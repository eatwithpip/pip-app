import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '@/components/ui/Text';
import { type Objective } from '@/constants/goals';
import { C } from '@/constants/palette';
import { emptyObjectiveWeek, isObjectiveAchieved, useObjectiveLog } from '@/hooks/useObjectiveLog';

interface ObjectiveTrackerProps {
  goalId: string;
  objective: Objective;
  selectedAt: string;
}

export default function ObjectiveTracker({ goalId, objective, selectedAt }: ObjectiveTrackerProps) {
  const { data: days = emptyObjectiveWeek(selectedAt), toggleDay } = useObjectiveLog(goalId, selectedAt);
  const achieved = isObjectiveAchieved(objective, days);
  const frequencyLabel = objective.targetFrequency === 'daily' ? 'daily' : 'weekly';

  return (
    <View style={styles.container}>
      <Text style={styles.objectiveText}>{objective.text}</Text>

      <View style={styles.checkboxRow}>
        {days.map(day => (
          <TouchableOpacity
            key={day.date}
            style={styles.dayColumn}
            onPress={() => toggleDay.mutate({ date: day.date, completed: !day.completed })}
            disabled={day.disabled}
            hitSlop={4}
          >
            <View
              style={[styles.circle, day.completed && styles.circleChecked, day.disabled && styles.disabled]}
            >
              {day.completed && <Ionicons name="checkmark" size={18} color={C.white} />}
            </View>
            <Text
              style={[
                styles.dayLabel,
                day.completed && styles.dayLabelChecked,
                day.disabled && styles.disabled,
              ]}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {achieved && (
        <View style={styles.achievedRow}>
          <Text style={styles.achievedText}>
            Amazing! You've completed your {frequencyLabel} objective!
          </Text>
          <Text style={styles.achievedEmoji}>🎉</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  objectiveText: {
    fontSize: 15,
    color: C.text,
    lineHeight: 21,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
    width: 38,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: C.nobel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleChecked: {
    backgroundColor: C.success,
  },
  disabled: {
    opacity: 0.3,
  },
  dayLabel: {
    fontSize: 24,
    color: C.text,
    fontWeight: '700',
  },
  dayLabelChecked: {
    color: C.sunshade,
    fontWeight: '700',
  },
  achievedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievedText: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: C.text,
    lineHeight: 24,
  },
  achievedEmoji: {
    fontSize: 28,
  },
});
