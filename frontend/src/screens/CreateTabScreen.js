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
import { eventsAPI } from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'

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
  const [selectedCategory, setSelectedCategory] = useState([]) // Array instead of null
  const fadeAnim = useRef(new Animated.Value(0)).current
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    capacity: '',
    date: new Date(), // Use Date object
    time: new Date(), // Use Date object
  })

  // Add these new state variables
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    
    if (selectedDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Reset time to start of day
      
      if (selectedDate < today) {
        Alert.alert('Invalid Date', 'Please select a future date')
        return
      }
      
      setEventData(prev => ({ ...prev, date: selectedDate }))
    }
  }

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    
    if (selectedTime) {
      const now = new Date()
      const selectedDateTime = new Date(eventData.date)
      selectedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes())
      
      // If the selected date is today, ensure time is in the future
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const eventDate = new Date(eventData.date)
      eventDate.setHours(0, 0, 0, 0)
      
      if (eventDate.getTime() === today.getTime() && selectedDateTime < now) {
        Alert.alert('Invalid Time', 'Please select a future time')
        return
      }
      
      setEventData(prev => ({ ...prev, time: selectedTime }))
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
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
    if (selectedCategory.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one category')
      return false
    }
    if (!eventData.streetAddress.trim() || !eventData.city.trim() || !eventData.state.trim()) {
      Alert.alert('Validation Error', 'Please enter complete address details')
      return false
    }
    
    const capacity = parseInt(eventData.capacity)
    if (!eventData.capacity || isNaN(capacity) || capacity < 1) {
      Alert.alert('Validation Error', 'Please enter a valid capacity (minimum 1 person)')
      return false
    }
    if (capacity > 9999) {
      Alert.alert('Validation Error', 'Maximum capacity is 9999 people')
      return false
    }
    
    // Validate future date/time
    const eventDateTime = new Date(eventData.date)
    eventDateTime.setHours(eventData.time.getHours(), eventData.time.getMinutes())
    
    if (eventDateTime <= new Date()) {
      Alert.alert('Validation Error', 'Event must be scheduled for a future date and time')
      return false
    }
    
    return true
  }

  const handleCreateEvent = async () => {
    console.log('🚀 CREATE EVENT BUTTON CLICKED!')
    console.log('📝 Current form data:', eventData)
    console.log('🏷️ Selected categories:', selectedCategory)
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }

    console.log('✅ Form validation passed, starting API call...')
    setIsLoading(true)

    try {
      // Get user token for authentication
      const userToken = await AsyncStorage.getItem('userToken')
      if (!userToken) {
        Alert.alert('Authentication Required', 'Please log in to create events')
        setIsLoading(false)
        return
      }

      // Prepare event data for backend API
      const eventPayload = {
        title: eventData.title.trim(),
        description: eventData.description.trim(),
        categories: selectedCategory, // selectedCategory is already an array
        streetAddress: eventData.streetAddress.trim(),
        city: eventData.city.trim() || 'San Francisco', 
        state: eventData.state.trim() || 'CA',  
        zipCode: eventData.zipCode.trim() || '94102',
        landmark: eventData.landmark?.trim() || '',
        capacity: parseInt(eventData.capacity),
        // TODO: Add proper date/time handling from the date/time pickers
        date: eventData.date.toISOString()
      }

      console.log('🎉 Creating event with payload:', eventPayload)
      console.log('🔑 Using user token:', userToken ? 'exists' : 'missing')
      console.log('🏷️ Payload categories:', eventPayload.categories)
      console.log('🏷️ Payload categories type:', typeof eventPayload.categories)
      console.log('🏷️ Payload categories length:', eventPayload.categories?.length)
      console.log('🔑 Using user token:', userToken ? 'exists' : 'missing')
      
      // Actually call the backend API!
      const response = await eventsAPI.createEvent(eventPayload, userToken)
      
      console.log('✅ Event created successfully:', response)
      
      Alert.alert(
        'Event Created!', 
        `"${eventData.title}" has been created successfully and saved to the backend!`,
        [
          {
            text: 'Create Another',
            onPress: () => {
              setEventData({
                title: '',
                description: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                landmark: '',
                capacity: '',
                date: new Date(), // Reset date
                time: new Date(), // Reset time
              })
              setSelectedCategory([])
            }
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      )

    } catch (error) {
      console.error('❌ Create event error:', error)
      Alert.alert(
        'Error', 
        error.message || 'Failed to create event. Please check your connection and try again.'
      )
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
        Categories/Tags * (Select multiple)
      </ClustrText>
      
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6
      }}>
        {EVENT_CATEGORIES.map(category => {
          const isSelected = selectedCategory.includes(category.id)
          return (
            <Pressable
              key={category.id}
              onPress={() => {
                setSelectedCategory(prev => {
                  if (prev.includes(category.id)) {
                    return prev.filter(id => id !== category.id)
                  } else {
                    return [...prev, category.id]
                  }
                })
              }}
              style={{
                backgroundColor: isSelected 
                  ? category.color + '20' 
                  : colors.surface,
                borderWidth: 2,
                borderColor: isSelected 
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
                color: isSelected 
                  ? category.color 
                  : colors.text,
                textAlign: 'center'
              }}>
                {category.name}
              </ClustrText>
              {isSelected && (
                <View style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: category.color,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <ClustrText style={{ fontSize: 12, color: colors.surface }}>
                    ✓
                  </ClustrText>
                </View>
              )}
            </Pressable>
          )
        })}
      </View>
      
      <ClustrText style={{
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 8
      }}>
        Selected: {selectedCategory.length} categories
      </ClustrText>
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
            {/* Header - keep your existing header code */}
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

            {/* Form - REPLACE the "Coming Soon" content with this */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ 
                padding: 20,
                paddingBottom: 100
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

              {/* Address Section */}
              <ClustrCard style={{ marginBottom: 24, padding: 20 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 16
                }}>
                  Event Location *
                </ClustrText>

                {/* Street Address */}
                <View style={{ marginBottom: 16 }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8
                  }}>
                    Street Address
                  </ClustrText>
                  <ClustrInput
                    placeholder="123 Main Street"
                    value={eventData.streetAddress}
                    onChangeText={(value) => handleInputChange('streetAddress', value)}
                  />
                </View>

                {/* City and State Row */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <View style={{ flex: 2, marginRight: 12 }}>
                    <ClustrText style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: 8
                    }}>
                      City
                    </ClustrText>
                    <ClustrInput
                      placeholder="San Francisco"
                      value={eventData.city}
                      onChangeText={(value) => handleInputChange('city', value)}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <ClustrText style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: 8
                    }}>
                      State
                    </ClustrText>
                    <ClustrInput
                      placeholder="CA"
                      value={eventData.state}
                      onChangeText={(value) => handleInputChange('state', value)}
                      maxLength={2}
                    />
                  </View>
                </View>

                {/* ZIP Code and Landmark */}
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <ClustrText style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: 8
                    }}>
                      ZIP Code
                    </ClustrText>
                    <ClustrInput
                      placeholder="94102"
                      value={eventData.zipCode}
                      onChangeText={(value) => handleInputChange('zipCode', value)}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>
                  <View style={{ flex: 2, marginLeft: 12 }}>
                    <ClustrText style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.text,
                      marginBottom: 8
                    }}>
                      Landmark (Optional)
                    </ClustrText>
                    <ClustrInput
                      placeholder="Near Golden Gate Park"
                      value={eventData.landmark}
                      onChangeText={(value) => handleInputChange('landmark', value)}
                    />
                  </View>
                </View>
              </ClustrCard>

              {/* Working Date and Time Section */}
              <View style={{ marginBottom: 24 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 12
                }}>
                  When is your event? *
                </ClustrText>

                {/* Date Picker */}
                <View style={{ marginBottom: 16 }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8
                  }}>
                    Date
                  </ClustrText>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <ClustrText style={{ fontSize: 16, marginRight: 8 }}>📅</ClustrText>
                    <ClustrText style={{ fontSize: 16, color: colors.text }}>
                      {eventData.date.toDateString()}
                    </ClustrText>
                  </Pressable>
                </View>

                {/* Time Picker */}
                <View style={{ marginBottom: 16 }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8
                  }}>
                    Time
                  </ClustrText>
                  <Pressable
                    onPress={() => setShowTimePicker(true)}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <ClustrText style={{ fontSize: 16, marginRight: 8 }}>🕐</ClustrText>
                    <ClustrText style={{ fontSize: 16, color: colors.text }}>
                      {eventData.time.toLocaleTimeString()}
                    </ClustrText>
                  </Pressable>
                </View>
              </View>

              {/* Date Picker Component */}
              {showDatePicker && (
                <DateTimePicker
                  value={eventData.date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false)
                    if (selectedDate) {
                      setEventData(prev => ({ ...prev, date: selectedDate }))
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}

              {/* Time Picker Component */}
              {showTimePicker && (
                <DateTimePicker
                  value={eventData.time}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false)
                    if (selectedTime) {
                      setEventData(prev => ({ ...prev, time: selectedTime }))
                    }
                  }}
                />
              )}

              {/* Enhanced Capacity Section */}
              <View style={{ marginBottom: 24 }}>
                <ClustrText style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8
                }}>
                  Maximum Attendees *
                </ClustrText>
                
                {/* Quick Select Options */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 12
                }}>
                  {[5, 10, 15, 20, 25, 50, 100].map(number => (
                    <Pressable
                      key={number}
                      onPress={() => handleInputChange('capacity', number.toString())}
                      style={{
                        backgroundColor: eventData.capacity === number.toString() 
                          ? colors.primary + '20' 
                          : colors.surface,
                        borderWidth: 2,
                        borderColor: eventData.capacity === number.toString() 
                          ? colors.primary 
                          : colors.border,
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        margin: 4
                      }}
                    >
                      <ClustrText style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: eventData.capacity === number.toString() 
                          ? colors.primary 
                          : colors.text
                      }}>
                        {number}
                      </ClustrText>
                    </Pressable>
                  ))}
                </View>

                {/* Custom Number Input */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <ClustrText style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginRight: 12
                  }}>
                    Or enter custom:
                  </ClustrText>
                  <View style={{ flex: 1 }}>
                    <ClustrInput
                      placeholder="Enter number"
                      value={eventData.capacity}
                      onChangeText={(value) => {
                        // Only allow numbers
                        const numericValue = value.replace(/[^0-9]/g, '')
                        handleInputChange('capacity', numericValue)
                      }}
                      keyboardType="numeric"
                      maxLength={4}
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: '600'
                      }}
                    />
                  </View>
                </View>
                
                <ClustrText style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  marginTop: 4
                }}>
                  Choose from quick options or enter a custom number
                </ClustrText>
              </View>

              {/* Image Upload Placeholder */}
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
                  onPress={() => Alert.alert('Coming Soon', 'Image upload will be available soon')}
                >
                  <ClustrText style={{ fontSize: 32, marginBottom: 12 }}>📷</ClustrText>
                  <ClustrText style={{ fontSize: 14, color: colors.textSecondary }}>
                    Add Event Photo (Coming soon)
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
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
