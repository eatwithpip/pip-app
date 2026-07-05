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

export default function TextInputField({ label, type = 'text', required = false, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const isEmail = type === 'email';

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>
      <View style={[styles.inputRow, focused && styles.inputRowFocused]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={isEmail ? 'email-address' : 'default'}
          autoCapitalize={isEmail || isPassword ? 'none' : 'sentences'}
          autoCorrect={!isEmail && !isPassword}
          placeholderTextColor={C.nobel}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
