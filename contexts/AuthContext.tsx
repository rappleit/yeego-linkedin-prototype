import { ProfileAPI } from '@/api/ProfileAPI'
import { Profile } from '@/types/profile'
import { supabase } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { createContext, ReactNode, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  profileLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, profileData: { username: string; display_name: string }) => Promise<void>
  refreshProfile: () => Promise<void>
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Fetch user profile 
  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      ProfileAPI.getCurrentUserProfile()
        .then(setProfile)
        .catch(console.error)
        .finally(() => setProfileLoading(false));
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [user])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(`Login failed: ${error.message}`)
    }
  }

  async function register(email: string, password: string, profileData: { username: string; display_name: string }) {
    // Create user account on supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      throw new Error(`Registration failed: ${authError.message}`)
    }

    if (authData.user) {
      // Create profile entry in supabase
      try {
        await ProfileAPI.createProfile({
          id: authData.user.id,
          email: email,
          username: profileData.username,
          display_name: profileData.display_name,
        })
      } catch (profileError) {
        throw new Error(`Profile creation failed: ${profileError instanceof Error ? profileError.message : 'Unknown error'}`)
      }
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(`Logout failed: ${error.message}`)
    }
  }

  async function refreshProfile() {
    if (user) {
      setProfileLoading(true);
      try {
        const newProfile = await ProfileAPI.getCurrentUserProfile()
        setProfile(newProfile)
      } catch (error) {
        console.error('Error refreshing profile:', error)
      } finally {
        setProfileLoading(false);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, profile, profileLoading, login, logout, register, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

