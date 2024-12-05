import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './routes';
import { ColorSchemeProvider } from './contexts/ColorSchemeProvider';
import { useColorScheme } from './hooks/useColorScheme';

function AppContent() {
  const { colorScheme } = useColorScheme();

  return (
    <div className={colorScheme === 'dark' ? 'dark' : ''}>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          theme={colorScheme}
          className="dark:bg-surface dark:text-gray-100"
        />
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ColorSchemeProvider>
        <AppContent />
      </ColorSchemeProvider>
    </Provider>
  );
}
