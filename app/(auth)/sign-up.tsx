import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import TextInputField from '@/components/ui/TextInputField';
import { useAuth } from '@/context/AuthContext';
import { C } from '@/constants/palette';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
          <TextInputField
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            placeholder="you@example.com"
          />

          <TextInputField
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            placeholder="At least 6 characters"
          />

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
    paddingHorizontal: 16,
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
    backgroundColor: C.white,
    borderRadius: 12,
    gap: 20,
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '4px 4px 8px 0px rgba(238, 221, 201, 0.2)' },
      default: {
        shadowColor: '#EEDDC9',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
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
