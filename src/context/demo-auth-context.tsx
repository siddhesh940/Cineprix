'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    name?: string
    avatar_url?: string
  }
  created_at?: string
  last_sign_in_at?: string
  app_metadata?: {
    provider?: string
  }
}

interface AuthContextType {
  user: User | null
  session: { user: User } | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>
  signInWithGoogle: () => Promise<{ error?: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error?: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<{ user: User } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('moviesprix-user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setSession({ user: userData })
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Demo: Accept any email/password
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } }
    }
    
    // Generate consistent user ID based on email using simple hash
    const userId = email.replace(/[@.]/g, '_').toLowerCase();
    console.log('Generated user ID for email:', email, 'ID:', userId);
    
    const userData: User = {
      id: userId,
      email,
      user_metadata: {
        full_name: email.split('@')[0],
      },
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
      },
    }
    
    console.log('Setting user data:', userData);
    localStorage.setItem('moviesprix-user', JSON.stringify(userData))
    setUser(userData)
    setSession({ user: userData })
    return {}
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!email || !password) {
      return { error: { message: 'Email and password are required' } }
    }
    
    if (password.length < 6) {
      return { error: { message: 'Password must be at least 6 characters' } }
    }
    
    // Generate consistent user ID based on email using simple hash
    const userId = email.replace(/[@.]/g, '_').toLowerCase();
    
    const userData: User = {
      id: userId,
      email,
      user_metadata: {
        full_name: fullName || email.split('@')[0],
      },
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
      },
    }
    
    localStorage.setItem('moviesprix-user', JSON.stringify(userData))
    setUser(userData)
    setSession({ user: userData })
    return {}
  }

  const signInWithGoogle = async () => {
    const userData: User = {
      id: 'demo_google_com',
      email: 'demo@google.com',
      user_metadata: {
        full_name: 'Demo User',
        name: 'Demo User',
        avatar_url: 'https://via.placeholder.com/150',
      },
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {
        provider: 'google',
      },
    }
    
    localStorage.setItem('moviesprix-user', JSON.stringify(userData))
    setUser(userData)
    setSession({ user: userData })
    return {}
  }

  const signOut = async () => {
    try {
      // Clear state first
      setUser(null)
      setSession(null)
      
      // Clear localStorage
      localStorage.removeItem('moviesprix-user')
      
      // Redirect to login
      router.push('/auth/login')
      
    } catch (error) {
      console.error('Sign out error:', error)
      // Even if there's an error, still try to clear state and redirect
      localStorage.removeItem('moviesprix-user')
      setUser(null)
      setSession(null)
      router.push('/auth/login')
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) return { error: { message: 'No user found' } }
    
    const updatedUser = {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        ...updates,
      },
    }
    
    localStorage.setItem('moviesprix-user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setSession({ user: updatedUser })
    return {}
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}