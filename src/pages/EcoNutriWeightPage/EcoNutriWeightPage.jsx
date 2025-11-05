import styles from "./EcoNutriWeightPage.module.css";
import WeightCompare from "../../components/WeightCompare/WeightCompare";
import WeightPieChart from "../../components/WeightPieChart/WeightPieChart";
import Button from "../../components/Button/Button";

const EcoNutriWeightPage = () => {
    let isDisale = false;

    const onClickButton = () => {

    }

    return (
        <>
            <div className={styles.container}>
                <WeightPieChart />
                <WeightCompare />
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