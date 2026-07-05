import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import { useAuth } from '@/context/AuthContext';
import { C } from '@/constants/palette';

export default function TodayScreen() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Header title="Today" />

        <View style={styles.placeholder}>
          <View style={styles.placeholderInner} />
        </View>

        <Button
          label="Sign out"
          onPress={signOut}
          variant="outline"
          style={styles.signOutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 24,
  },
  placeholder: {
    flex: 1,
  },
  placeholderInner: {
    backgroundColor: C.white,
    borderRadius: 16,
    height: 140,
  },
  signOutButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    marginBottom: 8,
  },
});
