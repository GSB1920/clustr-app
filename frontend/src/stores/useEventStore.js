import { create } from 'zustand'
import { eventsAPI } from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'

export const useEventStore = create((set, get) => ({
  // 🎯 ALL STATE IN ONE PLACE (replaces 15+ useState)
  events: [],
  isLoading: false,
  selectedCategory: 'all',
  searchQuery: '',
  selectedEvent: null,
  showEventModal: false,
  joiningEvents: new Set(),

  // 🎛️ SIMPLE SETTERS
  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
    // Auto-fetch when category changes
    setTimeout(() => get().fetchEvents(), 100)
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    // Auto-fetch when search changes (debounced)
    setTimeout(() => get().fetchEvents(), 300)
  },

  // 🎭 MODAL ACTIONS
  openEventModal: (event) => set({ 
    selectedEvent: event, 
    showEventModal: true 
  }),
  
  closeEventModal: () => set({ 
    selectedEvent: null, 
    showEventModal: false 
  }),

  // 📡 ASYNC ACTIONS (replaces all handleXXX functions)
  fetchEvents: async (customFilters = {}) => {
    set({ isLoading: true })
    
    try {
      const { selectedCategory, searchQuery } = get()
      
      // Build filters
      const filters = { ...customFilters }
      if (selectedCategory !== 'all') filters.category = selectedCategory
      if (searchQuery?.trim()) filters.search = searchQuery.trim()

      console.log('📋 Fetching events from backend...')
      const response = await eventsAPI.getEvents(filters)
      
      console.log('✅ Events fetched:', response.events.length)
      
      // Debug tags
      if (response.events?.length > 0) {
        const multiTagEvent = response.events.find(e => e.title.includes('Multi-Tag Test Event'))
        if (multiTagEvent) {
          console.log('🎯 Multi-Tag Test Event tags:', JSON.stringify(multiTagEvent.tags))
        }
      }
      
      set({ events: response.events || [], isLoading: false })
    } catch (error) {
      console.error('❌ Error fetching events:', error)
      set({ events: [], isLoading: false })
    }
  },

  // 🤝 JOIN EVENT (replaces handleJoinEvent)
  joinEvent: async (eventId) => {
    const { joiningEvents, showEventModal } = get()
    
    if (joiningEvents.has(eventId)) return
    
    try {
      const userToken = await AsyncStorage.getItem('userToken')
      if (!userToken) {
        Alert.alert('Authentication Required', 'Please log in to join events')
        return
      }

      // Add to loading state
      set({ joiningEvents: new Set([...joiningEvents, eventId]) })
      
      console.log('🤝 Joining event:', eventId)
      const response = await eventsAPI.joinEvent(eventId, userToken)
      
      console.log('✅ Join response:', response)
      
      // Refresh events
      await get().fetchEvents()
      
      // Show success and close modal
      Alert.alert('Success', 'You have joined the event!', [
        {
          text: 'OK',
          onPress: () => {
            if (showEventModal) {
              get().closeEventModal()
            }
          }
        }
      ])
      
    } catch (error) {
      console.error('❌ Join event error:', error)
      Alert.alert('Error', error.message || 'Failed to join event')
    } finally {
      // Remove from loading state
      const { joiningEvents: current } = get()
      const newSet = new Set(current)
      newSet.delete(eventId)
      set({ joiningEvents: newSet })
    }
  },

  // 🚪 LEAVE EVENT (replaces handleLeaveEvent)
  leaveEvent: async (eventId) => {
    const { joiningEvents, showEventModal } = get()
    
    if (joiningEvents.has(eventId)) return
    
    try {
      const userToken = await AsyncStorage.getItem('userToken')
      if (!userToken) {
        Alert.alert('Authentication Required', 'Please log in to manage events')
        return
      }

      // Show confirmation dialog
      Alert.alert(
        'Leave Event',
        'Are you sure you want to leave this event?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: async () => {
              try {
                // Add to loading state
                set({ joiningEvents: new Set([...get().joiningEvents, eventId]) })
                
                console.log('🚪 Leaving event:', eventId)
                const response = await eventsAPI.leaveEvent(eventId, userToken)
                
                console.log('✅ Leave response:', response)
                
                // Refresh events
                await get().fetchEvents()
                
                // Show success and close modal
                Alert.alert('Success', 'You have left the event.', [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (showEventModal) {
                        get().closeEventModal()
                      }
                    }
                  }
                ])
                
              } catch (error) {
                console.error('❌ Leave event error:', error)
                Alert.alert('Error', error.message || 'Failed to leave event')
              } finally {
                // Remove from loading state
                const { joiningEvents: current } = get()
                const newSet = new Set(current)
                newSet.delete(eventId)
                set({ joiningEvents: newSet })
              }
            }
          }
        ]
      )
    } catch (error) {
      console.error('❌ Leave event error:', error)
      Alert.alert('Error', 'Failed to leave event')
    }
  }
}))