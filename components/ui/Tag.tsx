import { StyleSheet, View } from 'react-native';

import { C } from '@/constants/palette';
import Text from './Text';

interface Props {
  label: string;
  /**
   * filled  – warm peach background with orange border (used for goal themes)
   * outlined – white background with gray border (used for difficulty/track labels)
   */
  variant?: 'filled' | 'outlined';
}

export default function Tag({ label, variant = 'filled' }: Props) {
  return (
    <View style={[styles.base, variant === 'filled' ? styles.filled : styles.outlined]}>
      <Text style={[styles.label, variant === 'filled' ? styles.labelFilled : styles.labelOutlined]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
  },
  filled: {
    backgroundColor: C.romantic,
    borderColor: C.sunshade,
  },
  outlined: {
    backgroundColor: C.white,
    borderColor: C.doveGrey,
  },
  label: {
    fontSize: 12,
    fontWeight: '400',
  },
  labelFilled: {
    color: C.text,
  },
  labelOutlined: {
    color: C.text,
  },
});
