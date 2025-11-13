import { createBrowserRouter } from 'react-router-dom';
import App from "../App";
import routes from "../constants/routes";

import EcoNutriWeightPage from '../pages/EcoNutriWeightPage/EcoNutriWeightPage';
import ResultPage from '../pages/ResultPage/ResultPage'; 

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: routes.ecoweight,
                element: <EcoNutriWeightPage />
            },
            {
                path: '/result',  
                element: <ResultPage />
            }
        ]
    }
]);

export default router;