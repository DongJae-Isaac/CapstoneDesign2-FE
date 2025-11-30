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
        fetchHistory(userId, 0, 50); // 충분한 개수 조회 후 프론트에서 필터링
    }, [fetchHistory, userId]);

    // 최근 3개 제품 - 중복 제거 후 최신순으로 3개만
    const recentProducts = (() => {
        if (!historyData) return [];

        // 중복 제거: 같은 product_name 중 가장 최신 것만 유지
        const uniqueProducts = historyData.reduce((acc, current) => {
            const existing = acc.find(item => item.product_name === current.product_name);
            if (!existing) {
                acc.push(current);
            } else {
                // 더 최신 것으로 교체
                const currentDate = new Date(current.created_at);
                const existingDate = new Date(existing.created_at);
                if (currentDate > existingDate) {
                    const index = acc.indexOf(existing);
                    acc[index] = current;
                }
            }
            return acc;
        }, []);

        // created_at 기준 내림차순 정렬 후 3개만
        return uniqueProducts
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 3);
    })();

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