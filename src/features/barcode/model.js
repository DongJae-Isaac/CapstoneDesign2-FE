/**
 * 바코드 스캔 결과 타입
 * @typedef {Object} BarcodeScanResult
 * @property {string} barcode - 바코드 번호
 * @property {string} type - 타입 (기본값: unknown)
 */

/**
 * 영양 정보 상세
 * @typedef {Object} NutritionDetail
 * @property {number} score - 영양 점수
 * @property {number} sodium_mg - 나트륨 함량 (mg)
 * @property {number} sugar_g - 당 함량 (g)
 * @property {number} sat_fat_g - 포화지방 함량 (g)
 * @property {number} trans_fat_g - 트랜스지방 함량 (g)
 * @property {number|null} serving_ml - 1회 제공량 (ml)
 */

/**
 * 포장 정보 상세
 * @typedef {Object} PackagingDetail
 * @property {number} score - 포장재 점수
 * @property {string} material - 포장재 재질
 * @property {string|null} raw_material - 원재료
 */

/**
 * 첨가물 정보 상세
 * @typedef {Object} AdditivesDetail
 * @property {number} score - 첨가물 점수
 * @property {number} count - 첨가물 개수
 * @property {string} risk_level - 위험 수준 (기본값: Unknown)
 */

/**
 * 식품 분석 결과
 * @typedef {Object} FoodAnalysisResult
 * @property {string} barcode - 바코드 번호
 * @property {string} name - 제품명
 * @property {string|null} report_no - 품목제조보고번호
 * @property {string|null} image_url - 제품 이미지 URL
 * @property {NutritionDetail} nutrition - 영양 정보
 * @property {PackagingDetail} packaging - 포장 정보
 * @property {AdditivesDetail} additives - 첨가물 정보
 */

/**
 * 사용자 가중치
 * @typedef {Object} UserPriorities
 * @property {number} pkg_vs_add - 포장재 vs 첨가물 가중치 (기본값: 1)
 * @property {number} pkg_vs_nut - 포장재 vs 영양 가중치 (기본값: 1)
 * @property {number} add_vs_nut - 첨가물 vs 영양 가중치 (기본값: 1)
 */

/**
 * 등급 계산 요청
 * @typedef {Object} GradeCalculationRequest
 * @property {FoodAnalysisResult} scores - 1단계에서 받은 점수 데이터
 * @property {UserPriorities} priorities - 사용자가 설정한 가중치
 */

/**
 * 계산된 가중치
 * @typedef {Object} UserWeights
 * @property {number} nutrition_weight - 영양 가중치
 * @property {number} packaging_weight - 포장재 가중치
 * @property {number} additives_weight - 첨가물 가중치
 */

/**
 * 등급 결과
 * @typedef {Object} GradeResult
 * @property {number|null} scan_id - 스캔 ID (저장된 경우)
 * @property {number} user_id - 사용자 ID
 * @property {number|null} food_id - 식품 ID
 * @property {string} name - 제품명
 * @property {'A'|'B'|'C'|'D'|'E'} grade - 최종 등급
 * @property {number} total_score - 총점
 * @property {UserWeights} weights - 계산된 가중치
 * @property {number} nutrition_score - 영양 점수
 * @property {number} packaging_score - 포장재 점수
 * @property {number} additives_score - 첨가물 점수
 */

/**
 * API 에러 응답
 * @typedef {Object} ApiError
 * @property {Array<{loc: string[], msg: string, type: string}>} detail - 에러 상세 정보
 */

export {};
