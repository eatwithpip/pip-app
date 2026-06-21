import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContinueButton from '@/components/onboarding/ContinueButton';
import Text from '@/components/ui/Text';
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

export default function Step6Screen() {
  const handleStart = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/(tabs)/today');
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
        <ContinueButton onPress={handleStart} enabled label="Start logging" />
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
