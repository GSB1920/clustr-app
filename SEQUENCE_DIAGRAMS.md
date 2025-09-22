# 🔄 Sequence Diagrams & Data Flow - Clustr App

## 🔐 Authentication Flow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant A as AuthScreen
    participant G as Google OAuth
    participant API as Backend API
    participant AS as AsyncStorage
    participant M as MainScreen

    U->>A: Tap "Login with Google"
    A->>G: Open Google OAuth
    G->>U: Show Google login
    U->>G: Enter credentials
    G->>A: Return auth code
    A->>API: POST /auth/google-login
    API->>API: Validate Google token
    API->>API: Create/update user
    API->>A: Return JWT tokens
    A->>AS: Store tokens securely
    AS->>A: Confirm storage
    A->>M: Navigate to main app
    M->>M: Initialize user session
```

### **Authentication State Flow**
```
User Action: "Login with Google"
    ↓
AuthScreen: setLoading(true)
    ↓
Google OAuth: Request permissions
    ↓
Backend API: Validate & create user
    ↓
AsyncStorage: Store JWT tokens
    ↓
App State: Set authenticated user
    ↓
Navigation: Redirect to MainScreen
```

---

## 📱 Event Discovery & Join Flow

```mermaid
sequenceDiagram
    participant U as User
    participant D as DashboardScreen
    participant ES as EventStore
    participant API as Events API
    participant EC as EventCard
    participant M as EventModal

    U->>D: Open dashboard
    D->>ES: fetchEvents()
    ES->>API: GET /events
    API->>ES: Return events list
    ES->>D: Update events state
    D->>EC: Render event cards
    
    U->>EC: Tap event card
    EC->>ES: openEventModal(event)
    ES->>M: Show modal
    M->>U: Display event details
    
    U->>M: Tap "Join Event"
    M->>ES: joinEvent(eventId)
    ES->>ES: Optimistic update
    ES->>D: Update UI immediately
    ES->>API: POST /events/:id/join
    API->>ES: Confirm join success
    ES->>M: Close modal
    M->>D: Return to dashboard
```

### **Event Join State Flow**
```
User Action: "Join Event"
    ↓
EventStore: Add to joiningEvents set (loading state)
    ↓
EventStore: Optimistic update (event.isJoined = true)
    ↓
UI: Show joined state immediately
    ↓
API Call: POST /events/:id/join
    ↓
Success: Remove from joiningEvents set
    ↓
Error: Rollback optimistic update + show error
```

---

## 💬 Real-time Chat Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant C1 as ChatScreen 1
    participant CS as ChatStore
    participant S as Socket.IO
    participant API as Chat API
    participant C2 as ChatScreen 2
    participant U2 as User 2

    U1->>C1: Open chat for event
    C1->>CS: initializeSocket()
    CS->>S: Connect to server
    S->>CS: Connection confirmed
    CS->>API: GET /chat/events/:id/messages
    API->>CS: Return message history
    CS->>C1: Display messages

    U1->>C1: Type message
    C1->>CS: setMessageInput(text)
    U1->>C1: Send message
    C1->>CS: sendMessage(content, eventId)
    CS->>API: POST /chat/events/:id/messages
    API->>S: Broadcast new message
    S->>CS: Emit to all clients
    CS->>CS: Filter by currentEventId
    CS->>C1: Add to messages array
    
    S->>C2: Same message broadcast
    C2->>C2: Filter by currentEventId
    C2->>U2: Show new message
```

### **Real-time Message State Flow**
```
User Action: "Send Message"
    ↓
ChatStore: setMessageInput('') (clear input)
    ↓
API Call: POST /chat/events/:id/messages
    ↓
Backend: Save to database
    ↓
Socket.IO: Broadcast to all clients
    ↓
Frontend: Filter by event_id
    ↓
ChatStore: Add to messages array
    ↓
UI: Display new message with animation
```

---

## 🔔 Notification Flow

```mermaid
sequenceDiagram
    participant U1 as User 1 (Creator)
    participant E as EventStore
    participant API as Events API
    participant N as NotificationService
    participant P as PushService
    participant S as Socket.IO
    participant NS as NotificationStore
    participant U2 as User 2 (Recipient)

    U1->>E: Create new event
    E->>API: POST /events
    API->>API: Save event to DB
    API->>N: notify_new_event()
    N->>N: Create in-app notifications
    API->>P: notify_new_event()
    P->>P: Send push notifications
    API->>S: Emit 'new_notification'
    S->>NS: Real-time notification
    NS->>U2: Show notification bell
    
    U2->>NS: Tap notification bell
    NS->>API: GET /notifications
    API->>NS: Return notifications
    NS->>U2: Display notification list
```

### **Notification State Flow**
```
Event Created
    ↓
Backend: Create notification records
    ↓
Push Service: Send to user devices
    ↓
Socket.IO: Broadcast to connected clients
    ↓
NotificationStore: Update unread count
    ↓
UI: Animate notification bell
    ↓
User Interaction: Open notification modal
    ↓
API: Fetch detailed notifications
    ↓
UI: Display notification list
```

---

## 🎛️ State Management Data Flow

```mermaid
flowchart TD
    A[User Action] --> B[Component Handler]
    B --> C{State Type?}
    
    C -->|Local UI| D[useState/useRef]
    C -->|Global App| E[Zustand Store]
    C -->|Server Data| F[API Service]
    
    D --> G[Component Re-render]
    
    E --> H[Store Update]
    H --> I[Notify Subscribers]
    I --> J[Component Re-render]
    
    F --> K[HTTP Request]
    K --> L{Response OK?}
    L -->|Yes| M[Update Store]
    L -->|No| N[Error Handler]
    M --> I
    N --> O[Show Error UI]
    
    J --> P[UI Update]
    G --> P
    O --> P
```

### **Store-to-Component Data Flow**
```
Store State Change
    ↓
Zustand: Notify subscribers
    ↓
Component: Check if subscribed state changed
    ↓
React: Schedule re-render if changed
    ↓
Component: Re-render with new state
    ↓
UI: Update visual elements
```

---

## 🔄 Optimistic Update Pattern

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant S as Store
    participant API as Backend API

    U->>C: Click "Join Event"
    C->>S: joinEvent(eventId)
    
    Note over S: Optimistic Update Phase
    S->>S: Update UI state immediately
    S->>C: Trigger re-render
    C->>U: Show "Joined" state
    
    Note over S,API: API Sync Phase
    S->>API: POST /events/:id/join
    
    alt Success
        API->>S: 200 OK
        Note over S: No UI change needed
    else Error
        API->>S: Error response
        S->>S: Rollback optimistic update
        S->>C: Trigger re-render
        C->>U: Show error + original state
    end
```

### **Optimistic Update State Flow**
```
User Action
    ↓
Immediate UI Update (Optimistic)
    ↓
API Call (Background)
    ↓
Success: Keep optimistic state
    ↓
Error: Rollback + show error message
```

---

## 📱 Modal Management Flow

```mermaid
stateDiagram-v2
    [*] --> Dashboard
    Dashboard --> EventModalOpen : openEventModal(event)
    EventModalOpen --> EventModalClosed : closeEventModal()
    EventModalClosed --> Dashboard
    
    EventModalOpen --> ChatModalOpen : openChatModal(event)
    ChatModalOpen --> ChatModalClosed : closeChatModal()
    ChatModalClosed --> Dashboard
    
    Dashboard --> NotificationModalOpen : openNotificationModal()
    NotificationModalOpen --> NotificationModalClosed : closeNotificationModal()
    NotificationModalClosed --> Dashboard
```

### **Modal State Transitions**
```
Dashboard (Base State)
    ↓ [User taps event card]
Event Modal Open
    ↓ [User taps "Open Chat"]
Chat Modal Open (Event modal closes)
    ↓ [User closes chat]
Dashboard (Back to base)
```

---

## 🔌 Socket.IO Connection Flow

```mermaid
sequenceDiagram
    participant A as App Startup
    participant CS as ChatStore
    participant S as Socket.IO Server
    participant NS as NotificationStore

    A->>CS: App initialization
    CS->>S: io.connect()
    S->>CS: 'connect' event
    CS->>CS: Set isConnected = true
    CS->>NS: initializeNotifications(socket)
    NS->>S: Listen for 'new_notification'
    CS->>S: Listen for 'new_message'
    
    Note over CS,S: Real-time Communication Active
    
    S->>CS: 'new_message' event
    CS->>CS: Filter by currentEventId
    CS->>CS: Update messages array
    
    S->>NS: 'new_notification' event
    NS->>NS: Update unread count
    NS->>NS: Trigger bell animation
```

### **Socket Connection State Flow**
```
App Start
    ↓
ChatStore: Initialize socket connection
    ↓
Socket.IO: Connect to server
    ↓
Server: Send connection confirmation
    ↓
ChatStore: Register event listeners
    ↓
NotificationStore: Register notification listeners
    ↓
Real-time communication active
```

---

## 🎨 Component Lifecycle & State

```mermaid
flowchart TD
    A[Component Mount] --> B[useEffect Hook]
    B --> C[Fetch Initial Data]
    C --> D[Subscribe to Store]
    
    D --> E[Store State Change]
    E --> F{Component Subscribed?}
    F -->|Yes| G[Component Re-render]
    F -->|No| H[Skip Re-render]
    
    G --> I[Update UI Elements]
    I --> J[Trigger Animations]
    
    K[User Interaction] --> L[Event Handler]
    L --> M[Update Store State]
    M --> E
    
    N[Component Unmount] --> O[Cleanup Subscriptions]
    O --> P[Cancel Pending Requests]
```

### **Component-Store Interaction Pattern**
```
Component Mount
    ↓
Subscribe to store slices
    ↓
Store state changes
    ↓
Component checks if subscribed state changed
    ↓
Re-render if changed
    ↓
Update UI with new state
    ↓
Component unmount
    ↓
Cleanup subscriptions
```

---

## 🔄 Error Handling Flow

```mermaid
flowchart TD
    A[API Call] --> B{Network Available?}
    B -->|No| C[Show Offline Message]
    B -->|Yes| D[Send Request]
    
    D --> E{Response Status}
    E -->|200-299| F[Parse JSON]
    E -->|400-499| G[Client Error]
    E -->|500-599| H[Server Error]
    
    F --> I[Update Store State]
    
    G --> J[Show Validation Error]
    H --> K[Show Server Error]
    
    J --> L[User Can Retry]
    K --> L
    C --> L
    
    L --> M{User Retries?}
    M -->|Yes| A
    M -->|No| N[Graceful Degradation]
```

### **Error Recovery State Flow**
```
API Error Occurs
    ↓
Categorize error type (network, client, server)
    ↓
Show appropriate error message
    ↓
Provide retry mechanism
    ↓
User chooses to retry or continue
    ↓
Retry: Repeat API call
    ↓
Continue: Show cached/default content
```

---

## 📊 Performance Optimization Flow

```mermaid
flowchart TD
    A[Component Render] --> B{Expensive Computation?}
    B -->|Yes| C[useMemo Hook]
    B -->|No| D[Direct Render]
    
    C --> E[Check Dependencies]
    E --> F{Dependencies Changed?}
    F -->|Yes| G[Recompute Value]
    F -->|No| H[Use Cached Value]
    
    G --> I[Cache New Value]
    H --> I
    I --> D
    
    D --> J{Large List?}
    J -->|Yes| K[FlatList with Optimization]
    J -->|No| L[Standard Render]
    
    K --> M[Virtual Scrolling]
    M --> N[Remove Clipped Views]
    N --> O[Batch Renders]
    
    L --> P[Component Output]
    O --> P
```

### **Performance Optimization Pattern**
```
Component renders
    ↓
Check for expensive operations
    ↓
Apply memoization (useMemo, React.memo)
    ↓
Use optimized list rendering (FlatList)
    ↓
Enable native driver animations
    ↓
Result: Smooth 60fps performance
```

---

*These sequence diagrams illustrate the complex data flows and state management patterns that make the Clustr app responsive and reliable. Each flow is designed for optimal user experience and system performance.*
