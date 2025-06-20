import { UNIPILE_CONFIG, unipileFetch } from '@/utils/unipile'
import { useMutation, useQuery } from '@tanstack/react-query'

export interface CreateHostedAuthLinkRequest {
  type: "create" | "reconnect"
  api_url?: string
  expiresOn: string
  providers: string | string[]
  notify_url?: string
  name?: string
}

export interface CreateHostedAuthLinkResponse {
  url: string
  id: string
  expiresOn: string
}

export interface LinkedInProfile {
  object: string
  provider: string
  provider_id: string
  public_identifier: string
  member_urn: string
  first_name: string
  last_name: string
  headline?: string
  primary_locale?: {
    country: string
    language: string
  }
  is_open_profile: boolean
  is_premium: boolean
  is_influencer: boolean
  is_creator: boolean
  is_relationship: boolean
  network_distance?: string
  is_self: boolean
  websites?: any[]
  follower_count?: number
  connections_count?: number
  location?: string
  birthdate?: {
    month: number
    day: number
  }
  invitation?: {
    type: string
    status: string
  }
  profile_picture_url?: string
  profile_picture_url_large?: string
  // Legacy fields 
  id?: string
  identifier?: string
  display_name?: string
  summary?: string
  industry?: string
  public_profile_url?: string
  connection_count?: number
  created_at?: string
  updated_at?: string
}

export interface SendInvitationRequest {
  provider_id: string
  account_id: string
}

export interface SendInvitationResponse {
  object: string
  invitation_id: string
  usage: number
}

export interface CancelInvitationRequest {
  invitationId: string
  accountId: string
}

export interface Invitation {
  id: string
  object: string
  date: string
  parsed_datetime: string
  invitation_text?: string
  invited_user: string
  invited_user_description?: string
  invited_user_id: string
  invited_user_public_id: string
}

export interface InvitationsListResponse {
  items: Invitation[]
  has_more: boolean
  total_count?: number
  cursor?: string
}

export interface GetInvitationsParams {
  accountId: string
  cursor?: string
  limit?: number
}

export const LinkedInAPI = {
  // Create hosted authentication link
  async createHostedAuthLink(request: CreateHostedAuthLinkRequest): Promise<CreateHostedAuthLinkResponse> {
    try {
      const response = await unipileFetch(`${UNIPILE_CONFIG.BASE_URL}/api/v1/hosted/accounts/link`, {
        method: 'POST',
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Failed to create hosted auth link: ${typeof errorData === 'string' ? errorData : JSON.stringify(errorData) || response.statusText}`
        )
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to create hosted auth link: ${error?.message || 'Unknown error'}`);
    }
  },

  // Retrieve LinkedIn profile by public identifier
  async getProfileByIdentifier(identifier: string, accountId: string): Promise<LinkedInProfile> {
    try {
      const response = await unipileFetch(`${UNIPILE_CONFIG.BASE_URL}/api/v1/users/${identifier}?account_id=${accountId}`, {
        method: 'GET'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Failed to retrieve profile: ${typeof errorData === 'string' ? errorData : JSON.stringify(errorData) || response.statusText}`
        )
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to retrieve profile: ${error?.message || 'Unknown error'}`);
    }
  },

  // Send LinkedIn invitation
  async sendInvitation(request: SendInvitationRequest): Promise<SendInvitationResponse> {
    try {
      const response = await unipileFetch(`${UNIPILE_CONFIG.BASE_URL}/api/v1/users/invite`, {
        method: 'POST',
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Failed to send invitation: ${typeof errorData === 'string' ? errorData : JSON.stringify(errorData) || response.statusText}`
        )
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to send invitation: ${error?.message || 'Unknown error'}`);
    }
  },


  // Fetch all invitations by account ID
  async getInvitations(accountId: string): Promise<InvitationsListResponse> {
    try {
      const response = await unipileFetch(`${UNIPILE_CONFIG.BASE_URL}/api/v1/users/invite/sent?account_id=${accountId}`, {
        method: 'GET'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Failed to fetch invitations: ${typeof errorData === 'string' ? errorData : JSON.stringify(errorData) || response.statusText}`
        )
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch invitations: ${error?.message || 'Unknown error'}`);
    }
  },

  // Fetch invitations with pagination support
  async getInvitationsPaginated({ accountId, cursor, limit = 100 }: GetInvitationsParams): Promise<InvitationsListResponse> {
    try {
      const queryParams = new URLSearchParams({
        account_id: accountId,
        limit: limit.toString()
      })
      
      if (cursor) {
        queryParams.append('cursor', cursor)
      }

      const url = `${UNIPILE_CONFIG.BASE_URL}/api/v1/users/invite/sent?${queryParams.toString()}`
      
      const response = await unipileFetch(url, {
        method: 'GET'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Failed to fetch invitations: ${typeof errorData === 'string' ? errorData : JSON.stringify(errorData) || response.statusText}`
        )
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Failed to fetch invitations: ${error?.message || 'Unknown error'}`);
    }
  }
}

// Hook for creating hosted authentication link
export const useCreateHostedAuthLink = () => {
  return useMutation({
    mutationFn: (request: CreateHostedAuthLinkRequest) => LinkedInAPI.createHostedAuthLink(request),
  })
}

// Hook for retrieving LinkedIn profile by identifier
export const useGetProfileByIdentifier = (identifier: string, accountId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['linkedin-profile', identifier],
    queryFn: () => LinkedInAPI.getProfileByIdentifier(identifier, accountId),
    enabled: enabled && !!identifier,
  })
}

// Hook for sending LinkedIn invitation
export const useSendInvitation = () => {
  return useMutation({
    mutationFn: (request: SendInvitationRequest) => LinkedInAPI.sendInvitation(request),
  })
}

// Hook for fetching all invitations by account ID
export const useGetInvitations = (accountId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['linkedin-invitations', accountId],
    queryFn: () => LinkedInAPI.getInvitations(accountId),
    enabled: enabled && !!accountId,
  })
}

// Hook for getting LinkedIn profile and connection status
export const useLinkedInProfileAndStatus = (
  linkedInProfileId: string,
  accountId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['linkedin-profile-status', linkedInProfileId, accountId],
    queryFn: async () => {
      const profile = await LinkedInAPI.getProfileByIdentifier(linkedInProfileId, accountId)
      const { getConnectionStatusFromProfile } = await import('@/helper/linkedinConnect')
      const connectionStatus = getConnectionStatusFromProfile(profile)
      
      return {
        profile,
        connectionStatus
      }
    },
    enabled: enabled && !!linkedInProfileId && !!accountId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0, 
    gcTime: 5 * 60 * 1000, 
  })
} 