export interface Profile {
  id: string
  updated_at?: string | null
  username?: string | null
  email?: string | null
  display_name?: string | null
  linkedin_connected?: boolean | null
  linkedin_profile_id?: string | null
  unipile_id?: string | null
}

export interface CreateProfileData {
  id: string
  username?: string
  email?: string
  display_name?: string
  linkedin_connected?: boolean
  linkedin_profile_id?: string
  unipile_id?: string
}

export interface UpdateProfileData {
  username?: string
  email?: string
  display_name?: string
  linkedin_connected?: boolean
  linkedin_profile_id?: string
  unipile_id?: string
} 