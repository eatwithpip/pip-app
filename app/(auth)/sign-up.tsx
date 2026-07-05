import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { C } from '@/constants/palette';
import { FONTS } from '@/constants/typography';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  const handleSignUp = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      // AuthProvider will detect the new session and _layout will redirect to onboarding
    } catch (err: any) {
      Alert.alert('Sign up failed', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join Eat With Pip and start your gut health journey
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              placeholder="you@example.com"
              placeholderTextColor={C.doveGrey}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, passwordFocused && styles.inputFocused]}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
              placeholder="At least 6 characters"
              placeholderTextColor={C.doveGrey}
            />
          </View>

          <Button
            label="Create account"
            onPress={handleSignUp}
            variant="brand"
            disabled={!canSubmit}
            loading={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: C.text,
    lineHeight: 42,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: C.doveGrey,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: C.text,
  },
  input: {
    height: 52,
    borderWidth: 2,
    borderColor: C.nobel,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: C.text,
    backgroundColor: C.white,
  },
  inputFocused: {
    borderColor: C.robinEggBlue,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 15,
    color: C.doveGrey,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
    color: C.cornflowerBlue,
  },
});
