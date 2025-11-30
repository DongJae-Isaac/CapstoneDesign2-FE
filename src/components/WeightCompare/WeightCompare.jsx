import { useState, useEffect } from 'react';
import WeightSlider from "../WeightSlider/WeightSlider";
import styles from "./WeightCompare.module.css";

const COLORS = {
    packaging: '#22C55E',  // 포장재
    additives: '#DC2626',  // 첨가물
    nutrition: '#2563EB',  // 영양
};

const WeightCompare = ({ updateWeights, initialSliderValues }) => {
    // 포장재 vs 첨가물, 포장재 vs 영양, 첨가물 vs 영양
    const [packagingVsAdditives, setPackagingVsAdditives] = useState(
        initialSliderValues?.packagingVsAdditives ?? 0
    );
    const [packagingVsNutrition, setPackagingVsNutrition] = useState(
        initialSliderValues?.packagingVsNutrition ?? 0
    );
    const [additivesVsNutrition, setAdditivesVsNutrition] = useState(
        initialSliderValues?.additivesVsNutrition ?? 0
    );

    // 슬라이더 값이 변경될 때마다 슬라이더 값만 업데이트 (가중치 계산은 백엔드에서)
    useEffect(() => {
        // 현재 슬라이더 값들
        const currentSliderValues = {
            packagingVsAdditives,
            packagingVsNutrition,
            additivesVsNutrition,
        };

        // 슬라이더 값만 상위 컴포넌트에 전달
        // 가중치는 나중에 백엔드 API 호출 시 계산됨
        updateWeights(null, currentSliderValues);
    }, [packagingVsAdditives, packagingVsNutrition, additivesVsNutrition, updateWeights]); 

    return (
        <div className={styles.content}>
            {/* 헤더 */}
            <div className={styles.header}>
                <h2 className={styles.title}>중요도 비교</h2>
                <p className={styles.description}>
                    각 항목을 비교하여 상대적 중요도를 결정해주세요
                </p>
            </div>

            {/* 슬라이더들 */}
            <div className={styles.sliders}>
                <WeightSlider
                    leftLabel="포장재"
                    rightLabel="첨가물"
                    leftColor={COLORS.packaging}
                    rightColor={COLORS.additives}
                    value={packagingVsAdditives}
                    onChange={setPackagingVsAdditives}
                />

                <WeightSlider
                    leftLabel="포장재"
                    rightLabel="영양"
                    leftColor={COLORS.packaging}
                    rightColor={COLORS.nutrition}
                    value={packagingVsNutrition}
                    onChange={setPackagingVsNutrition}
                />

                <WeightSlider
                    leftLabel="첨가물"
                    rightLabel="영양"
                    leftColor={COLORS.additives}
                    rightColor={COLORS.nutrition}
                    value={additivesVsNutrition}
                    onChange={setAdditivesVsNutrition}
                />
            </div>
        </div>
    );
}

export default WeightCompare;