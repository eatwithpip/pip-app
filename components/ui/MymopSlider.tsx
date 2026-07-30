import { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet, View, PanResponder } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

const THUMB = 22;
const TRACK_PAD = THUMB / 2;

interface MymopSliderProps {
  question: string;
  value: number;
  onChange: (v: number) => void;
}

export default function MymopSlider({ question, value, onChange }: MymopSliderProps) {
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
    <View style={styles.wrapper}>
      <Text style={styles.question}>{question}</Text>

      <View
        ref={trackRef}
        style={styles.trackContainer}
        onLayout={measure}
        {...pan.panHandlers}
      >
        {/* Background track */}
        <View style={styles.trackBg} />

        {/* Filled track */}
        {trackWidth > 0 && (
          <View style={[styles.trackFill, { width: fillWidth }]} />
        )}

        {/* Thumb */}
        {trackWidth > 0 && (
          <View style={[styles.thumb, { left: thumbLeft }]} />
        )}
      </View>

      <View style={styles.labelsRow}>
        {[0, 1, 2, 3, 4, 5].map(n => (
          <Text key={n} style={styles.labelText}>{n}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: C.text,
    lineHeight: 18,
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
    fontSize: 16,
    color: C.doveGrey,
    fontWeight: '600',
  },
});
