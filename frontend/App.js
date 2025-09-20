// App.js
import React from 'react'
import { View, ScrollView, StatusBar } from 'react-native'
import { ClustrThemeProvider, useClustrTheme } from './src/theme/ClustrTheme'
import { 
  ClustrButton, 
  ClustrInput, 
  ClustrCard, 
  ClustrText, 
  ClustrThemeSwitcher 
} from './src/components/ui/index.js'

const AppContent = () => {
  const { colors } = useClustrTheme()

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      <View style={{ padding: 24 }}>
        <ClustrText variant="title" style={{ marginBottom: 24 }}>
          Welcome to Clustr
        </ClustrText>

        <ClustrCard style={{ marginBottom: 24 }}>
          <ClustrText variant="heading" style={{ marginBottom: 16 }}>
            Sign In
          </ClustrText>
          
          <ClustrInput 
            placeholder="Enter your email"
            style={{ marginBottom: 16 }}
          />
          
          <ClustrInput 
            placeholder="Enter your password"
            secureTextEntry
            style={{ marginBottom: 24 }}
          />
          
          <ClustrButton 
            variant="primary" 
            style={{ marginBottom: 8 }}
            onPress={() => console.log('Sign In pressed')}
          >
            Sign In
          </ClustrButton>
          
          <ClustrButton variant="secondary">
            Create Account
          </ClustrButton>
        </ClustrCard>

        <ClustrCard style={{ marginBottom: 24 }}>
          <ClustrText variant="heading" style={{ marginBottom: 16 }}>
            Action Buttons
          </ClustrText>
          
          <ClustrButton variant="accent" style={{ marginBottom: 8 }}>
            Create New Cluster
          </ClustrButton>
          
          <ClustrButton variant="success" style={{ marginBottom: 8 }}>
            Success Action
          </ClustrButton>
          
          <ClustrButton variant="error">
            Delete Account
          </ClustrButton>
        </ClustrCard>

        <ClustrThemeSwitcher />
      </View>
    </ScrollView>
  )
}

export default function App() {
  return (
    <ClustrThemeProvider>
      <AppContent />
    </ClustrThemeProvider>
  )
}