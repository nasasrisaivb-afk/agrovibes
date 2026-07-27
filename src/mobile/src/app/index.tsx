import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function BrowseScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={[styles.brand, { color: theme.accent }]}>
          CropVibe
        </ThemedText>
        <ThemedText type="subtitle" style={styles.headline}>
          Browse the marketplace
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.support}>
          Native shell for the Buyer + Seller loop. Listings, checkout, and KYC
          land here as screens are nativized from the web app.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  brand: {
    letterSpacing: -0.5,
  },
  headline: {
    maxWidth: 320,
  },
  support: {
    maxWidth: 360,
    lineHeight: 22,
  },
});
