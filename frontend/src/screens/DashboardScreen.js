import React, { useState, useRef, useEffect } from 'react'
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
  Alert
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../components/ui'
import { eventsAPI } from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '📋', color: '#6C7B7F' },
  { id: 'social', name: 'Social', icon: '🤝', color: '#45B7D1' },
  { id: 'sports', name: 'Sports', icon: '🏀', color: '#4ECDC4' },
  { id: 'food', name: 'Food', icon: '🍎', color: '#FF6B6B' },
  { id: 'music', name: 'Music', icon: '🎵', color: '#9B59B6' }
]

export const DashboardScreen = ({ onLogout, user }) => {
  const { colors } = useClustrTheme()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      console.log('📋 Fetching events from backend...')
      
      const response = await eventsAPI.getEvents({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined
      })
      
      console.log('✅ Events fetched:', response.events.length)
      setEvents(response.events || [])
      
    } catch (error) {
      console.error('❌ Error fetching events:', error)
      setEvents([]) // Show empty list on error
    } finally {
      setIsLoading(false)
    }
  }

  // Refetch when category or search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents()
    }, 300) // Debounce search
    
    return () => clearTimeout(timeoutId)
  }, [selectedCategory, searchQuery])

  const filteredEvents = events // Events are already filtered by backend

  const handleJoinEvent = async (eventId) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken')
      if (!userToken) {
        Alert.alert('Authentication Required', 'Please log in to join events')
        return
      }

      console.log('🤝 Joining event:', eventId)
      await eventsAPI.joinEvent(eventId, userToken)
      
      // Refresh events list
      fetchEvents()
      
      Alert.alert('Success', 'You have joined the event!')
    } catch (error) {
      console.error('❌ Join event error:', error)
      Alert.alert('Error', error.message || 'Failed to join event')
    }
  }

  const EventCard = ({ event }) => {
    const categoryInfo = CATEGORIES.find(cat => cat.id === event.category) || CATEGORIES[0]
    
    return (
      <ClustrCard style={{
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        {/* Category Badge */}
                {/* Multiple Tags Display */}
                <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
            marginRight: 8
          }}>
            {/* Render multiple tags */}
            {(event.tags && event.tags.length > 0 ? event.tags : [event.category]).slice(0, 3).map((tag, index) => {
              const tagInfo = CATEGORIES.find(cat => cat.id === tag) || CATEGORIES[0]
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: tagInfo.color + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 6,
                    marginBottom: 4
                  }}
                >
                  <ClustrText style={{ 
                    fontSize: 10, 
                    marginRight: 2 
                  }}>
                    {tagInfo.icon}
                  </ClustrText>
                  <ClustrText style={{ 
                    fontSize: 10, 
                    fontWeight: '600',
                    color: tagInfo.color 
                  }}>
                    {tag}
                  </ClustrText>
                </View>
              )
            })}
            
            {/* Show "+X more" if there are more than 3 tags */}
            {(event.tags && event.tags.length > 3) && (
              <View style={{
                backgroundColor: colors.textSecondary + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                justifyContent: 'center',
                marginBottom: 4
              }}>
                <ClustrText style={{ 
                  fontSize: 10, 
                  fontWeight: '600',
                  color: colors.textSecondary 
                }}>
                  +{event.tags.length - 3}
                </ClustrText>
              </View>
            )}
          </View>
          
          <ClustrText style={{ 
            fontSize: 12, 
            color: colors.textSecondary,
            fontWeight: '500'
          }}>
            {new Date(event.event_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </ClustrText>
        </View>

        {/* Event Title */}
        <ClustrText style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 8
        }}>
          {event.title}
        </ClustrText>

        {/* Description */}
        <ClustrText style={{
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 20,
          marginBottom: 16
        }}>
          {event.description}
        </ClustrText>

        {/* Location and Time */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}>
            <ClustrText style={{ fontSize: 14, marginRight: 4 }}>📍</ClustrText>
            <ClustrText style={{
              fontSize: 14,
              color: colors.textSecondary,
              flex: 1
            }}>
              {event.location}
            </ClustrText>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <ClustrText style={{ fontSize: 14, marginRight: 4 }}>🕐</ClustrText>
            <ClustrText style={{
              fontSize: 14,
              color: colors.textSecondary
            }}>
              {new Date(event.event_date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </ClustrText>
          </View>
        </View>

        {/* Attendees and Join Button */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View>
              <ClustrText style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.text
              }}>
                {event.attendee_count || 0} attending
              </ClustrText>
              <ClustrText style={{
                fontSize: 11,
                color: colors.textSecondary
              }}>
                {event.spots_left || event.max_attendees} spots left
              </ClustrText>
            </View>
          </View>

          <ClustrButton
            variant="primary"
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 25,
              minWidth: 80
            }}
            onPress={() => handleJoinEvent(event.id)}
          >
            <ClustrText style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.surface
            }}>
              Join
            </ClustrText>
          </ClustrButton>
        </View>
      </ClustrCard>
    )
  }

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
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <ClustrText style={{ 
                    fontSize: 18,
                    color: colors.surface 
                  }}>
                    C
                  </ClustrText>
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
                    San Francisco, CA
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
              <EventCard key={event.id} event={event} />
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
    </SafeAreaView>
  )
}