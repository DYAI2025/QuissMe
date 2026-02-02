/**
 * Western Astrology Calculator for QuissMe
 *
 * This is a stub/placeholder file that will be replaced with
 * a full implementation using Swiss Ephemeris for accurate
 * planetary position calculations.
 *
 * For now, it provides basic zodiac sign calculations based on
 * birth date only (sun sign). Full implementation will include:
 * - Accurate planetary positions using Swiss Ephemeris
 * - Moon sign (requires birth time and location)
 * - Rising sign / Ascendant (requires exact birth time and location)
 * - Venus, Mars, and other planetary positions
 * - House calculations
 */

export interface WesternChart {
  sunSign: string;
  moonSign?: string;
  risingSign?: string;
  venusSign?: string;
  marsSign?: string;
  mercurySign?: string;
  jupiterSign?: string;
  saturnSign?: string;
}

export interface WesternInput {
  year: number;
  month: number;       // 1-12
  day: number;         // 1-31
  hour?: number;       // 0-23
  minute?: number;     // 0-59
  latitude?: number;   // For rising sign calculation
  longitude?: number;  // For rising sign calculation
  timezone?: string;   // e.g., 'Europe/Berlin'
}

// Zodiac sign date ranges (approximate, for sun sign only)
// Note: Full implementation should use precise solar longitude calculations
const ZODIAC_DATES: Array<{ sign: string; startMonth: number; startDay: number; endMonth: number; endDay: number }> = [
  { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
];

// German translations for zodiac signs
export const ZODIAC_GERMAN: Record<string, string> = {
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
};

// Zodiac elements
export const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: 'Fire',
  Leo: 'Fire',
  Sagittarius: 'Fire',
  Taurus: 'Earth',
  Virgo: 'Earth',
  Capricorn: 'Earth',
  Gemini: 'Air',
  Libra: 'Air',
  Aquarius: 'Air',
  Cancer: 'Water',
  Scorpio: 'Water',
  Pisces: 'Water'
};

// Zodiac modalities
export const ZODIAC_MODALITIES: Record<string, string> = {
  Aries: 'Cardinal',
  Cancer: 'Cardinal',
  Libra: 'Cardinal',
  Capricorn: 'Cardinal',
  Taurus: 'Fixed',
  Leo: 'Fixed',
  Scorpio: 'Fixed',
  Aquarius: 'Fixed',
  Gemini: 'Mutable',
  Virgo: 'Mutable',
  Sagittarius: 'Mutable',
  Pisces: 'Mutable'
};

/**
 * Calculate sun sign based on birth date
 * This is a simplified calculation using date ranges.
 * Full implementation should use astronomical calculations.
 */
function getSunSign(month: number, day: number): string {
  // Handle Capricorn which spans two years
  if (month === 12 && day >= 22) return 'Capricorn';
  if (month === 1 && day <= 19) return 'Capricorn';

  for (const zodiac of ZODIAC_DATES) {
    // Skip Capricorn (handled above)
    if (zodiac.sign === 'Capricorn') continue;

    // Check if date falls within this sign's range
    if (month === zodiac.startMonth && day >= zodiac.startDay) {
      return zodiac.sign;
    }
    if (month === zodiac.endMonth && day <= zodiac.endDay) {
      return zodiac.sign;
    }
  }

  // Fallback (should not reach here with valid dates)
  return 'Unknown';
}

/**
 * Calculate Western astrology chart
 *
 * Current implementation:
 * - Sun sign only (based on date ranges)
 *
 * TODO (requires Swiss Ephemeris):
 * - Accurate sun sign at boundary dates
 * - Moon sign calculation
 * - Rising sign / Ascendant
 * - Planetary positions (Venus, Mars, etc.)
 *
 * @param input Birth data including date, time, and location
 * @returns Western astrology chart (currently sun sign only)
 */
export function calculateWesternChart(input: WesternInput): WesternChart {
  const sunSign = getSunSign(input.month, input.day);

  // For now, return only sun sign
  // Future implementation will calculate other positions
  return {
    sunSign
    // moonSign, risingSign, venusSign, marsSign will be added
    // when Swiss Ephemeris integration is complete
  };
}

/**
 * Get zodiac sign information
 */
export function getZodiacInfo(sign: string): {
  german: string;
  element: string;
  modality: string;
  ruling_planet: string;
  symbol: string;
} {
  const rulingPlanets: Record<string, string> = {
    Aries: 'Mars',
    Taurus: 'Venus',
    Gemini: 'Mercury',
    Cancer: 'Moon',
    Leo: 'Sun',
    Virgo: 'Mercury',
    Libra: 'Venus',
    Scorpio: 'Pluto/Mars',
    Sagittarius: 'Jupiter',
    Capricorn: 'Saturn',
    Aquarius: 'Uranus/Saturn',
    Pisces: 'Neptune/Jupiter'
  };

  const symbols: Record<string, string> = {
    Aries: '\u2648',       // Ram
    Taurus: '\u2649',      // Bull
    Gemini: '\u264A',      // Twins
    Cancer: '\u264B',      // Crab
    Leo: '\u264C',         // Lion
    Virgo: '\u264D',       // Virgin
    Libra: '\u264E',       // Scales
    Scorpio: '\u264F',     // Scorpion
    Sagittarius: '\u2650', // Archer
    Capricorn: '\u2651',   // Goat
    Aquarius: '\u2652',    // Water Bearer
    Pisces: '\u2653'       // Fish
  };

  return {
    german: ZODIAC_GERMAN[sign] || sign,
    element: ZODIAC_ELEMENTS[sign] || 'Unknown',
    modality: ZODIAC_MODALITIES[sign] || 'Unknown',
    ruling_planet: rulingPlanets[sign] || 'Unknown',
    symbol: symbols[sign] || ''
  };
}

/**
 * Check if Western astrology data is complete
 * (has more than just sun sign)
 */
export function hasCompleteWesternData(chart: WesternChart): boolean {
  return !!(chart.sunSign && chart.moonSign && chart.risingSign);
}

/**
 * Placeholder for future Swiss Ephemeris integration
 * This function will be implemented when the ephemeris library is added
 */
export async function calculatePlanetaryPositions(input: WesternInput): Promise<WesternChart> {
  // TODO: Implement using Swiss Ephemeris
  // For now, return basic sun sign calculation
  console.warn('Western Astrology: Swiss Ephemeris not yet integrated. Returning sun sign only.');
  return calculateWesternChart(input);
}

export default {
  calculateWesternChart,
  getZodiacInfo,
  hasCompleteWesternData,
  calculatePlanetaryPositions,
  ZODIAC_GERMAN,
  ZODIAC_ELEMENTS,
  ZODIAC_MODALITIES
};
