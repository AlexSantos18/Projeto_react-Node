import React, { useEffect, useState } from "react";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../api";
import { PlusCircle, Edit2, Trash2, X } from "react-feather";

const CATEGORIES = ["Salário", "Aluguel", "Alimentação", "Transporte", "Lazer", "Outros"];

export default function Transactions() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ id: null, type: "expense", amount: "", category: "Outros", date: "" });
  const [filter, setFilter] = useState({ from: "", to: "", category: "" });
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    const res = await getTransactions(filter);
    setList(res.data);
  }

  useEffect(() => { load(); }, []);

  function openModal(transaction = null) {
    if (transaction) {
      setForm(transaction);
    } else {
      setForm({ id: null, type: "expense", amount: "", category: "Outros", date: "" });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.id) {
      await updateTransaction(form.id, form);
    } else {
      await createTransaction(form);
    }
    setModalOpen(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Deseja remover esta transação?")) return;
    await deleteTransaction(id);
    load();
  }

  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Transações</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-fintech-300 to-fintech-cyan text-white px-4 py-2 rounded-xl shadow-soft-lg hover:opacity-95 hover:-translate-y-0.5 transition"
        >
          <PlusCircle size={18} /> Nova
        </button>
      </div>

      {/* FILTRO */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-card">
        <h3 className="text-lg font-semibold mb-2">Filtro</h3>
        <div className="flex flex-wrap gap-2 items-end">
          <input type="date" value={filter.from} onChange={e => setFilter({ ...filter, from: e.target.value })} className="input" />
          <input type="date" value={filter.to} onChange={e => setFilter({ ...filter, to: e.target.value })} className="input" />
          <select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })} className="input">
            <option value="">Todas</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={load} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">Aplicar</button>
        </div>
      </div>

      {/* TABELA */}
      <table className="w-full bg-white rounded-xl shadow-card">
        <thead className="bg-slate-100 text-gray-600">
          <tr>
            <th className="px-3 py-2">Tipo</th>
            <th className="px-3 py-2">Valor</th>
            <th className="px-3 py-2">Categoria</th>
            <th className="px-3 py-2">Data</th>
            <th className="px-3 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {list.map(tx => (
            <tr key={tx.id} className="border-t hover:bg-gray-50">
              <td className="px-3 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {tx.type === "income" ? "Receita" : "Despesa"}
                </span>
              </td>
              <td className="px-3 py-2 font-medium">{currency.format(tx.amount)}</td>
              <td className="px-3 py-2">{tx.category}</td>
              <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="px-3 py-2 flex gap-2 justify-center">
                <button onClick={() => openModal(tx)} className="text-blue-600 hover:text-blue-900"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(tx.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white w-[95%] max-w-md rounded-xl shadow-card p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{form.id ? "Editar transação" : "Nova transação"}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><X /></button>
            </div>

            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input mb-3">
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>

            <input placeholder="Valor" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input mb-3" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input mb-3">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input mb-5" />

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 border rounded-lg">Cancelar</button>
              <button className="px-4 py-2 bg-gradient-to-r from-fintech-300 to-fintech-cyan text-white rounded-lg shadow">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
