import * as Linking from 'expo-linking';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import TextInputField from '@/components/ui/TextInputField';
import { C } from '@/constants/palette';
import { EMAIL_REGEX } from '@/constants/validation';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordRequestScreen() {
  const [email, setEmail] = useState('');
  const [checking, setChecking] = useState(false);
  const [emailKnown, setEmailKnown] = useState(false);
  const [notFoundError, setNotFoundError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkEmailExists = async (trimmed: string) => {
    setChecking(true);
    setNotFoundError('');
    setEmailKnown(false);
    try {
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_to_check: trimmed,
      });
      if (error) throw error;
      if (data === true) {
        setEmailKnown(true);
      } else {
        setNotFoundError('Sorry, we do not recognise this email address');
      }
    } catch {
      // Don't block the user if the check fails
    } finally {
      setChecking(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailKnown(false);
    setNotFoundError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = text.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) return;

    debounceRef.current = setTimeout(() => checkEmailExists(trimmed), 300);
  };

  const handleSubmit = async () => {
    if (!emailKnown || loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: Linking.createURL('reset-password'),
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message ?? 'Something went wrong. Please try again.');
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
          <Text style={styles.title}>Forgot password</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <TextInputField
            label="Email"
            type="email"
            required
            value={email}
            onChangeText={handleEmailChange}
            returnKeyType="done"
            placeholder="you@example.com"
          />

          {!!notFoundError && (
            <Text style={styles.notFoundError}>{notFoundError}</Text>
          )}

          <Button
            label="Send link to email"
            onPress={handleSubmit}
            variant="brand"
            disabled={!emailKnown || checking || sent}
            loading={loading || checking}
          />

          {sent && (
            <Text style={styles.successMessage}>
              Check your inbox and click the link to set a new password
            </Text>
          )}
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
  notFoundError: {
    fontSize: 13,
    color: C.error,
    marginTop: -8,
  },
  successMessage: {
    fontSize: 14,
    color: C.success,
    textAlign: 'center',
  },
});
