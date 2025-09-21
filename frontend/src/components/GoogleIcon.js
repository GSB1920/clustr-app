import React from 'react'
import { View } from 'react-native'
import { ClustrText } from './ui'

export const GoogleIcon = ({ size = 20 }) => {
  return (
    <View style={{
      width: size,
      height: size,
      backgroundColor: '#fff',
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    }}>
      {/* Simple Google "G" logo representation */}
      <View style={{
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size * 0.35,
        borderWidth: 2,
        borderColor: '#4285F4',
        borderRightColor: '#EA4335',
        borderBottomColor: '#FBBC05',
        borderLeftColor: '#34A853',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ClustrText style={{ 
          fontSize: size * 0.4, 
          fontWeight: 'bold',
          color: '#4285F4'
        }}>
          G
        </ClustrText>
      </View>
    </View>
  )
}
