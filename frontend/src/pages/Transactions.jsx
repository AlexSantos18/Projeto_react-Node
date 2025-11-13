import React, { useEffect, useState } from 'react'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api'

const CATEGORIES = ['Salário','Aluguel','Alimentação','Transporte','Lazer','Outros']

export default function Transactions(){
  const [list,setList] = useState([])
  const [form,setForm] = useState({type:'expense',amount:'',category:'Outros',date:''})
  const [filter,setFilter] = useState({from:'',to:'',category:''})

  async function load(){
    const res = await getTransactions(filter)
    setList(res.data)
  }

  useEffect(()=>{ load() }, [])

  async function handleCreate(e){
    e.preventDefault()
    await createTransaction(form)
    setForm({type:'expense',amount:'',category:'Outros',date:''})
    load()
  }

  async function handleDelete(id){
    if(!confirm('Confirma exclusão?')) return
    await deleteTransaction(id)
    load()
  }

  return (
    <div>
      <h2>Transações</h2>

      <section>
        <h3>Filtro</h3>
        <div>
          <label>De</label>
          <input type="date" value={filter.from} onChange={e=>setFilter({...filter,from:e.target.value})} />
          <label>Até</label>
          <input type="date" value={filter.to} onChange={e=>setFilter({...filter,to:e.target.value})} />
          <label>Categoria</label>
          <select value={filter.category} onChange={e=>setFilter({...filter,category:e.target.value})}>
            <option value="">Todas</option>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={load}>Aplicar</button>
        </div>
      </section>

      <section>
        <h3>Nova transação</h3>
        <form onSubmit={handleCreate}>
          <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
          <input placeholder="Valor" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <button>Criar</button>
        </form>
      </section>

      <section>
        <h3>Lista</h3>
        <table border="1" cellPadding="6">
          <thead><tr><th>Tipo</th><th>Valor</th><th>Categoria</th><th>Data</th><th>Ações</th></tr></thead>
          <tbody>
            {list.map(tx=> (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.category}</td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>
                  <button onClick={()=>alert('Editar: implementar UI de edição')}>Editar</button>
                  <button onClick={()=>handleDelete(tx.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
