import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet, View } from 'react-native';

import { C } from '@/constants/palette';
import Text from './Text';

interface Props {
  text: string;
}

export default function InfoTooltip({ text }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="information-circle" size={20} color={C.lavenderIcon} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.lavender,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 8,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: C.text,
    lineHeight: 12,
  },
});
