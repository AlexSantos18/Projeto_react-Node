import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function MonthlyBalanceChart({ data }) {
  return (
    <>
      <h2>Desempenho Mensal</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
            <Line type="monotone" dataKey="income" stroke="#7C3AED" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="expenses" stroke="#06B6D4" strokeWidth={3} dot={{ r: 3 }} />

        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
