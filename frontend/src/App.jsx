import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { useAuth } from './context/AuthContext';


export default function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Navbar só aparece se logado */}
        {token && <Navbar />}

        <main className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
