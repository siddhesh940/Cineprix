import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (typeof window !== 'undefined') {
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key exists:', !!supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster: string | null
          movie_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster?: string | null
          movie_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          movie_title?: string
          movie_poster?: string | null
          movie_year?: number | null
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster: string | null
          movie_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster?: string | null
          movie_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          movie_title?: string
          movie_poster?: string | null
          movie_year?: number | null
          created_at?: string
        }
      }
    }
  }
}

// Main client for client-side operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Browser client for client components
export function createClientSupabase() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server client for server components
export async function createServerSupabase() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster: string | null
          movie_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          movie_id: number
          movie_title: string
          movie_poster?: string | null
          movie_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          movie_id?: number
          movie_title?: string
          movie_poster?: string | null
          movie_year?: number | null
          created_at?: string
        }
      }
    }
  }
}