import React, { useRef, useEffect } from 'react'
import {
  View,
  Modal,
  Animated,
  Pressable,
  ScrollView,
  Dimensions,
  Easing
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from './ui'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.75 // 75% of screen height

export const EventDetailsModal = ({ 
  visible, 
  onClose, 
  event, 
  onJoinEvent,
  onLeaveEvent,
  user,
  isJoining = false 
}) => {
  const { colors } = useClustrTheme()
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current
  const backdropAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Enhanced slide up animation with bounce
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      // Enhanced slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: MODAL_HEIGHT,
          duration: 300,
          easing: Easing.in(Easing.back(1.1)),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start()
    }
  }, [visible])

  if (!event) return null

  const currentUserId = user?.id
  const hasUserJoined = event.attendees && event.attendees.includes(currentUserId)
  const isEventFull = (event.attendee_count || 0) >= event.max_attendees

  // Determine button state
  const getButtonConfig = () => {
    if (isJoining) {
      return {
        text: 'Processing...',
        backgroundColor: colors.primary + '80',
        textColor: colors.surface,
        disabled: true,
        action: 'none'
      }
    }
    
    if (hasUserJoined) {
      return {
        text: 'Leave Event',
        backgroundColor: '#EF4444', // Red color for leave
        textColor: colors.surface,
        disabled: false,
        action: 'leave'
      }
    }
    
    if (isEventFull) {
      return {
        text: 'Event Full',
        backgroundColor: colors.textSecondary + '40',
        textColor: colors.textSecondary,
        disabled: true,
        action: 'none'
      }
    }
    
    return {
      text: 'Join Event',
      backgroundColor: colors.primary,
      textColor: colors.surface,
      disabled: false,
      action: 'join'
    }
  }

  const buttonConfig = getButtonConfig()

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: backdropAnim,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onClose}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: MODAL_HEIGHT,
          backgroundColor: colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          opacity: fadeAnim,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 20,
        }}
      >
        {/* Handle Bar */}
        <View style={{
          alignItems: 'center',
          paddingTop: 12,
          paddingBottom: 8
        }}>
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: colors.textSecondary + '40',
            borderRadius: 2
          }} />
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={{ padding: 20 }}>
            {/* Joined Badge */}
            {hasUserJoined && (
              <View style={{
                alignSelf: 'flex-start',
                backgroundColor: '#10B981',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <ClustrText style={{
                  fontSize: 12,
                  marginRight: 4
                }}>
                  ✓
                </ClustrText>
                <ClustrText style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: colors.surface
                }}>
                  You're Attending
                </ClustrText>
              </View>
            )}

            {/* Event Header */}
            <View style={{ marginBottom: 20 }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12
              }}>
                {/* Tags */}
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  flex: 1,
                  marginRight: 12
                }}>
                  {(event.tags || [event.category]).slice(0, 4).map((tag, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.primary + '20',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginRight: 6,
                        marginBottom: 6
                      }}
                    >
                      <ClustrText style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: colors.primary
                      }}>
                        {tag}
                      </ClustrText>
                    </View>
                  ))}
                </View>

                {/* Date */}
                <ClustrText style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  fontWeight: '500'
                }}>
                  {new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </ClustrText>
              </View>

              {/* Title */}
              <ClustrText style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 8
              }}>
                {event.title}
              </ClustrText>

              {/* Location and Time */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <ClustrText style={{ fontSize: 16, marginRight: 8 }}>📍</ClustrText>
                <ClustrText style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  flex: 1
                }}>
                  {event.location}
                </ClustrText>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <ClustrText style={{ fontSize: 16, marginRight: 8 }}>🕐</ClustrText>
                <ClustrText style={{
                  fontSize: 14,
                  color: colors.textSecondary
                }}>
                  {new Date(event.event_date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </ClustrText>
              </View>
            </View>

            {/* Description */}
            <View style={{ marginBottom: 24 }}>
              <ClustrText style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8
              }}>
                About This Event
              </ClustrText>
              <ClustrText style={{
                fontSize: 14,
                color: colors.textSecondary,
                lineHeight: 22
              }}>
                {event.description}
              </ClustrText>
            </View>

            {/* Attendees Info */}
            <View style={{ marginBottom: 24 }}>
              <ClustrText style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 8
              }}>
                Event Capacity
              </ClustrText>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: colors.background,
                padding: 16,
                borderRadius: 12
              }}>
                <View style={{ alignItems: 'center' }}>
                  <ClustrText style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.primary
                  }}>
                    {event.attendee_count || 0}
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    Attending
                  </ClustrText>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <ClustrText style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.text
                  }}>
                    {event.max_attendees}
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    Max Capacity
                  </ClustrText>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <ClustrText style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: isEventFull ? colors.error || '#EF4444' : colors.success || '#10B981'
                  }}>
                    {event.spots_left || (event.max_attendees - (event.attendee_count || 0))}
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    Spots Left
                  </ClustrText>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Action */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: colors.border || colors.textSecondary + '20'
        }}>
          <ClustrButton
            disabled={buttonConfig.disabled}
            style={{
              backgroundColor: buttonConfig.backgroundColor,
              paddingVertical: 16,
              borderRadius: 12,
              opacity: buttonConfig.disabled ? 0.7 : 1
            }}
            onPress={() => {
              if (buttonConfig.disabled) return
              
              if (buttonConfig.action === 'leave') {
                onLeaveEvent && onLeaveEvent(event.id)
              } else if (buttonConfig.action === 'join') {
                onJoinEvent && onJoinEvent(event.id)
              }
            }}
          >
            <ClustrText style={{
              fontSize: 16,
              fontWeight: '600',
              color: buttonConfig.textColor,
              textAlign: 'center'
            }}>
              {buttonConfig.text}
            </ClustrText>
          </ClustrButton>
        </View>
      </Animated.View>
    </Modal>
  )
}
