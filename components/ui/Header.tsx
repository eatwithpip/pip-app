import Ionicons from '@react-native-vector-icons/ionicons';
import { Image, StyleSheet, View } from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';
import { useProfile } from '@/hooks/useProfile';

interface HeaderProps {
  title: string;
  isPremium?: boolean;
}

export default function Header({ title, isPremium = false }: HeaderProps) {
  const { data: profile } = useProfile();
  const profileImage = profile?.profile_image_url ?? null;

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text style={styles.date}>{today}</Text>
        {/* <Text style={styles.heading}>{title}</Text> */}
      </View>

      <View style={[styles.avatarRing, isPremium && styles.premiumRing]}>
        <View style={styles.avatarCircle}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={24} color={C.text} />
          )}
        </View>
      </View>
    </View>
  );
}

const AVATAR_SIZE = 48;
const RING_GAP = 2;
const RING_WIDTH = 2;
const RING_SIZE = AVATAR_SIZE + (RING_GAP + RING_WIDTH) * 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: C.text,
    paddingBottom: 12
  },
  text: {
    gap: 2,
  },
  date: {
    fontSize: 24,
    color: C.text,
    fontWeight: '700',
  },
  heading: {
    fontSize: 36,
    fontWeight: '700',
    color: C.text,
    lineHeight: 44,
  },
  avatarRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: RING_GAP,
    borderWidth: RING_WIDTH,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumRing: {
    borderColor: C.cornflowerBlue,
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: C.romantic,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
});
