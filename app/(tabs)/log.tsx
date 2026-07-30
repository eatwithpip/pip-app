import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/ui/Header';
import { C } from '@/constants/palette';

export default function LogScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Header title="Log" />

        <View style={styles.placeholder}>
          <View style={styles.placeholderInner} />
        </View>
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
});
