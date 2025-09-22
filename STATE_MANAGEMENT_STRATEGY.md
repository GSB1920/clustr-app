# 🎛️ State Management Strategy - Clustr App

## 📊 State Architecture Overview

Our state management follows a **hybrid approach** combining different strategies for different types of state:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LOCAL STATE   │    │  GLOBAL STATE   │    │  SERVER STATE   │
│                 │    │                 │    │                 │
│ • UI concerns   │    │ • Cross-component│    │ • API data      │
│ • Animations    │    │ • User session  │    │ • Real-time     │
│ • Form inputs   │    │ • App-wide state│    │ • Cache layer   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        v                        v                        v
   useState()              Zustand Stores           API Services
   useRef()               useEventStore()          eventsAPI.js
   Animated.Value         useChatStore()           Socket.IO
                         useNotificationStore()    AsyncStorage
```

---

## 🏪 Global State Management (Zustand)

### **Why Zustand Over Redux?**

| Aspect | Redux Toolkit | Zustand | Our Choice |
|--------|---------------|---------|------------|
| Bundle Size | ~47kb | ~2.6kb | ✅ Zustand |
| Boilerplate | High | Minimal | ✅ Zustand |
| Learning Curve | Steep | Gentle | ✅ Zustand |
| TypeScript | Extra setup | Built-in | ✅ Zustand |
| DevTools | Full support | Available | ✅ Zustand |
| Performance | Good | Excellent | ✅ Zustand |

### **Store Architecture**

#### **1. Event Store (`useEventStore`)**
**Responsibility**: Event discovery, filtering, and interactions

```javascript
// State Structure
{
  // Data State
  events: Event[],              // Fetched events list
  isLoading: boolean,           // API loading state
  
  // Filter State  
  selectedCategory: string,     // Active category filter
  searchQuery: string,          // Search input
  
  // UI State
  selectedEvent: Event | null,  // Currently viewed event
  showEventModal: boolean,      // Modal visibility
  showChatModal: boolean,       // Chat modal state
  joiningEvents: Set<string>,   // Loading states for join actions
  
  // Actions
  fetchEvents: () => Promise<void>,
  joinEvent: (eventId: string) => Promise<void>,
  leaveEvent: (eventId: string) => Promise<void>,
  setSelectedCategory: (category: string) => void,
  setSearchQuery: (query: string) => void,
  openEventModal: (event: Event) => void,
  closeEventModal: () => void,
  openChatModal: (event: Event) => void,
  closeChatModal: () => void
}
```

**Key Features**:
- **Auto-refetch**: Category/search changes trigger automatic data refresh
- **Optimistic Updates**: UI updates immediately, syncs with server
- **Loading States**: Granular loading states for better UX
- **Modal Management**: Centralized modal state across components

#### **2. Chat Store (`useChatStore`)**
**Responsibility**: Real-time messaging and Socket.IO management

```javascript
// State Structure
{
  // Real-time Data
  messages: Message[],          // Chat message history
  socket: Socket | null,        // Socket.IO connection
  isConnected: boolean,         // Connection status
  
  // Current Context
  currentEventId: string | null, // Active chat room
  currentChatRoom: string | null,
  messageInput: string,         // Input field value
  
  // UI State
  isLoading: boolean,           // Message loading
  showChat: boolean,            // Chat visibility
  
  // Actions
  initializeSocket: () => Promise<void>,
  sendMessage: (content: string, eventId: string) => Promise<void>,
  loadChatHistory: (eventId: string) => Promise<void>,
  setMessageInput: (input: string) => void,
  joinChatRoom: (eventId: string) => void,
  leaveChatRoom: () => void
}
```

**Socket.IO Integration**:
```javascript
// Simplified broadcast strategy
socket.on('new_message', (data) => {
  const { currentEventId } = get()
  
  // Frontend filtering (simpler than backend rooms)
  if (data.event_id === currentEventId) {
    set(state => ({
      messages: [...state.messages, data].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      )
    }))
  }
})
```

#### **3. Notification Store (`useNotificationStore`)**
**Responsibility**: In-app notifications and push notification handling

```javascript
// State Structure
{
  // Notification Data
  notifications: Notification[], // In-app notification list
  unreadCount: number,          // Badge count
  
  // UI State
  isLoading: boolean,           // Fetch loading state
  showNotificationModal: boolean, // Modal visibility
  bellAnimation: boolean,       // Bell shake animation
  
  // Actions
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>,
  markAsRead: (notificationId: string) => Promise<void>,
  markAllAsRead: () => Promise<void>,
  setShowNotificationModal: (show: boolean) => void,
  initializeNotifications: (socket: Socket) => void
}
```

---

## 🏠 Local State Management (React Hooks)

### **When to Use Local State**

#### **1. UI-Only Concerns**
```javascript
// Animation values - component-specific
const fadeAnim = useRef(new Animated.Value(0)).current
const slideAnim = useRef(new Animated.Value(50)).current

// Modal visibility - when only one component needs it
const [showDropdown, setShowDropdown] = useState(false)

// Form inputs - before submission
const [formData, setFormData] = useState({
  title: '',
  description: '',
  date: new Date()
})
```

#### **2. Temporary State**
```javascript
// Loading states for individual actions
const [isSubmitting, setIsSubmitting] = useState(false)

// Validation errors - component-specific
const [errors, setErrors] = useState({})

// UI feedback - temporary messages
const [showSuccess, setShowSuccess] = useState(false)
```

#### **3. Performance Optimizations**
```javascript
// Debounced search input
const [searchInput, setSearchInput] = useState('')

// Scroll position - component-specific
const [scrollY, setScrollY] = useState(0)

// Intersection observer - component-specific
const [isVisible, setIsVisible] = useState(false)
```

---

## 🌐 Server State Management

### **API Integration Strategy**

#### **1. Custom Fetch Wrapper**
```javascript
// services/api.js - Centralized API handling
const apiRequest = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem('userToken')
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  
  // Error handling
  if (!response.ok) {
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'API Error')
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }
  
  return await response.json()
}
```

#### **2. Store Integration**
```javascript
// Direct integration with Zustand stores
fetchEvents: async (customFilters = {}) => {
  set({ isLoading: true })
  
  try {
    const { selectedCategory, searchQuery } = get()
    const filters = { ...customFilters }
    
    if (selectedCategory !== 'all') filters.category = selectedCategory
    if (searchQuery?.trim()) filters.search = searchQuery.trim()

    const response = await eventsAPI.getEvents(filters)
    set({ events: response.events || [], isLoading: false })
  } catch (error) {
    console.error('❌ Error fetching events:', error)
    set({ events: [], isLoading: false })
  }
}
```

#### **3. Real-time Updates**
```javascript
// Socket.IO for live data
socket.on('new_event', (eventData) => {
  const { events } = get()
  set({ 
    events: [eventData, ...events].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  })
})
```

---

## 💾 Persistence Strategy

### **AsyncStorage Integration**
```javascript
// Token persistence
const storeToken = async (token) => {
  await AsyncStorage.setItem('userToken', token)
}

// User preferences
const storeUserPreferences = async (preferences) => {
  await AsyncStorage.setItem('userPrefs', JSON.stringify(preferences))
}

// Cache management
const cacheEventData = async (events) => {
  await AsyncStorage.setItem('cachedEvents', JSON.stringify(events))
}
```

---

## 🎯 State Decision Matrix

### **When to Use What State Type**

| State Type | Use Cases | Examples | Duration |
|------------|-----------|----------|----------|
| **Local State** | UI interactions, animations, temporary data | Modal open/close, form inputs, loading spinners | Component lifecycle |
| **Global State** | Cross-component data, user session, app-wide state | User auth, selected events, chat messages | App session |
| **Server State** | API data, real-time updates, cached responses | Events list, user profile, notifications | Until refresh/refetch |
| **Persistent State** | User preferences, auth tokens, offline data | Login state, theme choice, cached events | Across app restarts |

### **State Flow Diagram**

```
User Action
    ↓
Local State Update (Immediate UI feedback)
    ↓
Global State Update (Cross-component sync)
    ↓
API Call (Server sync)
    ↓
Server State Update (Data persistence)
    ↓
Socket.IO Broadcast (Real-time sync)
    ↓
All Connected Clients Updated
```

---

## 🔄 Data Flow Patterns

### **1. Optimistic Updates**
```javascript
// Update UI immediately, sync with server
joinEvent: async (eventId) => {
  // Optimistic update
  set(state => ({
    events: state.events.map(event =>
      event.id === eventId 
        ? { ...event, isJoined: true, attendeeCount: event.attendeeCount + 1 }
        : event
    )
  }))
  
  try {
    await eventsAPI.joinEvent(eventId)
    // Success - no additional UI update needed
  } catch (error) {
    // Rollback on error
    set(state => ({
      events: state.events.map(event =>
        event.id === eventId 
          ? { ...event, isJoined: false, attendeeCount: event.attendeeCount - 1 }
          : event
      )
    }))
  }
}
```

### **2. Auto-refetch Pattern**
```javascript
// Smart refetching based on dependencies
setSelectedCategory: (category) => {
  set({ selectedCategory: category })
  // Auto-fetch when category changes
  setTimeout(() => get().fetchEvents(), 100)
}

setSearchQuery: (query) => {
  set({ searchQuery: query })
  // Debounced auto-fetch when search changes
  setTimeout(() => get().fetchEvents(), 300)
}
```

### **3. Cross-store Communication**
```javascript
// Stores can interact with each other
// Chat store initializes notifications
initializeSocket: async () => {
  const socket = io(SOCKET_URL)
  
  socket.on('connect', () => {
    set({ isConnected: true, socket })
    
    // Initialize notifications when socket connects
    const { initializeNotifications } = require('./useNotificationStore')
      .useNotificationStore.getState()
    initializeNotifications(socket)
  })
}
```

---

## 📈 Performance Considerations

### **1. Selective Subscriptions**
```javascript
// Only subscribe to needed state slices
const DashboardScreen = () => {
  const { events, isLoading, fetchEvents } = useEventStore(state => ({
    events: state.events,
    isLoading: state.isLoading,
    fetchEvents: state.fetchEvents
  }))
  // Component only re-renders when events or isLoading change
}
```

### **2. Memoization Strategy**
```javascript
// Memoize expensive computations
const filteredEvents = useMemo(() => {
  return events.filter(event => {
    if (selectedCategory !== 'all' && event.category !== selectedCategory) {
      return false
    }
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })
}, [events, selectedCategory, searchQuery])
```

### **3. Debouncing**
```javascript
// Prevent excessive API calls
const debouncedSearch = useCallback(
  debounce((query) => {
    fetchEvents({ search: query })
  }, 300),
  [fetchEvents]
)
```

---

## 🧪 Testing Strategy

### **State Testing Approach**
```javascript
// Test store actions
it('should join event optimistically', async () => {
  const { result } = renderHook(() => useEventStore())
  
  await act(async () => {
    await result.current.joinEvent('event-1')
  })
  
  expect(result.current.events[0].isJoined).toBe(true)
})

// Test component state integration
it('should update UI when store state changes', () => {
  render(<DashboardScreen />)
  
  act(() => {
    useEventStore.getState().setSelectedCategory('Sports')
  })
  
  expect(screen.getByText('Sports')).toBeInTheDocument()
})
```

---

## 🚀 Scalability Benefits

### **1. Easy State Addition**
- New stores can be added without affecting existing ones
- Cross-store communication is explicit and traceable
- Each store has a single responsibility

### **2. Performance Scaling**
- Selective subscriptions prevent unnecessary re-renders
- Memoization reduces computation overhead
- Debouncing reduces API call frequency

### **3. Maintenance Benefits**
- Clear separation between local and global state
- Predictable data flow patterns
- Easy to debug with Zustand DevTools

---

*This state management strategy provides a scalable foundation for the Clustr app, balancing simplicity with powerful features for a production-ready React Native application.*
