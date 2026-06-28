import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient as _createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { setupURLPolyfill } from 'react-native-url-polyfill';

// During SSR (Node env), metro returns an empty module for @supabase — createClient is undefined.
// Guard it so module init doesn't crash; useEffect calls (auth, queries) never run in SSR.
const createClient = typeof _createClient === 'function' ? _createClient : null;

// Apply URL polyfill on native only — web already has URL, Node SSR doesn't need it
if (typeof URL === 'undefined') {
  setupURLPolyfill();
}

// On web, expo-secure-store exports an empty object so skip straight to AsyncStorage.
// On native, SecureStore is preferred; fall back to AsyncStorage for values > 2 KB.
const SecureStoreAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') return AsyncStorage.getItem(key);
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') { await AsyncStorage.setItem(key, value); return; }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      await AsyncStorage.setItem(key, value);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') { await AsyncStorage.removeItem(key); return; }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      await AsyncStorage.removeItem(key);
    }
  },
};

export const supabase = (createClient ?? (() => ({} as ReturnType<typeof _createClient>)))(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: SecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export type Profile = {
  id: string;
  name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  dietary_preferences: string[] | null;
  location: string | null;
  profile_image_url: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  created_at: string;
  updated_at: string;
};

export type UserGoal = {
  id: string;
  user_id: string;
  goal_id: string;
  created_at: string;
};
