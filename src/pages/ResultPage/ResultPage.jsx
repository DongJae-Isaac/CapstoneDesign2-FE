import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResultPage.module.css';

const ResultPage = () => {
  const navigate = useNavigate();

  // 목업 데이터
  const mockData = {
    product: {
      name: "샘플 식품",
      manufacturer: "ABC 식품",
      barcode: "8801234567890"
    },
    grade: {
      overall: "A",
      score: 82,
      message: "매우 우수한 선택입니다!"
    },
    detailScores: [
      {
        icon: "🌱",
        label: "포장재 지속가능성",
        score: 85,
        description: "재활용 가능한 포장재 사용",
        color: "green"
      },
      {
        icon: "🏭",
        label: "탄소발자국",
        score: 78,
        description: "탄소 배출 줄이기 필요",
        color: "red"
      },
      {
        icon: "💪",
        label: "영양 균형도",
        score: 88,
        description: "균형잡힌 영양 구성",
        color: "blue"
      }
    ],
    calculation: {
      formula: "(85 × 0.186) + (78 × 0.833) + (88 × 0.250)",
      result: 82
    }
  };

  const handleRescan = () => {
    navigate('/');
  };

  const handleGoToWeight = () => {
    navigate('/ecoweight');
  };

  return (
    <div className={styles.container}>

      {/* Main Content */}
      <main className={styles.main}>
        <h2 className={styles.pageTitle}>결과페이지</h2>
        
        {/* 제품 정보 카드 */}
        <div className={styles.card}>
          <div className={styles.productInfo}>
            <div className={styles.productIcon}>
              <div className={styles.iconInner}></div>
            </div>
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{mockData.product.name}</h3>
              <p className={styles.productText}>제조사: {mockData.product.manufacturer}</p>
              <p className={styles.productText}>바코드: {mockData.product.barcode}</p>
            </div>
          </div>
        </div>

        {/* 종합 등급 카드 */}
        <div className={`${styles.card} ${styles.gradeCard} ${styles[`grade${mockData.grade.overall}`]}`}>
          <p className={styles.gradeLabel}>종합 지속가능성 등급</p>
          <div className={styles.gradeLetter}>{mockData.grade.overall}</div>
          <div className={styles.gradeScore}>{mockData.grade.score}점</div>
          <p className={styles.gradeMessage}>{mockData.grade.message}</p>
        </div>

        {/* 세부 평가 카드 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>세부 평가</h3>
          
          {mockData.detailScores.map((item, index) => (
            <div key={index} className={styles.scoreItem}>
              <div className={styles.scoreHeader}>
                <div className={styles.scoreLabel}>
                  <span className={styles.scoreIcon}>{item.icon}</span>
                  <span className={styles.scoreName}>{item.label}</span>
                </div>
                <span className={`${styles.scoreValue} ${styles[item.color]}`}>
                  {item.score}점
                </span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${styles[item.color]}`}
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
              <p className={styles.scoreDescription}>{item.description}</p>
            </div>
          ))}
        </div>

        {/* 점수 산출 과정 카드 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>점수 산출 과정</h3>
          <div className={styles.calculation}>
            <p className={styles.calculationFormula}>
              종합점수 = {mockData.calculation.formula}
            </p>
            <p className={styles.calculationResult}>
              = {mockData.calculation.result}점
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.buttonGroup}>
          <button onClick={handleRescan} className={styles.secondaryButton}>
            다시스캔
          </button>
          <button onClick={handleGoToWeight} className={styles.primaryButton}>
            가중치 조회
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;