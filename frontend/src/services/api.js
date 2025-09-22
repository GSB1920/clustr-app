import { Platform } from 'react-native'

// Production Railway API URL
const RAILWAY_URL = 'https://renewed-wisdom-production.up.railway.app'

const getAPIBaseURL = () => {
  if (__DEV__) {
    // Use Railway production API for all platforms
    return `${RAILWAY_URL}/api`
  }
  return `${RAILWAY_URL}/api`
}

const API_BASE_URL = getAPIBaseURL()

console.log('🌐 Platform:', Platform.OS)
console.log('🌐 API Base URL:', API_BASE_URL)

// API Helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  console.log('🌐 API Request:', url, options.method || 'GET')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log('📡 Making request with config:', config)
    
    const response = await fetch(url, config)
    
    console.log('📡 Response status:', response.status)
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('❌ Non-JSON response:', text)
      throw new Error(`Server returned ${response.status}: Expected JSON but got ${contentType}`)
    }
    
    const data = await response.json()
    console.log('✅ API Success:', data)
if (data.event && data.event.tags) {
  console.log('🏷️ Event tags in response:', data.event.tags)
  console.log('🏷️ Event tags type:', typeof data.event.tags)
  console.log('🏷️ Event tags length:', data.event.tags?.length)
}

    if (!response.ok) {
      console.error('❌ API Error:', data)
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    console.log('✅ API Success:', data)
    return data
  } catch (error) {
    console.error('🚨 API Request Error:', error)
    
    // More specific error messages
    if (error.message === 'Network request failed') {
      throw new Error(`Cannot connect to server. Make sure backend is running and accessible.`)
    }
    
    throw error
  }
}

// Authentication API
export const authAPI = {
  // User Signup
  signup: async (userData) => {
    return await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        username: userData.username || userData.name,
      }),
    })
  },

  // User Login
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
  },

  // Get Current User
  getCurrentUser: async (token) => {
    return await apiRequest('/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  // Logout
  logout: async (token) => {
    return await apiRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  // Google OAuth
  googleAuth: async (googleToken, tokenType = 'id_token') => {
    return await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        token: googleToken,
        token_type: tokenType,
      }),
    })
  },

  // Get Google OAuth config
  getGoogleConfig: async () => {
    return await apiRequest('/auth/google/config', {
      method: 'GET',
    })
  },

  // Update user interests
  updateUserInterests: async (interests, token) => {
    console.log('🎯 Updating interests:', interests)
    console.log('🔑 Using token:', token ? 'exists' : 'missing')
    
    return await apiRequest('/auth/interests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interests: interests
      }),
    })
  },
}

// Update healthCheck function
export const healthCheck = async () => {
  try {
    const baseURL = NGROK_URL
    console.log('🏥 Health check:', baseURL)
    
    const response = await fetch(baseURL)
    const data = await response.json()
    
    console.log('✅ Backend healthy:', data)
    return data
  } catch (error) {
    console.error('💔 Backend not available:', error)
    throw new Error(`Backend server is not running at ${NGROK_URL}`)
  }
}

// Events API
export const eventsAPI = {
  // Create new event
  createEvent: async (eventData, token) => {
    console.log('🎯 Creating event:', eventData)
    return await apiRequest('/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
  },

  // Get all events
  getEvents: async (filters = {}) => {
    // Filter out undefined/null values
    const cleanFilters = Object.entries(filters)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    
    const params = new URLSearchParams(cleanFilters)
    const queryString = params.toString()
    const endpoint = queryString ? `/events?${queryString}` : '/events'
    
    return await apiRequest(endpoint, {
      method: 'GET',
    })
  },

  // Join event
  joinEvent: async (eventId, token) => {
    return await apiRequest(`/events/${eventId}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  // Leave event
  leaveEvent: async (eventId, token) => {
    return await apiRequest(`/events/${eventId}/leave`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  },
}