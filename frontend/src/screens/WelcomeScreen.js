import React, { useEffect, useRef, useState } from 'react'
import { 
  View, 
  Dimensions, 
  StatusBar,
  Animated,
  Pressable
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton } from '../components/ui'
import { ClustrLogoLarge } from '../assets/ClustrLogo'

const { width, height } = Dimensions.get('window')


export const WelcomeScreen = ({ onGetStarted }) => {
  const { colors } = useClustrTheme()
  const [activeTab, setActiveTab] = useState(0)
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const logoRotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      ]),
      // Logo rotation animation
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      {/* Main Content - No ScrollView */}
      <View style={{ flex: 1, paddingHorizontal: 24 }}>
        
        {/* Hero Section - Top Half */}
        <View style={{
          flex: 0.6,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 60,
        }}>
          {/* Stunning Logo */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
                { rotate: logoRotation }
              ],
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            {/* Clustr Logo */}
            <ClustrLogoLarge />
          </Animated.View>
          
          {/* Brand Name & Tagline */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <ClustrText 
              variant="title" 
              style={{
                fontSize: 42,
                fontWeight: '800',
                color: colors.text,
                marginBottom: 12,
                textAlign: 'center',
                letterSpacing: -1,
              }}
            >
              Clustr
            </ClustrText>
            
            <ClustrText 
              variant="body" 
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: colors.textSecondary,
                lineHeight: 26,
                maxWidth: 280,
                fontWeight: '500',
              }}
            >
              Join {'\n'}
              <ClustrText style={{ color: colors.primary, fontWeight: '600' }}>
                Your Favourite
              </ClustrText> Community
            </ClustrText>
          </Animated.View>
        </View>

        {/* Features Section - Bottom Half */}
        <View style={{ flex: 0.4, justifyContent: 'space-between' }}>
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingBottom: 40,
            }}
          >
            {/* Get Started Button */}
            <ClustrButton
              variant="primary"
              size="lg"
              onPress={onGetStarted}
              style={{
                width: '100%',
                paddingVertical: 18,
                borderRadius: 16,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
                marginBottom: 12,
              }}
            >
              <ClustrText style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
                Get Started →
              </ClustrText>
            </ClustrButton>

            {/* Secondary Text */}
            <ClustrText 
              variant="caption"
              style={{
                fontSize: 13,
                color: colors.muted,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              Free to start • No credit card required • Join 10,000+ users
            </ClustrText>
          </Animated.View>
        </View>
      </View>
    </View>
  )
}