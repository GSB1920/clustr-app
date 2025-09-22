import React, { useEffect, useRef } from 'react'
import {
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton } from '../components/ui'
import { useChatStore } from '../stores/useChatStore'

export const ChatScreen = ({ event, user, onClose }) => {
  const { colors } = useClustrTheme()
  const flatListRef = useRef(null)
  
  const {
    messages,
    isLoading,
    isConnected,
    messageInput,
    setMessageInput,
    initializeSocket,
    joinEventChat,
    leaveEventChat,
    sendMessage,
    cleanup
  } = useChatStore()

  useEffect(() => {
    console.log('💬 ChatScreen mounted for event:', event?.id)
    console.log('👤 User:', user?.id)
    
    if (event?.id) {
      console.log('🚀 Initializing chat for event:', event.title)
      // Initialize socket and join chat
      initializeSocket()
      joinEventChat(event.id)
    }
    
    return () => {
      console.log('👋 Leaving chat for event:', event?.id)
      // Cleanup when leaving chat
      leaveEventChat()
    }
  }, [event?.id])

  useEffect(() => {
    console.log('💬 Messages updated, count:', messages.length)
    console.log('💬 Current messages:', messages)
    
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleSendMessage = () => {
    if (messageInput.trim() && event?.id) {
      sendMessage(event.id, messageInput.trim())
    }
  }

  const renderMessage = ({ item: message }) => {
    const isOwnMessage = message.user_id === user?.id
    const isSystemMessage = message.message_type === 'system'
    
    if (isSystemMessage) {
      return (
        <View style={{
          alignItems: 'center',
          marginVertical: 8
        }}>
          <View style={{
            backgroundColor: colors.textSecondary + '20',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12
          }}>
            <ClustrText style={{
              fontSize: 12,
              color: colors.textSecondary,
              textAlign: 'center'
            }}>
              {message.content}
            </ClustrText>
          </View>
        </View>
      )
    }

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        marginVertical: 4,
        marginHorizontal: 16
      }}>
        <View style={{
          maxWidth: '80%',
          backgroundColor: isOwnMessage ? colors.primary : colors.surface,
          padding: 12,
          borderRadius: 16,
          borderTopRightRadius: isOwnMessage ? 4 : 16,
          borderTopLeftRadius: isOwnMessage ? 16 : 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2
        }}>
          {!isOwnMessage && (
            <ClustrText style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.primary,
              marginBottom: 4
            }}>
              {message.username}
            </ClustrText>
          )}
          
          <ClustrText style={{
            fontSize: 14,
            color: isOwnMessage ? colors.surface : colors.text,
            lineHeight: 20
          }}>
            {message.content}
          </ClustrText>
          
          <ClustrText style={{
            fontSize: 10,
            color: isOwnMessage ? colors.surface + '80' : colors.textSecondary,
            marginTop: 4,
            textAlign: 'right'
          }}>
            {new Date(message.created_at).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })}
          </ClustrText>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
      
      {/* Header */}
      <View style={{
        backgroundColor: colors.surface,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border || colors.textSecondary + '20',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View style={{ flex: 1 }}>
            <ClustrText style={{
              fontSize: 18,
              fontWeight: '700',
              color: colors.text
            }}>
              {event?.title || 'Event Chat'}
            </ClustrText>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isConnected ? '#10B981' : '#EF4444',
                marginRight: 6
              }} />
              <ClustrText style={{
                fontSize: 12,
                color: colors.textSecondary
              }}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </ClustrText>
            </View>
          </View>
          
          <Pressable
            onPress={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.background,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <ClustrText style={{ fontSize: 18 }}>✕</ClustrText>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ 
            paddingVertical: 16,
            flexGrow: 1
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
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
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8
              }}>
                Start the conversation!
              </ClustrText>
              <ClustrText style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center'
              }}>
                Be the first to send a message in this event chat.
              </ClustrText>
            </View>
          )}
        />

        {/* Message Input */}
        <View style={{
          backgroundColor: colors.surface,
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: Platform.OS === 'ios' ? 20 : 16, // Safe area padding
          borderTopWidth: 1,
          borderTopColor: colors.border || colors.textSecondary + '20'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: colors.background,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8
          }}>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.text,
                maxHeight: 100,
                paddingVertical: 8
              }}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={messageInput}
              onChangeText={setMessageInput}
              multiline={true}
              textAlignVertical="center"
            />
            
            <Pressable
              onPress={handleSendMessage}
              disabled={!messageInput.trim() || !isConnected}
              style={{
                backgroundColor: messageInput.trim() && isConnected ? colors.primary : colors.textSecondary + '40',
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8
              }}
            >
              <ClustrText style={{
                fontSize: 16,
                color: colors.surface
              }}>
                ➤
              </ClustrText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}