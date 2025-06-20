import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import ProfileScreen from '@/components/profile/ProfileScreen';

export default function ProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProfileScreen userId={id || ''} />;
}
