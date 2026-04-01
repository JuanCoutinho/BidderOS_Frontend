import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import type { RootState, AppDispatch } from './store/store';
import { useMeQuery } from './store/authApi';
import { setUser, setLoading, logout } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ResumesPage from './pages/ResumesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import OnboardingPage from './pages/OnboardingPage';

function AppInit() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data, error, isLoading } = useMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (!token) {
      dispatch(setLoading(false));
      return;
    }
    if (!isLoading) {
      if (data) dispatch(setUser(data.user));
      else if (error) dispatch(logout());
      dispatch(setLoading(false));
    }
  }, [data, error, isLoading, token, dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInit />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/resumes" element={<ProtectedRoute><ResumesPage /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
