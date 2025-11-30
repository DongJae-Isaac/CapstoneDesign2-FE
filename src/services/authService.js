import apiClient from "./api";

/**
 * 인증 관련 API 서비스
 */
const authService = {
  /**
   * 로그인
   * @param {Object} credentials - { username, password }
   * @returns {Promise} 로그인 응답 (토큰 포함)
   */
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * 회원가입
   * @param {Object} userData - { username, password, email }
   * @returns {Promise} 회원가입 응답
   */
  signup: async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  /**
   * 아이디 중복 확인
   * @param {string} username - 확인할 아이디
   * @returns {Promise} 중복 확인 응답 { available: boolean }
   */
  checkUsername: async (username) => {
    const response = await apiClient.get(`/auth/check-username`, {
      params: { username },
    });
    return response.data;
  },

  /**
   * 로그아웃
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      // 로컬 스토리지 클리어
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
    }
  },

  /**
   * 현재 사용자 정보 조회
   * @returns {Promise} 사용자 정보
   */
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

export default authService;
