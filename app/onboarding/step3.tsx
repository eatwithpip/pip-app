import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import SelectableCard from '@/components/onboarding/SelectableCard';
import StepDots from '@/components/onboarding/StepDots';
import Text from '@/components/ui/Text';
import { DIFFICULTY_OPTIONS, type ExperienceLevel } from '@/constants/difficulty';
import { C } from '@/constants/palette';
import { useOnboarding } from '@/context/OnboardingContext';

export default function Step3Screen() {
  const { goals } = useLocalSearchParams<{ goals: string }>();
  const { update } = useOnboarding();
  const [selected, setSelected] = useState<ExperienceLevel | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    update({ difficulty: selected });
    router.push({ pathname: '/onboarding/step4', params: { goals, difficulty: selected } } as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <OnboardingHeader title="Goals" />
        <StepDots total={5} current={3} />

        <Text style={styles.pageTitle}>What's your experience level?</Text>
        <Text style={styles.pageSubtitle}>I am...</Text>

        <View style={styles.cardList}>
          {DIFFICULTY_OPTIONS.map(option => (
            <SelectableCard
              key={option.id}
              title={option.statement}
              description={option.helperText}
              emoji={option.emoji}
              selected={selected === option.id}
              dimmed={selected !== null && selected !== option.id}
              onPress={() => setSelected(option.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleContinue} enabled={selected !== null} />
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
    paddingVertical: 48,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: C.text,
    lineHeight: 36,
    marginBottom: 20,
  },
  pageSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: C.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardList: {
    gap: 12,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
});
