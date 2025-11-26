import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // 로그인되어 있으면 UserMainPage로 리다이렉트
      navigate("/usermain", { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 로고 */}
        <h1 className={styles.logo}>EcoNutri</h1>

        {/* 아이콘 (저울 + 밀 + 사과) */}
        <div className={styles.iconContainer}>
          <svg className={styles.balanceIcon} viewBox="0 0 200 150" fill="none">
            {/* 저울 삼각형 받침대 */}
            <path d="M100 120 L80 140 L120 140 Z" fill="#2c2c2c" />

            {/* 저울대 */}
            <line
              x1="50"
              y1="80"
              x2="150"
              y2="80"
              stroke="#2c2c2c"
              strokeWidth="4"
            />
            <line
              x1="100"
              y1="80"
              x2="100"
              y2="120"
              stroke="#2c2c2c"
              strokeWidth="4"
            />

            {/* 왼쪽 접시 (밀) */}
            <ellipse cx="60" cy="80" rx="30" ry="8" fill="#2c2c2c" />
            <line
              x1="60"
              y1="72"
              x2="60"
              y2="80"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* 밀 아이콘 */}
            <g transform="translate(45, 40)">
              <path d="M15 0 Q17 5 15 10 Q13 5 15 0" fill="#2c2c2c" />
              <path d="M20 2 Q22 7 20 12 Q18 7 20 2" fill="#2c2c2c" />
              <path d="M25 0 Q27 5 25 10 Q23 5 25 0" fill="#2c2c2c" />
              <line
                x1="20"
                y1="12"
                x2="20"
                y2="25"
                stroke="#2c2c2c"
                strokeWidth="2"
              />
            </g>

            {/* 오른쪽 접시 (사과) */}
            <ellipse cx="140" cy="80" rx="30" ry="8" fill="#2c2c2c" />
            <line
              x1="140"
              y1="72"
              x2="140"
              y2="80"
              stroke="#2c2c2c"
              strokeWidth="2"
            />

            {/* 사과 아이콘 */}
            <g transform="translate(125, 45)">
              <circle cx="15" cy="15" r="12" fill="#2c2c2c" />
              <path
                d="M15 3 Q12 0 10 2"
                stroke="#2c2c2c"
                strokeWidth="2"
                fill="none"
              />
              <ellipse
                cx="18"
                cy="12"
                rx="3"
                ry="4"
                fill="#fff"
                opacity="0.3"
              />
            </g>
          </svg>
        </div>

        {/* 캐치프레이즈 */}
        <p className={styles.catchphrase}>
          환경과 건강을
          <br />
          생각하는 현명한 선택
        </p>

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <button onClick={handleLogin} className={styles.primaryButton}>
            로그인
          </button>
          <button onClick={handleSignup} className={styles.secondaryButton}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
