import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import App from './App';
import './index.css';

// Lazy loading das páginas
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Reports = lazy(() => import('./pages/Reports'));

// Componente de rota privada
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// Bloqueia o acesso à login/register quando já logado
function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : children;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Suspense fallback={<div className="p-4 text-center">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<App />}>
              {/* Rotas privadas */}
              <Route index element={
                <PrivateRoute><Dashboard /></PrivateRoute>
              } />

              <Route path="transactions" element={
                <PrivateRoute><Transactions /></PrivateRoute>
              } />

              <Route path="reports" element={
                <PrivateRoute><Reports /></PrivateRoute>
              } />

              {/* Rotas públicas */}
              <Route path="login" element={
                <PublicRoute><Login /></PublicRoute>
              } />

              <Route path="register" element={
                <PublicRoute><Register /></PublicRoute>
              } />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
