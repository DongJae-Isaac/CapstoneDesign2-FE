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

  // localStorage에서 사용자가 설정한 실제 가중치 불러오기
  const getUserWeights = () => {
    const userId = localStorage.getItem('userId') || '1';
    const savedWeights = localStorage.getItem(`userWeights_${userId}`);
    if (savedWeights) {
      const weights = JSON.parse(savedWeights);
      return {
        packaging_weight: weights.packaging / 100,
        additives_weight: weights.additives / 100,
        nutrition_weight: weights.nutrition / 100,
      };
    }
    return {
      packaging_weight: 0.333,
      additives_weight: 0.333,
      nutrition_weight: 0.334,
    };
  };

  // 대안 제품 추천 API 훅
  const { isLoading: isLoadingAlternatives, data: alternativesData, fetchAlternatives } = useAlternativeRecommendations();

  // 점수 반올림 헬퍼 함수 (소수점 2자리)
  const roundScore = (score) => {
    return Math.round(score * 100) / 100;
  };

  // 가중치 반올림 헬퍼 함수 (소수점 3자리)
  const roundWeight = (weight) => {
    return Math.round(weight * 1000) / 1000;
  };

  // 컴포넌트 마운트 시 대안 제품 조회
  useEffect(() => {
    console.log('=== 대안 제품 API 호출 체크 ===');
    console.log('analysisData:', analysisData);
    console.log('report_no:', analysisData?.report_no);
    console.log('gradeResult:', gradeResult);

    // 백엔드에서 report_no를 제공하면 대안 제품 조회
    if (analysisData?.report_no && gradeResult) {
      console.log('대안 제품 API 호출 시작');

      // localStorage에서 사용자 가중치 불러오기
      const userWeights = getUserWeights();

      // 재계산된 종합 점수 계산
      let analysis = analysisData;
      if (analysisData.scores) {
        analysis = {
          barcode: analysisData.barcode,
          name: analysisData.name,
          image_url: analysisData.image_url,
          report_no: analysisData.report_no,
          category_code: analysisData.category_code,
          nutrition: analysisData.scores.nutrition,
          packaging: analysisData.scores.packaging,
          additives: analysisData.scores.additives,
        };
      }

      const packagingScore = analysis.packaging?.score || gradeResult.packaging_score || 0;
      const additivesScore = analysis.additives?.score || gradeResult.additives_score || 0;
      const nutritionScore = analysis.nutrition?.score || gradeResult.nutrition_score || 0;

      const totalScore =
        (packagingScore * userWeights.packaging_weight) +
        (additivesScore * userWeights.additives_weight) +
        (nutritionScore * userWeights.nutrition_weight);

      const recalculatedScore = roundScore(totalScore);

      const request = {
        report_no: analysisData.report_no,
        total_score: recalculatedScore, // 재계산된 점수 사용
        weights: {
          nutrition_weight: userWeights.nutrition_weight,
          packaging_weight: userWeights.packaging_weight,
          additives_weight: userWeights.additives_weight,
        }
      };

      console.log('대안 제품 API 요청:', request);
      fetchAlternatives(request);
    } else {
      console.log('대안 제품 API 호출 조건 불충족');
      if (!analysisData?.report_no) console.log('report_no가 없습니다');
      if (!gradeResult) console.log('gradeResult가 없습니다');
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
      packaging_weight: 0.333,
      additives_weight: 0.333,
      nutrition_weight: 0.334
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

  // analysisData가 scores 객체를 포함하는 경우 처리
  let analysis = mockAnalysisData;
  if (analysisData) {
    // 백엔드 응답이 { barcode, name, scores: {...} } 형태인 경우
    if (analysisData.scores) {
      analysis = {
        barcode: analysisData.barcode,
        name: analysisData.name,
        image_url: analysisData.image_url,
        report_no: analysisData.report_no,
        category_code: analysisData.category_code,
        nutrition: analysisData.scores.nutrition,
        packaging: analysisData.scores.packaging,
        additives: analysisData.scores.additives,
      };
    } else {
      // 이미 평탄화된 구조인 경우
      analysis = analysisData;
    }
  }

  // 백엔드에서 받은 가중치가 잘못되었으므로, localStorage의 실제 사용자 가중치로 대체
  const userWeights = getUserWeights();
  if (result.weights) {
    result.weights = userWeights;
  }

  // 프론트엔드에서 종합 점수 재계산
  const calculateTotalScore = () => {
    // analysis 데이터의 점수를 사용 (더 정확함)
    const packagingScore = analysis.packaging?.score || result.packaging_score || 0;
    const additivesScore = analysis.additives?.score || result.additives_score || 0;
    const nutritionScore = analysis.nutrition?.score || result.nutrition_score || 0;

    console.log('=== 종합 점수 계산 ===');
    console.log('result 데이터:', result);
    console.log('analysis 데이터:', analysis);
    console.log('포장재 점수:', packagingScore);
    console.log('첨가물 점수:', additivesScore);
    console.log('영양 점수:', nutritionScore);
    console.log('포장재 가중치:', result.weights.packaging_weight);
    console.log('첨가물 가중치:', result.weights.additives_weight);
    console.log('영양 가중치:', result.weights.nutrition_weight);

    const packagingContribution = packagingScore * result.weights.packaging_weight;
    const additivesContribution = additivesScore * result.weights.additives_weight;
    const nutritionContribution = nutritionScore * result.weights.nutrition_weight;

    console.log('포장재 기여분:', packagingContribution);
    console.log('첨가물 기여분:', additivesContribution);
    console.log('영양 기여분:', nutritionContribution);

    const totalScore = packagingContribution + additivesContribution + nutritionContribution;

    console.log('총합:', totalScore);
    console.log('반올림 후:', roundScore(totalScore));

    return roundScore(totalScore);
  };

  // 점수로부터 등급 계산
  const calculateGrade = (score) => {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    if (score >= 20) return 'D';
    return 'E';
  };

  // 재계산된 종합 점수와 등급
  const recalculatedTotalScore = calculateTotalScore();
  const recalculatedGrade = calculateGrade(recalculatedTotalScore);

  // result 객체를 재계산된 값으로 업데이트
  result.total_score = recalculatedTotalScore;
  result.grade = recalculatedGrade;

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
  // 대체 식품은 백엔드에서 이미 가중치 적용된 total_score를 제공하므로,
  // 등급만 재계산하고 현재 제품보다 점수가 높은 것만 필터링
  const alternatives = (alternativesData || mockAlternatives)
    .map(item => {
      // 백엔드의 total_score는 이미 사용자 가중치가 적용된 값이므로 그대로 사용
      // 등급만 total_score 기반으로 재계산
      const recalculatedGrade = calculateGrade(item.total_score);

      return {
        ...item,
        total_score: roundScore(item.total_score), // 반올림만 적용
        grade: recalculatedGrade
      };
    })
    .filter(item => item.total_score > recalculatedTotalScore) // 현재 제품보다 점수가 높은 것만
    .sort((a, b) => b.total_score - a.total_score); // 점수가 높은 순으로 정렬

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
            {!isLoadingAlternatives && (
              <span className={styles.alternativesCount}>
                {alternatives.length}개
              </span>
            )}
          </div>
          {isLoadingAlternatives ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              대안 제품을 찾는 중...
            </div>
          ) : alternatives.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              추천할 대안 제품이 없습니다.
            </div>
          ) : (
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
          )}
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
              종합점수 = (포장재: {roundScore(result.packaging_score)} × {roundWeight(result.weights.packaging_weight)}) + (첨가물: {roundScore(result.additives_score)} × {roundWeight(result.weights.additives_weight)}) + (영양: {roundScore(result.nutrition_score)} × {roundWeight(result.weights.nutrition_weight)})
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
