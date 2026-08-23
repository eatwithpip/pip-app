import Ionicons from '@react-native-vector-icons/ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Text from '@/components/ui/Text';
import { type Objective } from '@/constants/goals';
import { C } from '@/constants/palette';
import { emptyObjectiveWeek, isObjectiveAchieved, useObjectiveLog } from '@/hooks/useObjectiveLog';

interface ObjectiveTrackerProps {
  goalId: string;
  objective: Objective;
}

export default function ObjectiveTracker({ goalId, objective }: ObjectiveTrackerProps) {
  const { data: days = emptyObjectiveWeek(), toggleDay } = useObjectiveLog(goalId);
  const achieved = isObjectiveAchieved(objective, days);

  return (
    <View style={styles.container}>
      <Text style={styles.objectiveText}>{objective.text}</Text>

      <View style={styles.checkboxRow}>
        {days.map(day => (
          <TouchableOpacity
            key={day.date}
            style={styles.dayColumn}
            onPress={() => toggleDay.mutate({ date: day.date, completed: !day.completed })}
            hitSlop={4}
          >
            <View style={[styles.circle, day.completed && styles.circleChecked]}>
              {day.completed && <Ionicons name="checkmark" size={18} color={C.white} />}
            </View>
            <Text style={[styles.dayLabel, day.completed && styles.dayLabelChecked]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {achieved && (
        <View style={styles.achievedPill}>
          <Ionicons name="flag" size={12} color={C.success} />
          <Text style={styles.achievedPillText}>Weekly target hit</Text>
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
  dayLabel: {
    fontSize: 24,
    color: C.text,
    fontWeight: '700',
  },
  dayLabelChecked: {
    color: C.sunshade,
    fontWeight: '700',
  },
  achievedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: C.successLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  achievedPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.success,
  },
});
