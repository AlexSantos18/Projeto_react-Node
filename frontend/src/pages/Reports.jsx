import React, { useEffect, useState } from "react";
import { getSummary } from "../api";
import { TrendingUp, TrendingDown, PieChart } from "react-feather";

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(30); // dias

  useEffect(() => {
    loadData();
  }, [period]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const to = new Date().toISOString().slice(0, 10);
      const d = new Date();
      d.setDate(d.getDate() - period);
      const from = d.toISOString().slice(0, 10);

      const res = await getSummary({ from, to });
      setSummary(res.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      const errorMsg = err?.response?.data?.message || err.message;
      setError(errorMsg);
      
      // Dados mockados para desenvolvimento
      setSummary({
        period: { 
          from: new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          to: new Date().toISOString().slice(0, 10)
        },
        incomeTotal: 5000,
        expenseTotal: 3200,
        balance: 1800,
        byCategory: [
          { category: 'Alimentação', total: -800, type: 'expense' },
          { category: 'Transporte', total: -400, type: 'expense' },
          { category: 'Lazer', total: -600, type: 'expense' },
          { category: 'Moradia', total: -1400, type: 'expense' },
          { category: 'Salário', total: 5000, type: 'income' },
        ]
      });
    } finally {
      setLoading(false);
    }
  }

  const fmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-gray-600">Análise detalhada das suas finanças</p>
        </div>

        {/* Filtro de período */}
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Últimos 7 dias</option>
          <option value={15}>Últimos 15 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={60}>Últimos 60 dias</option>
          <option value={90}>Últimos 90 dias</option>
          <option value={180}>Últimos 6 meses</option>
          <option value={365}>Último ano</option>
        </select>
      </div>

      {loading && <p className="animate-pulse text-center py-8">Carregando relatórios...</p>}
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 font-semibold">⚠️ Aviso: {error}</p>
          <p className="text-sm text-yellow-600 mt-1">
            Exibindo dados de exemplo. Verifique se a rota <code>/api/reports/summary</code> existe no backend.
          </p>
        </div>
      )}

      {summary && (
        <>
          {/* Período */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              📅 Período analisado: <strong>{summary.period?.from}</strong> até <strong>{summary.period?.to}</strong>
            </p>
          </div>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-400">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <TrendingUp size={20} className="text-green-500" />
                <span className="font-medium">Receitas Totais</span>
              </div>
              <p className="text-3xl font-bold text-green-600">
                {fmt.format(Number(summary.incomeTotal) || 0)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-400">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <TrendingDown size={20} className="text-red-500" />
                <span className="font-medium">Despesas Totais</span>
              </div>
              <p className="text-3xl font-bold text-red-600">
                {fmt.format(Number(summary.expenseTotal) || 0)}
              </p>
            </div>

            <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
              (summary.balance || 0) >= 0 ? 'border-blue-400' : 'border-orange-400'
            }`}>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <PieChart size={20} />
                <span className="font-medium">Saldo do Período</span>
              </div>
              <p className={`text-3xl font-bold ${
                (summary.balance || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {fmt.format(Number(summary.balance) || 0)}
              </p>
            </div>
          </div>

          {/* Tabela de categorias */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-xl font-bold">Gastos por Categoria</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % do Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(summary.byCategory || []).map((cat, idx) => {
                    const isIncome = (cat.type === 'income' || cat.total > 0);
                    const total = Math.abs(Number(cat.total) || 0);
                    const totalBase = isIncome ? summary.incomeTotal : summary.expenseTotal;
                    const percentage = totalBase ? (total / Math.abs(totalBase) * 100).toFixed(1) : 0;
                    
                    return (
                      <tr key={cat.category || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{cat.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            isIncome 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {isIncome ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                          isIncome ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {fmt.format(total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                          {percentage}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Taxa de Economia</h3>
              {summary.incomeTotal > 0 ? (
                <>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-blue-600">
                      {((summary.balance / summary.incomeTotal) * 100).toFixed(1)}%
                    </span>
                    <span className="text-gray-500 mb-1">das receitas</span>
                  </div>
                  <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((summary.balance / summary.incomeTotal) * 100, 100)}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Sem receitas no período</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Média Diária de Gastos</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-red-600">
                  {fmt.format((summary.expenseTotal || 0) / period)}
                </span>
                <span className="text-gray-500 mb-1">por dia</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Baseado em {period} dias de análise
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}