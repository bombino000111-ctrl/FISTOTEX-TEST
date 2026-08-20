"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface SIPChartProps {
  totalInvested: number;
  estimatedReturns: number;
  months: number;
}

export function SIPChart({ totalInvested, estimatedReturns }: SIPChartProps) {
  const data = [
    { name: "Invested Amount", value: totalInvested },
    { name: "Estimated Returns", value: estimatedReturns },
  ];

  const COLORS = ["#0F172A", "#16A34A"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
