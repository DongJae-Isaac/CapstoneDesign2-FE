import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "아이디를 입력해주세요";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // TODO: 백엔드 API 연동 시 실제 로그인 로직 추가
    // 현재는 임시로 localStorage에 토큰 저장
    console.log("로그인 시도:", formData);

    // 임시 토큰 저장 (실제로는 서버에서 받은 토큰 사용)
    localStorage.setItem("authToken", "temporary-token-" + Date.now());
    localStorage.setItem("username", formData.username);

    // 메인 페이지로 이동
    alert("로그인 성공!");
    navigate("/");
  };

  const handleForgotPassword = () => {
    // TODO: 비밀번호 찾기 페이지로 이동
    alert("비밀번호 찾기 기능은 준비중입니다.");
  };

  const handleGoToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        {/* 로고 영역 */}
        <div className={styles.logoSection}>
          <h1 className={styles.title}>EcoNutri</h1>
          <p className={styles.subtitle}>환경과 건강을 생각하는 현명한 선택</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.username ? styles.inputError : ""
              }`}
              placeholder="아이디를 입력하세요"
            />
            {errors.username && (
              <span className={styles.errorMessage}>{errors.username}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.password ? styles.inputError : ""
              }`}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button type="submit" className={styles.loginButton}>
            로그인
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className={styles.forgotPasswordButton}
          >
            비밀번호 찾기
          </button>
        </form>

        {/* 회원가입 섹션 */}
        <div className={styles.signupSection}>
          <p className={styles.signupText}>계정이 없으신가요?</p>
          <button onClick={handleGoToSignup} className={styles.signupButton}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
