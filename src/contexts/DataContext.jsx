import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // 가중치 상태
  const [weights, setWeights] = useState({
    packaging: 63.3,
    additives: 10.6,
    nutrition: 26.0,
  });

  // 결과 페이지 mock data
  const [resultData, setResultData] = useState({
    product: {
      name: "샘플 식품",
      manufacturer: "ABC 식품",
      barcode: "8801234567890",
    },
    alternatives: [
      {
        id: 1,
        name: "유기농 식품",
        manufacturer: "DEF 식품",
        grade: "A",
        score: 89,
        imageUrl: null,
      },
      {
        id: 2,
        name: "친환경 식품",
        manufacturer: "GHI 식품",
        grade: "A",
        score: 85,
        imageUrl: null,
      },
      {
        id: 3,
        name: "건강 식품",
        manufacturer: "JKL 식품",
        grade: "B",
        score: 79,
        imageUrl: null,
      },
      {
        id: 4,
        name: "자연주의 식품",
        manufacturer: "MNO 식품",
        grade: "A",
        score: 87,
        imageUrl: null,
      },
    ],
    grade: {
      overall: "A",
      score: 82,
      message: "매우 우수한 선택입니다!",
    },
    detailScores: [
      {
        icon: "🌱",
        label: "포장재 지속가능성",
        score: 85,
        description: "재활용 가능한 포장재 사용",
        color: "green",
      },
      {
        icon: "🏭",
        label: "탄소발자국",
        score: 78,
        description: "탄소 배출 줄이기 필요",
        color: "red",
      },
      {
        icon: "💪",
        label: "영양 균형도",
        score: 88,
        description: "균형잡힌 영양 구성",
        color: "blue",
      },
    ],
    calculation: {
      formula: "(85 × 0.186) + (78 × 0.833) + (88 × 0.250)",
      result: 82,
    },
  });

  // 가중치 업데이트 함수
  const updateWeights = (newWeights) => {
    setWeights(newWeights);
  };

  const value = {
    weights,
    updateWeights,
    resultData,
    setResultData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};