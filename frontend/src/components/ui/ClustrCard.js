// src/components/ui/ClustrCard.js
import React from 'react'
import { View } from 'react-native'
import { useClustrTheme } from '../../theme/ClustrTheme'

export const ClustrCard = ({ children, style, ...props }) => {
  const { colors } = useClustrTheme()

  const cardStyle = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2, // for Android
  }

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  )
}