import { useState, useCallback } from 'react';
import { getAlternativeRecommendations } from './api';

/**
 * 대안 제품 추천 조회 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   data: import('./model').RecommendationResult[] | null,
 *   fetchAlternatives: (request: import('./model').RecommendationRequest) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useAlternativeRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchAlternatives = useCallback(async (request) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const alternatives = await getAlternativeRecommendations(request);
      setData(alternatives);
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
    fetchAlternatives,
    reset,
  };
}
