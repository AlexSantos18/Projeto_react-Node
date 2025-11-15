import React, { useEffect, useState } from "react";
import { getSummary } from "../api";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "react-feather";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const to = new Date().toISOString().slice(0, 10);
        const d = new Date();
        d.setDate(d.getDate() - 30);
        const from = d.toISOString().slice(0, 10);

        const res = await getSummary({ from, to });
        setSummary(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  const Card = ({ title, value, icon: Icon, color }) => (
    <div className={`p-5 bg-white rounded-xl shadow-card border-l-4 ${color}`}>
      <div className="flex items-center gap-2 text-gray-600 font-medium">
        <Icon size={18} />
        {title}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{fmt.format(Number(value) || 0)}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-600 mb-6">Resumo financeiro dos últimos 30 dias.</p>

      {loading && <p className="animate-pulse">Carregando dados...</p>}
      {error && <p className="text-red-500 font-semibold">Erro: {error}</p>}

      {summary && (
        <>
          <div className="text-sm text-gray-500 mb-4">
            Período: <strong>{summary.period?.from}</strong> até <strong>{summary.period?.to}</strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card title="Receitas" value={summary.incomeTotal} icon={ArrowUpCircle} color="border-green-400" />
            <Card title="Despesas" value={summary.expenseTotal} icon={ArrowDownCircle} color="border-red-400" />
            <Card title="Saldo" value={summary.balance} icon={Wallet} color="border-fintech-300" />
          </div>

          <h3 className="text-xl font-bold mb-3">Por categoria</h3>

          <table className="w-full bg-white rounded-xl shadow-card text-left overflow-hidden">
            <thead className="bg-slate-100 text-gray-600">
              <tr>
                <th className="px-4 py-2">Categoria</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {(summary.byCategory || []).map((c) => (
                <tr key={c.category} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{c.category}</td>
                  <td className="px-4 py-2 font-medium">{fmt.format(Number(c.total) || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
