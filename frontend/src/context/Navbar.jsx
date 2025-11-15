import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transações', path: '/transactions' },
    { label: 'Relatórios', path: '/reports' },
  ];

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      logout();
      navigate('/login');
    }
  };

  if (!token) return null; // 🔥 Esconde navbar se não estiver logado

  return (
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
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-1 rounded-full transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
