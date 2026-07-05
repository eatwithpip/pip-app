import { Picker } from '@react-native-picker/picker';
import Ionicons from '@react-native-vector-icons/ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Text from '@/components/ui/Text';
import ContinueButton from '@/components/onboarding/ContinueButton';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import StepDots from '@/components/onboarding/StepDots';
import { C } from '@/constants/palette';
import { FONTS } from '@/constants/typography';

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const YEARS = Array.from({ length: new Date().getFullYear() - 1923 }, (_, i) =>
  String(new Date().getFullYear() - i)
);

const UK_COUNTIES = [
  'Avon', 'Bedfordshire', 'Berkshire', 'Bristol', 'Buckinghamshire',
  'Cambridgeshire', 'Cheshire', 'Cornwall', 'Cumbria', 'Derbyshire',
  'Devon', 'Dorset', 'Durham', 'East Riding of Yorkshire', 'East Sussex',
  'Essex', 'Gloucestershire', 'Greater London', 'Greater Manchester',
  'Hampshire', 'Herefordshire', 'Hertfordshire', 'Isle of Wight', 'Kent',
  'Lancashire', 'Leicestershire', 'Lincolnshire', 'Merseyside', 'Norfolk',
  'North Yorkshire', 'Northamptonshire', 'Northumberland', 'Nottinghamshire',
  'Oxfordshire', 'Rutland', 'Shropshire', 'Somerset', 'South Yorkshire',
  'Staffordshire', 'Suffolk', 'Surrey', 'Tyne and Wear', 'Warwickshire',
  'West Midlands', 'West Sussex', 'West Yorkshire', 'Wiltshire', 'Worcestershire',
  'Anglesey', 'Brecknockshire', 'Caernarfonshire', 'Cardiganshire',
  'Carmarthenshire', 'Denbighshire', 'Flintshire', 'Glamorgan',
  'Merionethshire', 'Monmouthshire', 'Montgomeryshire', 'Pembrokeshire', 'Radnorshire',
  'Aberdeenshire', 'Angus', 'Argyll and Bute', 'Ayrshire', 'Clackmannanshire',
  'Dumfries and Galloway', 'Dunbartonshire', 'City of Edinburgh', 'Fife',
  'City of Glasgow', 'Highland', 'Inverclyde', 'Midlothian', 'Moray',
  'Orkney Islands', 'Perth and Kinross', 'Renfrewshire', 'Scottish Borders',
  'Shetland Islands', 'Stirlingshire', 'West Lothian',
  'County Antrim', 'County Armagh', 'County Down',
  'County Fermanagh', 'County Londonderry', 'County Tyrone',
];

const GENDER_OPTIONS = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

const DIETARY_OPTIONS = [
  { label: 'Omnivore', value: 'omnivore' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Pescetarian', value: 'pescetarian' },
  { label: 'Vegan', value: 'vegan' },
];

// ─── SelectPicker ────────────────────────────────────────────────────────────

interface SelectPickerProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  style?: object;
}

function SelectPicker({ value, options, onChange, placeholder = 'Select...', style }: SelectPickerProps) {
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
      <TouchableOpacity
        style={[styles.selectButton, style]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={C.doveGrey} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
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

// ─── RadioGroup ──────────────────────────────────────────────────────────────

interface RadioGroupProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  return (
    <View style={styles.radioGrid}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={styles.radioOption}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, value === opt.value && styles.radioCircleActive]}>
            {value === opt.value && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.radioLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function Step1Screen() {
  const { update } = useOnboarding();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('');
  const [dietary, setDietary] = useState('');
  const [location, setLocation] = useState('');
  const [nameFocused, setNameFocused] = useState(false);

  const isComplete = !!(firstName && birthDay && birthMonth && birthYear && gender && dietary);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    if (!isComplete) return;
    update({
      name: firstName,
      dateOfBirth: `${birthYear}-${birthMonth}-${birthDay}`,
      gender,
      dietaryPreference: dietary,
      location,
      profileImageUri: profileImage,
    });
    router.push('/onboarding/step2' as never);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <OnboardingHeader title="Getting to know you" />
        <StepDots total={5} current={1} />

        {/* Page title */}
        <Text style={styles.pageTitle}>
          Help us personalise your{'\n'}
          <Text style={styles.pageTitleBrand}>Eat With Pip</Text> Journey
        </Text>

        {/* Avatar upload */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage} activeOpacity={0.85}>
            <View style={styles.avatarCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={52} color={C.text} />
              )}
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={16} color={C.white} />
            </View>
          </TouchableOpacity>
        </View>

        {/* First name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            First name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, nameFocused && styles.textInputFocused]}
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>

        {/* Birthday */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Birthday <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.birthdayRow}>
            <View style={styles.birthdayCol}>
              <Text style={styles.sublabel}>Day</Text>
              <SelectPicker value={birthDay} options={DAYS} onChange={setBirthDay} placeholder="DD" />
            </View>
            <View style={styles.birthdayCol}>
              <Text style={styles.sublabel}>Month</Text>
              <SelectPicker value={birthMonth} options={MONTHS} onChange={setBirthMonth} placeholder="MM" />
            </View>
            <View style={styles.birthdayCol}>
              <Text style={styles.sublabel}>Year</Text>
              <SelectPicker value={birthYear} options={YEARS} onChange={setBirthYear} placeholder="YYYY" />
            </View>
          </View>
        </View>

        {/* Gender */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Gender <Text style={styles.required}>*</Text>
          </Text>
          <RadioGroup options={GENDER_OPTIONS} value={gender} onChange={setGender} />
        </View>

        {/* Dietary preferences */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Dietary preferences <Text style={styles.required}>*</Text>
          </Text>
          <RadioGroup options={DIETARY_OPTIONS} value={dietary} onChange={setDietary} />
        </View>

        {/* Location */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location</Text>
          <SelectPicker
            value={location}
            options={UK_COUNTIES}
            onChange={setLocation}
            placeholder="Select county..."
          />
        </View>

        <View style={styles.continueWrapper}>
          <ContinueButton onPress={handleContinue} enabled={isComplete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 48,
  },


  // Title
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: C.text,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
  },
  pageTitleBrand: {
    fontStyle: 'normal',
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.romantic,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: C.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.bg,
  },

  // Field groups
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
    marginBottom: 8,
  },
  required: {
    color: C.error,
  },
  sublabel: {
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
    marginBottom: 8,
  },

  // Text input
  textInput: {
    height: 48,
    borderWidth: 2,
    borderColor: C.nobel,
    borderRadius: 6,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: C.text,
    backgroundColor: C.white,
  },
  textInputFocused: {
    borderColor: C.robinEggBlue,
  },

  // Birthday row
  birthdayRow: {
    flexDirection: 'row',
    gap: 10,
  },
  birthdayCol: {
    flex: 1,
  },

  // Select button
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

  // Picker modal
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

  // Radio buttons
  radioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 26,
    columnGap: 30,
  },
  radioOption: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 14,
    height: 14,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: C.nobel,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: C.robinEggBlue,
  },
  radioInner: {
    width: 4,
    height: 4,
    borderRadius: 50,
    backgroundColor: C.robinEggBlue,
  },
  radioLabel: {
    color: C.doveGrey,
    fontSize: 18,
    fontWeight: 600,
    flex: 1,
  },

  continueWrapper: {
    marginTop: 16,
  },
});
