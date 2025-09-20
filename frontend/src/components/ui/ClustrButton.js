// src/components/ui/ClustrButton.js
import React from 'react'
import { Text, Pressable } from 'react-native'
import { useClustrTheme } from '../../theme/ClustrTheme'

export const ClustrButton = ({ 
  variant = 'primary', 
  size = 'md',
  children, 
  style,
  textStyle,
  ...props 
}) => {
  const { colors } = useClustrTheme()

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }

    const sizeStyles = {
      sm: { paddingVertical: 8, paddingHorizontal: 16 },
      md: { paddingVertical: 12, paddingHorizontal: 24 },
      lg: { paddingVertical: 16, paddingHorizontal: 32 },
    }

    const variantStyles = {
      primary: { backgroundColor: colors.primary },
      secondary: { 
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: colors.border 
      },
      accent: { backgroundColor: colors.accent },
      success: { backgroundColor: colors.success },
      error: { backgroundColor: colors.error },
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    }
  }

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600', // semibold
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
    }

    const variantTextStyles = {
      primary: { color: '#FFFFFF' },
      secondary: { color: colors.secondary },
      accent: { color: '#FFFFFF' },
      success: { color: '#FFFFFF' },
      error: { color: '#FFFFFF' },
    }

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
      ...textStyle,
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && variant === 'primary' && { backgroundColor: colors.primaryDark },
        pressed && variant === 'secondary' && { backgroundColor: `${colors.secondary}1A` },
        style,
      ]}
      {...props}
    >
      <Text style={getTextStyle()}>
        {children}
      </Text>
    </Pressable>
  )
}