import React, { useState } from 'react'
import { register } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [error,setError] = useState(null)
  const nav = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try{
      await register({ name, email, password })
      nav('/login')
    }catch(err){
      setError(err?.response?.data?.message || 'Erro no registro')
    }
  }

  return (
    <div>
      <h2>Registrar</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Senha</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button>Registrar</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  )
}
