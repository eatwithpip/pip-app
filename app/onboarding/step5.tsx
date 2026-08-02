import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import StepDots from '@/components/onboarding/StepDots';
import MymopSlider from '@/components/ui/MymopSlider';
import Text from '@/components/ui/Text';
import { GOALS } from '@/constants/goals';
import { C } from '@/constants/palette';

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function Step5Screen() {
  const { goals } = useLocalSearchParams<{ goals: string }>();
  const goalIds = goals ? goals.split(',') : [];
  const selectedGoals = goalIds
    .map(id => GOALS.find(g => g.id === id))
    .filter(Boolean) as typeof GOALS;
  const initialScores = Object.fromEntries(goalIds.map(id => [id, 2]));
  const [scores, setScores] = useState<Record<string, number>>(initialScores);

  const handleSave = () => {
    router.push({ pathname: '/onboarding/step6', params: { goals } } as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <OnboardingHeader title="Benchmark" />
        <StepDots total={5} current={5} />

        <Text style={styles.intro}>Your chosen goal themes are:</Text>

        {selectedGoals.map((goal, i) => (
          <View key={goal.id}>
            <Text style={styles.goalName}>{goal.theme}</Text>
            {i < selectedGoals.length - 1 && (
              <Text style={styles.and}>and</Text>
            )}
          </View>
        ))}

        <Text style={styles.baselineLabel}>
          Set your baseline to track your progress against
        </Text>
        <Text style={styles.baselineHint}>
          For today, rate them how you feel 80% of the time. Your daily check-ins will soon build a picture of progress! 📈
        </Text>

        <View style={styles.sliderList}>
          {selectedGoals.map(goal => (
            <MymopSlider
              key={goal.id}
              question={goal.mymopQuestion}
              value={scores[goal.id] ?? 2}
              onChange={v => setScores(prev => ({ ...prev, [goal.id]: v }))}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleSave} enabled label="Save goals" />
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  intro: {
    fontSize: 15,
    color: C.doveGrey,
    marginBottom: 8,
    textAlign: 'center'
  },
  goalName: {
    fontSize: 32,
    fontWeight: '700',
    color: C.text,
    lineHeight: 38,
    textAlign: 'center'
  },
  and: {
    fontSize: 16,
    color: C.doveGrey,
    marginVertical: 4,
    textAlign: 'center'
  },
  baselineLabel: {
    fontSize: 15,
    color: C.text,
    marginTop: 20,
    marginBottom: 6,
  },
  baselineHint: {
    fontSize: 14,
    color: C.doveGrey,
    lineHeight: 20,
    marginBottom: 28,
  },
  sliderList: {
    gap: 32,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
});
