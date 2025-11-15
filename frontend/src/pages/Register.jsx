// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ---- SCHEMA DE VALIDAÇÃO ----
const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter ao menos 3 caracteres'),
  email: z.string().email('Informe um email válido'),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres'),
});

export default function Register() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await apiRegister(data);
      reset();
      navigate('/login');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Erro ao registrar');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Criar Conta</h2>

        {serverError && <p className="text-red-500 text-center mb-3 text-sm">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* NAME */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 text-slate-700 font-medium">Nome</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-slate-700 font-medium">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-slate-700 font-medium">Senha</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        {/* LINK LOGIN */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Já possui conta?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
