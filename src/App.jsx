import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import './index.css';
import AppRoutes from './routes/AppRoutes.jsx';
import theme from './styles/themes.js';
import { unstable_HistoryRouter as BrowserRouter } from 'react-router-dom/dist';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import { history } from './services/history.js';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <Provider store={store}>
          <BrowserRouter history={history}>
            <AppRoutes />
          </BrowserRouter>
        </Provider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
