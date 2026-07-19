import { Picker } from '@react-native-picker/picker';
import Ionicons from '@react-native-vector-icons/ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const YEARS = Array.from({ length: new Date().getFullYear() - 1923 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

// ─── SelectPicker ─────────────────────────────────────────────────────────────

interface SelectPickerProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
}

function SelectPicker({ value, options, onChange, placeholder = 'Select...' }: SelectPickerProps) {
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState<string>(value || options[0]);

  const handleOpen = () => {
    setTempValue(value || options[0]);
    setVisible(true);
  };

  const handleDone = () => {
    onChange(tempValue || options[0]);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.selectButton} onPress={handleOpen} activeOpacity={0.7}>
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={C.doveGrey} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.pickerSheet} onPress={() => {}}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.pickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDone}>
                <Text style={styles.pickerDone}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={tempValue || options[0]}
              onValueChange={(val) => setTempValue(val as string)}
              style={Platform.OS === 'android' ? { backgroundColor: C.white } : undefined}
            >
              {options.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ─── Age validation ───────────────────────────────────────────────────────────

function isAtLeast16(day: string, month: string, year: string): boolean {
  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  const cutoff = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
  return dob <= cutoff;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [dobError, setDobError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateAge = (day: string, month: string, year: string) => {
    if (day && month && year) {
      setDobError(
        isAtLeast16(day, month, year)
          ? ''
          : 'You must be aged 16 or above to sign up to Pip'
      );
    }
  };

  const handleBirthDay = (val: string) => {
    setBirthDay(val);
    validateAge(val, birthMonth, birthYear);
  };

  const handleBirthMonth = (val: string) => {
    setBirthMonth(val);
    validateAge(birthDay, val, birthYear);
  };

  const handleBirthYear = (val: string) => {
    setBirthYear(val);
    validateAge(birthDay, birthMonth, val);
  };

  const dobComplete = !!(birthDay && birthMonth && birthYear);

  const canSubmit =
    dobComplete &&
    !dobError &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword;

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
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Sign up to Pip</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.form}>
            {/* Date of birth */}
            <View>
              <Text style={styles.label}>
                Date of birth <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.birthdayRow}>
                <View style={styles.birthdayCol}>
                  <Text style={styles.sublabel}>Day</Text>
                  <SelectPicker value={birthDay} options={DAYS} onChange={handleBirthDay} placeholder="DD" />
                </View>
                <View style={styles.birthdayCol}>
                  <Text style={styles.sublabel}>Month</Text>
                  <SelectPicker value={birthMonth} options={MONTHS} onChange={handleBirthMonth} placeholder="MM" />
                </View>
                <View style={styles.birthdayCol}>
                  <Text style={styles.sublabel}>Year</Text>
                  <SelectPicker value={birthYear} options={YEARS} onChange={handleBirthYear} placeholder="YYYY" />
                </View>
              </View>
              {!!dobError && <Text style={styles.dobError}>{dobError}</Text>}
            </View>

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
              onSubmitEditing={handleSignUp}
              placeholder="Repeat your password"
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
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
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
  },
  required: {
    color: C.error,
  },
  sublabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
    marginBottom: 6,
  },
  birthdayRow: {
    flexDirection: 'row',
    gap: 10,
  },
  birthdayCol: {
    flex: 1,
  },
  dobError: {
    marginTop: 8,
    fontSize: 13,
    color: C.error,
  },
  selectButton: {
    height: 52,
    borderWidth: 1.5,
    borderColor: C.nobel,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.white,
  },
  selectText: {
    fontSize: 15,
    color: C.text,
    flex: 1,
  },
  selectPlaceholder: {
    color: C.doveGrey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: C.overlay,
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: C.nobel,
  },
  pickerCancel: {
    fontSize: 16,
    color: C.doveGrey,
  },
  pickerDone: {
    fontSize: 16,
    color: C.robinEggBlue,
    fontWeight: '600',
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
