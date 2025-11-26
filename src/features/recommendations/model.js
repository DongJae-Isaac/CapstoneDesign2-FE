/**
 * 대안 제품 추천 요청 DTO
 * @typedef {Object} RecommendationRequest
 * @property {string} report_no - 보고 번호 (품목제조보고번호)
 * @property {number} total_score - 현재 제품의 총점
 * @property {UserWeights} weights - 사용자 가중치
 */

/**
 * 사용자 가중치
 * @typedef {Object} UserWeights
 * @property {number} nutrition_weight - 영양 가중치
 * @property {number} packaging_weight - 포장재 가중치
 * @property {number} additives_weight - 첨가물 가중치
 */

/**
 * 대안 제품 추천 결과 DTO
 * @typedef {Object} RecommendationResult
 * @property {string} barcode - 바코드
 * @property {string} name - 제품명
 * @property {string|null} image_url - 제품 이미지 URL
 * @property {string|null} brand - 브랜드
 * @property {number} total_score - 총점
 * @property {'A'|'B'|'C'|'D'|'E'} grade - 등급
 * @property {number} nutrition_score - 영양 점수
 * @property {number} packaging_score - 포장재 점수
 * @property {number} additives_score - 첨가물 점수
 */

export {};
