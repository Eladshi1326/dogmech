import type { Breed } from '../data/breeds';
import { breeds } from '../data/breeds';
import type {
  AnswerMap,
  HardFilters,
  TargetProfile,
} from '../data/questions';
import { getVisibleQuestions } from '../data/questions';

export interface MatchReason {
  field: string;
  textHe: string;
}

export interface MatchResult {
  breed: Breed;
  score: number;     // 0–100
  reasons: MatchReason[];
}

const REASON_TEXTS: Record<string, (breed: Breed) => string> = {
  size: (b) =>
    b.size <= 2
      ? 'גודל קטן ונוח'
      : b.size === 3
        ? 'גודל בינוני מאוזן'
        : 'גודל גדול ומרשים',
  energy: (b) =>
    b.energy >= 4 ? 'רמת אנרגיה תואמת' : 'רוגע שמתאים לאורח החיים',
  shedding: (b) =>
    b.shedding <= 2 ? 'כמעט לא משיר שיער' : 'רמת השרת שיער תואמת',
  trainability: () => 'קל לאילוף וחכם',
  kidFriendly: () => 'מעולה עם ילדים',
  spaceNeed: (b) =>
    b.spaceNeed <= 2 ? 'מתאים מצוין לדירה' : 'מנצל את המרחב הזמין',
  barking: (b) => (b.barking <= 2 ? 'שקט - כמעט לא נובח' : 'רמת נביחה תואמת'),
  groomingEffort: (b) =>
    b.groomingEffort <= 2
      ? 'דורש מעט מאוד טיפוח'
      : 'רמת טיפוח שתואמת את העדפותיך',
  exerciseHoursPerDay: () => 'דרישות פעילות תואמות',
  goodWithDogs: () => 'מסתדר נהדר עם כלבים אחרים',
  noviceFriendly: () => 'ידידותי לבעלים מתחילים',
};

const NUMERIC_FIELDS: (keyof TargetProfile & keyof Breed)[] = [
  'size',
  'energy',
  'shedding',
  'trainability',
  'kidFriendly',
  'spaceNeed',
  'barking',
  'groomingEffort',
  'exerciseHoursPerDay',
  'goodWithDogs',
  'noviceFriendly',
];

const fieldRange = (field: string): number =>
  field === 'exerciseHoursPerDay' ? 2.5 : 4;

const buildProfile = (
  answers: AnswerMap,
): { target: TargetProfile; filters: HardFilters } => {
  const target: TargetProfile = {};
  const filters: HardFilters = {};
  const visible = getVisibleQuestions(answers);
  for (const q of visible) {
    const ans = answers[q.id];
    if (ans === undefined || ans === '') continue;
    q.apply(ans, target, filters);
  }
  return { target, filters };
};

const passesFilters = (breed: Breed, filters: HardFilters): boolean => {
  if (filters.requireHypoallergenic && !breed.hypoallergenic) return false;
  if (filters.minKidFriendly && breed.kidFriendly < filters.minKidFriendly)
    return false;
  if (filters.maxSize && breed.size > filters.maxSize) return false;
  if (
    filters.minNoviceFriendly &&
    breed.noviceFriendly < filters.minNoviceFriendly
  )
    return false;
  if (filters.minGoodWithDogs && breed.goodWithDogs < filters.minGoodWithDogs)
    return false;
  return true;
};

interface FieldScore {
  field: keyof TargetProfile & keyof Breed;
  score: number;
  weight: number;
}

const scoreBreed = (
  breed: Breed,
  target: TargetProfile,
): { total: number; per: FieldScore[] } => {
  let weightedSum = 0;
  let totalWeight = 0;
  const per: FieldScore[] = [];
  for (const field of NUMERIC_FIELDS) {
    const tf = target[field];
    if (!tf) continue;
    const breedValue = breed[field] as number;
    const diff = Math.abs(breedValue - tf.value);
    const normalized = 1 - diff / fieldRange(field);
    const score = Math.max(0, Math.min(1, normalized));
    weightedSum += score * tf.weight;
    totalWeight += tf.weight;
    per.push({ field, score, weight: tf.weight });
  }
  const total = totalWeight === 0 ? 0 : (weightedSum / totalWeight) * 100;
  return { total, per };
};

const buildReasons = (breed: Breed, per: FieldScore[]): MatchReason[] => {
  const candidates = per
    .filter((p) => p.score >= 0.85)
    .sort((a, b) => b.weight * b.score - a.weight * a.score);
  const reasons: MatchReason[] = [];
  const seen = new Set<string>();
  for (const c of candidates) {
    if (reasons.length >= 3) break;
    const fn = REASON_TEXTS[c.field];
    if (!fn) continue;
    const text = fn(breed);
    if (seen.has(text)) continue;
    seen.add(text);
    reasons.push({ field: c.field, textHe: text });
  }
  if (reasons.length === 0) {
    reasons.push({ field: 'general', textHe: 'התאמה כללית טובה לפרופיל שלך' });
  }
  return reasons;
};

export const matchBreeds = (
  answers: AnswerMap,
  topN: number = 3,
): MatchResult[] => {
  const { target, filters } = buildProfile(answers);
  const candidates = breeds.filter((b) => passesFilters(b, filters));
  const pool = candidates.length > 0 ? candidates : breeds;
  const scored: MatchResult[] = pool.map((breed) => {
    const { total, per } = scoreBreed(breed, target);
    return {
      breed,
      score: Math.round(total),
      reasons: buildReasons(breed, per),
    };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
};
