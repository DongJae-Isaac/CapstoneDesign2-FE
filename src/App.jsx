
import './App.css'
import './styles/global.css';
import { Layout } from "./components/Layout/Layout";
import { DataProvider } from './contexts/DataContext';

function App() {
  
  return (
    <DataProvider>
      <Layout />
    </DataProvider>
  );
}

export default App
