import { CreateProfileData, Profile } from '@/types/profile'
import { supabase } from '@/utils/supabase'
import { useMutation, useQuery } from '@tanstack/react-query'

export const ProfileAPI = {
  // Get all profiles
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`)
    }

    return data || []
  },

  // Get profile by ID
  async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null 
      }
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return data
  },

  // Get current user's profile
  async getCurrentUserProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    return this.getProfileById(user.id)
  },

  // Create new profile
  async createProfile(profileData: CreateProfileData): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`)
    }

    return data
  }
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: ProfileAPI.getProfiles,
  })
}

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => ProfileAPI.getProfileById(id),
    enabled: !!id,
  })
}

export const useCreateProfile = () => {
  return useMutation({
    mutationFn: ProfileAPI.createProfile,
  })
}

export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: ProfileAPI.getCurrentUserProfile,
  })
} 