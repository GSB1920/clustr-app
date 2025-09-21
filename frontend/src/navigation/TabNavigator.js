import React from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText } from '../components/ui'

// Import your existing DashboardScreen as EventsTab
import { DashboardScreen } from '../screens/DashboardScreen'

const Tab = createBottomTabNavigator()

// Simple Chat Screen (placeholder)
const ChatTab = () => {
  const { colors } = useClustrTheme()
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ClustrText style={{ fontSize: 48, marginBottom: 16 }}>💬</ClustrText>
      <ClustrText style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
        Chat Coming Soon
      </ClustrText>
    </View>
  )
}

// Simple Create Screen (placeholder)
const CreateTab = () => {
  const { colors } = useClustrTheme()
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ClustrText style={{ fontSize: 48, marginBottom: 16 }}>➕</ClustrText>
      <ClustrText style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
        Create Event Coming Soon
      </ClustrText>
    </View>
  )
}

export const TabNavigator = ({ user, onLogout }) => {
  const { colors } = useClustrTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Events" 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              📅
            </ClustrText>
          ),
        }}
      >
        {(props) => <DashboardScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Chat" 
        component={ChatTab}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              💬
            </ClustrText>
          ),
        }}
      />

      <Tab.Screen 
        name="Create" 
        component={CreateTab}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              ➕
            </ClustrText>
          ),
        }}
      />
    </Tab.Navigator>
  )
}
