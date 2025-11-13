import { useState, useEffect } from 'react';
import WeightSlider from "../WeightSlider/WeightSlider";
import styles from "./WeightCompare.module.css";

const COLORS = {
    packaging: '#22C55E',  // 포장재
    additives: '#DC2626',  // 첨가물
    nutrition: '#2563EB',  // 영양
};

const WeightCompare = ({ updateWeights }) => {
    // 포장재 vs 첨가물, 포장재 vs 영양, 첨가물 vs 영양
    const [packagingVsAdditives, setPackagingVsAdditives] = useState(0);
    const [packagingVsNutrition, setPackagingVsNutrition] = useState(0);
    const [additivesVsNutrition, setAdditivesVsNutrition] = useState(0);

    // 슬라이더 값이 변경될 때마다 가중치 계산
    useEffect(() => {
        // 각 항목의 상대적 점수 계산
        let packagingScore = 0;
        let additivesScore = 0;
        let nutritionScore = 0;

        // 포장재 vs 첨가물: 양수면 포장재가 더 중요, 음수면 첨가물이 더 중요
        packagingScore -= packagingVsAdditives;
        additivesScore += packagingVsAdditives;

        // 포장재 vs 영양: 양수면 포장재가 더 중요, 음수면 영양이 더 중요
        packagingScore -= packagingVsNutrition;
        nutritionScore += packagingVsNutrition;

        // 첨가물 vs 영양: 양수면 첨가물이 더 중요, 음수면 영양이 더 중요
        additivesScore -= additivesVsNutrition;
        nutritionScore += additivesVsNutrition;

        // 음수를 없애기 위해 최소값을 찾아서 모두 양수로 만들기
        const minScore = Math.min(packagingScore, additivesScore, nutritionScore);
        const offset = minScore < 0 ? Math.abs(minScore) + 1 : 0;

        packagingScore += offset;
        additivesScore += offset;
        nutritionScore += offset;

        // 0으로 나누기 방지
        const totalScore = packagingScore + additivesScore + nutritionScore;
        
        if (totalScore === 0) {
            // 모든 슬라이더가 0일 때 균등 배분
            updateWeights({
                packaging: 33.3,
                additives: 33.3,
                nutrition: 33.4,
            });
        } else {
            // 퍼센트로 변환
            const newWeights = {
                packaging: Number(((packagingScore / totalScore) * 100).toFixed(1)),
                additives: Number(((additivesScore / totalScore) * 100).toFixed(1)),
                nutrition: Number(((nutritionScore / totalScore) * 100).toFixed(1)),
            };

            // 반올림 오차 보정 (합계를 정확히 100으로)
            const sum = newWeights.packaging + newWeights.additives + newWeights.nutrition;
            if (sum !== 100) {
                const diff = 100 - sum;
                newWeights.packaging = Number((newWeights.packaging + diff).toFixed(1));
            }

            updateWeights(newWeights);
        }
    }, [packagingVsAdditives, packagingVsNutrition, additivesVsNutrition]); 

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