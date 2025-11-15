// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ---- SCHEMA DE VALIDAÇÃO ----
const loginSchema = z.object({
  email: z.string().email('Informe um email válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ---- SUBMIT HANDLER ----
  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await apiLogin(data);
      const token = response.data.token;
      login(token);
      navigate('/');

    } catch (err) {
      setServerError(err.response?.data?.message || 'Erro ao realizar login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Acessar conta</h2>

        {serverError && (
          <p className="text-red-500 mb-4 text-center text-sm">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* EMAIL */}
          <div className="mb-5">
            <label htmlFor="email" className="block mb-1 text-slate-700 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-slate-700 font-medium">
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-md text-white transition font-medium ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link para registro */}
        <p className="text-center text-sm text-slate-600 mt-5">
          Não tem conta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
