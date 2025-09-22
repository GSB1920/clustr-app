import React from 'react'
import { View, Image } from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'

// SINGLE SOURCE OF TRUTH FOR CLUSTR LOGO
const LOGO_CONFIG = {
  // Set this to true when you have the actual logo file
  useActualLogo: false,
  
  // Path to your actual logo (only used when useActualLogo is true)
  // logoPath: require('../../assets/clustr-logo.png'), // Update this path to match your logo file
  
  // Placeholder configuration
  placeholder: {
    showText: true,
    showIcon: true,
  }
}

// Clustr Logo Placeholder Component
const ClustrLogoPlaceholder = ({ size = 120, showText = true, iconColor = 'white' }) => {
  const { colors } = useClustrTheme()
  
  const iconSize = size * 0.4 // Icon is 40% of total size
  const dotSizes = {
    large: iconSize * 0.3,
    medium: iconSize * 0.2,
    small: iconSize * 0.15,
  }

  return (
    <View style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    }}>
      {/* Abstract cluster symbol */}
      <View style={{ alignItems: 'center' }}>
        {/* Top row of dots */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <View style={{
            width: dotSizes.large,
            height: dotSizes.large,
            borderRadius: dotSizes.large / 2,
            backgroundColor: iconColor,
            marginRight: 3,
          }} />
          <View style={{
            width: dotSizes.small,
            height: dotSizes.small,
            borderRadius: dotSizes.small / 2,
            backgroundColor: iconColor,
            marginRight: 3,
          }} />
          <View style={{
            width: dotSizes.medium,
            height: dotSizes.medium,
            borderRadius: dotSizes.medium / 2,
            backgroundColor: iconColor,
          }} />
        </View>
        
        {/* Bottom row of dots */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: dotSizes.small,
            height: dotSizes.small,
            borderRadius: dotSizes.small / 2,
            backgroundColor: iconColor,
            marginRight: 4,
          }} />
          <View style={{
            width: dotSizes.large + 2,
            height: dotSizes.large + 2,
            borderRadius: (dotSizes.large + 2) / 2,
            backgroundColor: iconColor,
            marginRight: 4,
          }} />
          <View style={{
            width: dotSizes.medium,
            height: dotSizes.medium,
            borderRadius: dotSizes.medium / 2,
            backgroundColor: iconColor,
          }} />
        </View>
      </View>
    </View>
  )
}

// Main Clustr Logo Component
export const ClustrLogo = ({ 
  size = 120, 
  variant = 'default', // 'default', 'icon-only', 'text-only'
  style = {},
  ...props 
}) => {
  const { colors } = useClustrTheme()

  // If we have the actual logo, use it
  if (LOGO_CONFIG.useActualLogo && LOGO_CONFIG.logoPath) {
    return (
      <View style={[{ alignItems: 'center' }, style]}>
        <Image 
          source={LOGO_CONFIG.logoPath}
          style={{ 
            width: size, 
            height: size,
            ...(variant === 'icon-only' && { marginBottom: 0 })
          }}
          resizeMode="contain"
          {...props}
        />
      </View>
    )
  }

  // Otherwise use placeholder
  return (
    <View style={[{ alignItems: 'center' }, style]}>
      {(variant === 'default' || variant === 'icon-only') && (
        <ClustrLogoPlaceholder 
          size={size} 
          showText={variant !== 'icon-only'}
        />
      )}
    </View>
  )
}

// Logo variants for different use cases
export const ClustrLogoSmall = (props) => (
  <ClustrLogo size={40} variant="icon-only" {...props} />
)

export const ClustrLogoMedium = (props) => (
  <ClustrLogo size={80} {...props} />
)

export const ClustrLogoLarge = (props) => (
  <ClustrLogo size={120} {...props} />
)

// Header logo (for navigation bars)
export const ClustrHeaderLogo = (props) => (
  <ClustrLogo size={70} variant="icon-only" {...props} />
)

// Helper function to enable actual logo when you have the file
export const enableActualLogo = (logoPath) => {
  LOGO_CONFIG.useActualLogo = true
  LOGO_CONFIG.logoPath = logoPath
}

export default ClustrLogo