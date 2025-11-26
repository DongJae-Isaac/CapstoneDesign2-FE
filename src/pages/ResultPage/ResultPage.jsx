import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlternativeRecommendations } from "../../features/recommendations";
import styles from "./ResultPage.module.css";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // BarcodePage에서 전달받은 데이터
  const gradeResult = location.state?.gradeResult;
  const analysisData = location.state?.analysisData;

  // 대안 제품 추천 API 훅
  const { isLoading: isLoadingAlternatives, data: alternativesData, fetchAlternatives } = useAlternativeRecommendations();

  // 점수 반올림 헬퍼 함수 (소수점 2자리)
  const roundScore = (score) => {
    return Math.round(score * 100) / 100;
  };

  // 컴포넌트 마운트 시 대안 제품 조회
  useEffect(() => {
    // 백엔드에서 report_no를 제공하면 대안 제품 조회
    if (analysisData?.report_no && gradeResult) {
      const request = {
        report_no: analysisData.report_no,
        total_score: gradeResult.total_score,
        weights: {
          nutrition_weight: gradeResult.weights.nutrition_weight,
          packaging_weight: gradeResult.weights.packaging_weight,
          additives_weight: gradeResult.weights.additives_weight,
        }
      };
      fetchAlternatives(request);
    }
  }, [analysisData, gradeResult, fetchAlternatives]);

  // Mock 데이터 (API 연결 전 테스트용)
  const mockGradeResult = {
    scan_id: 1,
    user_id: 1,
    food_id: null,
    name: "샘플 식품",
    grade: "A",
    total_score: 85,
    weights: {
      pkg_vs_add: 1,
      pkg_vs_nut: 1,
      add_vs_nut: 1
    },
    nutrition_score: 88,
    packaging_score: 85,
    additives_score: 82
  };

  const mockAnalysisData = {
    barcode: "8801234567890",
    name: "샘플 식품",
    image_url: null,
    category_code: null,
    nutrition: {
      score: 88,
      sodium_mg: 100,
      sugar_g: 5,
      sat_fat_g: 2,
      trans_fat_g: 0,
      serving_ml: 200
    },
    packaging: {
      score: 85,
      material: "PET",
      raw_material: "재활용 플라스틱"
    },
    additives: {
      score: 82,
      count: 3,
      risk_level: "Low"
    }
  };

  // API 데이터가 없으면 Mock 데이터 사용
  const result = gradeResult || mockGradeResult;
  const analysis = analysisData || mockAnalysisData;

  // 등급에 따른 메시지
  const getGradeMessage = (grade) => {
    switch (grade) {
      case 'A':
        return "매우 우수한 선택입니다!";
      case 'B':
        return "좋은 선택입니다!";
      case 'C':
        return "보통 수준입니다.";
      case 'D':
        return "개선이 필요한 제품입니다.";
      case 'E':
        return "더 나은 대안을 고려해보세요.";
      default:
        return "제품을 평가했습니다.";
    }
  };

  // Mock 대안 제품 데이터
  const mockAlternatives = [
    {
      barcode: "8801234567891",
      name: "유기농 식품",
      image_url: null,
      brand: "DEF 식품",
      total_score: 89,
      grade: "A",
      nutrition_score: 90,
      packaging_score: 88,
      additives_score: 89,
    },
    {
      barcode: "8801234567892",
      name: "친환경 식품",
      image_url: null,
      brand: "GHI 식품",
      total_score: 85,
      grade: "A",
      nutrition_score: 85,
      packaging_score: 87,
      additives_score: 83,
    },
  ];

  // API 데이터가 있으면 사용, 없으면 Mock 데이터 사용
  const alternatives = alternativesData || mockAlternatives;

  const handleRescan = () => {
    navigate("/barcode");
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
              {analysis.image_url ? (
                <img src={analysis.image_url} alt={result.name} />
              ) : (
                <div className={styles.iconInner}></div>
              )}
            </div>
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{result.name}</h3>
              <p className={styles.productText}>
                바코드: {analysis.barcode}
              </p>
              {analysis.category_code && (
                <p className={styles.productText}>
                  카테고리: {analysis.category_code}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 대체 추천 식품 카드 */}
        <div className={styles.card}>
          <div className={styles.alternativesHeader}>
            <h3 className={styles.cardTitle}>더 나은 대체 식품</h3>
            <span className={styles.alternativesCount}>
              {alternatives.length}개
            </span>
          </div>
          <div className={styles.alternativesScroll}>
            {alternatives.map((item) => (
              <div key={item.barcode} className={styles.alternativeItem}>
                <div className={styles.alternativeIcon}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
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
                    {item.brand}
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
                      {roundScore(item.total_score)}점
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 종합 등급 카드 */}
        <div
          className={`${styles.card} ${styles.gradeCard} ${
            styles[`grade${result.grade}`]
          }`}
        >
          <p className={styles.gradeLabel}>종합 지속가능성 등급</p>
          <div className={styles.gradeLetter}>{result.grade}</div>
          <div className={styles.gradeScore}>{roundScore(result.total_score)}점</div>
          <p className={styles.gradeMessage}>{getGradeMessage(result.grade)}</p>
        </div>

        {/* 세부 평가 카드 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>세부 평가</h3>

          {/* 포장재 점수 */}
          <div className={styles.scoreItem}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreLabel}>
                <span className={styles.scoreIcon}>🌱</span>
                <span className={styles.scoreName}>포장재 지속가능성</span>
              </div>
              <span className={`${styles.scoreValue} ${styles.green}`}>
                {roundScore(result.packaging_score)}점
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.green}`}
                style={{ width: `${roundScore(result.packaging_score)}%` }}
              ></div>
            </div>
            <p className={styles.scoreDescription}>
              재질: {analysis.packaging.material}
              {analysis.packaging.raw_material && ` (${analysis.packaging.raw_material})`}
            </p>
          </div>

          {/* 첨가물 점수 */}
          <div className={styles.scoreItem}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreLabel}>
                <span className={styles.scoreIcon}>🧪</span>
                <span className={styles.scoreName}>첨가물</span>
              </div>
              <span className={`${styles.scoreValue} ${styles.blue}`}>
                {roundScore(result.additives_score)}점
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.blue}`}
                style={{ width: `${roundScore(result.additives_score)}%` }}
              ></div>
            </div>
            <p className={styles.scoreDescription}>
              첨가물 {analysis.additives.count}개 포함 (위험도: {analysis.additives.risk_level})
            </p>
          </div>

          {/* 영양 점수 */}
          <div className={styles.scoreItem}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreLabel}>
                <span className={styles.scoreIcon}>💪</span>
                <span className={styles.scoreName}>영양 균형도</span>
              </div>
              <span className={`${styles.scoreValue} ${styles.red}`}>
                {roundScore(result.nutrition_score)}점
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.red}`}
                style={{ width: `${roundScore(result.nutrition_score)}%` }}
              ></div>
            </div>
            <p className={styles.scoreDescription}>
              나트륨: {analysis.nutrition.sodium_mg}mg,
              당류: {analysis.nutrition.sugar_g}g,
              포화지방: {analysis.nutrition.sat_fat_g}g
            </p>
          </div>
        </div>

        {/* 점수 산출 과정 카드 */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>점수 산출 과정</h3>
          <div className={styles.calculation}>
            <div className={styles.weightInfo}>
              <p className={styles.weightItem}>
                포장재 가중치: {roundScore(result.weights.packaging_weight * 100)}%
              </p>
              <p className={styles.weightItem}>
                첨가물 가중치: {roundScore(result.weights.additives_weight * 100)}%
              </p>
              <p className={styles.weightItem}>
                영양 가중치: {roundScore(result.weights.nutrition_weight * 100)}%
              </p>
            </div>
            <p className={styles.calculationFormula}>
              종합점수 = (포장재: {roundScore(result.packaging_score)} × {roundScore(result.weights.packaging_weight * 100)}%) + (첨가물: {roundScore(result.additives_score)} × {roundScore(result.weights.additives_weight * 100)}%) + (영양: {roundScore(result.nutrition_score)} × {roundScore(result.weights.nutrition_weight * 100)}%)
            </p>
            <p className={styles.calculationResult}>
              = {roundScore(result.total_score)}점
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
