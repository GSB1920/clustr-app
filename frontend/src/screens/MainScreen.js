import React, { useState } from 'react'
import { View } from 'react-native'
import { DashboardScreen } from './DashboardScreen'
import { ChatTabScreen } from './ChatTabScreen'
import { CreateTabScreen } from './CreateTabScreen'
import { TabNavigation } from '../components/TabNavigation'
export const MainScreen = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('events')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'events':
        return <DashboardScreen user={user} onLogout={onLogout} />
      case 'chat':
        return <ChatTabScreen user={user} />
      case 'create':
        return <CreateTabScreen user={user} />
      default:
        return <DashboardScreen user={user} onLogout={onLogout} />
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Active Tab Content */}
      <View style={{ flex: 1 }}>
        {renderActiveTab()}
      </View>
      
      {/* Bottom Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </View>
  )
}
