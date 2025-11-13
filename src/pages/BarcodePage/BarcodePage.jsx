import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './BarcodePage.module.css';
import Button from '../../components/Button/Button';

const BarcodePage = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const hasInitialized = useRef(false);
  const [scanning, setScanning] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

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

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log(`바코드 스캔 성공: ${decodedText}`, decodedResult);
      
      scanner.clear().then(() => {
        navigate('/result', { state: { barcode: decodedText } });
      }).catch(err => {
        console.error("Scanner clear error:", err);
        navigate('/result', { state: { barcode: decodedText } });
      });
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
  }, [navigate]);

  const handleTestResult = () => {
    const testBarcode = "8801234567890";
    navigate('/result', { state: { barcode: testBarcode } });
  };

  const handleToggleManualInput = () => {
    setShowManualInput(!showManualInput);
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      navigate('/result', { state: { barcode: manualBarcode } });
    } else {
      alert('바코드 번호를 입력해주세요');
    }
  };

  return (
    <div className={styles.container}>
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