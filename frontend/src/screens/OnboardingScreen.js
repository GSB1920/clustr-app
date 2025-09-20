// src/screens/WelcomeScreen.js
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

const { width, height } = Dimensions.get('window')

const features = [
  {
    icon: "🔗",
    title: "Connect",
    subtitle: "Everything",
    description: "Bring all your tools and teams together in one unified workspace"
  },
  {
    icon: "📋", 
    title: "Stay",
    subtitle: "Organized", 
    description: "Create smart clusters and watch your productivity soar"
  },
  {
    icon: "👥",
    title: "Collaborate",
    subtitle: "Better",
    description: "Work together in real-time, no matter where you are"
  }
]

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

    // Auto-rotate through features
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
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
            {/* Multi-layered Logo Design */}
            <View style={{
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Outer Glow Ring */}
              <View style={{
                position: 'absolute',
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: colors.primary + '20',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }} />
              
              {/* Middle Ring */}
              <View style={{
                position: 'absolute',
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: colors.primary + '40',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 8,
              }} />
              
              {/* Main Logo Container */}
              <View style={{
                width: 100,
                height: 100,
                borderRadius: 24,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 12,
                borderWidth: 3,
                borderColor: colors.surface,
              }}>
                {/* Cluster Icon */}
                <View style={{ position: 'relative' }}>
                  <ClustrText style={{ fontSize: 32, color: 'white' }}>⚡</ClustrText>
                  {/* Sparkle Effects */}
                  <View style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: colors.accent,
                    shadowColor: colors.accent,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.6,
                    shadowRadius: 4,
                  }} />
                </View>
              </View>
            </View>
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
              Empower yourself with{'\n'}
              <ClustrText style={{ color: colors.primary, fontWeight: '600' }}>
                quick knowledge
              </ClustrText> and seamless organization
            </ClustrText>
          </Animated.View>
        </View>

        {/* Features Section - Bottom Half */}
        <View style={{ flex: 0.4, justifyContent: 'space-between' }}>
          
          {/* Tab Indicators */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            {features.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => setActiveTab(index)}
                style={{
                  width: activeTab === index ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: activeTab === index ? colors.primary : colors.border,
                  marginHorizontal: 4,
                  shadowColor: activeTab === index ? colors.primary : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: activeTab === index ? 3 : 0,
                }}
              />
            ))}
          </Animated.View>

          {/* Active Feature Display */}
          <Animated.View 
            key={activeTab}
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
              paddingHorizontal: 20,
              marginBottom: 32,
            }}
          >
            {/* Feature Icon */}
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: colors.primary + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <ClustrText style={{ fontSize: 32 }}>
                {features[activeTab].icon}
              </ClustrText>
            </View>
            
            {/* Feature Title */}
            <ClustrText 
              variant="heading"
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {features[activeTab].title}{' '}
              <ClustrText style={{ color: colors.primary }}>
                {features[activeTab].subtitle}
              </ClustrText>
            </ClustrText>
            
            {/* Feature Description */}
            <ClustrText 
              variant="caption"
              style={{
                fontSize: 15,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 22,
                maxWidth: 280,
              }}
            >
              {features[activeTab].description}
            </ClustrText>
          </Animated.View>

          {/* CTA Section */}
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