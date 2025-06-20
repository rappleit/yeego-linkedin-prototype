import { Link } from 'expo-router';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useProfiles } from '@/api/ProfileAPI';
import { PageContainer } from '@/components/PageContainer';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProfilePicture } from '@/components/profile/ProfilePicture';
import { ThemedCard } from '@/components/ui/ThemedCard';
import { AuthContext } from '@/contexts/AuthContext';
import { Profile } from '@/types/profile';

type ProfileItemProps = {
  profile: Profile;
  onPress: () => void;
};

function ProfileItem({ profile, onPress }: ProfileItemProps) {
  return (
    <Link href={`./profiles/${profile.id}`} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <ThemedCard style={styles.profileCard} backgroundColor='cardBackground'>
          <View style={styles.profileContent}>
            <ProfilePicture
              source={`https://api.dicebear.com/9.x/thumbs/png?seed=${profile.id}`}
              size={60}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <ThemedText type="title" style={styles.profileName}>
                {profile.display_name || "Unknown User"}
              </ThemedText>
              <ThemedText style={styles.profileTitle}>
                @{profile.username || "no-username"}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      </TouchableOpacity>
    </Link>
  );
}

export default function ProfilesIndex() {
  const authContext = useContext(AuthContext);
  const currentUserId = authContext?.user?.id;
  const { data: allProfiles, isLoading, error } = useProfiles();

  const filteredProfiles = allProfiles?.filter(profile => profile.id !== currentUserId) || [];

  const renderProfileItem = ({ item }: { item: Profile }) => (
    <ProfileItem
      profile={item}
      onPress={() => {}}
    />
  );

  if (isLoading) {
    return (
      <PageContainer style={styles.container} scrollable={false}>
        <ThemedText>Loading profiles...</ThemedText>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer style={styles.container} scrollable={false}>
        <ThemedText>Error loading profiles: {error.message}</ThemedText>
      </PageContainer>
    );
  }

  return (
    <PageContainer style={styles.container} scrollable={false}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Profiles
        </ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Discover and connect with professionals
        </ThemedText>
      </ThemedView>
      
      <FlatList
        data={filteredProfiles}
        renderItem={renderProfileItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContainer: {
    paddingBottom: 20,
  },
  profileCard: {
    marginVertical: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileTitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 14,
    opacity: 0.6,
  },
  separator: {
    height: 8,
  },
});
