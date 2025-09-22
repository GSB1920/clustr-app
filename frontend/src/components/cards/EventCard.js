import React from 'react'
import { View, Pressable } from 'react-native'
import { useClustrTheme } from '../../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../ui'
import { CATEGORIES } from '../../constants/categories'

export const EventCard = React.memo(({ event, onPress, onJoinEvent, user, isJoining }) => {
  const { colors } = useClustrTheme()
  
  return (
    <Pressable onPress={() => onPress(event)}>
      <ClustrCard style={{
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 20,
        borderRadius: 16,
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}>
        {/* Multiple Tags Display */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12
        }}>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
            marginRight: 8
          }}>
            {/* Render multiple tags */}
            {(event.tags && event.tags.length > 0 ? event.tags : [event.category]).slice(0, 3).map((tag, index) => {
              const tagInfo = CATEGORIES.find(cat => cat.id === tag) || CATEGORIES[0]
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: tagInfo.color + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 6,
                    marginBottom: 4
                  }}
                >
                  <ClustrText style={{ 
                    fontSize: 10, 
                    marginRight: 2 
                  }}>
                    {tagInfo.icon}
                  </ClustrText>
                  <ClustrText style={{ 
                    fontSize: 10, 
                    fontWeight: '600',
                    color: tagInfo.color 
                  }}>
                    {tag}
                  </ClustrText>
                </View>
              )
            })}
            
            {/* Show "+X more" if there are more than 3 tags */}
            {(event.tags && event.tags.length > 3) && (
              <View style={{
                backgroundColor: colors.textSecondary + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                justifyContent: 'center',
                marginBottom: 4
              }}>
                <ClustrText style={{ 
                  fontSize: 10, 
                  fontWeight: '600',
                  color: colors.textSecondary 
                }}>
                  +{event.tags.length - 3}
                </ClustrText>
              </View>
            )}
          </View>
          
          <ClustrText style={{ 
            fontSize: 12, 
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

        {/* Event Title */}
        <ClustrText style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 8
        }}>
          {event.title}
        </ClustrText>

        {/* Description */}
        <ClustrText style={{
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 20,
          marginBottom: 16
        }}>
          {event.description}
        </ClustrText>

        {/* Location and Time */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}>
            <ClustrText style={{ fontSize: 14, marginRight: 4 }}>📍</ClustrText>
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
            <ClustrText style={{ fontSize: 14, marginRight: 4 }}>🕐</ClustrText>
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

        {/* Attendees and Join Button */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View>
              <ClustrText style={{
                fontSize: 12,
                fontWeight: '600',
                color: colors.text
              }}>
                {event.attendee_count || 0} attending
              </ClustrText>
              <ClustrText style={{
                fontSize: 11,
                color: colors.textSecondary
              }}>
                {event.spots_left || event.max_attendees} spots left
              </ClustrText>
            </View>
          </View>

          {/* Smart Join Button */}
          {(() => {
            const currentUserId = user?.id
            const hasUserJoined = event.attendees && event.attendees.includes(currentUserId)
            const isEventFull = (event.attendee_count || 0) >= event.max_attendees
            
            // Determine button state
            let buttonConfig = {
              text: 'Join',
              backgroundColor: colors.primary,
              textColor: colors.surface,
              disabled: false
            }
            
            if (isJoining) {
              buttonConfig = {
                text: 'Joining...',
                backgroundColor: colors.primary + '80',
                textColor: colors.surface,
                disabled: true
              }
            } else if (hasUserJoined) {
              buttonConfig = {
                text: 'Joined ✓',
                backgroundColor: '#10B981',
                textColor: colors.surface,
                disabled: true
              }
            } else if (isEventFull) {
              buttonConfig = {
                text: 'Full',
                backgroundColor: colors.textSecondary + '40',
                textColor: colors.textSecondary,
                disabled: true
              }
            }
            
            return (
              <ClustrButton
                variant="primary"
                disabled={buttonConfig.disabled}
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 25,
                  minWidth: 80,
                  backgroundColor: buttonConfig.backgroundColor,
                  opacity: buttonConfig.disabled ? 0.7 : 1
                }}
                onPress={() => !buttonConfig.disabled && onJoinEvent(event.id)}
              >
                <ClustrText style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: buttonConfig.textColor
                }}>
                  {buttonConfig.text}
                </ClustrText>
              </ClustrButton>
            )
          })()}
        </View>
      </ClustrCard>
    </Pressable>
  )
})
