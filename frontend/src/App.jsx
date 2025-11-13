import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { setAuthToken } from './api'

export default function App(){
  const [token, setToken] = useState(null)
  const nav = useNavigate()

  useEffect(()=>{
    const t = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('token') : null
    setToken(t)
  },[])

  function handleLogout(){
    setAuthToken(null)
    setToken(null)
    nav('/login')
  }

  return (
    <div style={{maxWidth:900, margin:'0 auto', padding:20}}>
      <header>
        <h1>Finance Pessoal (Estudo)</h1>
        <nav>
          <Link to="/">Dashboard</Link> | <Link to="/transactions">Transações</Link> | <Link to="/reports">Relatórios</Link> | {!token ? <Link to="/login">Login</Link> : <button onClick={handleLogout}>Logout</button>}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
