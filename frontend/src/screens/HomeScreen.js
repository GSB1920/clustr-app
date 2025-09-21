import React, { useRef, useEffect } from 'react'
import { 
  View, 
  ScrollView, 
  StatusBar,
  Animated,
  Pressable,
  SafeAreaView
} from 'react-native'
import { useClustrTheme } from '../theme/ClustrTheme'
import { ClustrText, ClustrButton, ClustrCard } from '../components/ui'

export const HomeScreen = ({ user, onLogout }) => {
  const { colors } = useClustrTheme()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar backgroundColor={colors.surface} barStyle="dark-content" />
        
        <Animated.View style={{ 
          flex: 1, 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }}>
          {/* Header with Profile & Notifications */}
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
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <ClustrText style={{ 
                    fontSize: 20,
                    color: colors.surface 
                  }}>
                    C
                  </ClustrText>
                </View>
                <View>
                  <ClustrText style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: colors.text
                  }}>
                    Welcome back!
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 14,
                    color: colors.textSecondary
                  }}>
                    {user?.name || user?.email || 'Clustr User'}
                  </ClustrText>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable 
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  onPress={() => console.log('Notifications pressed')}
                >
                  <ClustrText style={{ fontSize: 20 }}>🔔</ClustrText>
                </Pressable>
                
                <Pressable
                  onPress={onLogout}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <ClustrText style={{ fontSize: 20 }}>
                    👤
                  </ClustrText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
          >
            {/* Quick Stats */}
            <View style={{
              flexDirection: 'row',
              marginBottom: 24
            }}>
              <ClustrCard style={{
                flex: 1,
                padding: 20,
                marginRight: 12,
                backgroundColor: colors.primary + '10',
                borderWidth: 1,
                borderColor: colors.primary + '30'
              }}>
                <ClustrText style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.primary,
                  textAlign: 'center',
                  marginBottom: 4
                }}>
                  12
                </ClustrText>
                <ClustrText style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center'
                }}>
                  Events Joined
                </ClustrText>
              </ClustrCard>

              <ClustrCard style={{
                flex: 1,
                padding: 20,
                marginLeft: 12,
                backgroundColor: '#4ECDC4' + '10',
                borderWidth: 1,
                borderColor: '#4ECDC4' + '30'
              }}>
                <ClustrText style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#4ECDC4',
                  textAlign: 'center',
                  marginBottom: 4
                }}>
                  5
                </ClustrText>
                <ClustrText style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center'
                }}>
                  Events Created
                </ClustrText>
              </ClustrCard>
            </View>

            {/* Quick Actions */}
            <ClustrCard style={{
              padding: 20,
              marginBottom: 24
            }}>
              <ClustrText style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 16
              }}>
                Quick Actions
              </ClustrText>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary + '10',
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginRight: 8
                  }}
                  onPress={() => console.log('Browse Events')}
                >
                  <ClustrText style={{ fontSize: 24, marginBottom: 8 }}>📅</ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: colors.primary
                  }}>
                    Browse Events
                  </ClustrText>
                </Pressable>

                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: '#FF6B6B' + '10',
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginHorizontal: 4
                  }}
                  onPress={() => console.log('Create Event')}
                >
                  <ClustrText style={{ fontSize: 24, marginBottom: 8 }}>➕</ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#FF6B6B'
                  }}>
                    Create Event
                  </ClustrText>
                </Pressable>

                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: '#9B59B6' + '10',
                    padding: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginLeft: 8
                  }}
                  onPress={() => console.log('My Profile')}
                >
                  <ClustrText style={{ fontSize: 24, marginBottom: 8 }}>👤</ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#9B59B6'
                  }}>
                    My Profile
                  </ClustrText>
                </Pressable>
              </View>
            </ClustrCard>

            {/* Recent Activity */}
            <ClustrCard style={{
              padding: 20,
              marginBottom: 24
            }}>
              <ClustrText style={{
                fontSize: 18,
                fontWeight: '700',
                color: colors.text,
                marginBottom: 16
              }}>
                Recent Activity
              </ClustrText>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#4ECDC4' + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <ClustrText style={{ fontSize: 16 }}>🏀</ClustrText>
                </View>
                <View style={{ flex: 1 }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    Joined Basketball Game
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    2 hours ago
                  </ClustrText>
                </View>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12
              }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#FF6B6B' + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <ClustrText style={{ fontSize: 16 }}>🍎</ClustrText>
                </View>
                <View style={{ flex: 1 }}>
                  <ClustrText style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    Bookmarked Farmers Market
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 12,
                    color: colors.textSecondary
                  }}>
                    Yesterday
                  </ClustrText>
                </View>
              </View>
            </ClustrCard>

            {/* User Info Card */}
            <ClustrCard style={{
              padding: 20,
              marginBottom: 24
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <ClustrText style={{ 
                    fontSize: 24,
                    color: colors.surface 
                  }}>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </ClustrText>
                </View>
                <View style={{ flex: 1 }}>
                  <ClustrText style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: colors.text,
                    marginBottom: 4
                  }}>
                    {user?.name || 'Clustr User'}
                  </ClustrText>
                  <ClustrText style={{
                    fontSize: 14,
                    color: colors.textSecondary
                  }}>
                    {user?.email || 'user@clustr.com'}
                  </ClustrText>
                </View>
              </View>

              <ClustrButton
                variant="ghost"
                onPress={onLogout}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border
                }}
              >
                <ClustrText style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: colors.text
                }}>
                  Sign Out
                </ClustrText>
              </ClustrButton>
            </ClustrCard>
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}
