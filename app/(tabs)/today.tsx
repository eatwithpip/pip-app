import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

export default function TodayScreen() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.date}>{today}</Text>
          <Text style={styles.heading}>Today</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Your daily dashboard{'\n'}is coming soon.</Text>
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
  header: {
    gap: 4,
  },
  date: {
    fontSize: 14,
    color: C.doveGrey,
    fontWeight: '500',
  },
  heading: {
    fontSize: 36,
    fontWeight: '700',
    color: C.text,
    lineHeight: 44,
  },
  placeholder: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  placeholderText: {
    fontSize: 16,
    color: C.doveGrey,
    textAlign: 'center',
    lineHeight: 24,
  },
});
