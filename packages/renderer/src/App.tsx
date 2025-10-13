import { ThemeProvider } from './context/theme/ThemeProvider';
import './App.css';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <ThemeProvider>
      <AppLayout></AppLayout>
    </ThemeProvider>
  );
}

export default App;
