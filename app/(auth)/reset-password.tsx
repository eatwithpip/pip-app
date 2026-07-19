import { router } from 'expo-router';
import { useState } from 'react';
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
import { supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      router.replace('/(auth)/sign-in');
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
          <Text style={styles.title}>Reset password</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <TextInputField
            label="New password"
            type="password"
            required
            value={newPassword}
            onChangeText={setNewPassword}
            returnKeyType="next"
            placeholder="At least 6 characters"
          />

          <TextInputField
            label="Confirm password"
            type="password"
            required
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            placeholder="Repeat your password"
          />

          <Button
            label="Sign in"
            onPress={handleSubmit}
            variant="brand"
            disabled={!canSubmit}
            loading={loading}
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
});
