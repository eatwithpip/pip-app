import Ionicons from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';
import { FONTS } from '@/constants/typography';

type InputType = 'text' | 'email' | 'password';

interface Props extends Omit<TextInputProps, 'secureTextEntry' | 'keyboardType'> {
  label: string;
  type?: InputType;
  required?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TextInputField({ label, type = 'text', required = false, style, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const isPassword = type === 'password';
  const isEmail = type === 'email';

  const handleBlur = (e: any) => {
    setFocused(false);
    if (isEmail && rest.value && !EMAIL_REGEX.test(rest.value as string)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
    onBlur?.(e);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused, !!emailError && styles.inputRowError]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={isEmail ? 'email-address' : 'default'}
          autoCapitalize={isEmail || isPassword ? 'none' : 'sentences'}
          autoCorrect={!isEmail && !isPassword}
          placeholderTextColor={C.nobel}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(v => !v)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={C.doveGrey}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
    lineHeight: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.nobel,
    borderRadius: 6,
    backgroundColor: C.white,
  },
  inputRowFocused: {
    borderColor: C.robinEggBlue,
  },
  inputRowError: {
    borderColor: C.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 32,
    outlineWidth: 0,
    fontFamily: FONTS.regular,
    color: C.text,
  },
  asterisk: {
    color: C.error,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    color: C.error,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
