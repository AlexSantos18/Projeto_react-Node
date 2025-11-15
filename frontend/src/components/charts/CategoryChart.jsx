import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function CategoryChart({ data }) {
    const colors = ['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];


  return (
    <>
      <h2>Gastos por Categoria</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie dataKey="value" data={data} outerRadius={110} fill="#8884d8" label>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
