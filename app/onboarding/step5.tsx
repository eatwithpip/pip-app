import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { PanResponder, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import StepDots from '@/components/onboarding/StepDots';
import Text from '@/components/ui/Text';
import { GOALS } from '@/constants/goals';
import { C } from '@/constants/palette';

// ─── Slider ──────────────────────────────────────────────────────────────────

const THUMB = 22;
const TRACK_PAD = THUMB / 2;

interface SliderProps {
  question: string;
  value: number;
  onChange: (v: number) => void;
}

function MymopSlider({ question, value, onChange }: SliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef<View>(null);
  const trackWidthRef = useRef(0);
  const trackPageXRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const measure = useCallback(() => {
    trackRef.current?.measure((_, __, width, ___, pageX) => {
      trackWidthRef.current = width;
      trackPageXRef.current = pageX;
      setTrackWidth(width);
    });
  }, []);

  const resolveValue = (pageX: number) => {
    const effectiveWidth = trackWidthRef.current - 2 * TRACK_PAD;
    if (effectiveWidth <= 0) return 0;
    const rel = pageX - trackPageXRef.current - TRACK_PAD;
    const ratio = Math.max(0, Math.min(1, rel / effectiveWidth));
    return Math.round(ratio * 5);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => onChangeRef.current(resolveValue(e.nativeEvent.pageX)),
      onPanResponderMove: e => onChangeRef.current(resolveValue(e.nativeEvent.pageX)),
    })
  ).current;

  const effectiveWidth = trackWidth - 2 * TRACK_PAD;
  const thumbLeft = TRACK_PAD + (value / 5) * effectiveWidth - THUMB / 2;
  const fillWidth = (value / 5) * effectiveWidth;

  return (
    <View style={sliderStyles.wrapper}>
      <Text style={sliderStyles.question}>{question}</Text>

      <View
        ref={trackRef}
        style={sliderStyles.trackContainer}
        onLayout={measure}
        {...pan.panHandlers}
      >
        {/* Background track */}
        <View style={sliderStyles.trackBg} />

        {/* Filled track */}
        {trackWidth > 0 && (
          <View style={[sliderStyles.trackFill, { width: fillWidth }]} />
        )}

        {/* Thumb */}
        {trackWidth > 0 && (
          <View style={[sliderStyles.thumb, { left: thumbLeft }]} />
        )}
      </View>

      <View style={sliderStyles.labelsRow}>
        {[0, 1, 2, 3, 4, 5].map(n => (
          <Text key={n} style={sliderStyles.labelText}>{n}</Text>
        ))}
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: C.text,
    lineHeight: 26,
  },
  trackContainer: {
    height: 44,
    justifyContent: 'center',
  },
  trackBg: {
    position: 'absolute',
    left: TRACK_PAD,
    right: TRACK_PAD,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.swissCoffee,
  },
  trackFill: {
    position: 'absolute',
    left: TRACK_PAD,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.sunshade,
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: C.sunshade,
    elevation: 3,
    ...Platform.select({
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
      },
    }),
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: TRACK_PAD - 4,
  },
  labelText: {
    fontSize: 13,
    color: C.doveGrey,
  },
});

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
