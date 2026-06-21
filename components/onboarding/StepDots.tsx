import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet, View } from 'react-native';

import { C } from '@/constants/palette';

interface Props {
  total: number;
  current: number;
}

export default function StepDots({ total, current }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < current - 1;
        return (
          <View key={i} style={[styles.dot, isCompleted && styles.dotCompleted]}>
            {isCompleted && <Ionicons name="checkmark" size={12} color={C.white} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 40,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.swissCoffee,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: C.success,
  },
});
