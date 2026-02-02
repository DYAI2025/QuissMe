/**
 * Compatibility Calculator for QuissMe
 *
 * Combines BaZi (Chinese Astrology) and Western Astrology
 * to calculate comprehensive compatibility scores between two people.
 *
 * Gracefully handles cases where only BaZi data is available.
 */

// Import types from baziAdapter
import type { LegacyBaziResult } from './baziAdapter';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WesternChart {
  sunSign: string;
  moonSign?: string;
  venusSign?: string;
  marsSign?: string;
  risingSign?: string;
}

export interface BirthChart {
  bazi: LegacyBaziResult;
  western?: WesternChart;
}

export interface CompatibilityAspect {
  name: string;
  name_de: string;
  score: number;          // 0-100
  description: string;
  description_de: string;
  icon: string;
  source: 'bazi' | 'western' | 'combined';
}

export interface CompatibilityStrength {
  title: string;
  title_de: string;
  description: string;
  description_de: string;
  icon: string;
}

export interface CompatibilityChallenge {
  title: string;
  title_de: string;
  description: string;
  description_de: string;
  icon: string;
  tip: string;
  tip_de: string;
}

export interface CompatibilityResult {
  overallScore: number;   // 0-100
  overallLabel: string;
  overallLabel_de: string;
  aspects: CompatibilityAspect[];
  strengths: CompatibilityStrength[];
  challenges: CompatibilityChallenge[];
  summary: string;
  summary_de: string;
  baziOnly: boolean;      // true if only BaZi data was available
}

// ============================================================================
// BAZI COMPATIBILITY CONSTANTS
// ============================================================================

// Element generating cycle (sheng): Wood -> Fire -> Earth -> Metal -> Water -> Wood
const ELEMENT_GENERATES: Record<string, string> = {
  Wood: 'Fire',
  Fire: 'Earth',
  Earth: 'Metal',
  Metal: 'Water',
  Water: 'Wood'
};

// Element controlling cycle (ke): Wood -> Earth -> Water -> Fire -> Metal -> Wood
const ELEMENT_CONTROLS: Record<string, string> = {
  Wood: 'Earth',
  Fire: 'Metal',
  Earth: 'Water',
  Metal: 'Wood',
  Water: 'Fire'
};

// Animal compatibility groups (San He - Three Harmonies)
const ANIMAL_TRINE_GROUPS: Record<string, string[]> = {
  fire: ['Rat', 'Dragon', 'Monkey'],   // Water trine (actually achievers)
  wood: ['Ox', 'Snake', 'Rooster'],    // Metal trine (actually thinkers)
  water: ['Tiger', 'Horse', 'Dog'],    // Fire trine (actually protectors)
  metal: ['Rabbit', 'Goat', 'Pig']     // Wood trine (actually diplomats)
};

// Animal compatibility: Six Harmonies (Liu He)
const ANIMAL_HARMONIES: Record<string, string> = {
  Rat: 'Ox',
  Ox: 'Rat',
  Tiger: 'Pig',
  Pig: 'Tiger',
  Rabbit: 'Dog',
  Dog: 'Rabbit',
  Dragon: 'Rooster',
  Rooster: 'Dragon',
  Snake: 'Monkey',
  Monkey: 'Snake',
  Horse: 'Goat',
  Goat: 'Horse'
};

// Animal incompatibility: Direct clashes (Chong)
const ANIMAL_CLASHES: Record<string, string> = {
  Rat: 'Horse',
  Horse: 'Rat',
  Ox: 'Goat',
  Goat: 'Ox',
  Tiger: 'Monkey',
  Monkey: 'Tiger',
  Rabbit: 'Rooster',
  Rooster: 'Rabbit',
  Dragon: 'Dog',
  Dog: 'Dragon',
  Snake: 'Pig',
  Pig: 'Snake'
};

// ============================================================================
// WESTERN ASTROLOGY CONSTANTS
// ============================================================================

const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const ZODIAC_MODALITY: Record<string, string> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

const ZODIAC_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// ============================================================================
// GERMAN TRANSLATIONS
// ============================================================================

const TRANSLATIONS = {
  elements: {
    Wood: 'Holz',
    Fire: 'Feuer',
    Earth: 'Erde',
    Metal: 'Metall',
    Water: 'Wasser'
  },
  zodiac: {
    Aries: 'Widder',
    Taurus: 'Stier',
    Gemini: 'Zwillinge',
    Cancer: 'Krebs',
    Leo: 'Loewe',
    Virgo: 'Jungfrau',
    Libra: 'Waage',
    Scorpio: 'Skorpion',
    Sagittarius: 'Schuetze',
    Capricorn: 'Steinbock',
    Aquarius: 'Wassermann',
    Pisces: 'Fische'
  },
  aspects: {
    elementCompatibility: {
      name: 'Element Compatibility',
      name_de: 'Element-Harmonie'
    },
    yinYangBalance: {
      name: 'Yin/Yang Balance',
      name_de: 'Yin/Yang Balance'
    },
    animalCompatibility: {
      name: 'Animal Compatibility',
      name_de: 'Tierzeichen-Harmonie'
    },
    dayMasterHarmony: {
      name: 'Day Master Harmony',
      name_de: 'Tagesmeister-Harmonie'
    },
    sunSignCompatibility: {
      name: 'Sun Sign Compatibility',
      name_de: 'Sonnenzeichen-Kompatibilitaet'
    },
    moonSignCompatibility: {
      name: 'Moon Sign Compatibility',
      name_de: 'Mondzeichen-Kompatibilitaet'
    },
    venusMarsDynamics: {
      name: 'Venus/Mars Dynamics',
      name_de: 'Venus/Mars Dynamik'
    },
    communicationStyle: {
      name: 'Communication Style',
      name_de: 'Kommunikationsstil'
    }
  },
  overallLabels: {
    excellent: { en: 'Excellent Match', de: 'Ausgezeichnete Verbindung' },
    great: { en: 'Great Compatibility', de: 'Grossartige Kompatibilitaet' },
    good: { en: 'Good Potential', de: 'Gutes Potenzial' },
    moderate: { en: 'Moderate Match', de: 'Mittlere Uebereinstimmung' },
    challenging: { en: 'Growth Opportunity', de: 'Wachstumschance' }
  }
};

// ============================================================================
// BAZI COMPATIBILITY CALCULATIONS
// ============================================================================

/**
 * Calculate element relationship score between two elements
 */
function calculateElementScore(element1: string, element2: string): number {
  if (element1 === element2) {
    return 80; // Same element: strong but can lack balance
  }

  // Generating relationship (one produces the other)
  if (ELEMENT_GENERATES[element1] === element2) {
    return 90; // Element 1 generates Element 2 - very harmonious
  }
  if (ELEMENT_GENERATES[element2] === element1) {
    return 85; // Element 2 generates Element 1 - harmonious, receiving support
  }

  // Controlling relationship
  if (ELEMENT_CONTROLS[element1] === element2) {
    return 55; // Element 1 controls Element 2 - can be challenging
  }
  if (ELEMENT_CONTROLS[element2] === element1) {
    return 50; // Element 2 controls Element 1 - needs balance
  }

  // Neutral elements (no direct relationship)
  return 70;
}

/**
 * Get element relationship description
 */
function getElementRelationship(element1: string, element2: string): { type: string; desc: string; desc_de: string } {
  if (element1 === element2) {
    return {
      type: 'same',
      desc: `Both share ${element1} energy - deep understanding but similar blind spots`,
      desc_de: `Beide teilen ${TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements]}-Energie - tiefes Verstaendnis, aber aehnliche blinde Flecken`
    };
  }

  if (ELEMENT_GENERATES[element1] === element2) {
    return {
      type: 'generating',
      desc: `${element1} nurtures ${element2} - a naturally supportive dynamic`,
      desc_de: `${TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements]} naehrt ${TRANSLATIONS.elements[element2 as keyof typeof TRANSLATIONS.elements]} - eine natuerlich unterstuetzende Dynamik`
    };
  }

  if (ELEMENT_GENERATES[element2] === element1) {
    return {
      type: 'nurtured',
      desc: `${element2} nurtures ${element1} - receiving natural support`,
      desc_de: `${TRANSLATIONS.elements[element2 as keyof typeof TRANSLATIONS.elements]} naehrt ${TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements]} - natuerliche Unterstuetzung empfangen`
    };
  }

  if (ELEMENT_CONTROLS[element1] === element2) {
    return {
      type: 'controlling',
      desc: `${element1} can overpower ${element2} - requires conscious balance`,
      desc_de: `${TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements]} kann ${TRANSLATIONS.elements[element2 as keyof typeof TRANSLATIONS.elements]} dominieren - bewusstes Gleichgewicht noetig`
    };
  }

  if (ELEMENT_CONTROLS[element2] === element1) {
    return {
      type: 'controlled',
      desc: `${element2} can overpower ${element1} - learning to assert boundaries`,
      desc_de: `${TRANSLATIONS.elements[element2 as keyof typeof TRANSLATIONS.elements]} kann ${TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements]} dominieren - Grenzen setzen lernen`
    };
  }

  return {
    type: 'neutral',
    desc: `${element1} and ${element2} are independent - freedom in the relationship`,
    desc_de: `${TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements]} und ${TRANSLATIONS.elements[element2 as keyof typeof TRANSLATIONS.elements]} sind unabhaengig - Freiheit in der Beziehung`
  };
}

/**
 * Calculate animal sign compatibility
 */
function calculateAnimalScore(animal1: string, animal2: string): number {
  // Perfect harmony (Liu He - Six Harmonies)
  if (ANIMAL_HARMONIES[animal1] === animal2) {
    return 95;
  }

  // Same animal
  if (animal1 === animal2) {
    return 75; // Can understand each other but may compete
  }

  // Direct clash
  if (ANIMAL_CLASHES[animal1] === animal2) {
    return 40; // Challenging but can create passion
  }

  // Check trine groups (San He)
  for (const group of Object.values(ANIMAL_TRINE_GROUPS)) {
    if (group.includes(animal1) && group.includes(animal2)) {
      return 85; // Same trine - good compatibility
    }
  }

  // Default neutral
  return 65;
}

/**
 * Get animal compatibility description
 */
function getAnimalRelationship(animal1: string, animal2: string): { desc: string; desc_de: string } {
  if (ANIMAL_HARMONIES[animal1] === animal2) {
    return {
      desc: `${animal1} and ${animal2} are soulmates in Chinese astrology - natural harmony`,
      desc_de: `${animal1} und ${animal2} sind Seelenverwandte in der chinesischen Astrologie - natuerliche Harmonie`
    };
  }

  if (animal1 === animal2) {
    return {
      desc: `Both are ${animal1}s - deep understanding but may compete for the same space`,
      desc_de: `Beide sind ${animal1}s - tiefes Verstaendnis, aber moegliche Konkurrenz`
    };
  }

  if (ANIMAL_CLASHES[animal1] === animal2) {
    return {
      desc: `${animal1} and ${animal2} clash - intense energy that requires conscious work`,
      desc_de: `${animal1} und ${animal2} stehen im Konflikt - intensive Energie, die bewusste Arbeit erfordert`
    };
  }

  for (const group of Object.values(ANIMAL_TRINE_GROUPS)) {
    if (group.includes(animal1) && group.includes(animal2)) {
      return {
        desc: `${animal1} and ${animal2} share the same trine - natural allies`,
        desc_de: `${animal1} und ${animal2} teilen dasselbe Dreieck - natuerliche Verbuendete`
      };
    }
  }

  return {
    desc: `${animal1} and ${animal2} have a neutral relationship - room for individual growth`,
    desc_de: `${animal1} und ${animal2} haben eine neutrale Beziehung - Raum fuer individuelles Wachstum`
  };
}

/**
 * Calculate Yin/Yang balance score
 */
function calculateYinYangScore(yinYang1: string, yinYang2: string): number {
  if (yinYang1 !== yinYang2) {
    return 90; // Complementary - ideal balance
  }
  if (yinYang1 === 'Yang') {
    return 65; // Both Yang - active but may clash
  }
  return 70; // Both Yin - harmonious but may lack initiative
}

// ============================================================================
// WESTERN ASTROLOGY CALCULATIONS
// ============================================================================

/**
 * Calculate distance between zodiac signs (0-6)
 */
function getZodiacDistance(sign1: string, sign2: string): number {
  const idx1 = ZODIAC_ORDER.indexOf(sign1);
  const idx2 = ZODIAC_ORDER.indexOf(sign2);
  if (idx1 === -1 || idx2 === -1) return 6;

  const diff = Math.abs(idx1 - idx2);
  return Math.min(diff, 12 - diff);
}

/**
 * Calculate sun sign compatibility
 */
function calculateSunSignScore(sign1: string, sign2: string): number {
  const distance = getZodiacDistance(sign1, sign2);
  const element1 = ZODIAC_ELEMENTS[sign1];
  const element2 = ZODIAC_ELEMENTS[sign2];

  // Same sign
  if (sign1 === sign2) return 75;

  // Trine (same element, 4 signs apart)
  if (distance === 4 && element1 === element2) return 90;

  // Sextile (compatible elements, 2 signs apart)
  if (distance === 2) return 80;

  // Opposition (6 signs apart)
  if (distance === 6) return 60; // Can be magnetic but challenging

  // Square (3 signs apart)
  if (distance === 3) return 55; // Growth through friction

  // Conjunct neighbors
  if (distance === 1) return 65;

  return 70; // Quincunx or other
}

/**
 * Calculate moon sign compatibility (emotional)
 */
function calculateMoonSignScore(sign1?: string, sign2?: string): number | null {
  if (!sign1 || !sign2) return null;

  const element1 = ZODIAC_ELEMENTS[sign1];
  const element2 = ZODIAC_ELEMENTS[sign2];

  // Water-Water or Earth-Earth: deep emotional understanding
  if ((element1 === 'Water' && element2 === 'Water') ||
      (element1 === 'Earth' && element2 === 'Earth')) {
    return 90;
  }

  // Water-Earth: nurturing combination
  if ((element1 === 'Water' && element2 === 'Earth') ||
      (element1 === 'Earth' && element2 === 'Water')) {
    return 85;
  }

  // Fire-Air: inspiring combination
  if ((element1 === 'Fire' && element2 === 'Air') ||
      (element1 === 'Air' && element2 === 'Fire')) {
    return 80;
  }

  // Fire-Fire: passionate but volatile
  if (element1 === 'Fire' && element2 === 'Fire') {
    return 75;
  }

  // Air-Air: intellectual connection
  if (element1 === 'Air' && element2 === 'Air') {
    return 75;
  }

  // Fire-Water or Air-Earth: challenging
  if ((element1 === 'Fire' && element2 === 'Water') ||
      (element1 === 'Water' && element2 === 'Fire') ||
      (element1 === 'Air' && element2 === 'Earth') ||
      (element1 === 'Earth' && element2 === 'Air')) {
    return 55;
  }

  return 65;
}

/**
 * Calculate Venus/Mars compatibility (romantic/sexual)
 */
function calculateVenusMarsScore(
  venus1?: string, mars1?: string,
  venus2?: string, mars2?: string
): number | null {
  if (!venus1 || !mars2 || !venus2 || !mars1) return null;

  let score = 70;

  // Venus1 - Mars2 connection (what you desire meets their action)
  const vm1Distance = getZodiacDistance(venus1, mars2);
  if (vm1Distance === 0) score += 15;
  else if (vm1Distance === 4) score += 12;
  else if (vm1Distance === 2) score += 8;
  else if (vm1Distance === 6) score += 5;
  else if (vm1Distance === 3) score -= 5;

  // Venus2 - Mars1 connection
  const vm2Distance = getZodiacDistance(venus2, mars1);
  if (vm2Distance === 0) score += 15;
  else if (vm2Distance === 4) score += 12;
  else if (vm2Distance === 2) score += 8;
  else if (vm2Distance === 6) score += 5;
  else if (vm2Distance === 3) score -= 5;

  return Math.min(100, Math.max(0, score));
}

// ============================================================================
// MAIN COMPATIBILITY CALCULATOR
// ============================================================================

/**
 * Calculate comprehensive compatibility between two birth charts
 */
export function calculateCompatibility(chart1: BirthChart, chart2: BirthChart): CompatibilityResult {
  const aspects: CompatibilityAspect[] = [];
  const strengths: CompatibilityStrength[] = [];
  const challenges: CompatibilityChallenge[] = [];

  const hasWestern = !!(chart1.western?.sunSign && chart2.western?.sunSign);

  // ========== BAZI ASPECTS ==========

  // 1. Element Compatibility (Day Master elements)
  const element1 = chart1.bazi.mainElement;
  const element2 = chart2.bazi.mainElement;
  const elementScore = calculateElementScore(element1, element2);
  const elementRelation = getElementRelationship(element1, element2);

  aspects.push({
    name: 'Element Compatibility',
    name_de: 'Element-Harmonie',
    score: elementScore,
    description: elementRelation.desc,
    description_de: elementRelation.desc_de,
    icon: getElementIcon(element1, element2),
    source: 'bazi'
  });

  // Add strength or challenge based on element relationship
  if (elementRelation.type === 'generating' || elementRelation.type === 'nurtured') {
    strengths.push({
      title: 'Nurturing Energy Flow',
      title_de: 'Naehrende Energiefluss',
      description: `Your elements create a natural cycle of support and growth.`,
      description_de: `Eure Elemente schaffen einen natuerlichen Kreislauf von Unterstuetzung und Wachstum.`,
      icon: '🌱'
    });
  } else if (elementRelation.type === 'controlling' || elementRelation.type === 'controlled') {
    challenges.push({
      title: 'Power Dynamics',
      title_de: 'Machtdynamik',
      description: `One element naturally dominates the other.`,
      description_de: `Ein Element dominiert natuerlich das andere.`,
      icon: '⚖️',
      tip: 'Practice conscious awareness of when one partner is overwhelming the other.',
      tip_de: 'Achtet bewusst darauf, wann ein Partner den anderen ueberwältigt.'
    });
  }

  // 2. Yin/Yang Balance
  const yinYang1 = chart1.bazi.yinYang;
  const yinYang2 = chart2.bazi.yinYang;
  const yinYangScore = calculateYinYangScore(yinYang1, yinYang2);

  let yinYangDesc: string, yinYangDesc_de: string;
  if (yinYang1 !== yinYang2) {
    yinYangDesc = 'Perfect Yin/Yang balance - you complement each other naturally';
    yinYangDesc_de = 'Perfekte Yin/Yang Balance - ihr ergaenzt euch natuerlich';
    strengths.push({
      title: 'Complementary Energies',
      title_de: 'Komplementaere Energien',
      description: 'One brings activity, the other brings receptivity - perfect dance.',
      description_de: 'Einer bringt Aktivitaet, der andere Empfaenglichkeit - perfekter Tanz.',
      icon: '☯️'
    });
  } else if (yinYang1 === 'Yang') {
    yinYangDesc = 'Both Yang - high energy but may compete for leadership';
    yinYangDesc_de = 'Beide Yang - hohe Energie, aber moegliche Konkurrenz um Fuehrung';
    challenges.push({
      title: 'Leadership Competition',
      title_de: 'Fuehrungswettbewerb',
      description: 'Both want to lead - can create friction.',
      description_de: 'Beide wollen fuehren - kann Reibung erzeugen.',
      icon: '⚡',
      tip: 'Take turns leading in different life areas.',
      tip_de: 'Wechselt euch bei der Fuehrung in verschiedenen Lebensbereichen ab.'
    });
  } else {
    yinYangDesc = 'Both Yin - harmonious and receptive, but may need external motivation';
    yinYangDesc_de = 'Beide Yin - harmonisch und empfaenglich, aber benoetigt externe Motivation';
  }

  aspects.push({
    name: 'Yin/Yang Balance',
    name_de: 'Yin/Yang Balance',
    score: yinYangScore,
    description: yinYangDesc,
    description_de: yinYangDesc_de,
    icon: '☯️',
    source: 'bazi'
  });

  // 3. Animal Sign Compatibility (Year Branch)
  const animal1 = chart1.bazi.year.zhi.animal || '';
  const animal2 = chart2.bazi.year.zhi.animal || '';

  if (animal1 && animal2) {
    const animalScore = calculateAnimalScore(animal1, animal2);
    const animalRelation = getAnimalRelationship(animal1, animal2);

    aspects.push({
      name: 'Animal Compatibility',
      name_de: 'Tierzeichen-Harmonie',
      score: animalScore,
      description: animalRelation.desc,
      description_de: animalRelation.desc_de,
      icon: getAnimalIcon(animal1),
      source: 'bazi'
    });

    if (ANIMAL_HARMONIES[animal1] === animal2) {
      strengths.push({
        title: 'Destined Connection',
        title_de: 'Bestimmte Verbindung',
        description: 'Your animal signs form one of the six sacred harmonies.',
        description_de: 'Eure Tierzeichen bilden eine der sechs heiligen Harmonien.',
        icon: '🔮'
      });
    } else if (ANIMAL_CLASHES[animal1] === animal2) {
      challenges.push({
        title: 'Karmic Tension',
        title_de: 'Karmische Spannung',
        description: 'Your animal signs clash - intense attraction but friction.',
        description_de: 'Eure Tierzeichen stehen im Konflikt - intensive Anziehung aber Reibung.',
        icon: '🌋',
        tip: 'See conflicts as opportunities for growth, not threats.',
        tip_de: 'Seht Konflikte als Wachstumschancen, nicht als Bedrohungen.'
      });
    }
  }

  // 4. Day Master Harmony (comparing day pillar stems)
  const dayMaster1 = chart1.bazi.dayMaster;
  const dayMaster2 = chart2.bazi.dayMaster;
  const dayMasterElement1 = dayMaster1.element;
  const dayMasterElement2 = dayMaster2.element;
  const dayMasterScore = calculateElementScore(dayMasterElement1, dayMasterElement2);

  aspects.push({
    name: 'Day Master Harmony',
    name_de: 'Tagesmeister-Harmonie',
    score: dayMasterScore,
    description: `Core self compatibility: ${dayMaster1.name} (${dayMasterElement1}) with ${dayMaster2.name} (${dayMasterElement2})`,
    description_de: `Kern-Selbst Kompatibilitaet: ${dayMaster1.name} (${TRANSLATIONS.elements[dayMasterElement1 as keyof typeof TRANSLATIONS.elements]}) mit ${dayMaster2.name} (${TRANSLATIONS.elements[dayMasterElement2 as keyof typeof TRANSLATIONS.elements]})`,
    icon: '🎭',
    source: 'bazi'
  });

  // ========== WESTERN ASPECTS (if available) ==========

  if (hasWestern) {
    const sun1 = chart1.western!.sunSign;
    const sun2 = chart2.western!.sunSign;

    // 5. Sun Sign Compatibility
    const sunScore = calculateSunSignScore(sun1, sun2);
    const sunElement1 = ZODIAC_ELEMENTS[sun1];
    const sunElement2 = ZODIAC_ELEMENTS[sun2];

    aspects.push({
      name: 'Sun Sign Compatibility',
      name_de: 'Sonnenzeichen-Kompatibilitaet',
      score: sunScore,
      description: `${sun1} (${sunElement1}) meets ${sun2} (${sunElement2}) - your ego expression and life purpose`,
      description_de: `${TRANSLATIONS.zodiac[sun1 as keyof typeof TRANSLATIONS.zodiac]} (${sunElement1}) trifft ${TRANSLATIONS.zodiac[sun2 as keyof typeof TRANSLATIONS.zodiac]} (${sunElement2}) - euer Ego-Ausdruck und Lebenszweck`,
      icon: '☀️',
      source: 'western'
    });

    // 6. Moon Sign Compatibility (if available)
    const moon1 = chart1.western?.moonSign;
    const moon2 = chart2.western?.moonSign;
    const moonScore = calculateMoonSignScore(moon1, moon2);

    if (moonScore !== null && moon1 && moon2) {
      aspects.push({
        name: 'Moon Sign Compatibility',
        name_de: 'Mondzeichen-Kompatibilitaet',
        score: moonScore,
        description: `${moon1} Moon meets ${moon2} Moon - your emotional needs and instincts`,
        description_de: `${TRANSLATIONS.zodiac[moon1 as keyof typeof TRANSLATIONS.zodiac]} Mond trifft ${TRANSLATIONS.zodiac[moon2 as keyof typeof TRANSLATIONS.zodiac]} Mond - eure emotionalen Beduerfnisse und Instinkte`,
        icon: '🌙',
        source: 'western'
      });

      if (moonScore >= 85) {
        strengths.push({
          title: 'Emotional Attunement',
          title_de: 'Emotionale Abstimmung',
          description: 'Your emotional needs naturally align.',
          description_de: 'Eure emotionalen Beduerfnisse sind natuerlich aufeinander abgestimmt.',
          icon: '💝'
        });
      }
    }

    // 7. Venus/Mars Dynamics (if available)
    const venusScore = calculateVenusMarsScore(
      chart1.western?.venusSign,
      chart1.western?.marsSign,
      chart2.western?.venusSign,
      chart2.western?.marsSign
    );

    if (venusScore !== null) {
      aspects.push({
        name: 'Venus/Mars Dynamics',
        name_de: 'Venus/Mars Dynamik',
        score: venusScore,
        description: 'Romantic attraction and passion chemistry',
        description_de: 'Romantische Anziehung und Leidenschafts-Chemie',
        icon: '💕',
        source: 'western'
      });

      if (venusScore >= 85) {
        strengths.push({
          title: 'Magnetic Attraction',
          title_de: 'Magnetische Anziehung',
          description: 'Strong Venus-Mars connections indicate natural chemistry.',
          description_de: 'Starke Venus-Mars Verbindungen zeigen natuerliche Chemie.',
          icon: '🔥'
        });
      }
    }
  }

  // 8. Communication Style (combined analysis)
  const communicationScore = calculateCommunicationScore(chart1, chart2, hasWestern);
  aspects.push({
    name: 'Communication Style',
    name_de: 'Kommunikationsstil',
    score: communicationScore.score,
    description: communicationScore.desc,
    description_de: communicationScore.desc_de,
    icon: '💬',
    source: 'combined'
  });

  // ========== CALCULATE OVERALL SCORE ==========

  const totalScore = aspects.reduce((sum, a) => sum + a.score, 0);
  const overallScore = Math.round(totalScore / aspects.length);

  // Determine overall label
  let overallLabel: string, overallLabel_de: string;
  if (overallScore >= 85) {
    overallLabel = TRANSLATIONS.overallLabels.excellent.en;
    overallLabel_de = TRANSLATIONS.overallLabels.excellent.de;
  } else if (overallScore >= 75) {
    overallLabel = TRANSLATIONS.overallLabels.great.en;
    overallLabel_de = TRANSLATIONS.overallLabels.great.de;
  } else if (overallScore >= 65) {
    overallLabel = TRANSLATIONS.overallLabels.good.en;
    overallLabel_de = TRANSLATIONS.overallLabels.good.de;
  } else if (overallScore >= 50) {
    overallLabel = TRANSLATIONS.overallLabels.moderate.en;
    overallLabel_de = TRANSLATIONS.overallLabels.moderate.de;
  } else {
    overallLabel = TRANSLATIONS.overallLabels.challenging.en;
    overallLabel_de = TRANSLATIONS.overallLabels.challenging.de;
  }

  // Generate summary
  const summary = generateSummary(overallScore, hasWestern, element1, element2, strengths.length, challenges.length);
  const summary_de = generateSummary_de(overallScore, hasWestern, element1, element2, strengths.length, challenges.length);

  return {
    overallScore,
    overallLabel,
    overallLabel_de,
    aspects,
    strengths,
    challenges,
    summary,
    summary_de,
    baziOnly: !hasWestern
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getElementIcon(element1: string, element2: string): string {
  const icons: Record<string, string> = {
    Wood: '🌳',
    Fire: '🔥',
    Earth: '🏔️',
    Metal: '⚔️',
    Water: '🌊'
  };
  return icons[element1] || '✨';
}

function getAnimalIcon(animal: string): string {
  const icons: Record<string, string> = {
    Rat: '🐀',
    Ox: '🐂',
    Tiger: '🐅',
    Rabbit: '🐇',
    Dragon: '🐉',
    Snake: '🐍',
    Horse: '🐴',
    Goat: '🐐',
    Monkey: '🐒',
    Rooster: '🐓',
    Dog: '🐕',
    Pig: '🐷'
  };
  return icons[animal] || '🎋';
}

function calculateCommunicationScore(chart1: BirthChart, chart2: BirthChart, hasWestern: boolean): { score: number; desc: string; desc_de: string } {
  // Base score from month pillars (communication style in BaZi)
  const monthElement1 = chart1.bazi.month.zhi.element;
  const monthElement2 = chart2.bazi.month.zhi.element;
  let score = calculateElementScore(monthElement1, monthElement2);

  // Adjust based on western if available
  if (hasWestern && chart1.western?.sunSign && chart2.western?.sunSign) {
    const modality1 = ZODIAC_MODALITY[chart1.western.sunSign];
    const modality2 = ZODIAC_MODALITY[chart2.western.sunSign];

    if (modality1 === modality2) {
      if (modality1 === 'Mutable') score += 5; // Both flexible
      else if (modality1 === 'Fixed') score -= 5; // Both stubborn
    } else {
      score += 3; // Different modalities can balance
    }
  }

  score = Math.min(100, Math.max(0, score));

  let desc: string, desc_de: string;
  if (score >= 80) {
    desc = 'Natural flow in communication - you easily understand each other';
    desc_de = 'Natuerlicher Kommunikationsfluss - ihr versteht euch leicht';
  } else if (score >= 65) {
    desc = 'Good communication potential with some adjustment needed';
    desc_de = 'Gutes Kommunikationspotenzial mit etwas Anpassung';
  } else {
    desc = 'Different communication styles - requires patience and practice';
    desc_de = 'Unterschiedliche Kommunikationsstile - erfordert Geduld und Uebung';
  }

  return { score, desc, desc_de };
}

function generateSummary(score: number, hasWestern: boolean, element1: string, element2: string, strengthCount: number, challengeCount: number): string {
  const base = hasWestern
    ? 'Based on both BaZi and Western astrology analysis'
    : 'Based on BaZi analysis';

  if (score >= 80) {
    return `${base}, you share a strong natural connection. With ${element1} and ${element2} energies, you have ${strengthCount} key strengths to build upon. Every relationship needs nurturing, but yours has excellent potential.`;
  } else if (score >= 65) {
    return `${base}, you have good compatibility with room for growth. Your ${element1} and ${element2} energies can learn from each other. Focus on your ${strengthCount} strengths while being mindful of ${challengeCount} growth areas.`;
  } else {
    return `${base}, your connection offers significant growth opportunities. The tension between ${element1} and ${element2} can spark transformation. With conscious effort, challenges become stepping stones.`;
  }
}

function generateSummary_de(score: number, hasWestern: boolean, element1: string, element2: string, strengthCount: number, challengeCount: number): string {
  const e1 = TRANSLATIONS.elements[element1 as keyof typeof TRANSLATIONS.elements];
  const e2 = TRANSLATIONS.elements[element2 as keyof typeof TRANSLATIONS.elements];

  const base = hasWestern
    ? 'Basierend auf BaZi und westlicher Astrologie-Analyse'
    : 'Basierend auf BaZi-Analyse';

  if (score >= 80) {
    return `${base} teilt ihr eine starke natuerliche Verbindung. Mit ${e1} und ${e2} Energien habt ihr ${strengthCount} wichtige Staerken. Jede Beziehung braucht Pflege, aber eure hat ausgezeichnetes Potenzial.`;
  } else if (score >= 65) {
    return `${base} habt ihr gute Kompatibilitaet mit Wachstumsraum. Eure ${e1} und ${e2} Energien koennen voneinander lernen. Fokussiert auf eure ${strengthCount} Staerken, achtet auf ${challengeCount} Wachstumsbereiche.`;
  } else {
    return `${base} bietet eure Verbindung bedeutende Wachstumschancen. Die Spannung zwischen ${e1} und ${e2} kann Transformation ausloesen. Mit bewusster Anstrengung werden Herausforderungen zu Trittsteine.`;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  calculateElementScore,
  calculateAnimalScore,
  calculateYinYangScore,
  calculateSunSignScore,
  calculateMoonSignScore,
  getElementRelationship,
  getAnimalRelationship,
  TRANSLATIONS
};
