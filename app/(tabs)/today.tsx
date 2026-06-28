import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/ui/Header';
import Text from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { C } from '@/constants/palette';

export default function TodayScreen() {
  const { signOut } = useAuth();

  const handleSignOut = () => signOut();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Header title="Today" />

        <View style={styles.placeholder}>
          <View style={styles.placeholderInner} />
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
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
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.text,
    marginBottom: 8,
  },
  signOutText: {
    fontSize: 15,
    color: C.text,
  },
});
