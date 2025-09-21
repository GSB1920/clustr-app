import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrInput, ClustrCard } from '../components/ui'

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

  const handleAuth = () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      alert('Please fill in all required fields')
      return
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // Simulate auth success
    console.log('Auth attempted with:', formData)
    onAuthSuccess()
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
        
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 20
          }}
        >
          {/* Header - Optimized spacing */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: 24,
              paddingTop: responsive.topPadding,
              paddingBottom: responsive.sectionSpacing,
            }}
          >
            {/* Back Button */}
            <Pressable 
              onPress={onGoBack}
              style={{
                alignSelf: 'flex-start',
                padding: 8,
                marginBottom: 16,
              }}
            >
              <ClustrText style={{ color: colors.primary, fontSize: 16 }}>
                ← Back
              </ClustrText>
            </Pressable>

            {/* Welcome Text */}
            <ClustrText 
              variant="title" 
              style={{
                fontSize: height < 700 ? 24 : 28,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8,
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </ClustrText>
            
            <ClustrText 
              variant="body" 
              style={{
                fontSize: height < 700 ? 14 : 16,
                color: colors.textSecondary,
                lineHeight: height < 700 ? 20 : 24,
              }}
            >
              {isSignUp 
                ? 'Join thousands of users organizing their digital life' 
                : 'Sign in to continue your productivity journey'
              }
            </ClustrText>
          </Animated.View>

          {/* Auth Form - Optimized layout */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingHorizontal: 24,
              flex: 1,
            }}
          >
            <ClustrCard style={{
              padding: responsive.cardPadding,
              borderRadius: 16,
              backgroundColor: colors.surface,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}>
              {/* Name Field (Sign Up Only) */}
              {isSignUp && (
                <View style={{ marginBottom: responsive.inputSpacing }}>
                  <ClustrText 
                    variant="label" 
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Full Name
                  </ClustrText>
                  <ClustrInput
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    style={{
                      borderRadius: 12,
                      paddingVertical: height < 700 ? 12 : 14,
                      paddingHorizontal: 16,
                      fontSize: 16,
                    }}
                  />
                </View>
              )}

              {/* Email Field */}
              <View style={{ marginBottom: responsive.inputSpacing }}>
                <ClustrText 
                  variant="label" 
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </ClustrText>
                <ClustrInput
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    borderRadius: 12,
                    paddingVertical: height < 700 ? 12 : 14,
                    paddingHorizontal: 16,
                    fontSize: 16,
                  }}
                />
              </View>

              {/* Password Field */}
              <View style={{ marginBottom: isSignUp ? responsive.inputSpacing : 20 }}>
                <ClustrText 
                  variant="label" 
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  Password
                </ClustrText>
                <ClustrInput
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  style={{
                    borderRadius: 12,
                    paddingVertical: height < 700 ? 12 : 14,
                    paddingHorizontal: 16,
                    fontSize: 16,
                  }}
                />
              </View>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <View style={{ marginBottom: 20 }}>
                  <ClustrText 
                    variant="label" 
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: colors.text,
                      marginBottom: 8,
                    }}
                  >
                    Confirm Password
                  </ClustrText>
                  <ClustrInput
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    style={{
                      borderRadius: 12,
                      paddingVertical: height < 700 ? 12 : 14,
                      paddingHorizontal: 16,
                      fontSize: 16,
                    }}
                  />
                </View>
              )}

              {/* Forgot Password (Sign In Only) */}
              {!isSignUp && (
                <Pressable style={{ alignSelf: 'flex-end', marginBottom: 20 }}>
                  <ClustrText 
                    style={{
                      color: colors.primary,
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    Forgot Password?
                  </ClustrText>
                </Pressable>
              )}

              {/* Auth Button */}
              <ClustrButton
                variant="primary"
                size="lg"
                onPress={handleAuth}
                style={{
                  width: '100%',
                  paddingVertical: height < 700 ? 14 : 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <ClustrText style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </ClustrText>
              </ClustrButton>

              {/* Divider */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 16,
              }}>
                <View style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.border,
                }} />
                <ClustrText 
                  style={{
                    color: colors.muted,
                    fontSize: 14,
                    paddingHorizontal: 16,
                  }}
                >
                  or
                </ClustrText>
                <View style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: colors.border,
                }} />
              </View>

              {/* Social Auth Buttons */}
              <ClustrButton
                variant="secondary"
                size="lg"
                style={{
                  width: '100%',
                  paddingVertical: height < 700 ? 14 : 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <ClustrText style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                  🚀 Continue with Google
                </ClustrText>
              </ClustrButton>

              <ClustrButton
                variant="secondary"
                size="lg"
                style={{
                  width: '100%',
                  paddingVertical: height < 700 ? 14 : 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <ClustrText style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                  🍎 Continue with Apple
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
              <Pressable onPress={toggleAuthMode}>
                <ClustrText 
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: '600',
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </ClustrText>
              </Pressable>
            </View>

            {/* Skip Button for Testing */}
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
                  Skip for now →
                </ClustrText>
              </ClustrButton>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}