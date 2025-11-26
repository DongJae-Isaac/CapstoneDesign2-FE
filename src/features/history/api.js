/**
 * @typedef {import('./model').ScanHistoryItem} ScanHistoryItem
 * @typedef {import('./model').ScanHistoryDetail} ScanHistoryDetail
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

/**
 * 내 스캔 기록 목록 조회 API
 * @param {number} userId - 사용자 ID
 * @param {number} skip - 건너뛸 개수 (기본값: 0)
 * @param {number} limit - 조회할 개수 (기본값: 20)
 * @returns {Promise<ScanHistoryItem[]>} 스캔 기록 목록
 * @throws {Error} API 요청 실패 시
 */
export async function getMyScanHistory(userId, skip = 0, limit = 20) {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  try {
    const params = new URLSearchParams({
      user_id: userId.toString(),
      skip: skip.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/history/me?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 422) {
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      throw new Error(`스캔 기록 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('스캔 기록 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 특정 스캔 기록 상세 조회 API
 * @param {number} scanId - 스캔 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<ScanHistoryDetail>} 스캔 기록 상세
 * @throws {Error} API 요청 실패 시
 */
export async function getScanHistoryDetail(scanId, userId) {
  if (!scanId) {
    throw new Error('스캔 ID가 필요합니다.');
  }

  if (!userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  try {
    const params = new URLSearchParams({
      user_id: userId.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/history/${scanId}?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 404) {
        throw new Error('스캔 기록을 찾을 수 없습니다.');
      }

      if (response.status === 403) {
        throw new Error('접근 권한이 없습니다.');
      }

      if (response.status === 422) {
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      throw new Error(`스캔 기록 상세 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('스캔 기록 상세 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 스캔 기록 삭제 API
 * @param {number} scanId - 스캔 ID
 * @param {number} userId - 사용자 ID
 * @returns {Promise<void>}
 * @throws {Error} API 요청 실패 시
 */
export async function deleteScanHistory(scanId, userId) {
  if (!scanId) {
    throw new Error('스캔 ID가 필요합니다.');
  }

  if (!userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  try {
    const params = new URLSearchParams({
      user_id: userId.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/history/${scanId}?${params}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 404) {
        throw new Error('스캔 기록을 찾을 수 없습니다.');
      }

      if (response.status === 403) {
        throw new Error('접근 권한이 없습니다.');
      }

      if (response.status === 422) {
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      throw new Error(`스캔 기록 삭제 실패: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('스캔 기록 삭제 중 오류가 발생했습니다.');
  }
}
