import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import styles from "./HistoryPage.module.css";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { historyData, deleteHistoryItem, deleteAllHistory } = useData();
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(historyData);
  }, [historyData]);

  useEffect(() => {
    // 필터링 로직
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

  const handleDeleteAll = () => {
    if (window.confirm("모든 검색 기록을 삭제하시겠습니까?")) {
      deleteAllHistory();
      alert("모든 기록이 삭제되었습니다.");
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("이 항목을 삭제하시겠습니까?")) {
      deleteHistoryItem(id);
    }
  };

  const handleItemClick = (item) => {
    // TODO: 상세 페이지로 이동 (바코드 또는 제품 ID 전달)
    navigate(`/result?barcode=${item.barcode}`);
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: "#4CAF50",
      B: "#8BC34A",
      C: "#FFA726",
      D: "#EF5350",
      F: "#E53935",
    };
    return colors[grade] || "#9E9E9E";
  };

  const getGradeBackgroundColor = (grade) => {
    const colors = {
      A: "#C8E6C9",
      B: "#DCEDC8",
      C: "#FFE0B2",
      D: "#FFCDD2",
      F: "#EF9A9A",
    };
    return colors[grade] || "#F5F5F5";
  };

  const filters = [
    { value: "전체" },
    { value: "A등급" },
    { value: "B등급" },
    { value: "C등급" },
    { value: "D등급" },
  ];

  return (
    <div className={styles.container}>
      {/* 타이틀 영역 */}
      <div className={styles.titleSection}>
        <h2 className={styles.title}>검색 히스토리</h2>
        <button
          onClick={handleDeleteAll}
          className={styles.deleteAllButton}
          disabled={historyData.length === 0}
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

      {/* 히스토리 리스트 */}
      <div className={styles.historyList}>
        {filteredData.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p className={styles.emptyText}>
              {historyData.length === 0
                ? "아직 검색한 제품이 없습니다"
                : "해당 등급의 제품이 없습니다"}
            </p>
            {historyData.length === 0 && (
              <button
                onClick={() => navigate("/")}
                className={styles.scanButton}
              >
                제품 스캔하기
              </button>
            )}
          </div>
        ) : (
          filteredData.map((item) => (
            <div
              key={item.id}
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
                <h3 className={styles.productName}>{item.productName}</h3>
                <p className={styles.dateTime}>{item.scannedAt}</p>
              </div>

              {/* 점수 바 */}
              <div className={styles.scoreContainer}>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>포장재</span>
                  <div className={styles.scoreBarWrapper}>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreBarFill}
                        style={{
                          width: `${item.detailScores.포장재}%`,
                          backgroundColor: "#4CAF50",
                        }}
                      />
                    </div>
                    <span className={styles.scoreValue}>
                      {item.detailScores.포장재}
                    </span>
                  </div>
                </div>

                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>첨가물</span>
                  <div className={styles.scoreBarWrapper}>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreBarFill}
                        style={{
                          width: `${item.detailScores.첨가물}%`,
                          backgroundColor: "#EF5350",
                        }}
                      />
                    </div>
                    <span className={styles.scoreValue}>
                      {item.detailScores.첨가물}
                    </span>
                  </div>
                </div>

                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>영양가치</span>
                  <div className={styles.scoreBarWrapper}>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreBarFill}
                        style={{
                          width: `${item.detailScores.영양가치}%`,
                          backgroundColor: "#2196F3",
                        }}
                      />
                    </div>
                    <span className={styles.scoreValue}>
                      {item.detailScores.영양가치}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
