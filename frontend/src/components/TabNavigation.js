import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText } from './ui'

export const TabNavigation = ({ activeTab, onTabChange }) => {
  const { colors } = useClustrTheme()

  const tabs = [
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'chat', name: 'Chat', icon: '💬' },
    { id: 'create', name: 'Create', icon: '➕' }
  ]

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingVertical: 12,
      paddingHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    }}>
      {tabs.map(tab => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <ClustrText style={{
            fontSize: activeTab === tab.id ? 20 : 18,
            marginBottom: 4,
            opacity: activeTab === tab.id ? 1 : 0.6
          }}>
            {tab.icon}
          </ClustrText>
          <ClustrText style={{
            fontSize: 12,
            fontWeight: activeTab === tab.id ? '600' : '500',
            color: activeTab === tab.id ? colors.primary : colors.textSecondary
          }}>
            {tab.name}
          </ClustrText>
        </Pressable>
      ))}
    </View>
  )
}
