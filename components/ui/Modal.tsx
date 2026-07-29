import Ionicons from '@react-native-vector-icons/ionicons';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

const FADE_DURATION = 300;

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ visible, title, onClose, children }: Props) {
  const [rendered, setRendered] = useState(visible);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: FADE_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: Platform.OS !== 'web',
    });

    if (visible) {
      setRendered(true);
      animation.start();
    } else {
      animation.start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }
  }, [visible, opacity]);

  if (!rendered) return null;

  return (
    <RNModal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Pressable style={styles.sheet} onPress={() => {}}>
          <TouchableOpacity style={styles.close} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color={C.text} />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{title}</Text>
            {children}
          </ScrollView>
        </Pressable>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: C.overlay,
    justifyContent: 'center',
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: C.white,
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 24,
  },
  close: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.romantic,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: C.text,
    marginBottom: 12,
  },
});
