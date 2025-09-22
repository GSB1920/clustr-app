# 🗺️ Component Map - Clustr App

## 📱 Component Hierarchy

```
App.js
├── WelcomeScreen (Route-level)
├── OnboardingScreen (Route-level)
├── AuthScreen (Route-level)
├── InterestScreen (Route-level)
└── MainScreen (Route-level)
    ├── TabNavigation (Layout)
    ├── DashboardScreen (Page-level)
    │   ├── EventCard (Reusable) [React.memo]
    │   │   ├── ClustrText (UI Component)
    │   │   ├── ClustrButton (UI Component)
    │   │   └── Multi-tag Display Logic
    │   ├── EventDetailsModal (Modal)
    │   │   ├── ClustrText (UI Component)
    │   │   ├── ClustrButton (UI Component)
    │   │   └── Animated.View (Animation)
    │   ├── NotificationModal (Modal)
    │   │   ├── ClustrText (UI Component)
    │   │   ├── ClustrButton (UI Component)
    │   │   └── FlatList (Performance)
    │   ├── ChatScreen (Full-screen Modal)
    │   │   ├── FlatList (Message List)
    │   │   ├── MessageBubble (Reusable) [React.memo]
    │   │   ├── ClustrInput (UI Component)
    │   │   └── KeyboardAvoidingView (Layout)
    │   ├── Search & Filter UI
    │   │   ├── ClustrInput (UI Component)
    │   │   └── Category Pills (Reusable)
    │   └── Animated.View (Performance)
    ├── ChatTabScreen (Page-level)
    │   ├── EventCard (Reusable) [React.memo]
    │   └── FlatList (Performance)
    └── CreateTabScreen (Page-level)
        ├── ClustrInput (UI Component)
        ├── ClustrButton (UI Component)
        ├── DateTimePicker (External)
        └── Category Selection UI

Design System Components (ui/)
├── ClustrText (Typography)
├── ClustrButton (Interactive)
├── ClustrInput (Form)
├── ClustrCard (Container)
└── ClustrThemeSwitcher (Theme)

Services & Utilities
├── api.js (API Layer)
├── pushNotifications.js (External Service)
├── ClustrTheme.js (Design System)
└── categories.js (Constants)

State Management (stores/)
├── useEventStore (Global State)
├── useChatStore (Global State + Socket.IO)
└── useNotificationStore (Global State)
```

---

## 🏗️ Component Types Classification

### **1. Page-Level Components (Route-based)**
- **Purpose**: Full-screen views that represent app routes
- **Characteristics**: Manage page-level state, coordinate multiple components
- **Examples**:
  - `DashboardScreen` - Main event discovery interface
  - `ChatTabScreen` - Chat hub with event list
  - `CreateTabScreen` - Event creation form
  - `AuthScreen` - Login/signup flows

### **2. Layout Components**
- **Purpose**: Structure and organize page content
- **Characteristics**: Handle responsive design, navigation, spacing
- **Examples**:
  - `MainScreen` - Tab-based navigation container
  - `TabNavigation` - Bottom tab navigation
  - `KeyboardAvoidingView` - Keyboard handling wrapper

### **3. Reusable Components**
- **Purpose**: Shared functionality across multiple screens
- **Characteristics**: Props-driven, memoized for performance
- **Examples**:
  - `EventCard` - Event display with join/leave actions
  - `MessageBubble` - Chat message display
  - `Category Pills` - Filter selection UI

### **4. Modal Components**
- **Purpose**: Overlay interfaces for detailed interactions
- **Characteristics**: Animation-heavy, backdrop handling
- **Examples**:
  - `EventDetailsModal` - Bottom sheet event details
  - `NotificationModal` - Full-screen notification center
  - `ChatScreen` - Full-screen modal chat interface

### **5. UI/Design System Components**
- **Purpose**: Consistent visual language and interactions
- **Characteristics**: Theme-aware, accessibility-focused
- **Examples**:
  - `ClustrText` - Typography with theme integration
  - `ClustrButton` - Consistent button styling with loading states
  - `ClustrInput` - Form inputs with validation styling
  - `ClustrCard` - Container with shadows and theming

---

## 🎨 Component Design Patterns

### **Performance Optimizations**
```javascript
// Memoized components for expensive renders
export const EventCard = React.memo(({ event, onJoin, onLeave }) => {
  // Only re-renders when event data changes
})

// FlatList for large data sets
<FlatList
  data={events}
  renderItem={renderEventCard}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

### **Animation Components**
```javascript
// Native animations for smooth performance
const slideAnim = useRef(new Animated.Value(height)).current

Animated.spring(slideAnim, {
  toValue: 0,
  useNativeDriver: true, // GPU acceleration
}).start()
```

### **Conditional Rendering**
```javascript
// Smart component loading based on state
{showEventModal && (
  <EventDetailsModal
    event={selectedEvent}
    onClose={closeEventModal}
    onJoin={joinEvent}
  />
)}
```

---

## 📊 Component Metrics

### **Complexity Reduction Through Architecture**
- **DashboardScreen**: 808 → 429 lines (47% reduction)
- **State Management**: 15+ useState → 1 Zustand hook
- **Reusable Components**: 5 shared components across 8 screens
- **Memoized Components**: 3 performance-critical components

### **Component Reusability**
- **EventCard**: Used in DashboardScreen, ChatTabScreen
- **ClustrButton**: Used across 12+ locations
- **ClustrText**: Used across 25+ locations
- **Modal Pattern**: Consistent across EventDetails, Notifications, Chat

---

## 🔄 Data Flow Architecture

### **Props Down, Events Up Pattern**
```
DashboardScreen (Container)
    ↓ props (event, onJoin, onLeave)
EventCard (Presentation)
    ↑ events (onJoin, onLeave callbacks)
useEventStore (State Management)
    ↓ state updates
All subscribed components re-render
```

### **Modal Management Pattern**
```
Parent Component
    ↓ selectedEvent, showModal
Modal Component
    ↑ onClose, onAction callbacks
Zustand Store
    ↓ global modal state
Multiple components can trigger same modal
```

---

## 🎯 Component Responsibilities

### **Single Responsibility Principle**
- **EventCard**: Only displays event data and handles user interactions
- **EventDetailsModal**: Only shows detailed view and action buttons
- **ChatScreen**: Only handles messaging interface
- **DashboardScreen**: Only coordinates event discovery flow

### **Separation of Concerns**
- **UI Components**: Only handle presentation and user interaction
- **Stores**: Only handle state management and business logic
- **Services**: Only handle external API calls and data transformation
- **Screens**: Only coordinate components and handle navigation

---

## 🚀 Scalability Considerations

### **Component Growth Strategy**
1. **Atomic Design**: Build from smallest components up
2. **Feature-based Organization**: Group related components together
3. **Lazy Loading**: Load components only when needed
4. **Code Splitting**: Separate vendor and app bundles

### **Maintenance Benefits**
- **Clear Hierarchy**: Easy to locate and modify components
- **Consistent Patterns**: Similar components follow same structure
- **Isolated Changes**: Modifications don't affect unrelated components
- **Testing Strategy**: Each component can be tested independently

---

*This component map represents the current architecture as of the submission date. The hierarchy emphasizes performance, reusability, and maintainability for a production-ready React Native application.*
