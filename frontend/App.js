import React, { useState, useEffect } from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ClustrThemeProvider, useClustrTheme } from './src/theme/ClustrTheme'
import { WelcomeScreen } from './src/screens/WelcomeScreen'
import { AuthScreen } from './src/screens/AuthScreen'
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
  const [currentScreen, setCurrentScreen] = useState('loading') // 'loading', 'welcome', 'auth', 'main'
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAppState()
  }, [])

  //Temp
  const checkAppState = async () => {
    try {
      // TEMPORARY: Clear storage to always start from welcome (for development)
      await AsyncStorage.clear()
      
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome')
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
      
      console.log('🔍 Debug - hasSeenWelcome:', hasSeenWelcome)
      console.log('🔍 Debug - isLoggedIn:', isLoggedIn)
      
      if (isLoggedIn === 'true') {
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

  const handleAuthSuccess = async () => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true')
      setCurrentScreen('main')
    } catch (error) {
      console.log('Error saving auth state:', error)
      setCurrentScreen('main')
    }
  }

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome')
  }

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: '#F8FAFC' }} />
  }

  switch (currentScreen) {
    case 'welcome':
      return (
        <WelcomeScreen 
          onGetStarted={handleGetStarted}
        />
      )
    
    case 'auth':
      return (
        <AuthScreen 
          onAuthSuccess={handleAuthSuccess}
          onGoBack={handleBackToWelcome}
        />
      )
    
    case 'main':
    default:
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