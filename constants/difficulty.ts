import { type Goal, type Objective } from './goals';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface DifficultyOption {
  id: ExperienceLevel;
  emoji: string;
  statement: string;
  helperText: string;
  trackName: string;
  objectiveDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    id: 'beginner',
    emoji: '⚡',
    statement: 'I am new to food logging and mindful eating',
    helperText: 'We recommend our Small Steps track',
    trackName: 'Small Steps',
    objectiveDifficulty: 'Beginner',
  },
  {
    id: 'intermediate',
    emoji: '💩',
    statement: "I'm not a stranger to food logging, but I dip in and out",
    helperText: 'We recommend our Steady Steps track',
    trackName: 'Steady Steps',
    objectiveDifficulty: 'Intermediate',
  },
  {
    id: 'advanced',
    emoji: '🥦',
    statement: 'I know my stuff, but give me a motivational boost!',
    helperText: 'We recommend our Advanced track',
    trackName: 'Advanced',
    objectiveDifficulty: 'Advanced',
  },
];

// The objective a goal card should show is whichever one matches the
// user's chosen experience level — shared by the Goals and Today screens
// so they always agree on which objective is "the" current one.
export function findObjective(
  goal: Goal,
  difficulty: ExperienceLevel | null | undefined
): Objective | undefined {
  const option = DIFFICULTY_OPTIONS.find(d => d.id === difficulty);
  return goal.objectives.find(o => o.difficultyLevel === option?.objectiveDifficulty);
}
