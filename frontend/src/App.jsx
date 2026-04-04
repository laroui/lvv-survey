import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FormBuilderPage from './pages/FormBuilderPage';
import FormDetailPage from './pages/FormDetailPage';
import ResponsesPage from './pages/ResponsesPage';
import PartnersPage from './pages/PartnersPage';
import PartnerDetailPage from './pages/PartnerDetailPage';
import PublicSurveyPage from './pages/PublicSurveyPage';
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

        <Route path="/responses" element={
          <ProtectedRoute><ResponsesPage /></ProtectedRoute>
        } />

        <Route path="/partners" element={
          <ProtectedRoute><PartnersPage /></ProtectedRoute>
        } />
        <Route path="/partners/:id" element={
          <ProtectedRoute><PartnerDetailPage /></ProtectedRoute>
        } />

        <Route path="/f/:token" element={<PublicSurveyPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
