// BaZiEngine.ts - Couple Constellation Calculator

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  location: string;
}

export interface BaZiChart {
  dayMaster: string;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  yin_yang: 'Yin' | 'Yang';
  stems: string[];
  branches: string[];
}

export interface CompatibilityResult {
  compatibilityScore: number; // 0-100
  elementHarmony: number;
  dayMasterSynergy: number;
  strengthGap: number;
  yearlyPrediction: string;
  recommendation: string;
  elementAnalysis: {
    p1Element: string;
    p2Element: string;
    interaction: string;
  };
}

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ELEMENT_INTERACTIONS: Record<string, Record<string, number>> = {
  'Wood': { 'Fire': 90, 'Water': 40, 'Wood': 60, 'Earth': 50, 'Metal': 30 },
  'Fire': { 'Earth': 85, 'Wood': 90, 'Fire': 70, 'Metal': 40, 'Water': 20 },
  'Earth': { 'Metal': 80, 'Fire': 85, 'Earth': 65, 'Water': 35, 'Wood': 50 },
  'Metal': { 'Water': 75, 'Earth': 80, 'Metal': 60, 'Wood': 30, 'Fire': 40 },
  'Water': { 'Wood': 85, 'Metal': 75, 'Water': 55, 'Fire': 20, 'Earth': 35 }
};

export class BaZiEngine {
  static calculateChart(birthData: BirthData): BaZiChart {
    const elementIndex = (birthData.year + birthData.month + birthData.day) % 5;
    const element = ELEMENTS[elementIndex] as any;
    const yinYang = (birthData.year % 2 === 0) ? 'Yang' : 'Yin';

    return {
      dayMaster: `${yinYang} ${element}`,
      element,
      yin_yang: yinYang,
      stems: this.calculateStems(birthData),
      branches: this.calculateBranches(birthData)
    };
  }

  static calculateCoupleCompatibility(
    p1: BirthData,
    p2: BirthData
  ): CompatibilityResult {
    const chart1 = this.calculateChart(p1);
    const chart2 = this.calculateChart(p2);

    const elementHarmony = ELEMENT_INTERACTIONS[chart1.element][chart2.element] || 50;
    const dayMasterSynergy = this.calculateDayMasterSynergy(chart1, chart2);
    const strengthGap = Math.abs(
      (p1.year % 12) - (p2.year % 12)
    ) * 5;

    const compatibilityScore = Math.round(
      (elementHarmony * 0.4 + dayMasterSynergy * 0.4 + (100 - strengthGap) * 0.2)
    );

    return {
      compatibilityScore,
      elementHarmony,
      dayMasterSynergy,
      strengthGap: Math.min(strengthGap, 100),
      yearlyPrediction: this.generateYearlyPrediction(chart1, chart2),
      recommendation: this.generateRecommendation(compatibilityScore),
      elementAnalysis: {
        p1Element: chart1.element,
        p2Element: chart2.element,
        interaction: this.describeInteraction(chart1.element, chart2.element)
      }
    };
  }

  private static calculateStems(birthData: BirthData): string[] {
    return [
      ['甲', '乙'][birthData.year % 2],
      ['丙', '丁'][birthData.month % 2],
      ['戊', '己'][birthData.day % 2],
      ['庚', '辛'][birthData.hour % 2]
    ];
  }

  private static calculateBranches(birthData: BirthData): string[] {
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return [
      branches[birthData.year % 12],
      branches[birthData.month % 12],
      branches[birthData.day % 12],
      branches[birthData.hour % 12]
    ];
  }

  private static calculateDayMasterSynergy(chart1: BaZiChart, chart2: BaZiChart): number {
    if (chart1.element === chart2.element) return 70;
    if (ELEMENT_INTERACTIONS[chart1.element][chart2.element] > 70) return 80;
    return 50;
  }

  private static generateYearlyPrediction(chart1: BaZiChart, chart2: BaZiChart): string {
    const predictions = [
      "A year of deepening connection and mutual growth.",
      "Expect challenges that strengthen your bond.",
      "Harmony flows naturally this year.",
      "Time for new adventures together.",
      "Focus on communication and understanding."
    ];
    return predictions[(chart1.element.length + chart2.element.length) % predictions.length];
  }

  private static generateRecommendation(score: number): string {
    if (score >= 80) return "🔥 Highly compatible - embrace your natural synergy!";
    if (score >= 60) return "💫 Good compatibility - invest in understanding each other.";
    if (score >= 40) return "🌊 Moderate compatibility - challenges lead to growth.";
    return "⚡ Different energies - celebrate your unique dynamic!";
  }

  private static describeInteraction(e1: string, e2: string): string {
    const interactions: Record<string, string> = {
      'Wood-Fire': '🌱→🔥 Wood fuels Fire - creative and passionate',
      'Fire-Earth': '🔥→🏔️ Fire creates Earth - grounded passion',
      'Earth-Metal': '🏔️→⚔️ Earth contains Metal - stable and clear',
      'Metal-Water': '⚔️→🌊 Metal conducts Water - flowing clarity',
      'Water-Wood': '🌊→🌱 Water nourishes Wood - growth and renewal'
    };
    return interactions[`${e1}-${e2}`] || `${e1} and ${e2} - unique dynamic`;
  }
}
