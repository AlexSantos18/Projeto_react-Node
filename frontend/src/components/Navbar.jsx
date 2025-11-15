// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="font-bold text-lg">💰 Finance Pessoal</h1>

      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-300 transition">Dashboard</Link>
        <Link to="/transactions" className="hover:text-blue-300 transition">Transações</Link>
        <Link to="/reports" className="hover:text-blue-300 transition">Relatórios</Link>

        {token ? (
          <button
            onClick={logout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Sair
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
            <Link to="/register" className="hover:text-blue-300 transition">Criar Conta</Link>
          </>
        )}
      </div>
    </nav>
  );
}
