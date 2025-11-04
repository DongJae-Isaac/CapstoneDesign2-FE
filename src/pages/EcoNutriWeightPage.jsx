import styles from "./EcoNutriWeightPage.module.css";
import WeightCompare from "../components/WeightCompare/WeightCompare";

const EcoNutriWeightPage = () => {
    

    return (
        <>
            <div className={styles.container}>
                <WeightCompare />
            </div>
        </> 
    );
}

export default EcoNutriWeightPage;