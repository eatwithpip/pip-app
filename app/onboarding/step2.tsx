import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import SelectableCard from '@/components/onboarding/SelectableCard';
import StepDots from '@/components/onboarding/StepDots';
import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';
import { GOALS } from '../../constants/goals';

const MAX_GOALS = 2;

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function Step2Screen() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isComplete = selectedIds.length === MAX_GOALS;

  const toggleGoal = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_GOALS) return prev;
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    if (!isComplete) return;
    router.push({ pathname: '/onboarding/step3', params: { goals: selectedIds.join(',') } } as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingHeader title="Goals" />
        <StepDots total={5} current={2} />

        <Text style={styles.pageTitle}>Select two goals,{'\n'}revisit any time</Text>
        <Text style={styles.pageSubtitle}>I want to...</Text>

        <View style={styles.goalList}>
          {GOALS.map(goal => {
            const selected = selectedIds.includes(goal.id);
            const dimmed = isComplete && !selected;
            return (
              <SelectableCard
                key={goal.id}
                title={goal.name}
                description={goal.explainerCopy}
                emoji={goal.emoji}
                selected={selected}
                dimmed={dimmed}
                onPress={() => toggleGoal(goal.id)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} enabled={isComplete} />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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
    paddingVertical: 48,
  },


  // Title
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 20,
  },
  pageSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: C.text,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Goal list
  goalList: {
    gap: 12,
  },

  // Footer
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
});
