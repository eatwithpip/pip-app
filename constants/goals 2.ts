export type Frequency = 'daily' | 'weekly' | 'monthly';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Objective {
  text: string;
  targetCount: number;
  targetFrequency: Frequency;
  difficultyLevel: Difficulty;
  foodExamples: string[];
  medicalDisclaimer?: string;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  theme: string;
  explainerCopy: string;
  mymopQuestion: string;
  objectives: Objective[];
}

export const GOALS: Goal[] = [
  {
    id: 'energy',
    name: 'Feel energised & steady throughout the day',
    emoji: '⚡',
    theme: 'Energy & Vitality',
    explainerCopy: 'Reduce energy slumps: no caffeine or sugar crashes',
    mymopQuestion: 'How steady was your energy today?',
    objectives: [
      {
        text: 'Eat something nourishing within 2 hours of waking (even if small).',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: ['Porridge sachet', 'Boiled egg + toast', 'Banana + nut butter'],
      },
      {
        text: 'Add a protein or fibre boost to breakfast 3x this week.',
        targetCount: 3,
        targetFrequency: 'weekly',
        difficultyLevel: 'Intermediate',
        foodExamples: ['Oats', 'Yoghurt', 'Eggs', 'Fruit'],
      },
      {
        text: 'Eat a balanced first meal (plants + protein + whole carbs) 4x per week.',
        targetCount: 4,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: [
          'Eggs + wholegrain toast + spinach',
          'Greek yoghurt + oats + berries',
          'Porridge + nut butter + fruit',
        ],
      },
    ],
  },
  {
    id: 'digestion',
    name: 'Improve digestion & regularity',
    emoji: '💩',
    theme: 'Digestion & Regularity',
    explainerCopy: 'More comfortable digestion & regular bowel movements',
    mymopQuestion: 'How did your meals make you feel today?',
    objectives: [
      {
        text: 'Add one extra bite of any fruit or veg today.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: [],
      },
      {
        text: 'Include one fermented or pre/probiotic food daily.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Intermediate',
        foodExamples: ['Yoghurt', 'Kimchi', 'Bananas', 'Oats', 'Asparagus'],
      },
      {
        text: 'On 4 days per week, eat a meal with 3+ different plant foods and add one cup of bone or vegetable broth, either with a meal or as a snack.',
        targetCount: 4,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: ['Dinner with mixed veg + broth before eating'],
      },
    ],
  },
  {
    id: 'gut-brain',
    name: 'Work on the gut–brain connection',
    emoji: '🧠',
    theme: 'Balanced Mind',
    explainerCopy: 'Feel calm, clear & focused — even when life\'s busy',
    mymopQuestion: 'How calm or balanced did you feel today?',
    objectives: [
      {
        text: 'Take one deep breath before you eat once per day.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: [],
      },
      {
        text: 'Do a 5-minute unwind (stretch, journal or guided calm) daily.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Intermediate',
        foodExamples: [],
      },
      {
        text: 'Have 30 screen-free minutes before bed 3 nights per week.',
        targetCount: 3,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: [],
      },
    ],
  },
  {
    id: 'focus',
    name: 'Feel focused & clear-headed',
    emoji: '🎯',
    theme: 'Focus & Clarity',
    explainerCopy: 'Work on brain fog and poor focus',
    mymopQuestion: 'How clearly were you able to focus today?',
    objectives: [
      {
        text: 'Swap one afternoon coffee or sweet snack for water & nuts.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: [],
      },
      {
        text: 'Pair protein & slow carbs before focus-heavy tasks.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Intermediate',
        foodExamples: [
          'Hummus + oatcakes',
          'Eggs + wholegrain toast',
          'Greek yoghurt + oats',
          'Cottage cheese + rye crackers',
          'Peanut butter + apple',
          'Tuna + wholegrain crackers',
        ],
      },
      {
        text: 'On 4 days per week, eat one intentional focus-supporting meal before your most demanding task.',
        targetCount: 4,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: [
          'Lentil curry + brown rice',
          'Eggs + beans + wholegrain toast',
          'Chicken, quinoa & roasted veg',
          'Tofu, veg & noodles',
          'Salmon + sweet potato + greens',
        ],
      },
    ],
  },
  {
    id: 'variety',
    name: 'Eat balanced, colourful meals',
    emoji: '🥦',
    theme: 'Dietary Variety & Balance',
    explainerCopy: 'Increase variety in your diet & improve gut microbiome',
    mymopQuestion: 'How balanced or colourful were your meals today?',
    objectives: [
      {
        text: 'Add one new colour to a meal today.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: ['Berries', 'Tomatoes', 'Spinach', 'Peppers'],
      },
      {
        text: 'Include 3+ colours in your main meal 3x per week.',
        targetCount: 3,
        targetFrequency: 'weekly',
        difficultyLevel: 'Intermediate',
        foodExamples: [
          'Chicken, rice, broccoli, carrots',
          'Pasta with tomato sauce, spinach, peppers',
        ],
      },
      {
        text: 'On 4 days per week, eat a meal with at least 4 different plant foods.',
        targetCount: 4,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: [
          'Veg, bean & grain bowls',
          'Stir-fry with mixed vegetables',
          'Bean chilli with peppers, tomatoes, onions, beans',
          'Roast veg tray + grains',
        ],
      },
    ],
  },
  {
    id: 'skin',
    name: 'See a healthy glow in my skin',
    emoji: '✨',
    theme: 'Skin Health',
    explainerCopy: 'Support your skin from within with collagen, antioxidants, and gut-loving foods',
    mymopQuestion: 'How healthy or radiant did your skin feel this week?',
    objectives: [
      {
        text: 'Add one colourful fruit or veg to lunch.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: ['Carrots', 'Tomatoes', 'Salad greens'],
      },
      {
        text: 'Add a skin-supportive food daily — collagen, probiotics, omega-3 or antioxidants.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Intermediate',
        foodExamples: ['Salmon', 'Flax', 'Berries', 'Yoghurt', 'Leafy greens', 'Citrus', 'Tofu or eggs'],
      },
      {
        text: 'On 4 days per week, eat a meal combining colour + healthy fats + a gut-supportive food.',
        targetCount: 4,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: ['Salmon + greens + kimchi', 'Tofu + veg + avocado'],
      },
    ],
  },
  {
    id: 'social',
    name: 'Share food and connect with others',
    emoji: '💝',
    theme: 'Social Connection',
    explainerCopy: 'Feel supported, inspired and connected around food',
    mymopQuestion: 'How connected did you feel around food today?',
    objectives: [
      {
        text: 'Send or share a photo of one meal with a friend.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: [],
      },
      {
        text: 'Eat with or talk about a meal with someone twice per month.',
        targetCount: 2,
        targetFrequency: 'monthly',
        difficultyLevel: 'Intermediate',
        foodExamples: [],
      },
      {
        text: 'Cook or share a meal weekly for 4 weeks.',
        targetCount: 1,
        targetFrequency: 'weekly',
        difficultyLevel: 'Advanced',
        foodExamples: [],
      },
    ],
  },
  {
    id: 'hydration',
    name: 'Feel hydrated, alert and clear-headed',
    emoji: '💧',
    theme: 'Hydration',
    explainerCopy: 'Increase water intake to improve hydration',
    mymopQuestion: 'How hydrated did you feel today?',
    objectives: [
      {
        text: 'Drink 1 glass of water when you wake up in the morning.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Beginner',
        foodExamples: [],
      },
      {
        text: 'Drink one glass of water with each meal.',
        targetCount: 3,
        targetFrequency: 'daily',
        difficultyLevel: 'Intermediate',
        foodExamples: [],
      },
      {
        text: 'Aim for around two litres of water per day, spread across the day.',
        targetCount: 1,
        targetFrequency: 'daily',
        difficultyLevel: 'Advanced',
        foodExamples: [],
        medicalDisclaimer:
          'Hydration needs vary. Drink to thirst and avoid forcing fluids. If you have kidney, heart, or electrolyte-related conditions, follow medical advice.',
      },
    ],
  },
];
