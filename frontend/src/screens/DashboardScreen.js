import React, { useRef, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Animated,
  Pressable,
  TextInput,
  FlatList,
  SafeAreaView,
  Alert,
  Modal
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../components/ui'
import { EventDetailsModal } from '../components/modals/EventDetailsModal'
import { EventCard } from '../components/cards/EventCard'
import { ChatScreen } from './ChatScreen'
import { ClustrHeaderLogo } from '../assets/ClustrLogo'
import { useEventStore } from '../stores/useEventStore'
import { CATEGORIES } from '../constants/categories'

const { width, height } = Dimensions.get('window')

// Enhanced mock data matching the screenshot
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Weekend Farmers Market",
    category: "Food",
    date: "Sat, Jan 20",
    time: "09:00",
    location: "Mission Dolores Park",
    description: "Fresh local produce, artisanal foods, and live music. Perfect for a Saturday morning with family and friends.",
    attendees: [
      { id: 1, name: "John", avatar: "👨‍💼" },
      { id: 2, name: "Sarah", avatar: "👩‍🎨" }
    ],
    attendeeCount: 2,
    spotsLeft: 48,
    isJoined: false,
    categoryColor: "#FF6B6B",
    categoryIcon: "🍎"
  },
  {
    id: 2,
    title: "Community Basketball Game",
    category: "Sports",
    date: "Sun, Jan 21",
    time: "14:00",
    location: "Golden Gate Park Courts",
    description: "Friendly pickup basketball game. All skill levels welcome! Bring water and good vibes.",
    attendees: [
      { id: 4, name: "Alex", avatar: "🏀" }
    ],
    attendeeCount: 1,
    spotsLeft: 19,
    isJoined: false,
    categoryColor: "#4ECDC4",
    categoryIcon: "🏀"
  },
  {
    id: 3,
    title: "Tech Networking Mixer",
    category: "Social",
    date: "Fri, Jan 26",
    time: "18:30",
    location: "Downtown SF",
    description: "Connect with local tech professionals, share ideas, and build meaningful relationships.",
    attendees: [
      { id: 6, name: "Lisa", avatar: "👩‍💻" },
      { id: 7, name: "David", avatar: "👨‍💼" },
      { id: 8, name: "Maria", avatar: "👩‍🎨" }
    ],
    attendeeCount: 3,
    spotsLeft: 27,
    isJoined: true,
    categoryColor: "#45B7D1",
    categoryIcon: "🤝"
  },
  {
    id: 4,
    title: "Live Jazz Night",
    category: "Music",
    date: "Sat, Jan 27",
    time: "20:00",
    location: "The Blue Note",
    description: "Enjoy smooth jazz performances by local artists in an intimate setting.",
    attendees: [
      { id: 9, name: "Tom", avatar: "🎷" },
      { id: 10, name: "Anna", avatar: "🎵" }
    ],
    attendeeCount: 2,
    spotsLeft: 38,
    isJoined: false,
    categoryColor: "#9B59B6",
    categoryIcon: "🎵"
  }
]

// CATEGORIES moved to constants/categories.js

export const DashboardScreen = ({ onLogout, user }) => {
  const { colors } = useClustrTheme()
  
  // 🎯 REPLACE ALL useState WITH ONE HOOK!
  const {
    events,
    isLoading,
    selectedCategory,
    searchQuery,
    selectedEvent,
    showEventModal,
    showChatModal,
    joiningEvents,
    setSelectedCategory,
    setSearchQuery,
    fetchEvents,
    joinEvent,
    leaveEvent,
    openEventModal,
    closeEventModal,
    openChatModal,
    closeChatModal
  } = useEventStore()
  
  // Keep only animations (these stay local)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    fetchEvents()
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  // Add debugging to check user
  useEffect(() => {
    console.log('👤 Current user:', user?.id ? 'logged in' : 'not logged in')
    console.log('👤 User ID:', user?.id)
  }, [user])

  // Events are already filtered by backend through Zustand
  const filteredEvents = events

  // handleJoinEvent moved to Zustand store

  // All handlers moved to Zustand store

  // EventCard moved to components/cards/EventCard.js

  const CategoryButton = ({ category, isSelected }) => (
    <Pressable
      onPress={() => setSelectedCategory(category.id)}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: isSelected ? colors.primary : colors.surface,
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isSelected ? 0.2 : 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ClustrText style={{ 
          fontSize: 14, 
          marginRight: 6 
        }}>
          {category.icon}
        </ClustrText>
        <ClustrText style={{
          fontSize: 14,
          fontWeight: '600',
          color: isSelected ? colors.surface : colors.text
        }}>
          {category.name}
        </ClustrText>
      </View>
    </Pressable>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
        
        <Animated.View style={{ 
          flexShrink: 0,  // ✅ Add this instead
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          {/* Header */}
          <View style={{
            paddingTop: 16,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: colors.surface,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <View style={{
                  marginRight: 16
                }}>
                  <ClustrHeaderLogo />
                </View>
                <View>
                  <ClustrText style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: colors.text
                  }}>
                    Clustr
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    Ujjain, MP
                  </ClustrText>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable 
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                  }}
                >
                  <ClustrText style={{ fontSize: 18 }}>🔔</ClustrText>
                </Pressable>
                
                <Pressable
                  onPress={onLogout}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: user ? colors.primary + '20' : colors.background,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ClustrText style={{ fontSize: 18 }}>
                    {user ? '👤' : '🔐'}
                  </ClustrText>
                </Pressable>
              </View>
            </View>

            {/* Search Bar */}
            <View style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <ClustrText style={{ fontSize: 16, marginRight: 12 }}>🔍</ClustrText>
              <TextInput
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.text,
                  fontFamily: 'System'
                }}
                placeholder="Search events..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </Animated.View>

        {/* Navigation Tabs */}
        <View style={{
          paddingTop: 12,      // Reduced top padding
          paddingBottom: 8,    // Minimal bottom padding  
          paddingLeft: 20
        }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {CATEGORIES.map(category => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
              />
            ))}
          </ScrollView>
        </View>

        {/* Events List */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: 20,
            paddingTop: 8  // Add small top padding
          }}
        >
          {isLoading ? (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60
            }}>
              <ClustrText style={{
                fontSize: 48,
                marginBottom: 16
              }}>
                ⏳
              </ClustrText>
              <ClustrText style={{
                fontSize: 16,
                color: colors.textSecondary
              }}>
                Loading events...
              </ClustrText>
            </View>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onPress={openEventModal}
                onJoinEvent={joinEvent}
                user={user}
                isJoining={joiningEvents.has(event.id)}
              />
            ))
          ) : (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60
            }}>
              <ClustrText style={{
                fontSize: 48,
                marginBottom: 16
              }}>
                ��
              </ClustrText>
              <ClustrText style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8
              }}>
                No events yet
              </ClustrText>
              <ClustrText style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center'
              }}>
                Be the first to create an event in your community!
              </ClustrText>
            </View>
          )}
        </ScrollView>
      </View>
      
      {/* Event Details Modal */}
      <EventDetailsModal
        visible={showEventModal}
        onClose={closeEventModal}
        event={selectedEvent}
        onJoinEvent={joinEvent}
        onLeaveEvent={leaveEvent}
        onOpenChat={openChatModal}
        user={user}
        isJoining={selectedEvent ? joiningEvents.has(selectedEvent.id) : false}
      />
      
      {/* Chat Modal - Full Screen */}
      <Modal
        visible={showChatModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedEvent && (
          <ChatScreen
            event={selectedEvent}
            user={user}
            onClose={closeChatModal}
          />
        )}
      </Modal>
    </SafeAreaView>
  )
}