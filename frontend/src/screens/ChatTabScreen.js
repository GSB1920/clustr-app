import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, StatusBar, ScrollView, Pressable } from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrCard } from '../components/ui'
import { ChatScreen } from './ChatScreen'
import { useEventStore } from '../stores/useEventStore'

export const ChatTabScreen = ({ user }) => {
  const { colors } = useClustrTheme()
  const [selectedChatEvent, setSelectedChatEvent] = useState(null)
  const [showChatScreen, setShowChatScreen] = useState(false)
  
  const { events, fetchEvents } = useEventStore()
  
  // Get events user is attending (can chat in)
  const attendingEvents = events.filter(event => 
    event.attendees && event.attendees.includes(user?.id)
  )

  useEffect(() => {
    // Fetch events to show chat list
    fetchEvents()
  }, [])

  const handleOpenChat = (event) => {
    console.log('💬 Opening chat for event:', event.title)
    setSelectedChatEvent(event)
    setShowChatScreen(true)
  }

  const handleCloseChat = () => {
    setShowChatScreen(false)
    setTimeout(() => setSelectedChatEvent(null), 300)
  }

  if (showChatScreen && selectedChatEvent) {
    return (
      <ChatScreen
        event={selectedChatEvent}
        user={user}
        onClose={handleCloseChat}
      />
    )
  }

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
                💬
              </ClustrText>
            </View>
            <View>
              <ClustrText style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text
              }}>
                Your Chats
              </ClustrText>
              <ClustrText style={{
                fontSize: 12,
                color: colors.textSecondary
              }}>
                {attendingEvents.length} event conversations
              </ClustrText>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {attendingEvents.length > 0 ? (
            attendingEvents.map(event => (
              <Pressable
                key={event.id}
                onPress={() => handleOpenChat(event)}
              >
                <ClustrCard style={{
                  marginBottom: 16,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: colors.surface,
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
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.primary + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <ClustrText style={{ fontSize: 20 }}>💬</ClustrText>
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <ClustrText style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.text,
                        marginBottom: 4
                      }}>
                        {event.title}
                      </ClustrText>
                      
                      <ClustrText style={{
                        fontSize: 12,
                        color: colors.textSecondary
                      }}>
                        {event.attendee_count || 0} attendees • Tap to chat
                      </ClustrText>
                    </View>
                    
                    <View style={{
                      backgroundColor: colors.primary + '20',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12
                    }}>
                      <ClustrText style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: colors.primary
                      }}>
                        {event.category}
                      </ClustrText>
                    </View>
                  </View>
                </ClustrCard>
              </Pressable>
            ))
          ) : (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 60
            }}>
              <ClustrText style={{
                fontSize: 48,
                marginBottom: 16
              }}>
                💬
              </ClustrText>
              
              <ClustrText style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                textAlign: 'center',
                marginBottom: 8
              }}>
                No Event Chats Yet
              </ClustrText>
              
              <ClustrText style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 20
              }}>
                Join events to start chatting with other attendees!
              </ClustrText>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
