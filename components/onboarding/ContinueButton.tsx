import { StyleSheet, TouchableOpacity } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

interface Props {
  onPress: () => void;
  enabled: boolean;
  label?: string;
}

export default function ContinueButton({ onPress, enabled, label = 'Continue' }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, enabled && styles.buttonActive]}
      onPress={onPress}
      activeOpacity={enabled ? 0.8 : 1}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: C.nobel,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: C.cornflowerBlue,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
    letterSpacing: 0.3,
  },
});
