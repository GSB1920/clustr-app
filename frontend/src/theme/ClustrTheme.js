// src/theme/ClustrTheme.js
import React, { createContext, useContext, useState, useEffect } from 'react'

const ClustrThemeContext = createContext()

export const useClustrTheme = () => {
  const context = useContext(ClustrThemeContext)
  if (!context) {
    throw new Error('useClustrTheme must be used within ClustrThemeProvider')
  }
  return context
}

// Clustr Brand Themes based on your brand guide
const clustrThemes = {
  default: {
    // Core Colors from your brand guide
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#06B6D4',
    accent: '#F97316',
    success: '#10B981',
    error: '#F43F5E',
    
    // Neutral Colors from your brand guide
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    muted: '#94A3B8',
    text: '#334155',
    textSecondary: '#64748B',
  },
  
  dark: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#06B6D4',
    accent: '#F97316',
    success: '#10B981',
    error: '#F43F5E',
    
    // Dark theme neutrals
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    muted: '#64748B',
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
  },
  
  // Alternative brand theme for testing
  vibrant: {
    primary: '#8B5CF6', // Purple variant
    primaryDark: '#7C3AED',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    success: '#10B981',
    error: '#F43F5E',
    
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    muted: '#94A3B8',
    text: '#334155',
    textSecondary: '#64748B',
  }
}

export const ClustrThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default')
  const [colors, setColors] = useState(clustrThemes.default)

  const switchTheme = (themeName) => {
    const newTheme = clustrThemes[themeName]
    if (newTheme) {
      setCurrentTheme(themeName)
      setColors(newTheme)
    }
  }

  const updateBrandColor = (colorKey, newColor) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: newColor
    }))
  }

  return (
    <ClustrThemeContext.Provider value={{
      colors,
      currentTheme,
      switchTheme,
      updateBrandColor,
      availableThemes: Object.keys(clustrThemes)
    }}>
      {children}
    </ClustrThemeContext.Provider>
  )
}