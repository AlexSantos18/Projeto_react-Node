// src/App.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Importe o hook

export default function App() {
  const { token, logout } = useAuth(); // Use o hook
  const nav = useNavigate();

  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    nav('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Finance Pessoal <span className="text-blue-600">(Estudo)</span>
            </h1>
            <p className="text-sm text-slate-500">
              Controle simples de receitas, despesas e relatórios.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <Link
              to="/"
              className="px-3 py-1 rounded-full hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className="px-3 py-1 rounded-full hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
            >
              Transações
            </Link>
            <Link
              to="/reports"
              className="px-3 py-1 rounded-full hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition"
            >
              Relatórios
            </Link>

            {!token ? (
              <Link
                to="/login"
                className="ml-2 px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </nav>
        </header>

        <main className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}