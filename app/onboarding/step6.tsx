import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import Text from '@/components/ui/Text';
import { useOnboarding } from '@/context/OnboardingContext';
import { useInvalidateProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { C } from '@/constants/palette';

function DisclaimerCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
    lineHeight: 24,
  },
});

async function uploadAvatar(userId: string, localUri: string): Promise<string | null> {
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const mimeType = blob.type || 'image/jpeg';
    const ext = mimeType.split('/')[1]?.split('+')[0]?.split(';')[0] || 'jpg';
    const path = `${userId}/avatar.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, blob, {
      upsert: true,
      contentType: mimeType,
    });
    if (error) return null;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}

export default function Step6Screen() {
  const { data: onboarding } = useOnboarding();
  const invalidateProfile = useInvalidateProfile();
  const { goals } = useLocalSearchParams<{ goals: string }>();
  const [saving, setSaving] = useState(false);

  const handleStart = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // Re-fetch the session so the supabase client has a fresh JWT for REST calls
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        Alert.alert('Session expired', 'Please sign in again.');
        router.replace('/(auth)/sign-in');
        return;
      }
      const userId = session.user.id;

      // Upload avatar if the user chose one
      let profileImageUrl: string | null = null;
      if (onboarding.profileImageUri) {
        profileImageUrl = await uploadAvatar(userId, onboarding.profileImageUri);
      }

      // Save profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        name: onboarding.name || null,
        date_of_birth: onboarding.dateOfBirth || null,
        gender: onboarding.gender || null,
        dietary_preferences: onboarding.dietaryPreference ? [onboarding.dietaryPreference] : null,
        location: onboarding.location || null,
        profile_image_url: profileImageUrl,
        difficulty: onboarding.difficulty || null,
        updated_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;

      // Save selected goals
      const goalIds = goals ? goals.split(',').filter(Boolean) : [];
      if (goalIds.length > 0) {
        await supabase.from('user_goals').delete().eq('user_id', userId);
        const { error: goalsError } = await supabase.from('user_goals').insert(
          goalIds.map(goal_id => ({ user_id: userId, goal_id }))
        );
        if (goalsError) throw goalsError;
      }

      // Invalidate the profile cache so the router redirects to tabs
      await invalidateProfile();
      router.replace('/(tabs)/today');
    } catch (err: any) {
      Alert.alert('Something went wrong', err.message ?? 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{'Wahoo!\nYou\'re all\nset up 🎉'}</Text>

        <View style={styles.cards}>
          <DisclaimerCard title="A quick note on personalisation">
            <Text style={styles.body}>
              <Text style={styles.bold}>Everyone's body is different.</Text>
              {'\n'}If you have a diagnosed condition (such as IBS, food allergies, ADHD, are pregnant or managing a health condition), you can{' '}
              <Text style={styles.bold}>adapt, swap or skip any suggestion</Text>
              {' '}that doesn't feel right for you.
            </Text>
            <Text style={styles.body}>
              Eat With Pip is about noticing patterns and building confidence —{' '}
              <Text style={styles.bold}>not pushing through discomfort.</Text>
            </Text>
          </DisclaimerCard>

          <DisclaimerCard title="When to get extra support">
            <Text style={styles.body}>
              If you notice ongoing or worsening symptoms, unexplained weight loss, persistent pain, or anything that concerns you, it's important to speak with a GP or healthcare professional.
            </Text>
          </DisclaimerCard>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ContinueButton onPress={handleStart} enabled={!saving} label={saving ? 'Saving…' : 'Start logging'} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: C.text,
    lineHeight: 48,
    textAlign: 'center',
    marginBottom: 32,
  },
  cards: {
    gap: 16,
  },
  body: {
    fontSize: 15,
    color: C.text,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: C.text,
  },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
});
