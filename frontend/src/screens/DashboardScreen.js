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
  SafeAreaView
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../components/ui'

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
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
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

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesCategory = selectedCategory === 'all' || 
      event.category.toLowerCase() === selectedCategory
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const EventCard = ({ event }) => (
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
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
      }}>
        <View style={{
          backgroundColor: event.categoryColor + '20',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <ClustrText style={{ 
            fontSize: 12, 
            marginRight: 4 
          }}>
            {event.categoryIcon}
          </ClustrText>
          <ClustrText style={{ 
            fontSize: 12, 
            fontWeight: '600',
            color: event.categoryColor 
          }}>
            {event.category}
          </ClustrText>
        </View>
        <ClustrText style={{ 
          fontSize: 12, 
          color: colors.textSecondary,
          fontWeight: '500'
        }}>
          {event.date}
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
            {event.time}
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
          {/* Attendee Avatars */}
          <View style={{
            flexDirection: 'row',
            marginRight: 12
          }}>
            {event.attendees.slice(0, 3).map((attendee, index) => (
              <View
                key={attendee.id}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: index > 0 ? -8 : 0,
                  borderWidth: 2,
                  borderColor: colors.surface
                }}
              >
                <ClustrText style={{ fontSize: 14 }}>
                  {attendee.avatar}
                </ClustrText>
              </View>
            ))}
          </View>
          
          <View>
            <ClustrText style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.text
            }}>
              {event.attendeeCount} attending
            </ClustrText>
            <ClustrText style={{
              fontSize: 11,
              color: colors.textSecondary
            }}>
              {event.spotsLeft} spots left
            </ClustrText>
          </View>
        </View>

        <ClustrButton
          variant={event.isJoined ? "secondary" : "primary"}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 25,
            minWidth: 80
          }}
          onPress={() => console.log(`${event.isJoined ? 'Leave' : 'Join'} ${event.title}`)}
        >
          <ClustrText style={{
            fontSize: 14,
            fontWeight: '600',
            color: event.isJoined ? colors.text : colors.surface
          }}>
            {event.isJoined ? 'Joined' : 'Join'}
          </ClustrText>
        </ClustrButton>
      </View>
    </ClustrCard>
  )

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
          flex: 1, 
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

        {/* Navigation Tabs */}
        <View style={{
          paddingVertical: 20,
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
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
          
          {filteredEvents.length === 0 && (
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
                🔍
              </ClustrText>
              <ClustrText style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8
              }}>
                No events found
              </ClustrText>
              <ClustrText style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                paddingHorizontal: 40
              }}>
                Try adjusting your search or category filter
              </ClustrText>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
    </SafeAreaView>
  )
}