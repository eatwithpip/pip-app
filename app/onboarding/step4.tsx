import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import StepDots from '@/components/onboarding/StepDots';
import InfoTooltip from '@/components/ui/InfoTooltip';
import Tag from '@/components/ui/Tag';
import Text from '@/components/ui/Text';
import { DIFFICULTY_OPTIONS } from '@/constants/difficulty';
import { GOALS, type Objective } from '@/constants/goals';
import { C } from '@/constants/palette';

// ─── Objective card (step4-only) ─────────────────────────────────────────────

interface ObjectiveCardProps {
  objective: Objective;
  themeName: string;
  trackName: string;
}

function ObjectiveCard({ objective, themeName, trackName }: ObjectiveCardProps) {
  const hasExamples = objective.foodExamples.length > 0;

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.tagRow}>
        <Tag label={themeName} variant="filled" />
        <Tag label={trackName} variant="outlined" />
      </View>

      <Text style={cardStyles.objectiveText}>{objective.text}</Text>

      {hasExamples && (
        <InfoTooltip text={`Try: ${objective.foodExamples.join(', ')}`} />
      )}

      {objective.medicalDisclaimer && (
        <InfoTooltip text={objective.medicalDisclaimer} />
      )}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.sunshade,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  objectiveText: {
    fontSize: 18,
    fontWeight: '600',
    color: C.text,
    lineHeight: 24,
  },
});

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function Step4Screen() {
  const { goals, difficulty } = useLocalSearchParams<{ goals: string; difficulty: string }>();

  const goalIds = goals ? goals.split(',') : [];
  const difficultyOption = DIFFICULTY_OPTIONS.find(d => d.id === difficulty);

  const assignments = goalIds.flatMap(id => {
    const goal = GOALS.find(g => g.id === id);
    if (!goal || !difficultyOption) return [];
    const objective = goal.objectives.find(
      o => o.difficultyLevel === difficultyOption.objectiveDifficulty
    );
    if (!objective) return [];
    return [{ goal, objective }];
  });

  const handleContinue = () => {
    router.push({ pathname: '/onboarding/step5', params: { goals } } as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingHeader title="Your plan" />
        <StepDots total={5} current={4} />

        <Text style={styles.pageTitle}>Here are your{'\n'}objectives</Text>

        <View style={styles.cardList}>
          {assignments.map(({ goal, objective }) => (
            <ObjectiveCard
              key={goal.id}
              objective={objective}
              themeName={goal.theme}
              trackName={difficultyOption?.trackName ?? ''}
            />
          ))}
        </View>

        <Text style={styles.footerNote}>
          You can change these at <Text style={styles.footerBold}>any time</Text> in our goals area
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} enabled={assignments.length > 0} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: C.text,
    lineHeight: 36,
    marginBottom: 24,
  },
  cardList: {
    gap: 16,
  },
  footerNote: {
    fontSize: 15,
    color: C.doveGrey,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  footerBold: {
    fontWeight: '700',
    color: C.text,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
});
