import { createBrowserRouter } from 'react-router-dom';
import App from "../App";
import routes from "../constants/routes";

import EcoNutriWeightPage from '../pages/EcoNutriWeightPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: routes.ecoweight,
                element: <EcoNutriWeightPage />
            }
        ]
    }
]);

export default router;