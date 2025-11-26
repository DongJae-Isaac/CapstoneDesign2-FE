/**
 * @typedef {Object} UserAuthRequest
 * @property {string} login_id - 로그인 ID
 * @property {string} password - 비밀번호
 */

/**
 * @typedef {Object} AuthResponse
 * @property {number} user_id - 사용자 ID
 * @property {string} login_id - 로그인 ID
 * @property {boolean} success - 성공 여부
 * @property {string} [message] - 메시지 (선택)
 */

export const AUTH_RESPONSE_SCHEMA = {};
