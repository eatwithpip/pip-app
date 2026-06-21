import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

interface Props {
  title: string;
  description: string;
  emoji: string;
  selected: boolean;
  dimmed?: boolean;
  onPress: () => void;
}

export default function SelectableCard({
  title,
  description,
  emoji,
  selected,
  dimmed = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={dimmed ? 1 : 0.75}
    >
      <View style={styles.inner}>
        <View style={styles.textBlock}>
          <Text style={[styles.title, dimmed && styles.titleDimmed]}>{title}</Text>
          <Text style={[styles.description, dimmed && styles.descriptionDimmed]}>
            {description}
          </Text>
        </View>
        <Text style={[styles.emoji, dimmed && styles.emojiDimmed]}>{emoji}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: C.sunshade,
    borderRadius: 12,
    backgroundColor: C.white,
    paddingVertical: 20,
    paddingHorizontal: 17,
  },
  cardSelected: {
    backgroundColor: C.romanticSelected,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    marginBottom: 4,
    lineHeight: 28,
  },
  titleDimmed: {
    opacity: 0.5,
  },
  description: {
    fontSize: 18,
    color: C.doveGrey,
    lineHeight: 22,
  },
  descriptionDimmed: {
    color: C.nobel,
  },
  emoji: {
    fontSize: 26,
  },
  emojiDimmed: {
    opacity: 0.4,
  },
});
