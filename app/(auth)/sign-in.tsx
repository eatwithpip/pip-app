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
import TextLink from '@/components/ui/TextLink';
import { useAuth } from '@/context/AuthContext';
import { C } from '@/constants/palette';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6;

  const handleSignIn = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // AuthProvider will detect the session and _layout will redirect
    } catch (err: any) {
      Alert.alert('Sign in failed', err.message ?? 'Invalid email or password.');
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
          <Text style={styles.title}>Sign in to Pip</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.topFooter}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInputField
            label="Email"
            type="email"
            required
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
            placeholder="you@example.com"
          />

          <TextInputField
            label="Password"
            type="password"
            required
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
            placeholder="Your password"
          />

          <Button
            label="Sign in"
            onPress={handleSignIn}
            variant="primary"
            disabled={!canSubmit}
            loading={loading}
          />

          <TextLink
            label="Forgot password?"
            onPress={() => router.push('/(auth)/forgot-password-request')}
            style={styles.forgotLink}
          />
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
    fontSize: 28,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: C.nobel,
  },
  form: {
    gap: 20,
    backgroundColor: C.white,
    borderRadius: 12,
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
  topFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
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
  forgotLink: {
    textAlign: 'right',
  },
});
