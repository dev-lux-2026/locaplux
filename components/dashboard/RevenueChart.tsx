"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueChart({ data }) {
  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
      <h2 className="text-lg font-semibold mb-4">Revenus & Commissions</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
          <Line type="monotone" dataKey="commission" stroke="#dc2626" strokeWidth={2} />
          <Line type="monotone" dataKey="partner" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
