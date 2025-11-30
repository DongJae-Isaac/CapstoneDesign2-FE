import { useState, useCallback, useEffect } from "react";
import styles from "./EcoNutriWeightPage.module.css";
import WeightCompare from "../../components/WeightCompare/WeightCompare";
import WeightPieChart from "../../components/WeightPieChart/WeightPieChart";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { calculateGrade } from "../../features/barcode/api";

const EcoNutriWeightPage = () => {
    const navigate = useNavigate();

    // 사용자 ID 가져오기
    const userId = localStorage.getItem('userId') || '1';

    // 가중치 상태 (백엔드에서 계산된 값)
    const [weights, setWeights] = useState({
        packaging: 33.3,
        additives: 33.3,
        nutrition: 33.4,
    });

    // 슬라이더 값 상태
    const [sliderValues, setSliderValues] = useState(() => {
        const savedSliders = localStorage.getItem(`userSliderValues_${userId}`);
        if (savedSliders) {
            return JSON.parse(savedSliders);
        }
        return {
            packagingVsAdditives: 0,
            packagingVsNutrition: 0,
            additivesVsNutrition: 0,
        };
    });

    const updateWeights = useCallback((_, newSliderValues) => {
        if (newSliderValues) {
            setSliderValues(newSliderValues);
        }
    }, []);

    // 슬라이더 값이 변경될 때마다 백엔드에서 가중치 계산
    useEffect(() => {
        const fetchWeights = async () => {
            try {
                // 더미 데이터로 API 호출하여 가중치만 계산
                const dummyScores = {
                    barcode: "0000000000000",
                    name: "가중치 계산용",
                    nutrition: { score: 50, sodium_mg: 0, sugar_g: 0, sat_fat_g: 0, trans_fat_g: 0 },
                    packaging: { score: 50, material: "plastic" },
                    additives: { score: 50, count: 0 }
                };

                const priorities = {
                    pkg_vs_add: sliderValues.packagingVsAdditives,
                    pkg_vs_nut: sliderValues.packagingVsNutrition,
                    add_vs_nut: sliderValues.additivesVsNutrition
                };

                const result = await calculateGrade(
                    parseInt(userId),
                    { scores: dummyScores, priorities },
                    false // 히스토리에 저장하지 않음
                );

                // 백엔드에서 계산된 가중치를 퍼센트로 변환
                setWeights({
                    packaging: Number((result.weights.packaging_weight * 100).toFixed(1)),
                    additives: Number((result.weights.additives_weight * 100).toFixed(1)),
                    nutrition: Number((result.weights.nutrition_weight * 100).toFixed(1)),
                });
            } catch (error) {
                console.error('가중치 계산 실패:', error);
                // 에러 시 기본값 유지
            }
        };

        fetchWeights();
    }, [sliderValues, userId]);

    let isDisable = false;

    const onClickButton = () => {
        // 슬라이더 값과 계산된 가중치를 사용자별로 localStorage에 저장
        localStorage.setItem(`userWeights_${userId}`, JSON.stringify(weights));
        localStorage.setItem(`userSliderValues_${userId}`, JSON.stringify(sliderValues));

        // 메인 페이지로 이동
        navigate("/usermain");
    };

    return (
        <>
            <div className={styles.container}>
                <WeightPieChart weights={weights}/>
                <WeightCompare updateWeights={updateWeights} initialSliderValues={sliderValues}/>
                <Button
                    text={"설정 완료"}
                    type={'long'}
                    onClick={onClickButton}
                    disabled={isDisable}
                    className={styles.Button}
                />
            </div>
        </>
    );
}

export default EcoNutriWeightPage;