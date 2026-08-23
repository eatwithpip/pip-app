import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ObjectiveExamplesHeader from '@/components/goals/ObjectiveExamplesHeader';
import ObjectiveTracker from '@/components/goals/ObjectiveTracker';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import MymopSlider from '@/components/ui/MymopSlider';
import Text from '@/components/ui/Text';
import TextLink from '@/components/ui/TextLink';
import { useAuth } from '@/context/AuthContext';
import { findObjective } from '@/constants/difficulty';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useProfile } from '@/hooks/useProfile';
import { useUserGoals } from '@/hooks/useUserGoals';
import { C } from '@/constants/palette';

export default function TodayScreen() {
  const { signOut } = useAuth();
  const { data: goals = [] } = useUserGoals();
  const { data: profile } = useProfile();
  const { data: savedScores, submit } = useDailyLog();
  const [scores, setScores] = useState<Record<string, number>>({});
  const hasSubmittedToday = !!savedScores && Object.keys(savedScores).length > 0;

  const goalObjectives = goals.flatMap(goal => {
    const objective = findObjective(goal, profile?.difficulty);
    return objective ? [{ goal, objective }] : [];
  });

  // Fill in each goal's score once from today's saved log; a new day means
  // no saved rows yet, so this naturally lands on 0 without any manual reset.
  useEffect(() => {
    if (!savedScores) return;
    setScores(prev => {
      const next = { ...prev };
      for (const goal of goals) {
        if (next[goal.id] === undefined) next[goal.id] = savedScores[goal.id] ?? 0;
      }
      return next;
    });
  }, [savedScores, goals]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Header title="Today" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {goals.length > 0 && (
            <View style={styles.logSection}>
              <Text style={styles.logHeading}>Log</Text>

              <View style={styles.logCard}>
                {goals.map(goal => (
                  <MymopSlider
                    key={goal.id}
                    question={goal.mymopQuestion}
                    value={scores[goal.id] ?? 0}
                    onChange={v => setScores(prev => ({ ...prev, [goal.id]: v }))}
                  />
                ))}

                <Button
                  label={submit.isPending ? 'Submitting…' : hasSubmittedToday ? 'Edit' : 'Submit'}
                  onPress={() => submit.mutate(scores)}
                  variant="brand"
                  size="small"
                  loading={submit.isPending}
                />
              </View>
            </View>
          )}

          {goalObjectives.length > 0 && (
            <View style={styles.logSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.logHeading}>Objectives</Text>
                <TextLink label="View Goals" onPress={() => router.push('/(tabs)/goals')} />
              </View>

              <View style={styles.logCard}>
                {goalObjectives.map(({ goal, objective }, i) => (
                  <View
                    key={goal.id}
                    style={[styles.objectiveBlock, i > 0 && styles.objectiveBlockDivider]}
                  >
                    <ObjectiveExamplesHeader
                      theme={goal.theme}
                      foodExamples={objective.foodExamples}
                    />
                    <ObjectiveTracker
                      goalId={goal.id}
                      objective={objective}
                      selectedAt={goal.selectedAt}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <Button
          label="Sign out"
          onPress={signOut}
          variant="outline"
          style={styles.signOutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    gap: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 24,
  },
  logSection: {
    gap: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
  },
  logCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    gap: 28,
  },
  objectiveBlock: {
    gap: 12,
  },
  objectiveBlockDivider: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: C.nobel,
  },
  signOutButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    marginBottom: 8,
  },
});
