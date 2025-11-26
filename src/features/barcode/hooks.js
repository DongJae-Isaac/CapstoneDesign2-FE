import { useState, useCallback } from 'react';
import { scanBarcodeFromImage, getFoodAnalysis, calculateGrade } from './api';

/**
 * 바코드 스캔 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   result: import('./model').BarcodeScanResult | null,
 *   scanBarcode: (file: File) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useBarcodeScan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const scanBarcode = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await scanBarcodeFromImage(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    scanBarcode,
    reset,
  };
}

/**
 * 식품 분석 조회 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   data: import('./model').FoodAnalysisResult | null,
 *   fetchAnalysis: (barcode: string) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useFoodAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchAnalysis = useCallback(async (barcode) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const analysisData = await getFoodAnalysis(barcode);
      setData(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    fetchAnalysis,
    reset,
  };
}

/**
 * 등급 계산 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   result: import('./model').GradeResult | null,
 *   calculate: (userId: number, request: import('./model').GradeCalculationRequest, saveHistory?: boolean) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useGradeCalculation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const calculate = useCallback(async (userId, request, saveHistory = true) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const gradeResult = await calculateGrade(userId, request, saveHistory);
      setResult(gradeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    calculate,
    reset,
  };
}
