import Ionicons from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

interface Props {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function OnboardingHeader({ title, onBack, showBack = true }: Props) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack ?? (() => router.back())}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color={C.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.romantic,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
  },
  spacer: {
    width: 48,
  },
});
