import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

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

    // 아이디 입력 시 중복확인 상태 초기화
    if (name === "username") {
      setIsUsernameAvailable(null);
    }
  };

  const validateUsername = (username) => {
    if (!username.trim()) {
      return "아이디를 입력해주세요";
    }
    if (username.length < 4) {
      return "아이디는 4자 이상이어야 합니다";
    }
    if (username.length > 20) {
      return "아이디는 20자 이하여야 합니다";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "아이디는 영문, 숫자, 밑줄(_)만 사용 가능합니다";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "비밀번호를 입력해주세요";
    }
    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다";
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return "비밀번호는 영문과 숫자를 포함해야 합니다";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return null; // 이메일은 선택사항
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "올바른 이메일 형식이 아닙니다";
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    // 아이디 검증
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    } else if (isUsernameAvailable === null) {
      newErrors.username = "아이디 중복확인을 해주세요";
    } else if (isUsernameAvailable === false) {
      newErrors.username = "이미 사용중인 아이디입니다";
    }

    // 비밀번호 검증
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // 비밀번호 확인 검증
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    }

    // 이메일 검증 (선택사항)
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckUsername = async () => {
    // 아이디 유효성 검사
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setErrors((prev) => ({ ...prev, username: usernameError }));
      return;
    }

    setIsCheckingUsername(true);

    // TODO: 백엔드 API 연동 시 실제 중복확인 로직 추가
    // 현재는 임시로 1초 후 랜덤 결과 반환
    setTimeout(() => {
      // 임시: 'admin', 'test' 아이디는 사용 불가로 처리
      const unavailableUsernames = ["admin", "test", "econutri"];
      const isAvailable = !unavailableUsernames.includes(
        formData.username.toLowerCase()
      );

      setIsUsernameAvailable(isAvailable);
      setIsCheckingUsername(false);

      if (!isAvailable) {
        setErrors((prev) => ({
          ...prev,
          username: "이미 사용중인 아이디입니다",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.username;
          return newErrors;
        });
      }
    }, 1000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // TODO: 백엔드 API 연동 시 실제 회원가입 로직 추가
    console.log("회원가입 시도:", {
      username: formData.username,
      password: formData.password,
      email: formData.email,
    });

    // 임시: 회원가입 성공 처리
    alert("회원가입이 완료되었습니다!");
    navigate("/login");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
        {/* 헤더 */}
        <div className={styles.header}>
          <button onClick={handleGoToLogin} className={styles.backButton}>
            ← 돌아가기
          </button>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            EcoNutri와 함께 건강한 선택을 시작하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSignup} className={styles.form}>
          {/* 아이디 */}
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              아이디 <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWithButton}>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.username ? styles.inputError : ""
                } ${isUsernameAvailable === true ? styles.inputSuccess : ""}`}
                placeholder="영문, 숫자, 밑줄 4-20자"
              />
              <button
                type="button"
                onClick={handleCheckUsername}
                disabled={isCheckingUsername || !formData.username.trim()}
                className={styles.checkButton}
              >
                {isCheckingUsername ? "확인중..." : "중복확인"}
              </button>
            </div>
            {errors.username && (
              <span className={styles.errorMessage}>{errors.username}</span>
            )}
            {isUsernameAvailable === true && (
              <span className={styles.successMessage}>
                ✓ 사용 가능한 아이디입니다
              </span>
            )}
          </div>

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호 <span className={styles.required}>*</span>
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
              placeholder="영문, 숫자 포함 8자 이상"
            />
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.inputGroup}>
            <label htmlFor="passwordConfirm" className={styles.label}>
              비밀번호 확인 <span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.passwordConfirm ? styles.inputError : ""
              }`}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.passwordConfirm && (
              <span className={styles.errorMessage}>
                {errors.passwordConfirm}
              </span>
            )}
          </div>

          {/* 이메일 (선택) */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일 <span className={styles.optional}>(선택)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button type="submit" className={styles.signupButton}>
            회원가입
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className={styles.loginSection}>
          <p className={styles.loginText}>이미 계정이 있으신가요?</p>
          <button
            type="button"
            onClick={handleGoToLogin}
            className={styles.loginLink}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
