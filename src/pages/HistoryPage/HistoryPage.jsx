import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScanHistory, useDeleteScanHistory } from "../../features/history";
import styles from "./HistoryPage.module.css";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [filteredData, setFilteredData] = useState([]);

  // 사용자 ID (localStorage에서 가져오기)
  const userId = parseInt(localStorage.getItem('userId') || '1', 10);

  // 히스토리 조회 API 훅
  const { isLoading, error, data: historyData, fetchHistory } = useScanHistory();

  // 히스토리 삭제 API 훅
  const { deleteRecord } = useDeleteScanHistory();

  // 컴포넌트 마운트 시 히스토리 조회
  useEffect(() => {
    fetchHistory(userId, 0, 50); // 최대 50개 조회
  }, [fetchHistory, userId]);

  // 히스토리 데이터 변경 시 필터링
  useEffect(() => {
    if (historyData) {
      setFilteredData(historyData);
    }
  }, [historyData]);

  // 필터 변경 시 필터링
  useEffect(() => {
    if (!historyData) return;

    if (selectedFilter === "전체") {
      setFilteredData(historyData);
    } else {
      // 'A등급' -> 'A' 추출
      const gradeValue = selectedFilter.charAt(0);
      setFilteredData(historyData.filter((item) => item.grade === gradeValue));
    }
  }, [selectedFilter, historyData]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleDeleteAll = async () => {
    if (window.confirm("모든 검색 기록을 삭제하시겠습니까?")) {
      // 각 항목을 순차적으로 삭제
      if (historyData) {
        for (const item of historyData) {
          await deleteRecord(item.scan_id, userId);
        }
        // 다시 조회
        fetchHistory(userId, 0, 50);
        alert("모든 기록이 삭제되었습니다.");
      }
    }
  };

  const handleDeleteItem = async (scanId) => {
    if (window.confirm("이 항목을 삭제하시겠습니까?")) {
      await deleteRecord(scanId, userId);
      // 다시 조회
      fetchHistory(userId, 0, 50);
    }
  };

  const handleItemClick = (item) => {
    // 상세 페이지로 이동
    navigate(`/history/${item.scan_id}`);
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

  const filters = [
    { value: "전체" },
    { value: "A등급" },
    { value: "B등급" },
    { value: "C등급" },
    { value: "D등급" },
    { value: "E등급" },
  ];

  // 날짜 포맷팅 함수
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

  return (
    <div className={styles.container}>
      {/* 타이틀 영역 */}
      <div className={styles.titleSection}>
        <h2 className={styles.title}>검색 히스토리</h2>
        <button
          onClick={handleDeleteAll}
          className={styles.deleteAllButton}
          disabled={!historyData || historyData.length === 0 || isLoading}
        >
          전체 삭제
        </button>
      </div>

      {/* 필터 버튼 */}
      <div className={styles.filterSection}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`${styles.filterButton} ${
              selectedFilter === filter.value ? styles.filterButtonActive : ""
            }`}
          >
            {filter.value}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className={styles.loadingState}>
          <p>히스토리를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className={styles.errorState}>
          <p>히스토리를 불러오는데 실패했습니다.</p>
          <p>{error}</p>
          <button onClick={() => fetchHistory(userId, 0, 50)}>다시 시도</button>
        </div>
      )}

      {/* 히스토리 리스트 */}
      {!isLoading && !error && (
        <div className={styles.historyList}>
          {filteredData.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p className={styles.emptyText}>
                {!historyData || historyData.length === 0
                  ? "아직 검색한 제품이 없습니다"
                  : "해당 등급의 제품이 없습니다"}
              </p>
              {(!historyData || historyData.length === 0) && (
                <button
                  onClick={() => navigate("/barcode")}
                  className={styles.scanButton}
                >
                  제품 스캔하기
                </button>
              )}
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.scan_id}
                className={styles.historyCard}
                onClick={() => handleItemClick(item)}
              >
                {/* 등급 뱃지 */}
                <div
                  className={styles.gradeBadge}
                  style={{
                    backgroundColor: getGradeBackgroundColor(item.grade),
                    color: getGradeColor(item.grade),
                  }}
                >
                  {item.grade}
                </div>

                {/* 제품 정보 */}
                <div className={styles.cardHeader}>
                  <h3 className={styles.productName}>{item.product_name}</h3>
                  <p className={styles.dateTime}>{formatDate(item.created_at)}</p>
                </div>

                {/* 총점 표시 */}
                <div className={styles.scoreContainer}>
                  <div className={styles.scoreRow}>
                    <span className={styles.scoreLabel}>총점</span>
                    <span className={styles.scoreValue} style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {item.total_score}점
                    </span>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.scan_id);
                  }}
                  className={styles.deleteButton}
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
