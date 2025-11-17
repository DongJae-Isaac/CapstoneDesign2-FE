import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataContext";
import styles from "./UserMainPage.module.css"
import camera from "../../assets/camera.png"

const UserMainPage = () => {
    const navigate = useNavigate();
    const { historyData } = useData();
    const [showBarcodeInput, setShowBarcodeInput] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState("");

    // 최근 3개 제품만 가져오기
    const recentProducts = historyData.slice(0, 3);

    const handleProductClick = (item) => {
        navigate(`/result?barcode=${item.barcode}`);
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

    const getScoreBarColor = (label) => {
        const colors = {
            포장재: "#4CAF50",
            첨가물: "#EF5350",
            영양가치: "#2196F3",
        };
        return colors[label] || "#9E9E9E";
    };

    const onClickBarcode = () => {
        navigate('/barcode')
    }

    const onClickBarcodeInput = () => {
        setShowBarcodeInput(true);
    }

    const handleBarcodeSubmit = () => {
        if (!barcodeValue.trim()) {
            alert("바코드를 입력해주세요.");
            return;
        }

        // 히스토리 데이터에서 바코드로 검색
        const foundProduct = historyData.find(item => item.barcode === barcodeValue);

        if (foundProduct) {
            // 찾은 경우 결과 페이지로 이동
            navigate(`/result?barcode=${barcodeValue}`);
        } else {
            // 찾지 못한 경우
            alert("해당 바코드의 제품을 찾을 수 없습니다.");
        }

        // 입력 초기화 및 모달 닫기
        setBarcodeValue("");
        setShowBarcodeInput(false);
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
                    <div className={styles.slider}>
                        {recentProducts.map((item) => (
                            <div
                                key={item.id}
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
                                <p className={styles.productDate}>{item.scannedAtShort}</p>

                                {/* 제품명 */}
                                <h3 className={styles.productName}>{item.productName}</h3>

                                {/* 점수 바 */}
                                <div className={styles.scoreContainer}>
                                    {Object.entries(item.detailScores).map(([label, score]) => (
                                        <div key={label} className={styles.scoreRow}>
                                            <span className={styles.scoreLabel}>{label}</span>
                                            <div className={styles.scoreBarWrapper}>
                                                <div className={styles.scoreBar}>
                                                    <div
                                                        className={styles.scoreBarFill}
                                                        style={{
                                                            width: `${score}%`,
                                                            backgroundColor: getScoreBarColor(label),
                                                        }}
                                                    />
                                                </div>
                                                <span className={styles.scoreValue}>{score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
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