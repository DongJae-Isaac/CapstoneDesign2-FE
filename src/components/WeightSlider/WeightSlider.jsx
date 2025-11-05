import styles from "./WeightSlider.module.css";

const WeightSlider = ({ 
  leftLabel, 
  rightLabel, 
  leftColor, 
  rightColor,
  value = 0,
  onChange 
}) => {
  // 중요도 텍스트 생성
  const getImportanceText = (side) => {
    const isLeft = side === 'left';
    
    if ((isLeft && value < 0) || (!isLeft && value > 0)) {
      const importance = Math.abs(value);
      if (importance >= 6) return '매우 중요';
      if (importance >= 4) return '중요';
      if (importance >= 2) return '조금 중요';
    }
    return '조금 중요';
  };

  // 슬라이더 배경색
  const getSliderBackground = () => {
    const percentage = ((value + 7) / 14) * 100;
    
    if (value < 0) {
      return `linear-gradient(to right, 
        ${leftColor} 0%, 
        // ${leftColor} ${percentage}%, 
        #E5E7EB ${percentage}%, 
        #E5E7EB 100%)`;
    } else if (value > 0) {
      return `linear-gradient(to right, 
        #E5E7EB 0%, 
        #E5E7EB ${percentage}%, 
        // ${rightColor} ${percentage}%, 
        ${rightColor} 100%)`;
    } else {
      return '#E5E7EB';
    }
  };

  // 눈금 생성
  const renderTicks = () => {
    const ticks = [];
    for (let i = -7; i <= 7; i++) {
      ticks.push(
        <div 
          key={i} 
          className={`${styles.tick} ${i === 0 ? styles.centerTick : ''} ${i === value ? styles.activeTick : ''}`}
        >
          <span className={styles.tickLabel}>{Math.abs(i)}</span>
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className={styles.sliderContainer}>
      {/* 라벨 */}
      <div className={styles.labels}>
        <span className={styles.label} style={{ color: leftColor }}>
          {leftLabel}
        </span>
        <span className={styles.label} style={{ color: rightColor }}>
          {rightLabel}
        </span>
      </div>

      {/* 슬라이더 */}
      <div className={styles.sliderWrapper}>
        {/* 중앙선 표시 */}
        <div className={styles.centerLine} />
        
        <input
          type="range"
          min="-7"
          max="7"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          style={{ background: getSliderBackground() }}
        />
      </div>

      {/* 눈금 */}
      <div className={styles.ticks}>
        {renderTicks()}
      </div>

      {/* 하단 텍스트 */}
      <div className={styles.subLabels}>
        <span className={styles.subLabel}>{getImportanceText('left')}</span>
        <span className={styles.subLabel}>{getImportanceText('right')}</span>
      </div>
    </div>
  );
};

export default WeightSlider;