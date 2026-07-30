import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import MymopSlider from '@/components/ui/MymopSlider';
import Text from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useUserGoals } from '@/hooks/useUserGoals';
import { C } from '@/constants/palette';

export default function TodayScreen() {
  const { signOut } = useAuth();
  const { data: goals = [] } = useUserGoals();
  const { data: savedScores, submit } = useDailyLog();
  const [scores, setScores] = useState<Record<string, number>>({});

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
                  label={submit.isPending ? 'Submitting…' : 'Submit'}
                  onPress={() => submit.mutate(scores)}
                  variant="brand"
                  size="small"
                  loading={submit.isPending}
                />
              </View>
            </View>
          )}

          <View style={styles.placeholder}>
            <View style={styles.placeholderInner} />
          </View>
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
  placeholder: {
    flex: 1,
  },
  placeholderInner: {
    backgroundColor: C.white,
    borderRadius: 16,
    height: 140,
  },
  signOutButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
    marginBottom: 8,
  },
});
