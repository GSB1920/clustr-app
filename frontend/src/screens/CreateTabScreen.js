import React from 'react'
import { View, SafeAreaView, StatusBar } from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrCard } from '../components/ui'

export const CreateTabScreen = ({ user }) => {
  const { colors } = useClustrTheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
        
        {/* Header */}
        <View style={{
          paddingTop: 16,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: colors.surface,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}>
              <ClustrText style={{ 
                fontSize: 18,
                color: colors.surface 
              }}>
                ➕
              </ClustrText>
            </View>
            <View>
              <ClustrText style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text
              }}>
                Create Event
              </ClustrText>
              <ClustrText style={{
                fontSize: 12,
                color: colors.textSecondary
              }}>
                Bring your community together
              </ClustrText>
            </View>
          </View>
        </View>

        {/* Coming Soon Content */}
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40
        }}>
          <ClustrText style={{
            fontSize: 64,
            marginBottom: 24
          }}>
            🎉
          </ClustrText>
          
          <ClustrText style={{
            fontSize: 24,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 16
          }}>
            Event Creation Coming Soon
          </ClustrText>
          
          <ClustrText style={{
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24
          }}>
            Soon you'll be able to create and host your own local events. Bring your community together around shared interests.
          </ClustrText>
        </View>
      </View>
    </SafeAreaView>
  )
}
