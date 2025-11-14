// src/pages/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

// ✅ Mock com as funções necessárias
jest.mock('../api', () => ({
  login: jest.fn(),
  setAuthToken: jest.fn(), // <-- Adicionado
}));

import { login as apiLogin } from '../api';

const renderWithProviders = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    apiLogin.mockClear();
  });

  test('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  test('calls login API and redirects on success', async () => {
    // ✅ Corrigido: Agora simula a resposta real do Axios (objeto com `data`)
    // Supondo que api.login retorne { data: { token: '...' } }
    apiLogin.mockResolvedValue({ data: { token: 'fake-jwt-token' } });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(apiLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('shows error message on login failure', async () => {
    // ✅ Corrigido: Agora simula o erro real do Axios (objeto com `response.data`)
    // Supondo que o erro tenha a estrutura: { response: { data: { message: '...' } } }
    apiLogin.mockRejectedValue({
      response: {
        data: {
          message: 'Credenciais inválidas',
        },
      },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});