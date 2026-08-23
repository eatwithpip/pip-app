import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Tag from '@/components/ui/Tag';
import Text from '@/components/ui/Text';
import { DIFFICULTY_OPTIONS, type ExperienceLevel } from '@/constants/difficulty';
import { type Objective } from '@/constants/goals';
import { C } from '@/constants/palette';

interface EscalationOfferProps {
  checkpoint: 4 | 8;
  nextTiers: Objective[];
  onAccept: (level: ExperienceLevel) => void;
  onDecline: () => void;
  pending?: boolean;
}

function levelFor(objective: Objective): ExperienceLevel | undefined {
  return DIFFICULTY_OPTIONS.find(d => d.objectiveDifficulty === objective.difficultyLevel)?.id;
}

export default function EscalationOffer({
  checkpoint,
  nextTiers,
  onAccept,
  onDecline,
  pending = false,
}: EscalationOfferProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>You've smashed this for {checkpoint} weeks 🎉</Text>
      <Text style={styles.subheading}>Ready for a bigger challenge?</Text>

      <View style={styles.options}>
        {nextTiers.map(objective => {
          const level = levelFor(objective);
          if (!level) return null;
          return (
            <TouchableOpacity
              key={level}
              style={styles.option}
              onPress={() => onAccept(level)}
              disabled={pending}
              activeOpacity={0.75}
            >
              <Tag label={objective.difficultyLevel} variant="outlined" />
              <Text style={styles.optionText}>{objective.text}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity onPress={onDecline} disabled={pending} hitSlop={8} style={styles.decline}>
          <Text style={styles.declineText}>No thanks, keep my current objective</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: C.sunshade,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
  },
  subheading: {
    fontSize: 18,
    color: C.doveGrey,
    marginBottom: 8,
  },
  options: {
    gap: 10,
  },
  option: {
    backgroundColor: C.bg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 4,
  },
  optionText: {
    fontSize: 18,
    color: C.text,
    lineHeight: 20,
  },
  decline: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  declineText: {
    fontSize: 18,
    color: C.doveGrey,
    textDecorationLine: 'underline',
  },
});
