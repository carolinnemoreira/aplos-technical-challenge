import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
  data: any[]
}

export default function RevenueChart({ data }: Props) {
  return (
    <div className="chart-card">
      <h2>Revenue by Region ($)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="region" stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip />
          <Bar dataKey="total_value" fill="#64748b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}