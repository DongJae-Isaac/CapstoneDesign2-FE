import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useScanHistoryDetail } from "../../features/history";
import styles from "./HistoryDetailPage.module.css";

const HistoryDetailPage = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userId') || '1', 10);

  const { isLoading, error, data: historyDetail, fetchDetail } = useScanHistoryDetail();

  useEffect(() => {
    if (scanId) {
      fetchDetail(parseInt(scanId), userId);
    }
  }, [scanId, userId, fetchDetail]);

  const handleBack = () => {
    navigate(-1);
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: "#4CAF50",
      B: "#8BC34A",
      C: "#FFA726",
      D: "#EF5350",
      E: "#E53935",
    };
    return colors[grade] || "#9E9E9E";
  };

  const getGradeBackgroundColor = (grade) => {
    const colors = {
      A: "#C8E6C9",
      B: "#DCEDC8",
      C: "#FFE0B2",
      D: "#FFCDD2",
      E: "#EF9A9A",
    };
    return colors[grade] || "#F5F5F5";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>히스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>히스토리를 불러오는데 실패했습니다.</p>
          <p>{error}</p>
          <button onClick={handleBack} className={styles.backButton}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!historyDetail) {
    return null;
  }

  // 백엔드에서 받은 등급을 그대로 사용 (historyDetail.grade)
  const displayGrade = historyDetail.grade;

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 뒤로
        </button>
        <h2 className={styles.title}>검색 기록 상세</h2>
      </div>

      {/* 제품 정보 카드 */}
      <div className={styles.productCard}>
        {historyDetail.image_url && (
          <img
            src={historyDetail.image_url}
            alt={historyDetail.product_name}
            className={styles.productImage}
          />
        )}

        <h3 className={styles.productName}>{historyDetail.product_name}</h3>
        <p className={styles.dateTime}>{formatDate(historyDetail.created_at)}</p>

        {/* 등급 뱃지 - 백엔드에서 받은 등급 사용 */}
        <div
          className={styles.gradeBadge}
          style={{
            backgroundColor: getGradeBackgroundColor(displayGrade),
            color: getGradeColor(displayGrade),
          }}
        >
          {displayGrade}등급
        </div>

        {/* 총점 */}
        <div className={styles.scoreSection}>
          <div className={styles.totalScoreRow}>
            <span className={styles.totalScoreLabel}>총점</span>
            <span
              className={styles.totalScoreValue}
              style={{ color: getGradeColor(displayGrade) }}
            >
              {historyDetail.total_score}점
            </span>
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className={styles.infoMessage}>
        <p>💡 이 기록은 검색 당시의 결과입니다.</p>
        <p>자세한 분석 정보를 보려면 제품을 다시 스캔해주세요.</p>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
