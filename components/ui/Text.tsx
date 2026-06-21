import { StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native';
import { FONTS } from '@/constants/typography';

// Maps fontWeight values to the corresponding Afacad font file.
// React Native on iOS/Android requires the exact font family name that
// encodes the weight — setting fontFamily + fontWeight together causes
// issues (double-synthesis on some platforms).
const WEIGHT_MAP: Record<string, string> = {
  '100': FONTS.regular,
  '200': FONTS.regular,
  '300': FONTS.regular,
  normal: FONTS.regular,
  '400': FONTS.regular,
  '500': FONTS.medium,
  '600': FONTS.semiBold,
  '700': FONTS.bold,
  '800': FONTS.bold,
  '900': FONTS.bold,
  bold: FONTS.bold,
};

export default function Text({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = (flat?.fontWeight as string | undefined) ?? 'normal';
  const isItalic = flat?.fontStyle === 'italic';

  const base = WEIGHT_MAP[weight] ?? FONTS.regular;
  const fontFamily = isItalic ? `${base}_Italic` : base;

  return (
    <RNText
      {...props}
      style={[
        style,
        {
          fontFamily,
          // Clear weight/style — they're already encoded in the font file name.
          fontWeight: 'normal' as const,
          ...(isItalic ? { fontStyle: 'normal' as const } : {}),
        },
      ]}
    />
  );
}
