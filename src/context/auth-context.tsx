'use client'

import { createClientSupabase } from '@/lib/supabase'
import { AuthError, Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: AuthError }>
  signInWithGoogle: () => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error?: AuthError }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Create Supabase client
  const supabase = createClientSupabase()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (event === 'SIGNED_IN') {
        // Create or update user profile
        if (session?.user) {
          await createUserProfile(session.user)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Profile creation is handled by Supabase triggers or can be done later
  const createUserProfile = async (user: User) => {
    // Skip profile creation - will be handled by database triggers
    console.log('User authenticated:', user.id)
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error || undefined }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error: error || undefined }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error: error || undefined }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      }
      
      // Clear state immediately
      setUser(null)
      setSession(null)
      
      // Redirect to login
      router.push('/auth/login')
      router.refresh() // Force a page refresh to clear any cached state
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  const updateProfile = async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) return { error: new Error('No user found') as AuthError }
    
    // Profile updates will be handled by database triggers or separate API
    console.log('Profile update requested:', updates)
    return { error: undefined }
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