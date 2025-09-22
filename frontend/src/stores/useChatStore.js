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
const NGROK_URL = 'https://daa6fa6b3b0e.ngrok-free.app'
const API_BASE_URL = `${NGROK_URL}/api`
const SOCKET_URL = NGROK_URL // For Socket.IO connection

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
      const token = await AsyncStorage.getItem('userToken')
      if (!token) {
        console.log('❌ No token for socket connection')
        return
      }
      
      const socket = io(SOCKET_URL, {
        auth: { token },
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
        set(state => ({
          messages: [...state.messages, messageData]
        }))
      })
      
      socket.on('user_joined_chat', (data) => {
        console.log('👥 User joined chat:', data.username)
        // Add system message
        const systemMessage = {
          id: `system_${Date.now()}`,
          content: `${data.username} joined the chat`,
          message_type: 'system',
          created_at: new Date().toISOString(),
          timestamp: Date.now()
        }
        set(state => ({
          messages: [...state.messages, systemMessage]
        }))
      })
      
      socket.on('user_left_chat', (data) => {
        console.log('👋 User left chat:', data.username)
        // Add system message
        const systemMessage = {
          id: `system_${Date.now()}`,
          content: `${data.username} left the chat`,
          message_type: 'system',
          created_at: new Date().toISOString(),
          timestamp: Date.now()
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
      
      // Join Socket.IO room
      if (socket && socket.connected) {
        socket.emit('join_event_chat', { event_id: eventId })
        console.log(`💬 Joined chat for event ${eventId}`)
      }
      
    } catch (error) {
      console.error('❌ Join chat error:', error)
      Alert.alert('Error', 'Failed to join chat')
    } finally {
      set({ isLoading: false })
    }
  },
  
  // Leave event chat
  leaveEventChat: () => {
    const { socket, currentEventId } = get()
    
    if (socket && currentEventId) {
      socket.emit('leave_event_chat', { event_id: currentEventId })
      console.log(`👋 Left chat for event ${currentEventId}`)
    }
    
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
        throw new Error('Authentication required')
      }
      
      console.log(`📜 Loading chat history for event ${eventId}`)
      const response = await chatAPI.getMessages(eventId, token)
      
      set({
        messages: response.messages || [],
        currentChatRoom: response.chat_room_id
      })
      
      console.log(`✅ Loaded ${response.messages?.length || 0} messages`)
      
    } catch (error) {
      console.error('❌ Load chat history error:', error)
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
