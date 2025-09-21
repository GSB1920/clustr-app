import React, { useState, useEffect } from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ClustrThemeProvider, useClustrTheme } from './src/theme/ClustrTheme'
import { WelcomeScreen } from './src/screens/WelcomeScreen'
import { AuthScreen } from './src/screens/AuthScreen'
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
      
      console.log('🔍 Debug - hasSeenWelcome:', hasSeenWelcome)
      console.log('🔍 Debug - userToken:', userToken ? 'exists' : 'none')
      
      if (userToken && userData) {
        setUser(JSON.parse(userData))
        setCurrentScreen('main')
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
        setCurrentScreen('main')
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
        setCurrentScreen('main')
      }
    } catch (error) {
      console.log('Error saving auth state:', error)
      setCurrentScreen('main')
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      await AsyncStorage.removeItem('userData')
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