import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setAuthToken } from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await login({ email, password })
      const token = res?.data?.token
      if (token) {
        setAuthToken(token)
      }
      nav('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro no login')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button>Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
