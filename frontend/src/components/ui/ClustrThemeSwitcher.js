// src/components/ui/ClustrThemeSwitcher.js
import React from 'react'
import { View } from 'react-native'
import { useClustrTheme } from '../../theme/ClustrTheme'
import { ClustrButton } from './ClustrButton'
import { ClustrText } from './ClustrText'

export const ClustrThemeSwitcher = () => {
  const { currentTheme, switchTheme, availableThemes, updateBrandColor, colors } = useClustrTheme()

  return (
    <View style={{ padding: 16 }}>
      <ClustrText variant="subheading" style={{ marginBottom: 16 }}>
        Choose Theme
      </ClustrText>
      
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {availableThemes.map(theme => (
          <ClustrButton
            key={theme}
            variant={currentTheme === theme ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => switchTheme(theme)}
          >
            {theme}
          </ClustrButton>
        ))}
      </View>

      <ClustrText variant="caption" style={{ marginBottom: 8 }}>
        Quick Brand Test:
      </ClustrText>
      <ClustrButton
        variant="accent"
        onPress={() => updateBrandColor('primary', '#8B5CF6')}
        style={{ marginBottom: 8 }}
      >
        Change Primary to Purple
      </ClustrButton>
      <ClustrButton
        variant="secondary"
        onPress={() => updateBrandColor('primary', '#6366F1')}
      >
        Reset to Original
      </ClustrButton>
    </View>
  )
}