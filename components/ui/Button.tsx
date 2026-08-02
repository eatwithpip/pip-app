import { ActivityIndicator, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

export type ButtonVariant = 'primary' | 'brand' | 'outline';
export type ButtonSize = 'default' | 'small';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const isOutline = variant === 'outline';
  const isSmall = size === 'small';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && (disabled ? styles.primaryDisabled : styles.primary),
        variant === 'brand' && (disabled ? styles.brandDisabled : styles.brand),
        isOutline && styles.outline,
        isOutline && disabled && styles.opacityDisabled,
        isSmall && styles.small,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={disabled ? 1 : 0.8}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? C.text : C.white} />
      ) : (
        <Text style={[styles.label, isOutline && styles.outlineLabel, isSmall && styles.smallLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: C.cornflowerBlue,
  },
  primaryDisabled: {
    backgroundColor: C.nobel,
  },
  brand: {
    backgroundColor: C.sunshade,
  },
  brandDisabled: {
    backgroundColor: C.nobel,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: C.text,
  },
  opacityDisabled: {
    opacity: 0.4,
  },
  small: {
    height: 42,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
    letterSpacing: 0.3,
  },
  outlineLabel: {
    color: C.text,
  },
  smallLabel: {
    fontSize: 16,
  },
});
