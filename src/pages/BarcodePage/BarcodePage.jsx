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

  // analysisData를 저장하기 위한 ref (reset 후에도 유지)
  const savedAnalysisData = useRef(null);

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
    // localStorage에서 계산된 가중치 불러오기 (표시용)
    const savedWeights = localStorage.getItem(`userWeights_${userId}`);
    let weights = {
      packaging: 33.3,
      additives: 33.3,
      nutrition: 33.4,
    };

    if (savedWeights) {
      weights = JSON.parse(savedWeights);
    }

    console.log('사용자 설정 가중치:', weights);

    // localStorage에서 원본 슬라이더 값 불러오기 (AHP용)
    const savedSliders = localStorage.getItem(`userSliderValues_${userId}`);
    let sliderValues = {
      packagingVsAdditives: 0,
      packagingVsNutrition: 0,
      additivesVsNutrition: 0,
    };

    if (savedSliders) {
      sliderValues = JSON.parse(savedSliders);
    }

    // 슬라이더 값을 그대로 백엔드로 전송 (이미 -9 ~ +9 범위)
    const priorities = {
      pkg_vs_add: sliderValues.packagingVsAdditives,
      pkg_vs_nut: sliderValues.packagingVsNutrition,
      add_vs_nut: sliderValues.additivesVsNutrition
    };

    console.log('사용자 가중치:', priorities);

    return priorities;
  };

  // 식품 분석 완료 → 바로 등급 계산
  useEffect(() => {
    if (analysisData) {
      console.log('식품 분석 결과:', analysisData);

      // analysisData를 ref에 저장 (reset 후에도 유지하기 위해)
      savedAnalysisData.current = analysisData;

      const priorities = convertWeightsToApiFormat();
      console.log('사용자 가중치:', priorities);

      // 백엔드 응답이 { barcode, name, scores: {...} } 형태이면 평탄화
      let scoresData = analysisData;
      if (analysisData.scores) {
        scoresData = {
          barcode: analysisData.barcode,
          name: analysisData.name,
          report_no: analysisData.report_no,
          image_url: analysisData.image_url,
          nutrition: analysisData.scores.nutrition,
          packaging: analysisData.scores.packaging,
          additives: analysisData.scores.additives,
        };
      }

      // API 요청 데이터 구성 (OpenAPI 스펙에 맞게)
      const request = {
        scores: scoresData,
        priorities: priorities
      };

      console.log('등급 계산 요청 데이터:', JSON.stringify(request, null, 2));

      // 등급 계산 API 호출 (히스토리 저장 활성화)
      calculate(userId, request, true);
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
          analysisData: savedAnalysisData.current // ref에 저장된 데이터 사용
        }
      });
      resetGrade();
      savedAnalysisData.current = null; // 사용 후 초기화
    }
  }, [gradeResult, navigate, resetGrade]);

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