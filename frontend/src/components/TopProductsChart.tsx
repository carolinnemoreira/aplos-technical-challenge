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
  regions: string[]
  selectedRegion: string
  onRegionChange: (region: string) => void
  ageBands: string[]
  selectedAgeBand: string
  onAgeBandChange: (ageBand: string) => void
}

export default function TopProductsChart({
  data,
  regions,
  selectedRegion,
  onRegionChange,
  ageBands,
  selectedAgeBand,
  onAgeBandChange,
}: Props) {
  return (
    <div className="chart-card">
      <h2>Top Selling Products</h2>

      <div className="chart-filter">
        <div className="chart-filter-group">
          <label htmlFor="top-products-region-filter">Region</label>
          <select
            id="top-products-region-filter"
            value={selectedRegion}
            onChange={(event) => onRegionChange(event.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="chart-filter-group">
          <label htmlFor="top-products-age-filter">Age range</label>
          <select
            id="top-products-age-filter"
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
        <BarChart data={data} margin={{ top: 0, right: 12, bottom: 0, left: -12 }}>
          <XAxis dataKey="name" stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip
            cursor={false}
            separator=": "
            formatter={(value) => [value, "Quantity"]}
            contentStyle={{
              backgroundColor: "#000000",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#f9fafb" }}
          />
          <Bar
            dataKey="quantity"
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
