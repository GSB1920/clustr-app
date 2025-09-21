import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrInput, ClustrCard } from '../components/ui'
import { authAPI } from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window')

// Calculate responsive values based on screen size
const getResponsiveValues = () => {
  const isSmallScreen = height < 700
  const isMediumScreen = height >= 700 && height < 800
  const isLargeScreen = height >= 800
  
  return {
    topPadding: isSmallScreen ? 40 : isMediumScreen ? 50 : 60,
    cardPadding: isSmallScreen ? 20 : 24,
    sectionSpacing: isSmallScreen ? 16 : 20,
    inputSpacing: isSmallScreen ? 16 : 20,
  }
}

export const AuthScreen = ({ onAuthSuccess, onGoBack }) => {
  const { colors } = useClustrTheme()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const responsive = getResponsiveValues()
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Validation Error', 'Please fill in all required fields')
      return false
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address')
      return false
    }

    if (formData.password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long')
      return false
    }

    if (isSignUp) {
      if (!formData.name) {
        Alert.alert('Validation Error', 'Please enter your name')
        return false
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match')
        return false
      }
    }

    return true
  }

  const handleAuth = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      let response
      
      if (isSignUp) {
        // Signup
        response = await authAPI.signup({
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
        })
        console.log('✅ Signup successful:', response)
      } else {
        // Login
        response = await authAPI.login({
          email: formData.email.toLowerCase(),
          password: formData.password,
        })
        console.log('✅ Login successful:', response)
      }

      // Success! Save token and user data, then go directly to dashboard
      await AsyncStorage.setItem('userToken', response.token)
      await AsyncStorage.setItem('userData', JSON.stringify(response.user))
      
      // Go directly to dashboard without alert
      onAuthSuccess(response)

    } catch (error) {
      console.error('Auth error:', error)
      Alert.alert(
        'Authentication Error',
        error.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: colors.background 
      }}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingTop: responsive.topPadding,
            }}
          >
            {/* Header */}
            <View style={{
              alignItems: 'center',
              marginBottom: responsive.sectionSpacing * 2,
              paddingHorizontal: responsive.cardPadding,
            }}>
              <ClustrText variant="title" style={{
                fontSize: 32,
                fontWeight: '700',
                marginBottom: 8,
                textAlign: 'center',
              }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </ClustrText>
              
              <ClustrText style={{
                color: colors.textSecondary,
                fontSize: 16,
                textAlign: 'center',
                lineHeight: 22,
              }}>
                {isSignUp 
                  ? 'Join the community and discover amazing events'
                  : 'Sign in to continue to your account'
                }
              </ClustrText>
            </View>

            {/* Form */}
            <ClustrCard style={{
              marginHorizontal: responsive.cardPadding,
              padding: responsive.cardPadding,
              marginBottom: responsive.sectionSpacing,
            }}>
              {/* Name Field (Sign Up only) */}
              {isSignUp && (
                <View style={{ marginBottom: responsive.inputSpacing }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8,
                  }}>
                    Full Name
                  </ClustrText>
                  <ClustrInput
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              )}

              {/* Email Field */}
              <View style={{ marginBottom: responsive.inputSpacing }}>
                <ClustrText style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  Email
                </ClustrText>
                <ClustrInput
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* Password Field */}
              <View style={{ marginBottom: isSignUp ? responsive.inputSpacing : 0 }}>
                <ClustrText style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 8,
                }}>
                  Password
                </ClustrText>
                <ClustrInput
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  returnKeyType={isSignUp ? "next" : "done"}
                />
              </View>

              {/* Confirm Password Field (Sign Up only) */}
              {isSignUp && (
                <View style={{ marginBottom: 0 }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8,
                  }}>
                    Confirm Password
                  </ClustrText>
                  <ClustrInput
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    returnKeyType="done"
                  />
                </View>
              )}
            </ClustrCard>

            {/* Auth Button */}
            <ClustrCard style={{
              marginHorizontal: responsive.cardPadding,
              padding: responsive.cardPadding,
              marginBottom: responsive.sectionSpacing,
            }}>
              <ClustrButton
                variant="primary"
                onPress={handleAuth}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <ClustrText variant="button" style={{ color: colors.background }}>
                  {isLoading 
                    ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                    : (isSignUp ? 'Create Account' : 'Sign In')
                  }
                </ClustrText>
              </ClustrButton>
            </ClustrCard>

            {/* Switch Auth Mode */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: height < 700 ? 16 : 24,
            }}>
              <ClustrText 
                style={{
                  color: colors.textSecondary,
                  fontSize: 14,
                  marginRight: 4,
                }}
              >
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </ClustrText>
              <Pressable onPress={toggleAuthMode} disabled={isLoading}>
                <ClustrText 
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: '600',
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </ClustrText>
              </Pressable>
            </View>

            {/* Development Skip Button (Remove in production) */}
            <View style={{
              paddingHorizontal: responsive.cardPadding,
              paddingBottom: 20,
            }}>
              <ClustrButton
                variant="ghost"
                onPress={() => onAuthSuccess && onAuthSuccess()}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: 'transparent'
                }}
              >
                <ClustrText 
                  variant="button" 
                  style={{ 
                    color: colors.textSecondary,
                    fontSize: 16
                  }}
                >
                  Skip for now (Dev) →
                </ClustrText>
              </ClustrButton>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}