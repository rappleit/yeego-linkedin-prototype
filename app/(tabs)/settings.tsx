import { LinkedInAPI } from "@/api/LinkedInAPI";
import { PageContainer } from "@/components/PageContainer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedCard } from "@/components/ui/ThemedCard";
import { AuthContext } from "@/contexts/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useContext, useEffect } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

export default function SettingsScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  if (!authContext) {
    throw new Error("SettingsScreen must be used within an AuthProvider");
  }
  const { logout, profile, profileLoading, refreshProfile } = authContext;

  // Handle return from hosted auth
  useEffect(() => {
    // Check if user returned from auth flow
    if (params.auth === 'success') {
      Alert.alert("Success", "LinkedIn account connected successfully!");
      // Refresh profile to get updated LinkedIn connection status
      refreshProfile();
      
      router.setParams({});
    } else if (params.auth === 'failure') {
      Alert.alert("Failed", "LinkedIn connection failed. Please try again.");
      router.setParams({});
    }
  }, [params.auth, router, refreshProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "You have been logged out successfully");
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred during logout");
      console.error("Logout failed:", error);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      const request = {
        type: "create" as const,
        api_url: "https://api14.unipile.com:14496",
        expiresOn: new Date(Date.now() + 10 * 60 * 1000).toISOString(), //10 minutes
        providers: ["LINKEDIN"],
        notify_url: "https://rzzhsadiatfvgyiqdjmd.supabase.co/functions/v1/unipile-webhook",
        name: authContext.user?.id || "unknown_user",
      };

      const { url } = await LinkedInAPI.createHostedAuthLink(request);
      console.log("Received hosted auth URL:", url);

      Alert.alert(
        "Redirect to LinkedIn",
        "You will be redirected to LinkedIn to log in. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Continue", 
            onPress: async () => {
              try {
                const result = await WebBrowser.openAuthSessionAsync(url, 'your-app-scheme://');
                console.log("WebBrowser result:", result);
                
                setTimeout(() => {
                  refreshProfile();
                }, 2000);
              } catch (error) {
                console.error("WebBrowser error:", error);
                Alert.alert("Error", "Failed to open LinkedIn authentication.");
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to create LinkedIn auth link.");
      console.error(error);
    }
  };

  const renderLinkedInCard = () => {
    if (profileLoading) {
      return (
        <ThemedCard backgroundColor="cardBackground" style={styles.iconCard}>
          <Entypo name="linkedin" size={24} color="#687076" />
          <ThemedText type="defaultSemiBold" style={styles.loadingText}>
            Loading LinkedIn status...
          </ThemedText>
        </ThemedCard>
      );
    }

    if (profile?.linkedin_connected) {
      return (
        <ThemedCard 
          backgroundColor="tint" 
          lightColor="#4CAF50"
          darkColor="#66BB6A"
          style={styles.iconCard}
        >
          <Entypo name="linkedin" size={24} color="#fff" />
          <View style={styles.linkedInInfo}>
            <ThemedText type="defaultSemiBold" style={styles.linkedInText}>
              LinkedIn Connected
            </ThemedText>
            <ThemedText style={styles.linkedInProfileId}>
              Profile ID: {profile.linkedin_profile_id || 'N/A'}
            </ThemedText>
          </View>
        </ThemedCard>
      );
    }

    return (
      <Pressable onPress={handleConnectLinkedIn}>
        <ThemedCard backgroundColor="tint" style={styles.iconCard}>
          <Entypo name="linkedin" size={24} color="#fff" />
          <ThemedText type="defaultSemiBold" style={styles.linkedInText}>
            Connect account to LinkedIn
          </ThemedText>
        </ThemedCard>
      </Pressable>
    );
  };

  return (
    <PageContainer>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        {renderLinkedInCard()}
        <Pressable onPress={handleLogout}>
          <ThemedCard backgroundColor="cardBackground" style={styles.iconCard}>
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={24}
              color="#000"
            />
            <ThemedText type="defaultSemiBold" >
              Logout
            </ThemedText>
          </ThemedCard>
        </Pressable>
      </ThemedView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  contentContainer: {
    gap: 8,
    marginBottom: 24,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  linkedInText: {
    color: "#fff",
  },
  linkedInInfo: {
    flex: 1,
  },
  linkedInProfileId: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
  iconCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#687076",
  },
});
