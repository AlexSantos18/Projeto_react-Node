import React, { useEffect, useState } from 'react'
import { getSummary } from '../api'

export default function Dashboard(){
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      setError(null)
      try{
        // default: last 30 days
        const to = new Date().toISOString().slice(0,10)
        const d = new Date(); d.setDate(d.getDate()-30)
        const from = d.toISOString().slice(0,10)
        const res = await getSummary({ from, to })
        setSummary(res.data)
      }catch(err){
        setError(err?.response?.data?.message || err.message)
      }finally{
        setLoading(false)
      }
    }
    load()
  },[])

  const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Resumo rápido — total de receitas, despesas e saldo.</p>
      {loading && <p>Carregando resumo...</p>}
      {error && <p style={{color:'red'}}>Erro: {error}</p>}
      {summary && (
        <div>
          <div style={{marginBottom:12}}>
            Período: <strong>{summary.period?.from}</strong> até <strong>{summary.period?.to}</strong>
          </div>
          <div style={{display:'flex', gap:16}}>
            <div style={{padding:12, border:'1px solid #ccc'}}>
              <strong>Receitas</strong>
              <div>{fmt.format(Number(summary.incomeTotal) || 0)}</div>
            </div>
            <div style={{padding:12, border:'1px solid #ccc'}}>
              <strong>Despesas</strong>
              <div>{fmt.format(Number(summary.expenseTotal) || 0)}</div>
            </div>
            <div style={{padding:12, border:'1px solid #ccc'}}>
              <strong>Saldo</strong>
              <div>{fmt.format(Number(summary.balance) || 0)}</div>
            </div>
          </div>

          <h3>Por categoria</h3>
          <table border="1" cellPadding="6">
            <thead><tr><th>Categoria</th><th>Total</th></tr></thead>
            <tbody>
              {(summary.byCategory||[]).map(c=> (
                <tr key={c.category}><td>{c.category}</td><td>{fmt.format(Number(c.total) || 0)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
