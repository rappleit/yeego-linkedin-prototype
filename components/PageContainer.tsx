import { PropsWithChildren } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/ThemedView';

type PageContainerProps = PropsWithChildren<{
  scrollable?: boolean;
  style?: any;
}>;

export function PageContainer({ children, scrollable = true, style }: PageContainerProps) {
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch {
    insets = {
      top: Platform.OS === 'ios' ? 44 : 24, 
      bottom: Platform.OS === 'ios' ? 34 : 0, 
      left: 0,
      right: 0,
    };
  }
  
  const containerStyle = [
    styles.container,
    {
      paddingTop: insets.top + 20, 
    },
    style
  ];

  const contentStyle = [
    styles.contentContainer,
    {
      paddingBottom: insets.bottom + 20,
    }
  ];

  if (scrollable) {
    return (
      <ThemedView style={containerStyle}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[containerStyle, contentStyle]}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
}); 