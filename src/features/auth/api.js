/**
 * @typedef {import('./model').UserAuthRequest} UserAuthRequest
 * @typedef {import('./model').AuthResponse} AuthResponse
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

/**
 * 회원가입 API
 * @param {UserAuthRequest} request - 회원가입 요청 데이터
 * @returns {Promise<AuthResponse>} 회원가입 응답
 * @throws {Error} API 요청 실패 시
 */
export async function signup(request) {
  if (!request.login_id || !request.password) {
    throw new Error('로그인 ID와 비밀번호가 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 422) {
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      if (response.status === 409) {
        throw new Error('이미 존재하는 사용자입니다.');
      }

      throw new Error(`회원가입 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('회원가입 중 오류가 발생했습니다.');
  }
}

/**
 * 로그인 API
 * @param {UserAuthRequest} request - 로그인 요청 데이터
 * @returns {Promise<AuthResponse>} 로그인 응답
 * @throws {Error} API 요청 실패 시
 */
export async function login(request) {
  if (!request.login_id || !request.password) {
    throw new Error('로그인 ID와 비밀번호가 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 422) {
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      if (response.status === 401) {
        throw new Error('로그인 정보가 올바르지 않습니다.');
      }

      throw new Error(`로그인 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
}
