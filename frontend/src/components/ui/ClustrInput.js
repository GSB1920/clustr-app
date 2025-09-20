// src/components/ui/ClustrInput.js
import React, { useState } from 'react'
import { TextInput, View } from 'react-native'
import { useClustrTheme } from '../../theme/ClustrTheme'

export const ClustrInput = ({ 
  placeholder,
  style,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const { colors } = useClustrTheme()

  const getInputStyle = () => ({
    backgroundColor: colors.surface,
    borderWidth: isFocused ? 2 : 1,
    borderColor: isFocused ? colors.primary : colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  })

  return (
    <TextInput
      style={[getInputStyle(), style]}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  )
}