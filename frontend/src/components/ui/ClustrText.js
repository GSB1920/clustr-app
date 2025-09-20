// src/components/ui/ClustrText.js
import React from 'react'
import { Text } from 'react-native'
import { useClustrTheme } from '../../theme/ClustrTheme'

export const ClustrText = ({ 
  variant = 'body',
  style,
  children,
  ...props 
}) => {
  const { colors } = useClustrTheme()

  const getTextStyle = () => {
    const variants = {
      title: { fontSize: 24, fontWeight: '700', color: colors.text },
      heading: { fontSize: 20, fontWeight: '600', color: colors.text },
      subheading: { fontSize: 18, fontWeight: '500', color: colors.text },
      body: { fontSize: 16, fontWeight: '400', color: colors.text },
      caption: { fontSize: 14, fontWeight: '400', color: colors.textSecondary },
      label: { fontSize: 12, fontWeight: '500', color: colors.muted },
    }

    return variants[variant] || variants.body
  }

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  )
}