import React from 'react'
import { View, SafeAreaView, StatusBar } from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrCard } from '../components/ui'

export const ChatScreen = ({ user }) => {
  const { colors } = useClustrTheme()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
        
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
                💬
              </ClustrText>
            </View>
            <View>
              <ClustrText style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text
              }}>
                Chat
              </ClustrText>
              <ClustrText style={{
                fontSize: 12,
                color: colors.textSecondary
              }}>
                Event conversations
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
            💬
          </ClustrText>
          
          <ClustrText style={{
            fontSize: 24,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 16
          }}>
            Chat Coming Soon
          </ClustrText>
          
          <ClustrText style={{
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 24
          }}>
            Connect with other event attendees, share experiences, and build your local community through real-time conversations.
          </ClustrText>
          
          <ClustrCard style={{
            marginTop: 32,
            padding: 20,
            backgroundColor: colors.primary + '10',
            borderWidth: 1,
            borderColor: colors.primary + '30'
          }}>
            <ClustrText style={{
              fontSize: 14,
              color: colors.primary,
              textAlign: 'center',
              fontWeight: '600'
            }}>
              🚀 Feature in development
            </ClustrText>
          </ClustrCard>
        </View>
      </View>
    </SafeAreaView>
  )
}
