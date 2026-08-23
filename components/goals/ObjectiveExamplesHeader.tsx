import Ionicons from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Modal from '@/components/ui/Modal';
import Tag from '@/components/ui/Tag';
import Text from '@/components/ui/Text';
import { C } from '@/constants/palette';

interface ObjectiveExamplesHeaderProps {
  theme: string;
  foodExamples: string[];
}

export default function ObjectiveExamplesHeader({
  theme,
  foodExamples,
}: ObjectiveExamplesHeaderProps) {
  const [showExamples, setShowExamples] = useState(false);
  const hasExamples = foodExamples.length > 0;

  return (
    <View style={styles.row}>
      <Tag label={theme} />
      {hasExamples && (
        <TouchableOpacity onPress={() => setShowExamples(true)} hitSlop={8}>
          <Ionicons name="information-circle-outline" size={22} color={C.cornflowerBlue} />
        </TouchableOpacity>
      )}

      {hasExamples && (
        <Modal visible={showExamples} title="Food ideas" onClose={() => setShowExamples(false)}>
          <Text style={styles.modalText}>{foodExamples.join(', ')}</Text>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalText: {
    fontSize: 15,
    color: C.text,
    lineHeight: 22,
  },
});
