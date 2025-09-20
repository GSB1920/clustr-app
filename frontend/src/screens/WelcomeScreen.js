import React, { useEffect, useRef, useState } from 'react'
import { 
  View, 
  Animated, 
  Dimensions, 
  StatusBar,
  Easing,
  Alert
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton } from '../components/ui'
import { ClustrLogoLarge } from '../assets/ClustrLogo'

const { width, height } = Dimensions.get('window')

export const WelcomeScreen = ({ onLogin, onSignUp, onSkip }) => {
  const { colors } = useClustrTheme()
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current
  const logoOpacity = useRef(new Animated.Value(0)).current
  const titleTranslateY = useRef(new Animated.Value(50)).current
  const titleOpacity = useRef(new Animated.Value(0)).current
  const subtitleTranslateY = useRef(new Animated.Value(30)).current
  const subtitleOpacity = useRef(new Animated.Value(0)).current
  const buttonsScale = useRef(new Animated.Value(0)).current
  const buttonsOpacity = useRef(new Animated.Value(0)).current
  const backgroundGradient = useRef(new Animated.Value(0)).current
  
  // Floating animation for logo
  const floatAnimation = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    startWelcomeAnimation()
    startFloatingAnimation()
  }, [])

  const startWelcomeAnimation = () => {
    // Background gradient animation
    Animated.timing(backgroundGradient, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start()

    // Logo animation
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ]).start()

    // Title animation
    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start()

    // Subtitle animation
    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.spring(subtitleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start()

    // Buttons animation
    Animated.sequence([
      Animated.delay(1600),
      Animated.parallel([
        Animated.spring(buttonsScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      ])
    ]).start()
  }

  const startFloatingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start()
  }

  const handleSkip = () => {
    Alert.alert(
      "Guest Mode Coming Soon! 🚀",
      "We're working on guest access. For now, please create an account to experience the full power of Clustr.",
      [
        {
          text: "Got it",
          style: "default"
        },
        {
          text: "Sign Up",
          style: "default",
          onPress: onSignUp
        }
      ]
    )
  }

  const interpolatedFloat = floatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  })

  const backgroundInterpolation = backgroundGradient.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.primary + '10']
  })

  return (
    <Animated.View 
      style={[
        {
          flex: 1,
          backgroundColor: backgroundInterpolation,
        }
      ]}
    >
      <StatusBar 
        backgroundColor={colors.primary} 
        barStyle="light-content" 
        translucent 
      />
      
      {/* Background Pattern */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
      }}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              borderRadius: 50,
              backgroundColor: colors.primary,
              top: Math.random() * height,
              left: Math.random() * width,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </View>

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 60,
      }}>
        
        {/* Logo Section */}
        <Animated.View
          style={{
            transform: [
              { scale: logoScale },
              { translateY: interpolatedFloat }
            ],
            opacity: logoOpacity,
            marginBottom: 40,
            alignItems: 'center',
          }}
        >
          <ClustrLogoLarge />
          
          <ClustrText 
            variant="title" 
            style={{ 
              fontSize: 32,
              fontWeight: '700',
              color: colors.primary,
              textAlign: 'center',
              letterSpacing: -1,
              marginTop: 16,
            }}
          >
            Clustr
          </ClustrText>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }],
            opacity: titleOpacity,
            marginBottom: 16,
          }}
        >
          <ClustrText 
            variant="heading" 
            style={{ 
              textAlign: 'center',
              color: colors.text,
              fontSize: 28,
              fontWeight: '600',
              lineHeight: 36,
            }}
          >
            Welcome to Your{'\n'}Digital Universe
          </ClustrText>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={{
            transform: [{ translateY: subtitleTranslateY }],
            opacity: subtitleOpacity,
            marginBottom: 60,
          }}
        >
          <ClustrText 
            variant="body" 
            style={{ 
              textAlign: 'center',
              color: colors.textSecondary,
              fontSize: 16,
              lineHeight: 24,
              paddingHorizontal: 20,
            }}
          >
            Connect, organize, and manage everything in one place. 
            Experience seamless collaboration like never before.
          </ClustrText>
        </Animated.View>

        {/* Authentication Buttons */}
        <Animated.View
          style={{
            transform: [{ scale: buttonsScale }],
            opacity: buttonsOpacity,
            width: '100%',
            maxWidth: 280,
          }}
        >
          {/* Sign Up Button (Primary) */}
          <ClustrButton
            variant="primary"
            size="lg"
            onPress={onSignUp}
            style={{
              width: '100%',
              marginBottom: 12,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            Create Account
          </ClustrButton>

          {/* Login Button (Secondary) */}
          <ClustrButton
            variant="secondary"
            size="lg"
            onPress={onLogin}
            style={{
              width: '100%',
              marginBottom: 24,
            }}
          >
            Login
          </ClustrButton>

          {/* Skip/Guest Mode */}
          <ClustrButton
            variant="secondary"
            size="md"
            onPress={handleSkip}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              width: '100%',
            }}
            textStyle={{
              color: colors.textSecondary,
              fontSize: 14,
            }}
          >
            Continue as Guest
          </ClustrButton>
        </Animated.View>
      </View>
    </Animated.View>
  )
}