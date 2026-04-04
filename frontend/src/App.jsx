import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormDetailPage from './pages/FormDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/forms/new" element={
          <ProtectedRoute><FormBuilderPage /></ProtectedRoute>
        } />
        <Route path="/forms/:id/edit" element={
          <ProtectedRoute><FormBuilderPage /></ProtectedRoute>
        } />
        <Route path="/forms/:id" element={
          <ProtectedRoute><FormDetailPage /></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
