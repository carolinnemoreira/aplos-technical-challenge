import { useEffect, useState } from "react"
import RevenueChart from "./components/RevenueChart"
import TopProductsChart from "./components/TopProductsChart"

function App() {

  const [revenue, setRevenue] = useState([])
  const [topProducts, setTopProducts] = useState([])

  useEffect(() => {

    fetch("http://localhost:3000/api/revenue-by-region")
      .then(res => res.json())
      .then(data => setRevenue(data))

    fetch("http://localhost:3000/api/top-products")
      .then(res => res.json())
      .then(data => setTopProducts(data))

  }, [])

  return (
    <div className="container">

      <h1>Retail Analytics Dashboard</h1>

      <RevenueChart data={revenue} />

      <TopProductsChart data={topProducts} />

    </div>
  )
}

export default App