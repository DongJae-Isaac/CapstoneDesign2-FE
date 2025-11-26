
import './App.css'
import './styles/global.css';
import { Layout } from "./components/Layout/Layout";
import { DataProvider } from './contexts/DataContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Layout />
      </DataProvider>
    </QueryClientProvider>
  );
}

export default App
