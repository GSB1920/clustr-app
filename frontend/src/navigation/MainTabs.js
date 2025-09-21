import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText } from '../components/ui'

// Import screen components
import { HomeScreen } from '../screens/HomeScreen'
import { EventsScreen } from '../screens/EventsScreen'
import { ChatScreen } from '../screens/ChatScreen'
import { CreateEventScreen } from '../screens/CreateEventScreen'

const Tab = createBottomTabNavigator()

export const MainTabs = ({ user, onLogout }) => {
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
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
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
        name="Home" 
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              🏠
            </ClustrText>
          ),
        }}
      >
        {(props) => <HomeScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Events" 
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              📅
            </ClustrText>
          ),
        }}
      >
        {(props) => <EventsScreen {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Chat" 
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              💬
            </ClustrText>
          ),
        }}
      >
        {(props) => <ChatScreen {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen 
        name="Create" 
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <ClustrText style={{ 
              fontSize: focused ? 20 : 18, 
              color: color 
            }}>
              ➕
            </ClustrText>
          ),
        }}
      >
        {(props) => <CreateEventScreen {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
