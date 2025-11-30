import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import routes from "../constants/routes";

import EcoNutriWeightPage from "../pages/EcoNutriWeightPage/EcoNutriWeightPage";
import ResultPage from "../pages/ResultPage/ResultPage";
import BarcodePage from "../pages/BarcodePage/BarcodePage";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import HistoryPage from "../pages/HistoryPage/HistoryPage";
import HistoryDetailPage from "../pages/HistoryDetailPage/HistoryDetailPage";
import MainPage from "../pages/UserMainPage/UserMainPage";
import UserMainPage from "../pages/UserMainPage/UserMainPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <LandingPage />, // 시작 페이지
        },
        {
          path: "/login",
          element: <LoginPage />, // 로그인 페이지
        },
        {
          path: "/signup",
          element: <SignupPage />, // 회원가입 페이지
        },
        {
          path: "/usermain",
          element: <UserMainPage />,
        },
        {
          path: "/history",
          element: <HistoryPage />,
        },
        {
          path: "/history/:scanId",
          element: <HistoryDetailPage />,
        },
        {
          path: routes.ecoweight,
          element: <EcoNutriWeightPage />,
        },
        {
          path: "/result",
          element: <ResultPage />,
        },
        {
          path: "/barcode",
          element: <BarcodePage />,
        },
      ],
    },
  ],
  {
    // 👇 여기가 핵심입니다! 이 부분이 있어야 GitHub Pages 경로를 인식합니다.
    basename: "/CapstoneDesign2-FE",
  }
);

export default router;
