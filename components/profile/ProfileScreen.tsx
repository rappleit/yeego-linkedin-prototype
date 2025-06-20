import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { useLinkedInProfileAndStatus } from "@/api/LinkedInAPI";
import { useProfile } from "@/api/ProfileAPI";
import { PageContainer } from "@/components/PageContainer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProfilePicture } from "@/components/profile/ProfilePicture";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { AuthContext } from "@/contexts/AuthContext";
import { ConnectionStatus, connectLinkedInUser } from "@/helper/linkedinConnect";

export default function ProfileScreen({ userId }: { userId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authContext = useContext(AuthContext);
  const currentUserId = authContext?.user?.id;
  const { data: profile, isLoading, error, refetch: refetchProfile } = useProfile(userId);
  const { data: currentUserProfile, refetch: refetchCurrentUserProfile } = useProfile(currentUserId || '');
  
  const { data: linkedInData, isLoading: linkedInLoading, refetch: refetchLinkedInData } = useLinkedInProfileAndStatus(
    profile?.linkedin_profile_id || '',
    currentUserProfile?.unipile_id || '',
    !!(profile?.linkedin_profile_id && currentUserProfile?.unipile_id)
  );
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Refetch data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetchProfile();
      }
      
      if (currentUserId) {
        refetchCurrentUserProfile();
      }
      
      if (profile?.linkedin_profile_id && currentUserProfile?.unipile_id) {
        refetchLinkedInData();
      }
    }, [userId, currentUserId, profile?.linkedin_profile_id, currentUserProfile?.unipile_id, refetchProfile, refetchCurrentUserProfile, refetchLinkedInData])
  );

  useEffect(() => {
    setIsMounted(true);
    if (profile?.linkedin_profile_id && currentUserProfile?.unipile_id) {
      refetchLinkedInData();
    }
  }, [profile?.linkedin_profile_id, currentUserProfile?.unipile_id, refetchLinkedInData]);

  const connectionStatus: ConnectionStatus = linkedInData?.connectionStatus?.status || 'none';
  const isOwnProfile = profile?.id === currentUserId;

  const handleConnect = async () => {
    if (!profile?.linkedin_profile_id) {
      console.error('No LinkedIn profile ID available for target user');
      Alert.alert(
        'Connection Error',
        'This user does not have a LinkedIn profile connected.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Get the current user's unipile_id as the account ID
    if (!currentUserProfile?.unipile_id) {
      console.error('No Unipile account ID available for current user');
      Alert.alert(
        'Connection Error',
        'Your LinkedIn account is not properly connected. Please reconnect your LinkedIn account.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsConnecting(true);

    try {
      const result = await connectLinkedInUser({
        linkedinProfileId: profile.linkedin_profile_id,
        accountId: currentUserProfile.unipile_id
      });

      if (result.success) {
        // Invalidate the LinkedIn profile status query to force a refetch
        queryClient.invalidateQueries({
          queryKey: ['linkedin-profile-status', profile.linkedin_profile_id, currentUserProfile.unipile_id]
        });
        
        Alert.alert(
          'Connection Request Sent',
          'Your LinkedIn connection request has been sent successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          `Failed to send connection request: ${result.error}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error during connection process:', error);
      Alert.alert(
        'Connection Error',
        'An unexpected error occurred while trying to connect. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleViewLinkedInProfile = async () => {
    if (profile?.linkedin_profile_id) {
      try {
        const linkedInUrl = `https://www.linkedin.com/in/${profile.linkedin_profile_id}`;
        await WebBrowser.openBrowserAsync(linkedInUrl);
      } catch (error) {
        console.error('Error opening LinkedIn profile:', error);
        Alert.alert(
          'Error',
          'Unable to open LinkedIn profile. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert(
        'LinkedIn Profile Unavailable',
        'This user\'s LinkedIn profile is not available.',
        [{ text: 'OK' }]
      );
    }
  };

  if (isLoading) {
    return (
      <PageContainer style={styles.pageContainer} scrollable={false}>
        <ThemedText>Loading profile...</ThemedText>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer style={styles.pageContainer} scrollable={false}>
        <ThemedText>Error loading profile: {error.message}</ThemedText>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer style={styles.pageContainer} scrollable={false}>
        <ThemedText>Profile not found</ThemedText>
      </PageContainer>
    );
  }

  return (
    <PageContainer style={styles.pageContainer} scrollable={false}>
      <ThemedView style={styles.headerContainer}>
        <ProfilePicture
          source={`https://api.dicebear.com/9.x/thumbs/png?seed=${profile.id}`}
          size={80}
        />
        <ThemedText type="title" style={{ textAlign: "center" }}>
          {profile.display_name || "Unknown User"}
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={{ textAlign: "center", color: "gray" }}>
          @{profile.username}
        </ThemedText>
       {(profile.id !== currentUserId && profile.linkedin_connected !== false) && (
         <ThemedView style={styles.connectionContainer}>
           {connectionStatus === 'none' && (
             <ThemedButton
               title={isConnecting ? "Connecting..." : "Connect"}
               onPress={handleConnect}
               variant="outline"
               size="medium"
               icon={isConnecting ? undefined : "link"}
               iconPosition="left"
               disabled={isConnecting || linkedInLoading}
               loading={isConnecting}
             />
           )}
           {connectionStatus === 'pending' && (
             <ThemedButton
               title="Pending Connection"
               onPress={() => {
                 Alert.alert(
                   'Connection Status',
                   'You have already sent a connection request to this user. It is currently pending.',
                   [{ text: 'OK' }]
                 );
               }}
               variant="filled"
               size="medium"
               icon="clock.fill"
               iconPosition="left"
               customBackgroundColor="white"
               customTextColor="black"
             />
           )}
           {connectionStatus === 'connected' && (
             <ThemedButton
               title="Connected"
               onPress={() => {
                 Alert.alert(
                   'Connection Status',
                   'You are already connected with this user on LinkedIn.',
                   [{ text: 'OK' }]
                 );
               }}
               variant="filled"
               size="medium"
               icon="checkmark.circle.fill"
               iconPosition="left"
               customBackgroundColor="#0077B5"
               customTextColor="white"
             />
           )}
         </ThemedView>
       )}
      </ThemedView>
      {profile.linkedin_connected === false && !isOwnProfile && (
        <ThemedCard 
          backgroundColor="tint" 
          style={styles.linkedinCard}
          padding="medium"
        >
          <ThemedText style={styles.linkedinCardText}>
            This user is not connected to LinkedIn
          </ThemedText>
        </ThemedCard>
      )}
      <ThemedText style={{ textAlign: "center" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </ThemedText>
      
      {(profile.linkedin_connected !== false) && (
        <ThemedView style={styles.linkedInButtonContainer}>
          <ThemedButton
            title="View LinkedIn Profile"
            onPress={handleViewLinkedInProfile}
            variant="filled"
            size="medium"
            icon="link"
            iconPosition="left"
            customBackgroundColor="#0077B5"
            customTextColor="white"
          />
        </ThemedView>
      )}
      
      {/* Back button for non-own profiles */}
      {!isOwnProfile && (
        <ThemedView style={styles.backButtonContainer}>
          <ThemedButton
            title="Back"
            onPress={() => router.push('/(tabs)/profiles')}
            variant="outline"
            size="medium"
            icon="chevron.left"
            iconPosition="left"
          />
        </ThemedView>
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  linkedinCard: {
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
  },
  linkedinCardText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
  },
  connectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButtonContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 16,
  },
  linkedInButtonContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 16,
  },
});
