import { useData } from "../../contexts/DataContext";
import styles from "./EcoNutriWeightPage.module.css";
import WeightCompare from "../../components/WeightCompare/WeightCompare";
import WeightPieChart from "../../components/WeightPieChart/WeightPieChart";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const EcoNutriWeightPage = () => {
    const navigate = useNavigate();
    const {weights, updateWeights} = useData();
    let isDisale = false;

    const onClickButton = () => {
        navigate("/");
    }

    return (
        <>
            <div className={styles.container}>
                <WeightPieChart weights={weights}/>
                <WeightCompare updateWeights={updateWeights}/>
                <Button 
                text={"설정 완료"} 
                type = {'long'} 
                onClick = {onClickButton} 
                disabled = {isDisale} 
                className = {styles.Button}/>
            </div>
        </> 
    );
}

export default EcoNutriWeightPage;