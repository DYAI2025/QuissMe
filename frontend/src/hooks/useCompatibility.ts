/**
 * useCompatibility Hook for QuissMe
 *
 * A React hook that provides easy integration of the Compatibility Calculator
 * with the existing QuissMe application.
 *
 * Usage:
 * ```tsx
 * import { useCompatibility } from '../hooks/useCompatibility';
 *
 * function MyComponent({ userBazi, partnerBazi }) {
 *   const { result, isLoading, error, calculate } = useCompatibility();
 *
 *   useEffect(() => {
 *     if (userBazi && partnerBazi) {
 *       calculate(userBazi, partnerBazi);
 *     }
 *   }, [userBazi, partnerBazi]);
 *
 *   if (isLoading) return <div>Berechne...</div>;
 *   if (result) return <CompatibilityDisplay result={result} />;
 * }
 * ```
 */

import { useState, useCallback } from 'react';
import type { LegacyBaziResult } from '../lib/baziAdapter';
import { calculateCompatibility, type CompatibilityResult, type BirthChart, type WesternChart } from '../lib/compatibilityCalculator';
import { calculateWesternChart, type WesternInput } from '../lib/westernAstrology';

interface UseCompatibilityReturn {
  result: CompatibilityResult | null;
  isLoading: boolean;
  error: string | null;
  calculate: (
    userBazi: LegacyBaziResult,
    partnerBazi: LegacyBaziResult,
    userBirthData?: WesternInput,
    partnerBirthData?: WesternInput
  ) => void;
  reset: () => void;
}

/**
 * Hook for calculating and managing compatibility results
 */
export function useCompatibility(): UseCompatibilityReturn {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((
    userBazi: LegacyBaziResult,
    partnerBazi: LegacyBaziResult,
    userBirthData?: WesternInput,
    partnerBirthData?: WesternInput
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build birth charts
      const userChart: BirthChart = {
        bazi: userBazi
      };

      const partnerChart: BirthChart = {
        bazi: partnerBazi
      };

      // Add western astrology if birth data is available
      if (userBirthData) {
        userChart.western = calculateWesternChart(userBirthData);
      }

      if (partnerBirthData) {
        partnerChart.western = calculateWesternChart(partnerBirthData);
      }

      // Calculate compatibility
      const compatResult = calculateCompatibility(userChart, partnerChart);
      setResult(compatResult);
    } catch (err) {
      console.error('Compatibility calculation error:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler bei der Berechnung');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    result,
    isLoading,
    error,
    calculate,
    reset
  };
}

/**
 * Simple function to calculate compatibility directly
 * (without React hook, for use in non-React contexts)
 */
export function getCompatibility(
  userBazi: LegacyBaziResult,
  partnerBazi: LegacyBaziResult,
  userWestern?: WesternChart,
  partnerWestern?: WesternChart
): CompatibilityResult {
  const userChart: BirthChart = {
    bazi: userBazi,
    western: userWestern
  };

  const partnerChart: BirthChart = {
    bazi: partnerBazi,
    western: partnerWestern
  };

  return calculateCompatibility(userChart, partnerChart);
}

/**
 * Get a quick compatibility summary (for dashboard display)
 */
export function getQuickCompatibility(
  userBazi: LegacyBaziResult,
  partnerBazi: LegacyBaziResult
): {
  score: number;
  label: string;
  label_de: string;
  elementRelation: string;
  yinYangBalance: string;
} {
  const result = getCompatibility(userBazi, partnerBazi);

  // Find element and yin/yang aspects
  const elementAspect = result.aspects.find(a => a.name === 'Element Compatibility');
  const yinYangAspect = result.aspects.find(a => a.name === 'Yin/Yang Balance');

  return {
    score: result.overallScore,
    label: result.overallLabel,
    label_de: result.overallLabel_de,
    elementRelation: elementAspect?.description_de || '',
    yinYangBalance: yinYangAspect?.description_de || ''
  };
}

export default useCompatibility;
