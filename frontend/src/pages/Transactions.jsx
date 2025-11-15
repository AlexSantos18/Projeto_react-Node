import React, { useEffect, useState } from "react";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../api";
import { PlusCircle, Edit2, Trash2, X } from "react-feather";

const CATEGORIES = ["Salário", "Aluguel", "Alimentação", "Transporte", "Lazer", "Outros"];

export default function Transactions() {
  const [list, setList] = useState([]);
  // ✅ CORREÇÃO: Adicionado campo 'note'
  const [form, setForm] = useState({ 
    id: null, 
    type: "expense", 
    amount: "", 
    category: "Outros", 
    date: "", 
    note: "" 
  });
  const [filter, setFilter] = useState({ from: "", to: "", category: "" });
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    try {
      const res = await getTransactions(filter);
      setList(res.data);
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
    }
  }

  useEffect(() => { load(); }, []);

  function openModal(transaction = null) {
    if (transaction) {
      setForm({
        ...transaction,
        // Garantir que todos os campos existam
        note: transaction.note || ""
      });
    } else {
      setForm({ 
        id: null, 
        type: "expense", 
        amount: "", 
        category: "Outros", 
        date: new Date().toISOString().split('T')[0], // Data de hoje por padrão
        note: "" 
      });
    }
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      // Validação básica
      if (!form.amount || parseFloat(form.amount) <= 0) {
        alert('Informe um valor válido');
        return;
      }
      if (!form.date) {
        alert('Informe uma data');
        return;
      }

      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        note: form.note || null // Enviar null se estiver vazio
      };

      if (form.id) {
        await updateTransaction(form.id, payload);
      } else {
        await createTransaction(payload);
      }
      
      setModalOpen(false);
      load();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar transação: ' + (err.response?.data?.message || err.message));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja remover esta transação?")) return;
    try {
      await deleteTransaction(id);
      load();
    } catch (err) {
      console.error('Erro ao deletar:', err);
      alert('Erro ao deletar transação');
    }
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
          <input 
            type="date" 
            value={filter.from} 
            onChange={e => setFilter({ ...filter, from: e.target.value })} 
            className="input"
            placeholder="Data inicial" 
          />
          <input 
            type="date" 
            value={filter.to} 
            onChange={e => setFilter({ ...filter, to: e.target.value })} 
            className="input"
            placeholder="Data final" 
          />
          <select 
            value={filter.category} 
            onChange={e => setFilter({ ...filter, category: e.target.value })} 
            className="input"
          >
            <option value="">Todas</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <button 
            onClick={load} 
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-card">
          <thead className="bg-slate-100 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Tipo</th>
              <th className="px-3 py-2 text-right">Valor</th>
              <th className="px-3 py-2 text-left">Categoria</th>
              <th className="px-3 py-2 text-left">Data</th>
              <th className="px-3 py-2 text-left">Observação</th>
              <th className="px-3 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-3 py-8 text-center text-gray-500">
                  Nenhuma transação encontrada. Clique em "Nova" para adicionar.
                </td>
              </tr>
            ) : (
              list.map(tx => (
                <tr key={tx.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {tx.type === "income" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-right">{currency.format(tx.amount)}</td>
                  <td className="px-3 py-2">{tx.category}</td>
                  <td className="px-3 py-2">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{tx.note || '-'}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => openModal(tx)} 
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx.id)} 
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white w-full max-w-md rounded-xl shadow-card p-6 animate-fadeIn"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {form.id ? "Editar transação" : "Nova transação"}
              </h3>
              <button 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select 
                  value={form.type} 
                  onChange={e => setForm({ ...form, type: e.target.value })} 
                  className="input w-full"
                  required
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="1000,00" 
                  value={form.amount} 
                  onChange={e => setForm({ ...form, amount: e.target.value })} 
                  className="input w-full" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select 
                  value={form.category} 
                  onChange={e => setForm({ ...form, category: e.target.value })} 
                  className="input w-full"
                  required
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={e => setForm({ ...form, date: e.target.value })} 
                  className="input w-full" 
                  required
                />
              </div>

              {/* ✅ NOVO CAMPO: Observação/Nota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observação (opcional)
                </label>
                <textarea
                  placeholder="Ex: Salário mensal, Pagamento aluguel..."
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  className="input w-full resize-none"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                onClick={() => setModalOpen(false)} 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-fintech-300 to-fintech-cyan text-white rounded-lg shadow hover:opacity-90"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}