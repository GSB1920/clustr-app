import { create } from 'zustand'
import { io } from 'socket.io-client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'

// Chat API functions
const chatAPI = {
  getMessages: async (eventId, token, limit = 50, offset = 0) => {
    const response = await fetch(`${API_BASE_URL}/chat/events/${eventId}/messages?limit=${limit}&offset=${offset}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.status}`)
    }
    
    return await response.json()
  },

  sendMessage: async (eventId, content, token) => {
    const response = await fetch(`${API_BASE_URL}/chat/events/${eventId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`)
    }
    
    return await response.json()
  }
}

// API configuration (matching main API service)
const RAILWAY_URL = 'https://renewed-wisdom-production.up.railway.app'
const LOCAL_URL = 'http://localhost:5001'

// Use same logic as main API service
const useLocal = process.env.EXPO_PUBLIC_USE_LOCAL_BACKEND === 'true'
const API_BASE_URL = useLocal ? `${LOCAL_URL}/api` : `${RAILWAY_URL}/api`
const SOCKET_URL = useLocal ? LOCAL_URL : RAILWAY_URL

export const useChatStore = create((set, get) => ({
  // Chat state
  messages: [],
  isLoading: false,
  isConnected: false,
  currentEventId: null,
  currentChatRoom: null,
  socket: null,
  messageInput: '',
  
  // UI state
  showChat: false,
  
  // Actions
  setMessageInput: (input) => set({ messageInput: input }),
  setShowChat: (show) => set({ showChat: show }),
  
  // Initialize Socket.IO connection
  initializeSocket: async () => {
    try {
      const socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      })
      
      socket.on('connect', () => {
        console.log('🔌 Connected to chat server')
        set({ isConnected: true, socket })
      })
      
      socket.on('disconnect', () => {
        console.log('🔌 Disconnected from chat server')
        set({ isConnected: false })
      })
      
      socket.on('new_message', (messageData) => {
        console.log('💬 New message received:', messageData)
        
        // Only add message if it's for the current event and not duplicate
        const { currentEventId, messages } = get()
        if (messageData.event_id === currentEventId) {
          // Check if message already exists (prevent duplicates)
          const messageExists = messages.some(msg => msg.id === messageData.id)
          if (!messageExists) {
            console.log('✅ New message for current event, adding to chat')
            set(state => ({
              messages: [...state.messages, messageData]
            }))
          } else {
            console.log('⚠️ Message already exists, skipping duplicate')
          }
        } else {
          console.log('❌ Message is for different event, ignoring')
        }
      })
      
      socket.on('user_joined_chat', (data) => {
        console.log('👥 User joined chat:', data.username)
        // Add system message with unique ID
        const systemMessage = {
          id: `system_join_${data.user_id}_${Date.now()}`,
          content: `${data.username} joined the chat`,
          message_type: 'system',
          created_at: new Date().toISOString(),
          timestamp: Date.now(),
          event_id: data.event_id
        }
        set(state => ({
          messages: [...state.messages, systemMessage]
        }))
      })
      
      socket.on('user_left_chat', (data) => {
        console.log('👋 User left chat:', data.username)
        // Add system message with unique ID
        const systemMessage = {
          id: `system_leave_${data.user_id}_${Date.now()}`,
          content: `${data.username} left the chat`,
          message_type: 'system',
          created_at: new Date().toISOString(),
          timestamp: Date.now(),
          event_id: data.event_id
        }
        set(state => ({
          messages: [...state.messages, systemMessage]
        }))
      })
      
      socket.on('error', (error) => {
        console.error('🚨 Socket error:', error)
        Alert.alert('Chat Error', error.message || 'Connection error')
      })
      
    } catch (error) {
      console.error('❌ Socket initialization error:', error)
    }
  },
  
  // Join event chat
  joinEventChat: async (eventId) => {
    const { socket } = get()
    
    try {
      set({ isLoading: true, currentEventId: eventId })
      
      // Load chat history first
      await get().loadChatHistory(eventId)
      
      // Ready to receive real-time messages
      console.log(`💬 Ready to receive real-time messages for event ${eventId}`)
      
    } catch (error) {
      console.error('❌ Join chat error:', error)
      Alert.alert('Error', 'Failed to join chat')
    } finally {
      set({ isLoading: false })
    }
  },
  
  // Leave event chat
  leaveEventChat: () => {
    const { currentEventId } = get()
    
    console.log(`👋 Left chat for event ${currentEventId}`)
    
    set({
      messages: [],
      currentEventId: null,
      currentChatRoom: null,
      messageInput: ''
    })
  },
  
  // Load chat history
  loadChatHistory: async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      if (!token) {
        console.log('❌ No token for chat history')
        throw new Error('Authentication required')
      }
      
      console.log(`📜 Loading chat history for event ${eventId}`)
      console.log(`🔗 API URL: ${API_BASE_URL}/chat/events/${eventId}/messages`)
      
      const response = await chatAPI.getMessages(eventId, token)
      
      console.log('📡 Chat API response:', response)
      
      set({
        messages: response.messages || [],
        currentChatRoom: response.chat_room_id
      })
      
      console.log(`✅ Loaded ${response.messages?.length || 0} messages`)
      
    } catch (error) {
      console.error('❌ Load chat history error:', error)
      console.error('❌ Error details:', error.message)
      set({ messages: [] })
    }
  },
  
  // Send message
  sendMessage: async (eventId, content) => {
    const { messageInput } = get()
    const messageContent = content || messageInput.trim()
    
    if (!messageContent) {
      Alert.alert('Error', 'Please enter a message')
      return
    }
    
    try {
      const token = await AsyncStorage.getItem('userToken')
      if (!token) {
        Alert.alert('Error', 'Authentication required')
        return
      }
      
      console.log(`💬 Sending message: ${messageContent}`)
      
      // Send via API (Socket.IO will broadcast to others)
      await chatAPI.sendMessage(eventId, messageContent, token)
      
      // Clear input
      set({ messageInput: '' })
      
    } catch (error) {
      console.error('❌ Send message error:', error)
      Alert.alert('Error', error.message || 'Failed to send message')
    }
  },
  
  // Cleanup
  cleanup: () => {
    const { socket } = get()
    
    if (socket) {
      socket.disconnect()
    }
    
    set({
      messages: [],
      isConnected: false,
      currentEventId: null,
      socket: null,
      messageInput: ''
    })
  }
}))
