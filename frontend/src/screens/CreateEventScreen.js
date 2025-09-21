import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  SafeAreaView, 
  StatusBar, 
  ScrollView,
  Animated,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrCard, ClustrButton, ClustrInput } from '../components/ui'

// Event categories with icons and colors
const EVENT_CATEGORIES = [
  { id: 'sports', name: 'Sports', icon: '🏀', color: '#4ECDC4' },
  { id: 'food', name: 'Food & Dining', icon: '🍕', color: '#FF6B6B' },
  { id: 'music', name: 'Music', icon: '🎵', color: '#9B59B6' },
  { id: 'social', name: 'Social', icon: '🤝', color: '#45B7D1' },
  { id: 'outdoor', name: 'Outdoor', icon: '🌲', color: '#2ECC71' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨', color: '#E74C3C' },
  { id: 'tech', name: 'Technology', icon: '💻', color: '#3498DB' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: '#F39C12' }
]

export const CreateTabScreen = ({ user }) => {
  const { colors } = useClustrTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    address: '',
    capacity: '',
    date: '',
    time: ''
  })

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleInputChange = (field, value) => {
    setEventData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!eventData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter an event title')
      return false
    }
    if (!eventData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter an event description')
      return false
    }
    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Please select a category')
      return false
    }
    if (!eventData.address.trim()) {
      Alert.alert('Validation Error', 'Please enter an address')
      return false
    }
    if (!eventData.capacity || parseInt(eventData.capacity) < 1) {
      Alert.alert('Validation Error', 'Please enter a valid capacity (minimum 1)')
      return false
    }
    return true
  }

  const handleCreateEvent = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const newEvent = {
        ...eventData,
        category: selectedCategory,
        capacity: parseInt(eventData.capacity),
        created_by: user?.id || 'demo'
      }

      console.log('🎉 Creating event:', newEvent)
      
      // TODO: Send to backend
      // await eventsAPI.createEvent(newEvent)
      
      Alert.alert(
        'Event Created!', 
        `"${eventData.title}" has been created successfully.`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              setEventData({
                title: '',
                description: '',
                address: '',
                capacity: '',
                date: '',
                time: ''
              })
              setSelectedCategory(null)
            }
          },
          {
            text: 'View Events',
            onPress: () => console.log('Navigate to Events tab')
          }
        ]
      )

    } catch (error) {
      console.error('❌ Create event error:', error)
      Alert.alert('Error', 'Failed to create event. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const CategorySelector = () => (
    <View style={{ marginBottom: 24 }}>
      <ClustrText style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12
      }}>
        Category *
      </ClustrText>
      
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6
      }}>
        {EVENT_CATEGORIES.map(category => (
          <Pressable
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={{
              backgroundColor: selectedCategory === category.id 
                ? category.color + '20' 
                : colors.surface,
              borderWidth: 2,
              borderColor: selectedCategory === category.id 
                ? category.color 
                : colors.border,
              borderRadius: 12,
              padding: 12,
              margin: 6,
              minWidth: 100,
              alignItems: 'center'
            }}
          >
            <ClustrText style={{ 
              fontSize: 20, 
              marginBottom: 4 
            }}>
              {category.icon}
            </ClustrText>
            <ClustrText style={{
              fontSize: 12,
              fontWeight: '600',
              color: selectedCategory === category.id 
                ? category.color 
                : colors.text,
              textAlign: 'center'
            }}>
              {category.name}
            </ClustrText>
          </Pressable>
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
          
          <Animated.View style={{ 
            flex: 1, 
            opacity: fadeAnim
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
                    ➕
                  </ClustrText>
                </View>
                <View>
                  <ClustrText style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: colors.text
                  }}>
                    Create Event
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    Bring your community together
                  </ClustrText>
                </View>
              </View>
            </View>

            {/* Form */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ 
                padding: 20,
                paddingBottom: 100 // Space for create button
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Event Title */}
              <View style={{ marginBottom: 24 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8
                }}>
                  Event Title *
                </ClustrText>
                <ClustrInput
                  placeholder="What's the name of your event?"
                  value={eventData.title}
                  onChangeText={(value) => handleInputChange('title', value)}
                  style={{
                    fontSize: 16,
                    paddingVertical: 16
                  }}
                />
              </View>

              {/* Event Description */}
              <View style={{ marginBottom: 24 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8
                }}>
                  Description *
                </ClustrText>
                <View style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 16
                }}>
                  <TextInput
                    placeholder="Describe your event, what to expect, what to bring..."
                    placeholderTextColor={colors.textSecondary}
                    value={eventData.description}
                    onChangeText={(value) => handleInputChange('description', value)}
                    multiline
                    numberOfLines={4}
                    style={{
                      fontSize: 16,
                      color: colors.text,
                      textAlignVertical: 'top',
                      minHeight: 100
                    }}
                  />
                </View>
              </View>

              {/* Category Selection */}
              <CategorySelector />

              {/* Address */}
              <View style={{ marginBottom: 24 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8
                }}>
                  Address *
                </ClustrText>
                <ClustrInput
                  placeholder="Where will this event take place?"
                  value={eventData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  style={{
                    fontSize: 16,
                    paddingVertical: 16
                  }}
                />
                <ClustrText style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4
                }}>
                  Include full address with city and state
                </ClustrText>
              </View>

              {/* Date and Time Row */}
              <View style={{
                flexDirection: 'row',
                marginBottom: 24
              }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <ClustrText style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8
                  }}>
                    Date *
                  </ClustrText>
                  <ClustrInput
                    placeholder="MM/DD/YYYY"
                    value={eventData.date}
                    onChangeText={(value) => handleInputChange('date', value)}
                    style={{
                      fontSize: 16,
                      paddingVertical: 16
                    }}
                  />
                </View>
                
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ClustrText style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8
                  }}>
                    Time *
                  </ClustrText>
                  <ClustrInput
                    placeholder="HH:MM AM/PM"
                    value={eventData.time}
                    onChangeText={(value) => handleInputChange('time', value)}
                    style={{
                      fontSize: 16,
                      paddingVertical: 16
                    }}
                  />
                </View>
              </View>

              {/* Capacity */}
              <View style={{ marginBottom: 24 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8
                }}>
                  Maximum Attendees *
                </ClustrText>
                <ClustrInput
                  placeholder="How many people can join?"
                  value={eventData.capacity}
                  onChangeText={(value) => handleInputChange('capacity', value)}
                  keyboardType="numeric"
                  style={{
                    fontSize: 16,
                    paddingVertical: 16
                  }}
                />
                <ClustrText style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4
                }}>
                  Set a realistic number based on your venue
                </ClustrText>
              </View>

              {/* Image Upload (Future) */}
              <View style={{ marginBottom: 32 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8
                }}>
                  Event Image
                </ClustrText>
                
                <Pressable
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                    padding: 40,
                    alignItems: 'center',
                    opacity: 0.6
                  }}
                  onPress={() => Alert.alert('Coming Soon', 'Image upload will be available in a future update')}
                >
                  <ClustrText style={{
                    fontSize: 32,
                    marginBottom: 12
                  }}>
                    📷
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    textAlign: 'center'
                  }}>
                    Add Event Photo
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: 4
                  }}>
                    (Coming soon)
                  </ClustrText>
                </Pressable>
              </View>
            </ScrollView>

            {/* Fixed Create Button */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: colors.background,
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 32,
              borderTopWidth: 1,
              borderTopColor: colors.border
            }}>
              <ClustrButton
                variant="primary"
                onPress={handleCreateEvent}
                disabled={isLoading}
                style={{
                  paddingVertical: 16,
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.surface
                }}>
                  {isLoading ? 'Creating Event...' : 'Create Event'}
                </ClustrText>
              </ClustrButton>
              
              <ClustrText style={{
                fontSize: 12,
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: 8
              }}>
                Your event will be visible to the local community
              </ClustrText>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}