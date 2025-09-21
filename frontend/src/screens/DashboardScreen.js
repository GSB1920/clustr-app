import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Animated,
  Pressable,
  TextInput,
  FlatList
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../components/ui'

const { width, height } = Dimensions.get('window')

// Mock data for events
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
      { id: 2, name: "Sarah", avatar: "👩‍🎨" },
      { id: 3, name: "Mike", avatar: "👨‍🍳" }
    ],
    attendeeCount: 3,
    spotsLeft: 47,
    isJoined: true,
    categoryColor: "#FF6B6B"
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
      { id: 4, name: "Alex", avatar: "🏀" },
      { id: 5, name: "Emma", avatar: "👩‍💻" }
    ],
    attendeeCount: 2,
    spotsLeft: 18,
    isJoined: true,
    categoryColor: "#4ECDC4"
  },
  {
    id: 3,
    title: "Photography Meetup",
    category: "Social",
    date: "Mon, Jan 22",
    time: "18:30",
    location: "Lombard Street",
    description: "Join fellow photographers for a golden hour shoot around the city's most scenic spots.",
    attendees: [
      { id: 6, name: "Lisa", avatar: "📸" },
      { id: 7, name: "David", avatar: "👨‍🎓" },
      { id: 8, name: "Anna", avatar: "👩‍🎤" },
      { id: 9, name: "Tom", avatar: "🎭" }
    ],
    attendeeCount: 4,
    spotsLeft: 6,
    isJoined: false,
    categoryColor: "#45B7D1"
  },
  {
    id: 4,
    title: "Live Jazz Night",
    category: "Music",
    date: "Fri, Jan 26",
    time: "20:00",
    location: "Blue Note Cafe",
    description: "Intimate jazz performance featuring local artists. Great drinks and atmosphere.",
    attendees: [
      { id: 10, name: "Jazz", avatar: "🎺" },
      { id: 11, name: "Maya", avatar: "🎹" }
    ],
    attendeeCount: 2,
    spotsLeft: 28,
    isJoined: false,
    categoryColor: "#9B59B6"
  }
]

const CATEGORIES = [
  { id: 'all', name: 'All', color: '#6C7B7F' },
  { id: 'social', name: 'Social', color: '#45B7D1' },
  { id: 'sports', name: 'Sports', color: '#4ECDC4' },
  { id: 'food', name: 'Food', color: '#FF6B6B' },
  { id: 'music', name: 'Music', color: '#9B59B6' }
]

const EventCard = ({ event, onJoin }) => {
  const { colors } = useClustrTheme()
  
  return (
    <ClustrCard style={{ marginBottom: 16, padding: 16 }}>
      {/* Category Tag */}
      <View style={{
        alignSelf: 'flex-start',
        backgroundColor: event.categoryColor + '20',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12
      }}>
        <ClustrText variant="caption" style={{ color: event.categoryColor, fontWeight: '600' }}>
          {event.category}
        </ClustrText>
      </View>

      {/* Event Title */}
      <ClustrText variant="heading" style={{ marginBottom: 8, fontSize: 18 }}>
        {event.title}
      </ClustrText>

      {/* Date and Location */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <ClustrText variant="body" style={{ color: colors.textSecondary, marginRight: 16 }}>
          📅 {event.date}
        </ClustrText>
        <ClustrText variant="body" style={{ color: colors.textSecondary }}>
          🕐 {event.time}
        </ClustrText>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <ClustrText variant="body" style={{ color: colors.textSecondary }}>
          📍 {event.location}
        </ClustrText>
      </View>

      {/* Description */}
      <ClustrText variant="body" style={{ 
        color: colors.textSecondary, 
        marginBottom: 16,
        lineHeight: 20
      }}>
        {event.description}
      </ClustrText>

      {/* Attendees and Join Button */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <View style={{ flex: 1 }}>
          {/* Attendee Avatars */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            {event.attendees.slice(0, 3).map((attendee, index) => (
              <View key={attendee.id} style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.surface,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: index > 0 ? -8 : 0,
                borderWidth: 2,
                borderColor: colors.background
              }}>
                <ClustrText variant="caption" style={{ fontSize: 12 }}>
                  {attendee.avatar}
                </ClustrText>
              </View>
            ))}
          </View>
          
          {/* Attendance Count */}
          <ClustrText variant="caption" style={{ color: colors.textSecondary }}>
            {event.attendeeCount} attending • {event.spotsLeft} spots left
          </ClustrText>
        </View>

        {/* Join/Joined Button */}
        <ClustrButton
          variant={event.isJoined ? "secondary" : "primary"}
          size="small"
          onPress={() => onJoin(event.id)}
          style={{ 
            minWidth: 80,
            backgroundColor: event.isJoined ? colors.surface : colors.primary
          }}
        >
          <ClustrText 
            variant="button" 
            style={{ 
              color: event.isJoined ? colors.accent : colors.background,
              fontSize: 12
            }}
          >
            {event.isJoined ? '✓ Joined' : 'Join'}
          </ClustrText>
        </ClustrButton>
      </View>
    </ClustrCard>
  )
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const { colors } = useClustrTheme()
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 20 }}
      contentContainerStyle={{ paddingHorizontal: 24 }}
    >
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          style={{
            backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 12,
            borderWidth: 1,
            borderColor: selectedCategory === category.id ? colors.primary : colors.border
          }}
        >
          <ClustrText 
            variant="button" 
            style={{ 
              color: selectedCategory === category.id ? colors.background : colors.text,
              fontSize: 14
            }}
          >
            {category.name}
          </ClustrText>
        </Pressable>
      ))}
    </ScrollView>
  )
}

export const DashboardScreen = ({ onLogout }) => {
  const { colors } = useClustrTheme()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [events, setEvents] = useState(MOCK_EVENTS)
  
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleJoinEvent = (eventId) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              isJoined: !event.isJoined,
              attendeeCount: event.isJoined ? event.attendeeCount - 1 : event.attendeeCount + 1,
              spotsLeft: event.isJoined ? event.spotsLeft + 1 : event.spotsLeft - 1
            }
          : event
      )
    )
  }

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={{
          paddingTop: 60,
          paddingHorizontal: 24,
          paddingBottom: 20,
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.border
        }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16
          }}>
            <ClustrText variant="title" style={{ fontSize: 28, fontWeight: '700' }}>
              Clustr
            </ClustrText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable style={{ marginRight: 16 }}>
                <ClustrText style={{ fontSize: 20 }}>🔔</ClustrText>
              </Pressable>
              <Pressable onPress={onLogout} style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.accent,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ClustrText style={{ fontSize: 16 }}>👤</ClustrText>
              </Pressable>
            </View>
          </View>

          {/* Search Bar */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: colors.border
          }}>
            <TextInput
              placeholder="Search events..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                color: colors.text,
                fontSize: 16,
                fontFamily: 'System'
              }}
            />
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border
        }}>
          <Pressable style={{ marginRight: 32 }}>
            <ClustrText variant="heading" style={{ 
              color: colors.primary,
              borderBottomWidth: 2,
              borderBottomColor: colors.primary,
              paddingBottom: 4
            }}>
              Events
            </ClustrText>
          </Pressable>
          <Pressable style={{ marginRight: 32 }}>
            <ClustrText variant="heading" style={{ color: colors.textSecondary }}>
              Chat
            </ClustrText>
          </Pressable>
          <Pressable>
            <ClustrText variant="heading" style={{ color: colors.textSecondary }}>
              Create
            </ClustrText>
          </Pressable>
        </View>

        {/* Category Filter */}
        <CategoryFilter 
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Events List */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard event={item} onJoin={handleJoinEvent} />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  )
}