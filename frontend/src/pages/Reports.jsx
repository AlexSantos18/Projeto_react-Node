import React from "react";
import MonthlyBalanceChart from "../components/reports/MonthlyBalanceChart";
import CategoryChart from "../components/reports/CategoryChart";

export default function Reports() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Relatórios</h2>
      <p className="text-gray-600 mb-6">Análises detalhadas de evolução financeira.</p>

      <div className="grid grid-cols-1 gap-6">
        <MonthlyBalanceChart />
        <CategoryChart />
      </div>
    </div>
  );
}
