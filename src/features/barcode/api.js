/**
 * @typedef {import('./model').BarcodeScanResult} BarcodeScanResult
 * @typedef {import('./model').FoodAnalysisResult} FoodAnalysisResult
 * @typedef {import('./model').GradeCalculationRequest} GradeCalculationRequest
 * @typedef {import('./model').GradeResult} GradeResult
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

/**
 * 바코드 이미지 스캔 API
 * @param {File} imageFile - 스캔할 이미지 파일
 * @returns {Promise<BarcodeScanResult>} 바코드 스캔 결과
 * @throws {Error} API 요청 실패 시
 */
export async function scanBarcodeFromImage(imageFile) {
  if (!imageFile) {
    throw new Error('이미지 파일이 필요합니다.');
  }

  // FormData 생성
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/foods/scan-barcode-image`, {
      method: 'POST',
      body: formData,
      // Content-Type은 자동으로 설정됨 (multipart/form-data)
    });

    if (!response.ok) {
      // 에러 응답 처리
      const errorData = await response.json().catch(() => null);

      if (response.status === 422) {
        // Validation Error
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      throw new Error(`바코드 스캔 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('바코드 스캔 중 오류가 발생했습니다.');
  }
}

/**
 * 바코드로 식품 분석 정보 조회 API
 * @param {string} barcode - 바코드 번호
 * @returns {Promise<FoodAnalysisResult>} 식품 분석 결과
 * @throws {Error} API 요청 실패 시
 */
export async function getFoodAnalysis(barcode) {
  if (!barcode) {
    throw new Error('바코드 번호가 필요합니다.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/foods/analysis/${barcode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // 에러 응답 처리
      const errorData = await response.json().catch(() => null);

      if (response.status === 404) {
        throw new Error('제품 정보를 찾을 수 없습니다.');
      }

      if (response.status === 422) {
        // Validation Error
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      throw new Error(`식품 분석 조회 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('식품 분석 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 최종 등급 계산 API
 * @param {number} userId - 사용자 ID
 * @param {GradeCalculationRequest} request - 등급 계산 요청 데이터
 * @param {boolean} saveHistory - 히스토리 저장 여부 (기본값: true)
 * @returns {Promise<GradeResult>} 등급 계산 결과
 * @throws {Error} API 요청 실패 시
 */
export async function calculateGrade(userId, request, saveHistory = true) {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  if (!request.scores || !request.priorities) {
    throw new Error('점수 데이터와 가중치가 필요합니다.');
  }

  try {
    const params = new URLSearchParams({
      user_id: userId.toString(),
      save_history: saveHistory.toString(),
    });

    console.log('등급 계산 요청 데이터:', request);

    const response = await fetch(
      `${API_BASE_URL}/foods/calculate-grade?${params}`,
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

      console.error('등급 계산 에러 응답:', errorData);
      console.error('에러 상세:', JSON.stringify(errorData, null, 2));

      if (response.status === 422) {
        // 모든 에러 메시지 출력
        if (errorData?.detail && Array.isArray(errorData.detail)) {
          console.error('Validation 에러 목록:', errorData.detail);
          const errorMessages = errorData.detail.map(err =>
            `${err.loc?.join('.')} - ${err.msg}`
          ).join('\n');
          throw new Error(`입력 데이터 오류:\n${errorMessages}`);
        }
        const errorMessage = errorData?.detail?.[0]?.msg || '유효하지 않은 요청입니다.';
        throw new Error(errorMessage);
      }

      if (response.status === 500) {
        const errorMessage = errorData?.detail || JSON.stringify(errorData) || '서버 내부 오류가 발생했습니다.';
        throw new Error(`서버 오류: ${errorMessage}`);
      }

      throw new Error(`등급 계산 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('등급 계산 중 오류가 발생했습니다.');
  }
}
