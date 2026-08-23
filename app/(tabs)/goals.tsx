import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ObjectiveExamplesHeader from '@/components/goals/ObjectiveExamplesHeader';
import ObjectiveTracker from '@/components/goals/ObjectiveTracker';
import Header from '@/components/ui/Header';
import Text from '@/components/ui/Text';
import { findObjective } from '@/constants/difficulty';
import { type Objective } from '@/constants/goals';
import { C } from '@/constants/palette';
import { useProfile } from '@/hooks/useProfile';
import { useUserGoals, type UserGoal } from '@/hooks/useUserGoals';
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

const GOAL_WINDOW_WEEKS = 12;
const DAY_MS = 1000 * 60 * 60 * 24;

function goalWindowProgress(selectedAt: string) {
  const daysElapsed = Math.max(0, (Date.now() - new Date(selectedAt).getTime()) / DAY_MS);
  const totalDays = GOAL_WINDOW_WEEKS * 7;
  const week = Math.min(GOAL_WINDOW_WEEKS, Math.floor(daysElapsed / 7) + 1);
  const fraction = Math.min(1, daysElapsed / totalDays);
  return { week, fraction };
}

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
  goal: UserGoal;
  objective?: Objective;
  weekStats: GoalWeekStats;
}

function GoalCard({ goal, objective, weekStats }: GoalCardProps) {
  const { thisWeekAvg, trend, checkedInDays, days } = weekStats;
  const { week, fraction } = goalWindowProgress(goal.selectedAt);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderContainer}>
        <ObjectiveExamplesHeader theme={goal.theme} foodExamples={objective?.foodExamples ?? []} />
        <Text style={styles.goalName}>{goal.name}</Text>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>Week {week} of {GOAL_WINDOW_WEEKS}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${fraction * 100}%` }]} />
        </View>
      </View>

      {objective && <ObjectiveTracker goalId={goal.id} objective={objective} />}

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
    </View>
  );
}

export default function GoalsScreen() {
  const { data: goals = [] } = useUserGoals();
  const { data: profile } = useProfile();
  const { data: weekStatsByGoal = {} } = useWeeklyGoalStats();

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
              objective={findObjective(goal, profile?.difficulty)}
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
    paddingHorizontal: 10,
    paddingTop: 10,
    gap: 12,
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
  goalName: {
    fontSize: 26,
    fontWeight: '700',
    color: C.text,
    lineHeight: 32,
  },
  progressSection: {
    gap: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: C.doveGrey,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.nobel,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: C.success,
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
    width: 40,
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
    fontSize: 24,
    color: C.doveGrey,
    fontWeight: '700',
  },
  barDayActive: {
    color: C.sunshade,
    fontWeight: '700',
  },
});
