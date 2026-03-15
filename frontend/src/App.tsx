import { useEffect, useState } from "react"
import RevenueChart from "./components/RevenueChart"
import TopProductsChart from "./components/TopProductsChart"

type RevenueItem = {
  region: string
  total_value: number
}

type TopProductItem = {
  name: string
  quantity: number
}

type TopProductByRegionItem = {
  region: string
  name: string
  quantity: number
}

type TopProductByRegionAgeBandItem = {
  region: string
  age_band: string
  name: string
  quantity: number
}

type CategoryRevenueItem = {
  category: string
  total_value: number
}

type RevenueByRegionCategoryItem = {
  region: string
  category: string
  total_value: number
}

type RevenueByRegionCategoryAgeBandItem = {
  region: string
  category: string
  age_band: string
  total_value: number
}

const AGE_BANDS = ["All ages", "18–25", "26–35", "36–45", "46–60", "60+"]

function App() {
  const [baseRevenue, setBaseRevenue] = useState<RevenueItem[]>([])
  const [revenue, setRevenue] = useState<RevenueItem[]>([])
  const [revenueByRegionCategory, setRevenueByRegionCategory] = useState<
    RevenueByRegionCategoryItem[]
  >([])
  const [revenueByRegionCategoryAgeBand, setRevenueByRegionCategoryAgeBand] =
    useState<RevenueByRegionCategoryAgeBandItem[]>([])
  const [baseTopProducts, setBaseTopProducts] = useState<TopProductItem[]>([])
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([])
  const [topProductsByRegion, setTopProductsByRegion] = useState<
    TopProductByRegionItem[]
  >([])
  const [topProductsByRegionAgeBand, setTopProductsByRegionAgeBand] = useState<
    TopProductByRegionAgeBandItem[]
  >([])
  const [selectedTopProductRegion, setSelectedTopProductRegion] =
    useState("All regions")
  const [selectedTopProductAgeBand, setSelectedTopProductAgeBand] =
    useState("All ages")
  const [categories, setCategories] = useState<string[]>(["All categories"])
  const [selectedCategory, setSelectedCategory] = useState("All categories")
  const [selectedRevenueAgeBand, setSelectedRevenueAgeBand] =
    useState("All ages")

  useEffect(() => {
    fetch("http://localhost:3000/api/revenue-by-region")
      .then((res) => res.json())
      .then((data) => {
        setBaseRevenue(data)
        setRevenue(data)
      })

    fetch("http://localhost:3000/api/revenue-by-region-category")
      .then((res) => res.json())
      .then((data) => setRevenueByRegionCategory(data))

    fetch("http://localhost:3000/api/revenue-by-region-category-age-band")
      .then((res) => res.json())
      .then((data) => setRevenueByRegionCategoryAgeBand(data))

    fetch("http://localhost:3000/api/top-products")
      .then((res) => res.json())
      .then((data) => {
        setBaseTopProducts(data)
        setTopProducts(data)
      })

    fetch("http://localhost:3000/api/top-products-by-region")
      .then((res) => res.json())
      .then((data: TopProductByRegionItem[]) => {
        setTopProductsByRegion(data)
      })

    fetch("http://localhost:3000/api/top-products-by-region-age-band")
      .then((res) => res.json())
      .then((data) => setTopProductsByRegionAgeBand(data))

    fetch("http://localhost:3000/api/category-revenue")
      .then((res) => res.json())
      .then((data: CategoryRevenueItem[]) => {
        setCategories(["All categories", ...data.map((item) => item.category)])
      })
  }, [])

  const aggregateRevenueByRegion = (
    items: Array<{ region: string; total_value: number }>,
  ): RevenueItem[] => {
    const totals = new Map<string, number>()

    items.forEach((item) => {
      const previous = totals.get(item.region) ?? 0
      totals.set(item.region, previous + item.total_value)
    })

    return Array.from(totals.entries())
      .map(([region, total_value]) => ({ region, total_value }))
      .sort((first, second) => first.region.localeCompare(second.region))
  }

  useEffect(() => {
    if (selectedCategory === "All categories" && selectedRevenueAgeBand === "All ages") {
      setRevenue(baseRevenue)
      return
    }

    if (selectedCategory !== "All categories" && selectedRevenueAgeBand === "All ages") {
      const filteredByCategory = revenueByRegionCategory
        .filter((item) => item.category === selectedCategory)
        .map((item) => ({ region: item.region, total_value: item.total_value }))
        .sort((first, second) => first.region.localeCompare(second.region))

      setRevenue(filteredByCategory)
      return
    }

    if (selectedCategory === "All categories" && selectedRevenueAgeBand !== "All ages") {
      const filteredByAgeBand = revenueByRegionCategoryAgeBand
        .filter((item) => item.age_band === selectedRevenueAgeBand)
        .map((item) => ({ region: item.region, total_value: item.total_value }))

      setRevenue(aggregateRevenueByRegion(filteredByAgeBand))
      return
    }

    const filtered = revenueByRegionCategoryAgeBand
      .filter((item) => item.category === selectedCategory)
      .filter((item) => item.age_band === selectedRevenueAgeBand)
      .map((item) => ({ region: item.region, total_value: item.total_value }))

    setRevenue(filtered)
  }, [
    selectedCategory,
    selectedRevenueAgeBand,
    baseRevenue,
    revenueByRegionCategory,
    revenueByRegionCategoryAgeBand,
  ])

  const aggregateTopProductsByName = (
    items: Array<{ name: string; quantity: number }>,
  ): TopProductItem[] => {
    const totals = new Map<string, number>()

    items.forEach((item) => {
      const previous = totals.get(item.name) ?? 0
      totals.set(item.name, previous + item.quantity)
    })

    return Array.from(totals.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 10)
  }

  useEffect(() => {
    if (selectedTopProductRegion === "All regions" && selectedTopProductAgeBand === "All ages") {
      setTopProducts(baseTopProducts)
      return
    }

    if (selectedTopProductRegion !== "All regions" && selectedTopProductAgeBand === "All ages") {
      const filteredByRegion = topProductsByRegion
        .filter((item) => item.region === selectedTopProductRegion)
        .sort((first, second) => second.quantity - first.quantity)
        .slice(0, 10)
        .map((item) => ({ name: item.name, quantity: item.quantity }))

      setTopProducts(filteredByRegion)
      return
    }

    if (selectedTopProductRegion === "All regions" && selectedTopProductAgeBand !== "All ages") {
      const filteredByAgeBand = topProductsByRegionAgeBand
        .filter((item) => item.age_band === selectedTopProductAgeBand)
        .map((item) => ({ name: item.name, quantity: item.quantity }))

      setTopProducts(aggregateTopProductsByName(filteredByAgeBand))
      return
    }

    const filtered = topProductsByRegionAgeBand
      .filter((item) => item.region === selectedTopProductRegion)
      .filter((item) => item.age_band === selectedTopProductAgeBand)
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 10)
      .map((item) => ({ name: item.name, quantity: item.quantity }))

    setTopProducts(filtered)
  }, [
    selectedTopProductRegion,
    selectedTopProductAgeBand,
    baseTopProducts,
    topProductsByRegion,
    topProductsByRegionAgeBand,
  ])

  const topProductRegions = [
    "All regions",
    ...Array.from(
      new Set([
        ...topProductsByRegion.map((item) => item.region),
        ...revenue.map((item) => item.region),
      ]),
    ).sort(),
  ]

  return (
    <div className="container">
      <h1 className="title">Retail Analytics Dashboard</h1>

      <div className="grid">
        <RevenueChart
          data={revenue}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          ageBands={AGE_BANDS}
          selectedAgeBand={selectedRevenueAgeBand}
          onAgeBandChange={setSelectedRevenueAgeBand}
        />

        <TopProductsChart
          data={topProducts}
          regions={topProductRegions}
          selectedRegion={selectedTopProductRegion}
          onRegionChange={setSelectedTopProductRegion}
          ageBands={AGE_BANDS}
          selectedAgeBand={selectedTopProductAgeBand}
          onAgeBandChange={setSelectedTopProductAgeBand}
        />
      </div>
    </div>
  )
}

export default App
