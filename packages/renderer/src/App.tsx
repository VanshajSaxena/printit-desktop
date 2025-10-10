import { ThemeProvider } from './context/theme/ThemeProvider';
import { Dashboard } from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Dashboard></Dashboard>
    </ThemeProvider>
  );
}

export default App;
