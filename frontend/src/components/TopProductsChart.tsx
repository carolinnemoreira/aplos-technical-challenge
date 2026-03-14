import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
  data: any[]
}

export default function TopProductsChart({ data }: Props) {
  return (
    <div className="chart-card">
      <h2>Top Selling Products</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip />
          <Bar dataKey="quantity" fill="#94a3b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}