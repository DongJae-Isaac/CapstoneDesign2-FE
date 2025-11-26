import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useScanHistory } from "../../features/history";
import styles from "./UserMainPage.module.css"
import camera from "../../assets/camera.png"

const UserMainPage = () => {
    const navigate = useNavigate();
    const [showBarcodeInput, setShowBarcodeInput] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState("");

    // 사용자 ID (localStorage에서 가져오기)
    const userId = parseInt(localStorage.getItem('userId') || '1', 10);

    // 히스토리 조회 API 훅
    const { isLoading, data: historyData, fetchHistory } = useScanHistory();

    // 컴포넌트 마운트 시 히스토리 조회
    useEffect(() => {
        fetchHistory(userId, 0, 3); // 최근 3개만 조회
    }, [fetchHistory, userId]);

    // 점수로부터 등급 재계산 (백엔드 등급이 잘못될 수 있으므로)
    const calculateGrade = (score) => {
        if (score >= 80) return 'A';
        if (score >= 60) return 'B';
        if (score >= 40) return 'C';
        if (score >= 20) return 'D';
        return 'E';
    };

    // 최근 3개 제품 - 등급을 재계산해서 사용
    const recentProducts = (historyData || []).map(item => ({
        ...item,
        grade: calculateGrade(item.total_score) // 백엔드 등급 대신 프론트엔드에서 재계산
    }));

    const handleProductClick = (item) => {
        // 히스토리 상세 페이지로 이동
        navigate(`/history/${item.scan_id}`);
    };

    const handleViewAll = () => {
        navigate("/history");
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

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            month: '2-digit',
            day: '2-digit'
        });
    };

    const onClickBarcode = () => {
        navigate('/barcode')
    }

    const onClickBarcodeInput = () => {
        setShowBarcodeInput(true);
    }

    const handleBarcodeSubmit = async () => {
        if (!barcodeValue.trim()) {
            alert("바코드를 입력해주세요.");
            return;
        }

        // 입력 초기화 및 모달 닫기
        setBarcodeValue("");
        setShowBarcodeInput(false);

        // 바코드 페이지로 이동하면서 바코드 값을 state로 전달
        navigate('/barcode', { state: { barcode: barcodeValue } });
    }

    const handleCloseModal = () => {
        setBarcodeValue("");
        setShowBarcodeInput(false);
    }

    return <>
        <div className={styles.container}>
            <button 
            className={styles.barcodeScan}
            onClick={onClickBarcode}
            >
                <img src={camera} className={styles.cameraImg}/>
                <p className={styles.barcodeText}>바코드 스캔하기</p>
            </button>
            <button
            className={styles.barcodeInput}
            onClick={onClickBarcodeInput}
            >
                <p className={styles.barcodeText2}>바코드 직접 입력하기</p>
            </button>

            {/* 최근 검색한 제품 섹션 */}
            <div className={styles.recentSection}>
                <div className={styles.recentHeader}>
                    <h2 className={styles.recentTitle}>최근 검색한 제품</h2>
                    <button onClick={handleViewAll} className={styles.viewAllButton}>
                        전체보기 →
                    </button>
                </div>

                <div className={styles.sliderContainer}>
                    {isLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            최근 검색 기록을 불러오는 중...
                        </div>
                    ) : recentProducts.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            아직 검색한 제품이 없습니다.
                        </div>
                    ) : (
                        <div className={styles.slider}>
                            {recentProducts.map((item) => (
                                <div
                                    key={item.scan_id}
                                    className={styles.productCard}
                                    onClick={() => handleProductClick(item)}
                                >
                                    {/* 등급 뱃지 */}
                                    <div
                                        className={styles.gradeBadge}
                                        style={{
                                            backgroundColor: getGradeBackgroundColor(item.grade),
                                            color: getGradeColor(item.grade),
                                        }}
                                    >
                                        {item.grade}등급
                                    </div>

                                    {/* 날짜 */}
                                    <p className={styles.productDate}>{formatDate(item.created_at)}</p>

                                    {/* 제품명 */}
                                    <h3 className={styles.productName}>{item.product_name}</h3>

                                    {/* 총점 표시 */}
                                    <div className={styles.scoreContainer}>
                                        <div className={styles.totalScoreRow}>
                                            <span className={styles.totalScoreLabel}>총점</span>
                                            <span className={styles.totalScoreValue}>{item.total_score}점</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* 바코드 입력 모달 - Portal을 사용해서 document.body에 직접 렌더링 */}
        {showBarcodeInput && createPortal(
            <div className={styles.modalOverlay} onClick={handleCloseModal}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.modalTitle}>바코드 입력</h2>
                    <input
                        type="text"
                        className={styles.modalInput}
                        placeholder="바코드 번호를 입력하세요"
                        value={barcodeValue}
                        onChange={(e) => setBarcodeValue(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleBarcodeSubmit();
                            }
                        }}
                        autoFocus
                    />
                    <div className={styles.modalButtons}>
                        <button
                            className={styles.modalCancelButton}
                            onClick={handleCloseModal}
                        >
                            취소
                        </button>
                        <button
                            className={styles.modalSubmitButton}
                            onClick={handleBarcodeSubmit}
                        >
                            검색
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>
}

export default UserMainPage;