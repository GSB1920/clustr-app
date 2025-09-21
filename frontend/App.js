import React, { useState, useEffect } from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ClustrThemeProvider, useClustrTheme } from './src/theme/ClustrTheme'
import { WelcomeScreen } from './src/screens/WelcomeScreen'
import { AuthScreen } from './src/screens/AuthScreen'
import { InterestScreen } from './src/screens/InterestScreen'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { 
  ClustrButton, 
  ClustrInput, 
  ClustrCard, 
  ClustrText, 
  ClustrThemeSwitcher 
} from './src/components/ui'

// Main App (temporary)
const MainApp = () => {
  const { colors } = useClustrTheme()

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      <View style={{ padding: 24 }}>
        <ClustrText variant="title" style={{ marginBottom: 24 }}>
          🎉 Welcome to Clustr!
        </ClustrText>

        <ClustrCard style={{ marginBottom: 24 }}>
          <ClustrText variant="heading" style={{ marginBottom: 16 }}>
            You're In! 
          </ClustrText>
          
          <ClustrText variant="body" style={{ marginBottom: 16, color: colors.textSecondary }}>
            This is where your main app content will go. The onboarding and authentication flow is working perfectly!
          </ClustrText>
          
          <ClustrButton 
            variant="accent" 
            onPress={() => console.log('Explore pressed')}
          >
            Start Exploring
          </ClustrButton>
        </ClustrCard>

        <ClustrThemeSwitcher />
      </View>
    </ScrollView>
  )
}

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState('loading')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAppState()
  }, [])

  const checkAppState = async () => {
    try {
      // TEMPORARY: Clear storage to always start from welcome (for development)
      await AsyncStorage.clear()  // Uncomment this line to always start from welcome
      
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome')
      const userToken = await AsyncStorage.getItem('userToken')
      const userData = await AsyncStorage.getItem('userData')
      const hasSelectedInterests = await AsyncStorage.getItem('hasSelectedInterests')
      
      console.log('🔍 Debug - hasSeenWelcome:', hasSeenWelcome)
      console.log('🔍 Debug - userToken:', userToken ? 'exists' : 'none')
      console.log('🔍 Debug - hasSelectedInterests:', hasSelectedInterests)
      
      if (userToken && userData) {
        const user = JSON.parse(userData)
        setUser(user)
        
        // Check if user has selected interests
        if (hasSelectedInterests === 'true') {
          setCurrentScreen('main')
        } else {
          setCurrentScreen('interests')
        }
      } else if (hasSeenWelcome === 'true') {
        setCurrentScreen('auth')
      } else {
        setCurrentScreen('welcome')
      }
      
      setIsLoading(false)
    } catch (error) {
      console.log('Error checking app state:', error)
      setCurrentScreen('welcome')
      setIsLoading(false)
    }
  }

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true')
      setCurrentScreen('auth')
    } catch (error) {
      console.log('Error saving welcome state:', error)
      setCurrentScreen('auth')
    }
  }

  const handleAuthSuccess = async (authData = null) => {
    try {
      if (authData) {
        // Real authentication - save token and user data
        await AsyncStorage.setItem('userToken', authData.token)
        await AsyncStorage.setItem('userData', JSON.stringify(authData.user))
        setUser(authData.user)
        
        // After successful auth, go to interests selection
        setCurrentScreen('interests')
      } else {
        // Skip/Demo mode
        await AsyncStorage.setItem('userToken', 'demo_token')
        const demoUser = { 
          id: 'demo',
          name: 'Demo User', 
          email: 'demo@clustr.com',
          username: 'demo_user'
        }
        await AsyncStorage.setItem('userData', JSON.stringify(demoUser))
        setUser(demoUser)
        
        // Demo mode also needs interests
        setCurrentScreen('interests')
      }
    } catch (error) {
      console.log('Error saving auth state:', error)
      setCurrentScreen('interests') // Fallback to interests
    }
  }

  const handleInterestsSelected = async (interests) => {
    try {
      console.log('✅ User selected interests:', interests)
      
      // Mark interests as completed and go to main app
      await AsyncStorage.setItem('hasSelectedInterests', 'true')
      setCurrentScreen('main')
    } catch (error) {
      console.log('Error handling interests:', error)
      setCurrentScreen('main') // Proceed anyway
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      await AsyncStorage.removeItem('userData')
      await AsyncStorage.removeItem('hasSelectedInterests')
      await AsyncStorage.removeItem('userInterests')
      setUser(null)
      setCurrentScreen('auth')
    } catch (error) {
      console.log('Error logging out:', error)
    }
  }

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome')
  }

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#F8FAFC' }} />
  }

  console.log('🎯 Current screen state:', currentScreen)
  console.log('📱 About to render screen...')

  switch (currentScreen) {
    case 'welcome':
      console.log('🏠 Rendering Welcome Screen')
      return (
        <WelcomeScreen 
          onGetStarted={handleGetStarted}
        />
      )
    
    case 'auth':
      console.log('🔐 Rendering Auth Screen')
      return (
        <AuthScreen 
          onAuthSuccess={handleAuthSuccess}
          onGoBack={handleBackToWelcome}
        />
      )
    
    case 'interests':
      console.log('🎯 Rendering Interest Selection Screen')
      return (
        <InterestScreen 
          onInterestsSelected={handleInterestsSelected}
          user={user}
        />
      )
    
    case 'main':
      console.log('📊 Rendering Dashboard')
      return <DashboardScreen onLogout={handleLogout} user={user} />
    
    default:
      console.log('🏠 Rendering Default Welcome Screen')
      return <MainApp />
  }
}

export default function App() {
  return (
    <ClustrThemeProvider>
      <AppContent />
    </ClustrThemeProvider>
  )
}