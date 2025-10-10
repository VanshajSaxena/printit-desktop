import { ThemeProvider } from './context/theme/ThemeProvider';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <Dashboard></Dashboard>
    </ThemeProvider>
  );
}

export default App;
