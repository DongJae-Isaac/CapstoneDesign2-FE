import { useState, useCallback } from "react";
import styles from "./EcoNutriWeightPage.module.css";
import WeightCompare from "../../components/WeightCompare/WeightCompare";
import WeightPieChart from "../../components/WeightPieChart/WeightPieChart";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const EcoNutriWeightPage = () => {
    const navigate = useNavigate();

    // 가중치 상태 (로컬 state) - localStorage에서 불러오거나 기본값 사용
    const [weights, setWeights] = useState(() => {
        const savedWeights = localStorage.getItem('userWeights');
        if (savedWeights) {
            return JSON.parse(savedWeights);
        }
        return {
            packaging: 33.3,
            additives: 33.3,
            nutrition: 33.4,
        };
    });

    // 슬라이더 값 상태 추가
    const [sliderValues, setSliderValues] = useState(() => {
        const savedSliders = localStorage.getItem('userSliderValues');
        if (savedSliders) {
            return JSON.parse(savedSliders);
        }
        return {
            packagingVsAdditives: 0,
            packagingVsNutrition: 0,
            additivesVsNutrition: 0,
        };
    });

    const updateWeights = useCallback((newWeights, newSliderValues) => {
        setWeights(newWeights);
        if (newSliderValues) {
            setSliderValues(newSliderValues);
        }
    }, []);

    let isDisable = false;

    const onClickButton = () => {
        // 가중치와 슬라이더 값을 모두 localStorage에 저장
        localStorage.setItem('userWeights', JSON.stringify(weights));
        localStorage.setItem('userSliderValues', JSON.stringify(sliderValues));

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