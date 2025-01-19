import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryClient, QueryClientProvider } from 'react-query';

import { theme } from './theme/theme';
import { MainLayout } from './layouts/MainLayout';
import { ServiceRequests } from './pages/ServiceRequests/ServiceRequests';
import { Assets } from './pages/Assets/Assets';
import { Locations } from './pages/Locations/Locations';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/service-requests" replace />} />
                <Route path="/service-requests" element={<ServiceRequests />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/locations" element={<Locations />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
