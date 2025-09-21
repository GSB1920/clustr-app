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

const getResponsiveValues = () => {
  const isSmallScreen = height < 700
  const isMediumScreen = height >= 700 && height < 800
  
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
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
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
        response = await authAPI.signup({
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
        })
        console.log('✅ Signup successful:', response)
      } else {
        response = await authAPI.login({
          email: formData.email.toLowerCase(),
          password: formData.password,
        })
        console.log('✅ Login successful:', response)
      }

      await AsyncStorage.setItem('userToken', response.token)
      await AsyncStorage.setItem('userData', JSON.stringify(response.user))
      
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
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <Animated.View style={{ flex: 1, opacity: fadeAnim, paddingTop: responsive.topPadding }}>
            
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 40, paddingHorizontal: 24 }}>
              <ClustrText variant="title" style={{ fontSize: 32, fontWeight: '700', marginBottom: 8 }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </ClustrText>
              <ClustrText style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>
                {isSignUp ? 'Join the community' : 'Sign in to continue'}
              </ClustrText>
            </View>

            {/* Form */}
            <ClustrCard style={{ marginHorizontal: 24, padding: 24, marginBottom: 20 }}>
              
              {/* Name Field (Sign Up only) */}
              {isSignUp && (
                <View style={{ marginBottom: 20 }}>
                  <ClustrText style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                    Full Name
                  </ClustrText>
                  <ClustrInput
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                  />
                </View>
              )}

              {/* Email Field */}
              <View style={{ marginBottom: 20 }}>
                <ClustrText style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                  Email
                </ClustrText>
                <ClustrInput
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Field */}
              <View style={{ marginBottom: isSignUp ? 20 : 0 }}>
                <ClustrText style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                  Password
                </ClustrText>
                <ClustrInput
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                />
              </View>

              {/* Confirm Password (Sign Up only) */}
              {isSignUp && (
                <View>
                  <ClustrText style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                    Confirm Password
                  </ClustrText>
                  <ClustrInput
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                  />
                </View>
              )}
            </ClustrCard>

            {/* Auth Button */}
            <ClustrCard style={{ marginHorizontal: 24, padding: 24, marginBottom: 20 }}>
              <ClustrButton
                variant="primary"
                onPress={handleAuth}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1 }}
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
              <ClustrText style={{ color: colors.textSecondary, fontSize: 14, marginRight: 4 }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </ClustrText>
              <Pressable onPress={toggleAuthMode} disabled={isLoading}>
                <ClustrText style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </ClustrText>
              </Pressable>
            </View>

            {/* Skip Button */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 20 }}>
              <ClustrButton variant="ghost" onPress={() => onAuthSuccess && onAuthSuccess()}>
                <ClustrText style={{ color: colors.textSecondary }}>
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
