import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './BarcodePage.module.css';
import Button from '../../components/Button/Button';
import { useFoodAnalysis, useGradeCalculation } from '../../features/barcode';

const BarcodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scannerRef = useRef(null);
  const hasInitialized = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  // 식품 분석 API 훅
  const { isLoading: isAnalyzing, error: analysisError, data: analysisData, fetchAnalysis, reset: resetAnalysis } = useFoodAnalysis();

  // 등급 계산 API 훅
  const { isLoading: isCalculating, error: gradeError, result: gradeResult, calculate, reset: resetGrade } = useGradeCalculation();

  // 사용자 ID (localStorage에서 가져오기)
  const userId = parseInt(localStorage.getItem('userId') || '1', 10);

  // UserMainPage에서 바코드를 전달받은 경우 자동 조회
  useEffect(() => {
    const barcodeFromState = location.state?.barcode;
    if (barcodeFromState) {
      fetchAnalysis(barcodeFromState);
    }
  }, [location.state, fetchAnalysis]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const scanner = new Html5QrcodeScanner(
      "barcode-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scannerRef.current = scanner;

    const onScanSuccess = async (decodedText, decodedResult) => {
      console.log(`바코드 스캔 성공: ${decodedText}`, decodedResult);

      // 스캔 성공 시 카메라 중지
      scanner.clear().catch(err => {
        console.error("Scanner clear error:", err);
      });

      // 백엔드 API 호출
      await fetchAnalysis(decodedText);
    };

    const onScanFailure = (error) => {
      // 에러는 무시
    };

    scanner.render(onScanSuccess, onScanFailure);
    setScanning(true);

    const hideFileButton = setInterval(() => {
      const fileButton = document.getElementById('html5-qrcode-button-file-selection');
      if (fileButton) {
        fileButton.remove();
        clearInterval(hideFileButton);
      }
    }, 100);

    return () => {
      clearInterval(hideFileButton);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Scanner cleanup error:", error);
        });
      }
      hasInitialized.current = false;
    };
  }, [navigate, fetchAnalysis]);

  // 가중치를 API 형식으로 변환하는 함수
  const convertWeightsToApiFormat = () => {
    // localStorage에서 가중치 불러오기
    const savedWeights = localStorage.getItem('userWeights');
    let weights = {
      packaging: 33.3,
      additives: 33.3,
      nutrition: 33.4,
    };

    if (savedWeights) {
      weights = JSON.parse(savedWeights);
    }

    console.log('사용자 설정 가중치:', weights);

    // AHP 방식의 상대적 중요도 계산
    // 값이 클수록 더 중요함을 의미
    // 예: packaging=10, additives=30 이면 pkg_vs_add = 10/30 = 0.33 (첨가물이 3배 더 중요)
    // 백엔드는 정수로 받으므로, 비율을 계산하되 더 작은 값을 1로 정규화

    // 각 쌍의 비율 계산
    const calculatePriority = (weight1, weight2) => {
      if (weight1 > weight2) {
        // weight1이 더 중요 -> 양수 반환
        return Math.round(weight1 / weight2);
      } else if (weight2 > weight1) {
        // weight2가 더 중요 -> 음수 반환
        return -Math.round(weight2 / weight1);
      } else {
        // 같으면 1 (동등하게 중요)
        return 1;
      }
    };

    return {
      pkg_vs_add: calculatePriority(weights.packaging, weights.additives),
      pkg_vs_nut: calculatePriority(weights.packaging, weights.nutrition),
      add_vs_nut: calculatePriority(weights.additives, weights.nutrition)
    };
  };

  // 식품 분석 완료 → 바로 등급 계산
  useEffect(() => {
    if (analysisData) {
      console.log('식품 분석 결과:', analysisData);

      const priorities = convertWeightsToApiFormat();
      console.log('사용자 가중치:', priorities);

      // API 요청 데이터 구성
      const request = {
        scores: analysisData,
        priorities: priorities
      };

      console.log('등급 계산 요청 데이터:', JSON.stringify(request, null, 2));

      // 등급 계산 API 호출 (임시로 히스토리 저장 비활성화)
      calculate(userId, request, false);
      resetAnalysis();
    }
  }, [analysisData, userId, calculate, resetAnalysis]);

  // 등급 계산 완료 → 결과 페이지로 이동
  useEffect(() => {
    if (gradeResult) {
      console.log('등급 계산 결과:', gradeResult);
      navigate('/result', {
        state: {
          gradeResult: gradeResult,
          analysisData: analysisData
        }
      });
      resetGrade();
    }
  }, [gradeResult, navigate, analysisData, resetGrade]);

  // API 에러 처리
  useEffect(() => {
    if (analysisError) {
      alert(`식품 분석 실패: ${analysisError}`);
      resetAnalysis();
    }
  }, [analysisError, resetAnalysis]);

  useEffect(() => {
    if (gradeError) {
      alert(`등급 계산 실패: ${gradeError}`);
      resetGrade();
    }
  }, [gradeError, resetGrade]);

  const handleTestResult = async () => {
    const testBarcode = "8801234567890";
    await fetchAnalysis(testBarcode);
  };

  const handleToggleManualInput = () => {
    setShowManualInput(!showManualInput);
  };

  const handleManualSubmit = async () => {
    if (manualBarcode.trim()) {
      await fetchAnalysis(manualBarcode);
      setManualBarcode('');
      setShowManualInput(false);
    } else {
      alert('바코드 번호를 입력해주세요');
    }
  };

  return (
    <div className={styles.container}>
      {/* 로딩 오버레이 */}
      {(isAnalyzing || isCalculating) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          {isAnalyzing ? '식품 분석 중...' : '등급 계산 중...'}
        </div>
      )}

      {/* 스캔 영역 */}
      <div className={styles.scanArea}>
        <div id="barcode-reader" className={styles.barcodeReader}></div>
        <p className={styles.instruction}>바코드를 스캔 영역에 맞춰주세요</p>
      </div>

      {/* 버튼 섹션 */}
      <div className={styles.buttonSection}>
        {/* 바코드 번호 입력하기 버튼 */}
        <Button
          text={'바코드 번호 입력하기'}
          type={'testbtn'}
          onClick={handleToggleManualInput}
          disabled={false}
          className={styles.inputToggleButton}
        />

        {/* 바코드 수동 입력 섹션 (토글) */}
        {showManualInput && (
          <div className={styles.manualInputSection}>
            <input
              type="text"
              placeholder="바코드 번호 입력"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              className={styles.barcodeInput}
              autoFocus
            />
            <Button 
              text={'입력 완료'} 
              type={'testbtn'} 
              onClick={handleManualSubmit}  
              disabled={false}
              className={styles.submitButton}
            />
          </div>
        )}

        {/* 테스트 결과 보기 버튼 */}
        <Button 
          text={'테스트 결과 보기'} 
          type={'testbtn'} 
          onClick={handleTestResult}  
          disabled={false}
          className={styles.testButton}
        />
      </div>
    </div>
  );
};

export default BarcodePage;