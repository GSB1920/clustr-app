import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  StatusBar,
  Animated,
  Pressable,
  SafeAreaView,
  Alert
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../components/ui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authAPI } from '../services/api'
import { ClustrLogoMedium } from '../assets/ClustrLogo'

// Interest categories with icons and colors
const INTERESTS = [
  { id: 'sports', name: 'Sports', icon: '🏀', color: '#4ECDC4', description: 'Basketball, soccer, tennis, and more' },
  { id: 'food', name: 'Food & Dining', icon: '🍕', color: '#FF6B6B', description: 'Restaurants, cooking, food festivals' },
  { id: 'music', name: 'Music', icon: '🎵', color: '#9B59B6', description: 'Concerts, live music, jam sessions' },
  { id: 'social', name: 'Social Events', icon: '🤝', color: '#45B7D1', description: 'Networking, meetups, parties' },
  { id: 'outdoor', name: 'Outdoor Activities', icon: '🌲', color: '#2ECC71', description: 'Hiking, camping, nature walks' },
  { id: 'arts', name: 'Arts & Culture', icon: '🎨', color: '#E74C3C', description: 'Museums, galleries, workshops' },
  { id: 'tech', name: 'Technology', icon: '💻', color: '#3498DB', description: 'Tech meetups, coding, startups' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: '#F39C12', description: 'Gym sessions, yoga, running groups' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#8E44AD', description: 'Board games, video games, tournaments' },
  { id: 'books', name: 'Books & Learning', icon: '📚', color: '#16A085', description: 'Book clubs, workshops, lectures' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#E67E22', description: 'Group trips, travel planning' },
  { id: 'volunteer', name: 'Volunteering', icon: '❤️', color: '#C0392B', description: 'Community service, charity events' }
]

export const InterestScreen = ({ onInterestsSelected, user }) => {
  const { colors } = useClustrTheme()
  const [selectedInterests, setSelectedInterests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

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

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId)
      } else {
        return [...prev, interestId]
      }
    })
  }

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      Alert.alert(
        'Select More Interests',
        'Please select at least 3 interests to personalize your experience.',
        [{ text: 'OK' }]
      )
      return
    }

    setIsLoading(true)

    try {
      // Save interests to AsyncStorage first (always works)
      await AsyncStorage.setItem('userInterests', JSON.stringify(selectedInterests))
      console.log('✅ Interests saved locally:', selectedInterests)

      // Mark interests as completed
      await AsyncStorage.setItem('hasSelectedInterests', 'true')
      
      // Call the callback to proceed to dashboard
      onInterestsSelected(selectedInterests)

      // Try to save to backend in background (non-blocking)
      const userToken = await AsyncStorage.getItem('userToken')
      if (userToken) {
        authAPI.updateUserInterests(selectedInterests, userToken)
          .then(() => console.log('✅ Interests saved to backend'))
          .catch(error => {
            console.log('⚠️ Backend interests save failed (non-critical):', error.message)
          })
      }

    } catch (error) {
      console.error('❌ Error saving interests locally:', error)
      Alert.alert('Error', 'Failed to save interests. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const InterestCard = ({ interest }) => {
    const isSelected = selectedInterests.includes(interest.id)
    
    return (
      <Pressable
        onPress={() => toggleInterest(interest.id)}
        style={{
          flex: 1,
          margin: 8,
          minWidth: '45%',
          maxWidth: '48%'
        }}
      >
        <Animated.View
          style={{
            backgroundColor: isSelected ? interest.color + '20' : colors.surface,
            borderRadius: 16,
            padding: 20,
            borderWidth: 2,
            borderColor: isSelected ? interest.color : colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isSelected ? 0.15 : 0.05,
            shadowRadius: 8,
            elevation: isSelected ? 6 : 2,
            transform: [{ scale: isSelected ? 1.02 : 1 }]
          }}
        >
          {/* Icon */}
          <View style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: isSelected ? interest.color : interest.color + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            alignSelf: 'center'
          }}>
            <ClustrText style={{ 
              fontSize: 24,
              color: isSelected ? colors.surface : interest.color
            }}>
              {interest.icon}
            </ClustrText>
          </View>

          {/* Title */}
          <ClustrText style={{
            fontSize: 16,
            fontWeight: '700',
            color: isSelected ? interest.color : colors.text,
            textAlign: 'center',
            marginBottom: 8
          }}>
            {interest.name}
          </ClustrText>

          {/* Description */}
          <ClustrText style={{
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 16
          }}>
            {interest.description}
          </ClustrText>

          {/* Selection Indicator */}
          {isSelected && (
            <View style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: interest.color,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <ClustrText style={{ fontSize: 14, color: colors.surface }}>
                ✓
              </ClustrText>
            </View>
          )}
        </Animated.View>
      </Pressable>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        
        <Animated.View style={{ 
          flex: 1, 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          {/* Header */}
          <View style={{
            paddingTop: 20,
            paddingHorizontal: 24,
            paddingBottom: 30
          }}>
            {/* Logo */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <ClustrLogoMedium />
            </View>
            
            <ClustrText style={{
              fontSize: 28,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 8
            }}>
              What interests you?
            </ClustrText>
            
            <ClustrText style={{
              fontSize: 16,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 22
            }}>
              Select at least 3 interests to personalize your Clustr experience
            </ClustrText>

            {/* Progress Indicator */}
            <View style={{
              marginTop: 20,
              alignItems: 'center'
            }}>
              <ClustrText style={{
                fontSize: 14,
                fontWeight: '600',
                color: selectedInterests.length >= 3 ? colors.primary : colors.textSecondary
              }}>
                {selectedInterests.length}/3 minimum selected
              </ClustrText>
              
              <View style={{
                width: 200,
                height: 4,
                backgroundColor: colors.border,
                borderRadius: 2,
                marginTop: 8,
                overflow: 'hidden'
              }}>
                <Animated.View style={{
                  width: `${Math.min((selectedInterests.length / 3) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: colors.primary,
                  borderRadius: 2
                }} />
              </View>
            </View>
          </View>

          {/* Interests Grid */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              paddingHorizontal: 16,
              paddingBottom: 120 // Space for fixed button
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between'
            }}>
              {INTERESTS.map(interest => (
                <InterestCard key={interest.id} interest={interest} />
              ))}
            </View>
          </ScrollView>

          {/* Fixed Continue Button */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background,
            paddingHorizontal: 24,
            paddingVertical: 20,
            paddingBottom: 40,
            borderTopWidth: 1,
            borderTopColor: colors.border
          }}>
            <ClustrButton
              variant="primary"
              onPress={handleContinue}
              disabled={selectedInterests.length < 3 || isLoading}
              style={{
                opacity: selectedInterests.length < 3 ? 0.5 : 1,
                paddingVertical: 16
              }}
            >
              <ClustrText style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.surface
              }}>
                {isLoading 
                  ? 'Saving...' 
                  : `Continue with ${selectedInterests.length} interests`
                }
              </ClustrText>
            </ClustrButton>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
