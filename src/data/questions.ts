import type { Level } from './breeds';

export type AnswerValue = string | string[] | number;
export type AnswerMap = Record<string, AnswerValue>;

export interface TargetField {
  value: number;
  weight: number;
}

export interface TargetProfile {
  size?: TargetField;
  energy?: TargetField;
  shedding?: TargetField;
  trainability?: TargetField;
  kidFriendly?: TargetField;
  spaceNeed?: TargetField;
  barking?: TargetField;
  groomingEffort?: TargetField;
  exerciseHoursPerDay?: TargetField;
  goodWithDogs?: TargetField;
  noviceFriendly?: TargetField;
}

export interface HardFilters {
  requireHypoallergenic?: boolean;
  minKidFriendly?: Level;
  maxSize?: Level;
  minNoviceFriendly?: Level;
  minGoodWithDogs?: Level;
}

export interface Option {
  value: string;
  labelHe: string;
}

export interface Question {
  id: string;
  type: 'single' | 'slider';
  textHe: string;
  helperHe?: string;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  showIf?: (a: AnswerMap) => boolean;
  apply: (answer: AnswerValue, target: TargetProfile, filters: HardFilters) => void;
}

const set = (
  target: TargetProfile,
  key: keyof TargetProfile,
  value: number,
  weight: number,
) => {
  target[key] = { value, weight };
};

export const questions: Question[] = [
  {
    id: 'housing',
    type: 'single',
    textHe: 'איפה אתה גר?',
    helperHe: 'נצטרך לדעת כמה מקום זמין לכלב',
    options: [
      { value: 'apartment', labelHe: 'דירה' },
      { value: 'house-no-yard', labelHe: 'בית ללא חצר' },
      { value: 'house-yard', labelHe: 'בית עם חצר' },
    ],
    apply: (answer, target) => {
      if (answer === 'apartment') {
        set(target, 'spaceNeed', 1, 2);
        set(target, 'barking', 2, 1.5);
        set(target, 'size', 2, 1);
      } else if (answer === 'house-no-yard') {
        set(target, 'spaceNeed', 3, 1.5);
        set(target, 'size', 3, 0.5);
      } else {
        set(target, 'spaceNeed', 4, 1.5);
      }
    },
  },
  {
    id: 'yardSize',
    type: 'single',
    textHe: 'מה גודל החצר?',
    showIf: (a) => a.housing === 'house-yard',
    options: [
      { value: 'small', labelHe: 'קטנה' },
      { value: 'medium', labelHe: 'בינונית' },
      { value: 'large', labelHe: 'גדולה' },
    ],
    apply: (answer, target) => {
      if (answer === 'small') set(target, 'spaceNeed', 3, 1);
      else if (answer === 'medium') set(target, 'spaceNeed', 4, 1);
      else set(target, 'spaceNeed', 5, 1);
    },
  },
  {
    id: 'activityHours',
    type: 'slider',
    textHe: 'כמה שעות פעילות יומיות אתה מוכן להקדיש לכלב?',
    helperHe: 'כולל הליכות, משחק ופעילות',
    min: 0.5,
    max: 3,
    step: 0.5,
    defaultValue: 1.5,
    apply: (answer, target) => {
      const hours = Number(answer);
      set(target, 'exerciseHoursPerDay', hours, 2);
      const energy: number =
        hours <= 0.75 ? 2 : hours <= 1.5 ? 3 : hours <= 2 ? 4 : 5;
      set(target, 'energy', energy, 2);
    },
  },
  {
    id: 'kids',
    type: 'single',
    textHe: 'האם יש ילדים בבית?',
    options: [
      { value: 'none', labelHe: 'אין ילדים' },
      { value: 'young', labelHe: 'יש ילדים מתחת לגיל 6' },
      { value: 'older', labelHe: 'יש ילדים מעל גיל 6' },
    ],
    apply: (answer, target, filters) => {
      if (answer === 'young') {
        filters.minKidFriendly = 4;
        set(target, 'kidFriendly', 5, 2);
      } else if (answer === 'older') {
        filters.minKidFriendly = 3;
        set(target, 'kidFriendly', 4, 1.5);
      }
    },
  },
  {
    id: 'allergies',
    type: 'single',
    textHe: 'האם יש בבית מישהו עם אלרגיה לכלבים?',
    options: [
      { value: 'no', labelHe: 'לא' },
      { value: 'yes', labelHe: 'כן - צריך גזע היפואלרגני' },
    ],
    apply: (answer, target, filters) => {
      if (answer === 'yes') {
        filters.requireHypoallergenic = true;
        set(target, 'shedding', 1, 1.5);
      }
    },
  },
  {
    id: 'experience',
    type: 'single',
    textHe: 'מה הניסיון שלך עם כלבים?',
    options: [
      { value: 'beginner', labelHe: 'מתחיל - זה הכלב הראשון שלי' },
      { value: 'intermediate', labelHe: 'יש לי קצת ניסיון' },
      { value: 'expert', labelHe: 'מנוסה - גידלתי כלבים בעבר' },
    ],
    apply: (answer, target, filters) => {
      if (answer === 'beginner') {
        filters.minNoviceFriendly = 4;
        set(target, 'noviceFriendly', 5, 2);
        set(target, 'trainability', 4, 1);
      } else if (answer === 'intermediate') {
        set(target, 'noviceFriendly', 3, 1);
      } else {
        set(target, 'noviceFriendly', 2, 0.5);
      }
    },
  },
  {
    id: 'groomingTolerance',
    type: 'single',
    textHe: 'כמה זמן אתה מוכן להקדיש לטיפוח?',
    helperHe: 'מברשת, אמבטיה, תספורת',
    options: [
      { value: 'minimal', labelHe: 'מינימלי - מעדיף כלב חלק' },
      { value: 'medium', labelHe: 'בינוני - מברשת פעם בשבוע' },
      { value: 'high', labelHe: 'מוכן להשקיע - אוהב לטפח' },
    ],
    apply: (answer, target) => {
      if (answer === 'minimal') set(target, 'groomingEffort', 1, 1.5);
      else if (answer === 'medium') set(target, 'groomingEffort', 3, 1);
      else set(target, 'groomingEffort', 5, 1);
    },
  },
  {
    id: 'noiseTolerance',
    type: 'single',
    textHe: 'מה רמת הסבלנות שלך לנביחות?',
    options: [
      { value: 'quiet', labelHe: 'צריך שקט - שכנים רגישים' },
      { value: 'medium', labelHe: 'בינוני' },
      { value: 'any', labelHe: 'לא אכפת לי' },
    ],
    apply: (answer, target) => {
      if (answer === 'quiet') set(target, 'barking', 1, 2);
      else if (answer === 'medium') set(target, 'barking', 3, 1);
      else set(target, 'barking', 4, 0.3);
    },
  },
  {
    id: 'sizePreference',
    type: 'single',
    textHe: 'מה גודל הכלב המועדף עליך?',
    options: [
      { value: 'small', labelHe: 'קטן (עד 10 ק"ג)' },
      { value: 'medium', labelHe: 'בינוני (10-25 ק"ג)' },
      { value: 'large', labelHe: 'גדול (25+ ק"ג)' },
      { value: 'any', labelHe: 'לא משנה' },
    ],
    apply: (answer, target, filters) => {
      if (answer === 'small') {
        set(target, 'size', 2, 2);
        filters.maxSize = 3;
      } else if (answer === 'medium') {
        set(target, 'size', 3, 2);
      } else if (answer === 'large') {
        set(target, 'size', 5, 2);
      }
    },
  },
  {
    id: 'otherDogs',
    type: 'single',
    textHe: 'יש לך כלבים אחרים בבית או שאתה מתכנן להוסיף בעתיד?',
    showIf: (a) => a.kids !== 'young',
    options: [
      { value: 'has', labelHe: 'כן, יש כבר כלב נוסף' },
      { value: 'planning', labelHe: 'מתכנן להוסיף בעתיד' },
      { value: 'no', labelHe: 'לא, רק כלב אחד' },
    ],
    apply: (answer, target, filters) => {
      if (answer === 'has' || answer === 'planning') {
        filters.minGoodWithDogs = 3;
        set(target, 'goodWithDogs', 5, 1.5);
      }
    },
  },
];

export const getVisibleQuestions = (answers: AnswerMap): Question[] =>
  questions.filter((q) => !q.showIf || q.showIf(answers));
