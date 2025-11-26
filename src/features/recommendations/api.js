/**
 * @typedef {import('./model').RecommendationRequest} RecommendationRequest
 * @typedef {import('./model').RecommendationResult} RecommendationResult
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

/**
 * 대안 제품 추천 조회 API
 * @param {RecommendationRequest} request - 추천 요청 데이터
 * @returns {Promise<RecommendationResult[]>} 대안 제품 목록
 * @throws {Error} API 요청 실패 시
 */
export async function getAlternativeRecommendations(request) {
  if (!request || !request.report_no) {
    throw new Error('제품 보고 번호가 필요합니다.');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations/alternatives`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 404) {
        throw new Error('대안 제품을 찾을 수 없습니다.');
      }

      if (response.status === 422) {
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      throw new Error(`대안 제품 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('대안 제품 조회 중 오류가 발생했습니다.');
  }
}
