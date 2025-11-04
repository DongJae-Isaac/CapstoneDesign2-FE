import { useState } from 'react';
import WeightSlider from "../WeightSlider/WeightSlider";
import styles from "./WeightCompare.module.css";

const COLORS = {
        packaging: '#22C55E',  // 포장재
        additives: '#DC2626',  // 첨가물
        nutrition: '#2563EB',  // 영양
    };

const WeightCompare = () => {
    
    // 포장재 vs 첨가물, 포장재 vs 영양, 첨가물 vs 영양
        const [packagingVsAdditives, setpackagingVsAdditives] = useState(0);
        const [packagingVsNutrition, setpackagingVsNutrition] = useState(0);
        const [additivesVsNutrition, setadditivesVsNutrition] = useState(0);

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
                        onChange={setpackagingVsAdditives}
                    />

                    <WeightSlider
                        leftLabel="포장재"
                        rightLabel="영양"
                        leftColor={COLORS.packaging}
                        rightColor={COLORS.nutrition}
                        value={packagingVsNutrition}
                        onChange={setpackagingVsNutrition}
                    />

                    <WeightSlider
                        leftLabel="첨가물"
                        rightLabel="영양"
                        leftColor={COLORS.additives}
                        rightColor={COLORS.nutrition}
                        value={additivesVsNutrition}
                        onChange={setadditivesVsNutrition}
                    />
                    </div>
                </div>
    );
}

export default WeightCompare;