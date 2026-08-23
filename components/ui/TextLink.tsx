import { StyleProp, StyleSheet, TextStyle, TouchableOpacity } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
}

export default function TextLink({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.link, style]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 18,
    fontWeight: '600',
    color: C.cornflowerBlue,
    textDecorationLine: 'underline',
  },
});
