import Ionicons from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/ui/Header';
import Modal from '@/components/ui/Modal';
import Tag from '@/components/ui/Tag';
import Text from '@/components/ui/Text';
import { DIFFICULTY_OPTIONS } from '@/constants/difficulty';
import { type Goal, type Objective } from '@/constants/goals';
import { C } from '@/constants/palette';
import { useProfile } from '@/hooks/useProfile';
import { useUserGoals } from '@/hooks/useUserGoals';
import {
  emptyRollingWeekDays,
  type GoalWeekStats,
  useWeeklyGoalStats,
} from '@/hooks/useWeeklyGoalStats';

const EMPTY_WEEK_STATS: GoalWeekStats = {
  checkedInDays: 0,
  days: emptyRollingWeekDays(),
};

const BAR_TRACK_HEIGHT = 50;
const MIN_BAR_FILL_HEIGHT = 4;

function feelingLabel(avg?: number) {
  if (avg === undefined) return 'No check-ins yet this week';
  if (avg >= 4) return 'Feeling great this week';
  if (avg >= 3) return 'Feeling good this week';
  if (avg >= 2) return 'Mixed feelings this week';
  return 'A tough week';
}

const TREND_COPY = {
  up: 'Improving vs last week ↑',
  down: 'Dipped vs last week ↓',
  flat: 'Same as last week',
};

interface GoalCardProps {
  goal: Goal;
  objective?: Objective;
  weekStats: GoalWeekStats;
}

function GoalCard({ goal, objective, weekStats }: GoalCardProps) {
  const [showExamples, setShowExamples] = useState(false);
  const hasExamples = !!objective?.foodExamples.length;
  const { thisWeekAvg, trend, checkedInDays, days } = weekStats;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderContainer}>
        <View style={styles.cardHeader}>
          <Tag label={goal.theme} />
          {hasExamples && (
            <TouchableOpacity onPress={() => setShowExamples(true)} hitSlop={8}>
              <Ionicons name="information-circle-outline" size={22} color={C.cornflowerBlue} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.goalName}>{goal.name}</Text>
      </View>

      {objective && <Text style={styles.objective}>{objective.text}</Text>}

      <View style={styles.checkInBox}>
        <Text style={styles.checkInLabel}>Daily check-in</Text>
        <Text style={styles.checkInHeading}>{feelingLabel(thisWeekAvg)}</Text>

        <View style={styles.checkInRow}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>
              {thisWeekAvg !== undefined ? thisWeekAvg.toFixed(1) : '–'}
            </Text>
            <Text style={styles.scoreOutOf}>out of 5</Text>
          </View>

          <View style={styles.checkInDetails}>
            <Text style={styles.quote}>{`"${goal.mymopQuestion}"`}</Text>
            {trend && (
              <View style={styles.trendPill}>
                <Text style={styles.trendPillText}>{TREND_COPY[trend]}</Text>
              </View>
            )}
            <Text style={styles.checkInNote}>
              {checkedInDays > 0
                ? `Based on ${checkedInDays} check-in${checkedInDays === 1 ? '' : 's'} this week`
                : 'Log today to start tracking your week'}
            </Text>
          </View>
        </View>

        <View style={styles.barsRow}>
          {days.map((day, i) => {
            const active = day.score !== null;
            const fillHeight = active
              ? Math.max(MIN_BAR_FILL_HEIGHT, (day.score! / 5) * BAR_TRACK_HEIGHT)
              : 0;
            return (
              <View key={i} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  {active && <View style={[styles.barFill, { height: fillHeight }]} />}
                </View>
                <Text style={[styles.barDay, active && styles.barDayActive]}>{day.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {hasExamples && (
        <Modal visible={showExamples} title="Food ideas" onClose={() => setShowExamples(false)}>
          <Text style={styles.modalText}>{objective!.foodExamples.join(', ')}</Text>
        </Modal>
      )}
    </View>
  );
}

export default function GoalsScreen() {
  const { data: goals = [] } = useUserGoals();
  const { data: profile } = useProfile();
  const { data: weekStatsByGoal = {} } = useWeeklyGoalStats();
  const difficultyOption = DIFFICULTY_OPTIONS.find(d => d.id === profile?.difficulty);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Header title="Goals" showDate={false} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              objective={goal.objectives.find(
                o => o.difficultyLevel === difficultyOption?.objectiveDifficulty
              )}
              weekStats={weekStatsByGoal[goal.id] ?? EMPTY_WEEK_STATS}
            />
          ))}
        </ScrollView>
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
  scrollContent: {
    gap: 40,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  cardHeaderContainer: {
    flexDirection: 'column',
    gap: 8
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalName: {
    fontSize: 26,
    fontWeight: '700',
    color: C.text,
    lineHeight: 32,
  },
  objective: {
    fontSize: 15,
    color: C.text,
    lineHeight: 21,
  },
  checkInBox: {
    borderWidth: 1,
    borderColor: C.sunshade,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  checkInLabel: {
    fontSize: 12,
    color: C.doveGrey,
  },
  checkInHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  checkInRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: C.sunshade,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
  },
  scoreOutOf: {
    fontSize: 11,
    color: C.white,
  },
  checkInDetails: {
    flex: 1,
    gap: 8,
  },
  quote: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    color: C.text,
    lineHeight: 19,
  },
  trendPill: {
    alignSelf: 'flex-start',
    backgroundColor: C.successLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.success,
  },
  checkInNote: {
    fontSize: 12,
    color: C.doveGrey,
    lineHeight: 17,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barColumn: {
    alignItems: 'center',
    gap: 6,
    width: 28,
  },
  barTrack: {
    width: 24,
    height: BAR_TRACK_HEIGHT,
    borderRadius: 8,
    backgroundColor: C.bg,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    backgroundColor: C.sunshade,
  },
  barDay: {
    fontSize: 12,
    color: C.doveGrey,
  },
  barDayActive: {
    color: C.sunshade,
    fontWeight: '700',
  },
  modalText: {
    fontSize: 15,
    color: C.text,
    lineHeight: 22,
  },
});
