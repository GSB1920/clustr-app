import { Platform } from 'react-native'

// ngrok URL for testing
const NGROK_URL = 'https://ac0150d88af7.ngrok-free.app'

const getAPIBaseURL = () => {
  if (__DEV__) {
    // Use ngrok for all platforms to test Google OAuth
    return `${NGROK_URL}/api`
  }
  return `${NGROK_URL}/api`
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
    
    const data = await response.json()

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