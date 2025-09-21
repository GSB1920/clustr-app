import { Platform } from 'react-native'

// API Configuration - Fixed version
const YOUR_COMPUTER_IP = '192.168.1.9'  // Define this at the top

const getAPIBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5001/api'  // For both email auth AND Google OAuth
    } else if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5001/api'   // Android emulator localhost mapping
    } else {
      return 'http://localhost:5001/api'   // Web
    }
  }
  return 'http://localhost:5001/api'  // Production
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

// Health Check - Fixed
export const healthCheck = async () => {
  try {
    const baseURL = `http://${YOUR_COMPUTER_IP}:5001`  // Use the defined variable
    console.log('🏥 Health check:', baseURL)
    
    const response = await fetch(baseURL)
    const data = await response.json()
    
    console.log('✅ Backend healthy:', data)
    return data
  } catch (error) {
    console.error('💔 Backend not available:', error)
    throw new Error(`Backend server is not running at http://${YOUR_COMPUTER_IP}:5001`)
  }
}