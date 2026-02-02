/**
 * BaZi Adapter - Bridges the new accurate BaZi engine with the old API
 * 
 * This adapter wraps the astronomically accurate bazi.ts engine to provide
 * compatibility with the existing App.jsx interface.
 */

import { computeBazi, STEM_NAMES, BRANCH_NAMES, BaziInput, BaziResult, Pillar } from './bazi';

// Element mapping from stems
const STEM_ELEMENTS: Record<string, string> = {
  'Jia': 'Wood', 'Yi': 'Wood',
  'Bing': 'Fire', 'Ding': 'Fire',
  'Wu': 'Earth', 'Ji': 'Earth',
  'Geng': 'Metal', 'Xin': 'Metal',
  'Ren': 'Water', 'Gui': 'Water'
};

// Yin/Yang mapping from stems
const STEM_YINYANG: Record<string, string> = {
  'Jia': 'Yang', 'Yi': 'Yin',
  'Bing': 'Yang', 'Ding': 'Yin',
  'Wu': 'Yang', 'Ji': 'Yin',
  'Geng': 'Yang', 'Xin': 'Yin',
  'Ren': 'Yang', 'Gui': 'Yin'
};

// Branch elements
const BRANCH_ELEMENTS: Record<string, string> = {
  'Zi': 'Water', 'Chou': 'Earth',
  'Yin': 'Wood', 'Mao': 'Wood',
  'Chen': 'Earth', 'Si': 'Fire',
  'Wu': 'Fire', 'Wei': 'Earth',
  'Shen': 'Metal', 'You': 'Metal',
  'Xu': 'Earth', 'Hai': 'Water'
};

// Branch animals
const BRANCH_ANIMALS: Record<string, string> = {
  'Zi': 'Rat', 'Chou': 'Ox',
  'Yin': 'Tiger', 'Mao': 'Rabbit',
  'Chen': 'Dragon', 'Si': 'Snake',
  'Wu': 'Horse', 'Wei': 'Goat',
  'Shen': 'Monkey', 'You': 'Rooster',
  'Xu': 'Dog', 'Hai': 'Pig'
};

// Chinese characters for stems
const STEM_CHINESE: Record<string, string> = {
  'Jia': '甲', 'Yi': '乙',
  'Bing': '丙', 'Ding': '丁',
  'Wu': '戊', 'Ji': '己',
  'Geng': '庚', 'Xin': '辛',
  'Ren': '壬', 'Gui': '癸'
};

// Chinese characters for branches
const BRANCH_CHINESE: Record<string, string> = {
  'Zi': '子', 'Chou': '丑',
  'Yin': '寅', 'Mao': '卯',
  'Chen': '辰', 'Si': '巳',
  'Wu': '午', 'Wei': '未',
  'Shen': '申', 'You': '酉',
  'Xu': '戌', 'Hai': '亥'
};

// Interface for legacy pillar format
interface LegacyPillar {
  name: string;
  gan: string;
  zhi: string;
  ganInfo?: {
    name: string;
    element: string;
    yinYang: string;
  };
  zhiInfo?: {
    name: string;
    element: string;
    animal: string;
  };
}

// Interface for legacy Bazi result (compatible with old API)
interface LegacyBaziResult {
  year: { 
    gan: { char: string; element: string; yinYang: string; name: string };
    zhi: { char: string; element: string; yinYang: string; name: string };
  };
  month: { 
    gan: { char: string; element: string; yinYang: string; name: string };
    zhi: { char: string; element: string; yinYang: string; name: string };
  };
  day: { 
    gan: { char: string; element: string; yinYang: string; name: string };
    zhi: { char: string; element: string; yinYang: string; name: string };
  };
  hour: { 
    gan: { char: string; element: string; yinYang: string; name: string };
    zhi: { char: string; element: string; yinYang: string; name: string };
  };
  dayMaster: { char: string; element: string; yinYang: string; name: string };
  mainElement: string;
  yinYang: string;
  elements: Record<string, number>;
  strength: number;
  pillars: LegacyPillar[];
}

/**
 * Convert a Pillar from new engine format to legacy gan/zhi format
 */
function convertPillar(pillar: Pillar) {
  return {
    gan: {
      char: STEM_CHINESE[pillar.stem_name],
      element: STEM_ELEMENTS[pillar.stem_name],
      yinYang: STEM_YINYANG[pillar.stem_name],
      name: pillar.stem_name
    },
    zhi: {
      char: BRANCH_CHINESE[pillar.branch_name],
      element: BRANCH_ELEMENTS[pillar.branch_name],
      yinYang: pillar.branch_index % 2 === 0 ? 'Yang' : 'Yin',
      name: pillar.branch_name,
      animal: BRANCH_ANIMALS[pillar.branch_name]
    }
  };
}

/**
 * Calculate element counts from all pillars
 */
function calculateElements(result: BaziResult): Record<string, number> {
  const elements: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  
  // Count stem elements
  elements[STEM_ELEMENTS[result.pillars.year.stem_name]]++;
  elements[STEM_ELEMENTS[result.pillars.month.stem_name]]++;
  elements[STEM_ELEMENTS[result.pillars.day.stem_name]]++;
  elements[STEM_ELEMENTS[result.pillars.hour.stem_name]]++;
  
  // Count branch elements
  elements[BRANCH_ELEMENTS[result.pillars.year.branch_name]]++;
  elements[BRANCH_ELEMENTS[result.pillars.month.branch_name]]++;
  elements[BRANCH_ELEMENTS[result.pillars.day.branch_name]]++;
  elements[BRANCH_ELEMENTS[result.pillars.hour.branch_name]]++;
  
  return elements;
}

/**
 * Calculate strength based on day master and supporting elements
 */
function calculateStrength(result: BaziResult): number {
  const dayMasterElement = STEM_ELEMENTS[result.pillars.day.stem_name];
  let score = 2; // Base score for day master
  
  // Generating cycle: Wood->Fire->Earth->Metal->Water->Wood
  const generating: Record<string, string> = {
    'Wood': 'Fire',
    'Fire': 'Earth', 
    'Earth': 'Metal',
    'Metal': 'Water',
    'Water': 'Wood'
  };
  
  // What generates the day master
  const generatedBy: Record<string, string> = {
    'Fire': 'Wood',
    'Earth': 'Fire',
    'Metal': 'Earth',
    'Water': 'Metal',
    'Wood': 'Water'
  };
  
  // Check month branch - most important for strength
  const monthElement = BRANCH_ELEMENTS[result.pillars.month.branch_name];
  if (monthElement === dayMasterElement) {
    score += 1.5; // Same element - strong
  } else if (generatedBy[dayMasterElement] === monthElement) {
    score += 1; // Generated by month - somewhat strong
  }
  
  // Check hour branch
  const hourElement = BRANCH_ELEMENTS[result.pillars.hour.branch_name];
  if (hourElement === dayMasterElement) {
    score += 0.5;
  }
  
  return score;
}

/**
 * Main function: Calculate BaZi from birth data
 * 
 * @param year - Birth year (e.g., 1990)
 * @param month - Birth month (1-12)
 * @param day - Birth day (1-31)
 * @param hour - Birth hour (0-23)
 * @returns BaZi result compatible with old API
 */
export function calculateBazi(year: number, month: number, day: number, hour: number): LegacyBaziResult {
  // Create input for new engine
  // Using Berlin as default location (can be made configurable)
  const input: BaziInput = {
    birth_local: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00`,
    timezone: 'Europe/Berlin',
    longitude_deg: 13.405,
    latitude_deg: 52.52,
    time_standard: 'CIVIL',
    day_boundary: 'midnight',
    accuracy_seconds: 60
  };
  
  // Compute using new accurate engine
  const result = computeBazi(input);
  
  // Convert to legacy format
  const yearPillar = convertPillar(result.pillars.year);
  const monthPillar = convertPillar(result.pillars.month);
  const dayPillar = convertPillar(result.pillars.day);
  const hourPillar = convertPillar(result.pillars.hour);
  
  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    
    // Day Master is the stem of the day pillar
    dayMaster: dayPillar.gan,
    mainElement: dayPillar.gan.element,
    yinYang: dayPillar.gan.yinYang,
    
    // Element counts from all pillars
    elements: calculateElements(result),
    
    // Strength calculation
    strength: calculateStrength(result),
    
    // Legacy pillar array format
    pillars: [
      { name: 'Jahr', gan: yearPillar.gan.char, zhi: yearPillar.zhi.char, ganInfo: yearPillar.gan, zhiInfo: yearPillar.zhi },
      { name: 'Monat', gan: monthPillar.gan.char, zhi: monthPillar.zhi.char, ganInfo: monthPillar.gan, zhiInfo: monthPillar.zhi },
      { name: 'Tag', gan: dayPillar.gan.char, zhi: dayPillar.zhi.char, ganInfo: dayPillar.gan, zhiInfo: dayPillar.zhi },
      { name: 'Stunde', gan: hourPillar.gan.char, zhi: hourPillar.zhi.char, ganInfo: hourPillar.gan, zhiInfo: hourPillar.zhi }
    ]
  };
}

/**
 * Element Compatibility - Check relationship between two elements
 */
export function getElementCompatibility(element1: string, element2: string): { type: string; text: string } {
  const generating: Record<string, string[]> = {
    'Wood': ['Fire'],
    'Fire': ['Earth'],
    'Earth': ['Metal'],
    'Metal': ['Water'],
    'Water': ['Wood']
  };
  
  const controlling: Record<string, string[]> = {
    'Wood': ['Earth'],
    'Fire': ['Metal'],
    'Earth': ['Water'],
    'Metal': ['Wood'],
    'Water': ['Fire']
  };
  
  if (element1 === element2) {
    return { type: 'same', text: 'Gleiche Energie' };
  }
  if (generating[element1]?.includes(element2)) {
    return { type: 'generating', text: 'Nährt' };
  }
  if (generating[element2]?.includes(element1)) {
    return { type: 'nourished', text: 'Wird genährt' };
  }
  if (controlling[element1]?.includes(element2)) {
    return { type: 'controlling', text: 'Kontrolliert' };
  }
  if (controlling[element2]?.includes(element1)) {
    return { type: 'controlled', text: 'Wird kontrolliert' };
  }
  
  return { type: 'neutral', text: 'Neutral' };
}

/**
 * Yin/Yang Balance - Compare two BaZi charts
 */
export function getYinYangBalance(bazi1: LegacyBaziResult, bazi2: LegacyBaziResult): { balance: string; text: string; tip: string } {
  const yinYang = [bazi1.yinYang, bazi2.yinYang];
  const yangCount = yinYang.filter(y => y === 'Yang').length;
  
  if (yangCount === 0) {
    return { 
      balance: 'double-yin', 
      text: 'Beide Yin',
      tip: 'Kreative Energie, braucht mehr aktive Impulse'
    };
  }
  if (yangCount === 2) {
    return { 
      balance: 'double-yang', 
      text: 'Beide Yang',
      tip: 'Aktive Energie, braucht Ruhephasen'
    };
  }
  return { 
    balance: 'balanced', 
    text: 'Ausgewogen',
    tip: 'Perfekte Balance zwischen Aktivität und Ruhe'
  };
}

/**
 * Result pair combination interface
 */
interface ResultPair {
  title_de?: string;
  description_de?: string;
  icon?: string;
  strength_de?: string;
  tip_de?: string;
}

/**
 * Combine Answer Types - Get result for a pair of answer types
 */
export function combineAnswerTypes(
  type1: string, 
  type2: string, 
  resultPairs: Record<string, ResultPair>
): ResultPair {
  // Sort alphabetically for consistent key order
  const key = [type1, type2].sort().join('_');
  
  return resultPairs[key] || {
    title_de: 'Individuell',
    description_de: 'Ihr seid einzigartig.',
    icon: '💫',
    strength_de: 'Besonder',
    tip_de: 'Entdeckt euren eigenen Weg'
  };
}

// Re-export types and utilities that might be needed
export type { LegacyBaziResult, LegacyPillar };
