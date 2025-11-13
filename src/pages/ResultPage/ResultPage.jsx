import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ResultPage.module.css";
import { useData } from "../../contexts/DataContext";

const ResultPage = () => {
  const navigate = useNavigate();
  const { weights, resultData } = useData();

  // 가중치를 이용한 종합 점수 계산
  const calculatedData = useMemo(() => {
    // 세부 점수 (순서: 포장재, 첨가물, 영양)
    const packagingScore = resultData.detailScores[0].score; // 포장재
    const additivesScore = resultData.detailScores[1].score; // 첨가물
    const nutritionScore = resultData.detailScores[2].score; // 영양

    // 가중치를 0~1 범위로 변환 (퍼센트 → 소수)
    const packagingWeight = weights.packaging / 100;
    const additivesWeight = weights.additives / 100;
    const nutritionWeight = weights.nutrition / 100;

    // 종합 점수 계산
    const totalScore = Math.round(
      packagingScore * packagingWeight +
      additivesScore * additivesWeight +
      nutritionScore * nutritionWeight
    );

    // 등급 결정 (A: 80~100, B: 60~79, C: 0~59)
    let grade = "C";
    let message = "개선이 필요한 제품입니다.";
    
    if (totalScore >= 80) {
      grade = "A";
      message = "매우 우수한 선택입니다!";
    } else if (totalScore >= 60) {
      grade = "B";
      message = "좋은 선택입니다!";
    }

    // 계산 공식 문자열 생성
    const formula = `(${packagingScore} × ${packagingWeight.toFixed(3)}) + (${additivesScore} × ${additivesWeight.toFixed(3)}) + (${nutritionScore} × ${nutritionWeight.toFixed(3)})`;

    return {
      totalScore,
      grade,
      message,
      formula,
    };
  }, [weights, resultData.detailScores]);

  const handleRescan = () => {
    navigate("/");
  };

  const handleGoToWeight = () => {
    navigate("/ecoweight");
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2 className={styles.pageTitle}>결과페이지</h2>

        {/* 제품 정보 카드 */}
        <div className={styles.card}>
          <div className={styles.productInfo}>
            <div className={styles.productIcon}>
              <div className={styles.iconInner}></div>
            </div>
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{resultData.product.name}</h3>
              <p className={styles.productText}>
                제조사: {resultData.product.manufacturer}
              </p>
              <p className={styles.productText}>
                바코드: {resultData.product.barcode}
              </p>
            </div>
          </div>
        </div>

        {/* 대체 추천 식품 카드 */}
        <div className={styles.card}>
          <div className={styles.alternativesHeader}>
            <h3 className={styles.cardTitle}>더 나은 대체 식품</h3>
            <span className={styles.alternativesCount}>
              {resultData.alternatives.length}개
            </span>
          </div>
          <div className={styles.alternativesScroll}>
            {resultData.alternatives.map((item) => (
              <div key={item.id} className={styles.alternativeItem}>
                <div className={styles.alternativeIcon}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={styles.alternativeImage}
                    />
                  ) : (
                    <div className={styles.alternativeIconPlaceholder}>🍱</div>
                  )}
                </div>
                <div className={styles.alternativeInfo}>
                  <h4 className={styles.alternativeName}>{item.name}</h4>
                  <p className={styles.alternativeManufacturer}>
                    {item.manufacturer}
                  </p>
                  <div className={styles.alternativeGrade}>
                    <span
                      className={`${styles.alternativeBadge} ${
                        styles[`badge${item.grade}`]
                      }`}
                    >
                      {item.grade}
                    </span>
                    <span className={styles.alternativeScore}>
                      {item.score}점
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 종합 등급 카드 - 계산된 값 사용 */}
        <div
          className={`${styles.card} ${styles.gradeCard} ${
            styles[`grade${calculatedData.grade}`]
          }`}
        >
          <p className={styles.gradeLabel}>종합 지속가능성 등급</p>
          <div className={styles.gradeLetter}>{calculatedData.grade}</div>
          <div className={styles.gradeScore}>{calculatedData.totalScore}점</div>
          <p className={styles.gradeMessage}>{calculatedData.message}</p>
        </div>

        {/* 세부 평가 카드 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>세부 평가</h3>

          {resultData.detailScores.map((item, index) => (
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

        {/* 점수 산출 과정 카드 - 계산된 값 사용 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>점수 산출 과정</h3>
          <div className={styles.calculation}>
            <div className={styles.weightInfo}>
              <p className={styles.weightItem}>
                포장재 가중치: {weights.packaging.toFixed(1)}%
              </p>
              <p className={styles.weightItem}>
                첨가물 가중치: {weights.additives.toFixed(1)}%
              </p>
              <p className={styles.weightItem}>
                영양 가중치: {weights.nutrition.toFixed(1)}%
              </p>
            </div>
            <p className={styles.calculationFormula}>
              종합점수 = {calculatedData.formula}
            </p>
            <p className={styles.calculationResult}>
              = {calculatedData.totalScore}점
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