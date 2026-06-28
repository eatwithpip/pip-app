import { createContext, useContext, useState } from 'react';

export type OnboardingData = {
  name: string;
  dateOfBirth: string;
  gender: string;
  dietaryPreference: string;
  location: string;
  profileImageUri: string | null;
  selectedGoals: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  baselineScores: Record<string, number>;
};

type OnboardingContextType = {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
};

const defaults: OnboardingData = {
  name: '',
  dateOfBirth: '',
  gender: '',
  dietaryPreference: '',
  location: '',
  profileImageUri: null,
  selectedGoals: [],
  difficulty: '',
  baselineScores: {},
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaults);

  const update = (partial: Partial<OnboardingData>) =>
    setData(prev => ({ ...prev, ...partial }));

  return (
    <OnboardingContext.Provider value={{ data, update }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
