import { LinkedInAPI } from '@/api/LinkedInAPI'

export interface ConnectLinkedInUserParams {
  linkedinProfileId: string
  accountId: string
}

export interface ConnectLinkedInUserResult {
  success: boolean
  invitationId?: string
  error?: string
}

export type ConnectionStatus = 'connected' | 'pending' | 'none' | 'error'

export interface ConnectionStatusResult {
  status: ConnectionStatus
  error?: string
}

/**
 * Determines the connection status between the current user and a target LinkedIn profile
 * based on the profile data returned from getProfileByIdentifier
 */
export function getConnectionStatusFromProfile(profile: any): ConnectionStatusResult {
  try {
    // If there's a relationship, they are connected
    if (profile.is_relationship) {
      return { status: 'connected' }
    }

    // If there's an invitation object, check its status
    if (profile.invitation) {
      if (profile.invitation.type === 'SENT' && profile.invitation.status === 'PENDING') {
        return { status: 'pending' }
      }
    }

    // If no relationship and no pending invitation, show connect button
    return { status: 'none' }
  } catch (error: any) {
    return {
      status: 'error',
      error: error?.message || 'Error determining connection status'
    }
  }
}

/**
 * Helper function to connect with a LinkedIn user through a 3-step process:
 * 1. Get the profile's LinkedIn public identifier from the linkedin_profile_id
 * 2. Call the API to get the provider ID
 * 3. Send the connection request
 */

export async function connectLinkedInUser({
  linkedinProfileId,
  accountId
}: ConnectLinkedInUserParams): Promise<ConnectLinkedInUserResult> {
  try {
    const publicIdentifier = linkedinProfileId;

    //Call the API to get the provider ID
    const profile = await LinkedInAPI.getProfileByIdentifier(publicIdentifier, accountId);
    
    if (!profile || !profile.provider_id) {
      return {
        success: false,
        error: 'Failed to retrieve LinkedIn profile or provider ID not found'
      }
    }

    //Send the connection request
    const invitation = await LinkedInAPI.sendInvitation({
      provider_id: profile.provider_id,
      account_id: accountId
    });

    return {
      success: true,
      invitationId: invitation.invitation_id
    }

  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Unknown error occurred during connection process'
    }
  }
} 