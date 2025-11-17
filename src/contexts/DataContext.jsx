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

  // 히스토리 데이터 상태
  const [historyData, setHistoryData] = useState([
    {
      id: 1,
      productName: "코카콜라 제로",
      barcode: "8801056005887",
      grade: "A",
      score: 85,
      scannedAt: "2024.11.05 오후 3:34",
      scannedAtShort: "2일전",
      detailScores: {
        포장재: 85,
        첨가물: 72,
        영양가치: 88,
      },
    },
    {
      id: 2,
      productName: "코카콜라 제로",
      barcode: "8801043010238",
      grade: "A",
      score: 85,
      scannedAt: "2024.11.05 오후 3:34",
      scannedAtShort: "2일전",
      detailScores: {
        포장재: 85,
        첨가물: 72,
        영양가치: 88,
      },
    },
    {
      id: 3,
      productName: "코카콜라 제로",
      barcode: "8801115114710",
      grade: "A",
      score: 85,
      scannedAt: "2024.11.05 오후 3:34",
      scannedAtShort: "2일전",
      detailScores: {
        포장재: 85,
        첨가물: 72,
        영양가치: 88,
      },
    },
  ]);

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

  // 히스토리 항목 추가 함수
  const addHistoryItem = (item) => {
    setHistoryData((prev) => [item, ...prev]);
  };

  // 히스토리 항목 삭제 함수
  const deleteHistoryItem = (id) => {
    setHistoryData((prev) => prev.filter((item) => item.id !== id));
  };

  // 전체 히스토리 삭제 함수
  const deleteAllHistory = () => {
    setHistoryData([]);
  };

  const value = {
    weights,
    updateWeights,
    resultData,
    setResultData,
    historyData,
    setHistoryData,
    addHistoryItem,
    deleteHistoryItem,
    deleteAllHistory,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};