import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type Props = {
  data: any[]
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  ageBands: string[]
  selectedAgeBand: string
  onAgeBandChange: (ageBand: string) => void
}

export default function RevenueChart({
  data,
  categories,
  selectedCategory,
  onCategoryChange,
  ageBands,
  selectedAgeBand,
  onAgeBandChange,
}: Props) {
  return (
    <div className="chart-card">
      <h2>Revenue by Region</h2>

      <div className="chart-filter">
        <div className="chart-filter-group">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="chart-filter-group">
          <label htmlFor="category-age-filter">Age range</label>
          <select
            id="category-age-filter"
            value={selectedAgeBand}
            onChange={(event) => onAgeBandChange(event.target.value)}
          >
            {ageBands.map((ageBand) => (
              <option key={ageBand} value={ageBand}>
                {ageBand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
          <XAxis dataKey="region" stroke="#cbd5f5" />
          <YAxis
            stroke="#cbd5f5"
            width={96}
            tickFormatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(value))
            }
          />
          <Tooltip
            cursor={false}
            separator=": "
            formatter={(value) => [
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(value)),
              "Total value",
            ]}
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#f9fafb" }}
          />
          <Bar
            dataKey="total_value"
            fill="#2C91AD"
            radius={[6, 6, 0, 0]}
            activeBar={{
              fill: "#2C91AD",
              stroke: "#94a3b8",
              strokeWidth: 1,
              filter: "drop-shadow(0 0 6px rgba(148, 163, 184, 0.45))",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
