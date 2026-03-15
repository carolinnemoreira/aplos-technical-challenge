import express from "express"
import cors from "cors"
import fs from "fs"
import path from "path"

const app = express()
const PORT = 3000

app.use(cors())

// path to analytics file
const dataPath = path.join(__dirname, "../../pipeline/analytics.json")

function loadAnalytics() {
    const raw = fs.readFileSync(dataPath, "utf-8")
    return JSON.parse(raw)
}

// -----------------------------
// Endpoints
// -----------------------------

app.get("/api/revenue-by-region", (req, res) => {
    const data = loadAnalytics()
    const category = req.query.category as string | undefined

    if (!category || category === "All categories") {
        res.json(data.revenue_by_region)
        return
    }

    const revenueByRegionCategory = data.revenue_by_region_category ?? []
    const filtered = revenueByRegionCategory
        .filter((item: { category: string }) => item.category === category)
        .map((item: { region: string; total_value: number }) => ({
            region: item.region,
            total_value: item.total_value,
        }))

    res.json(filtered)
})

app.get("/api/revenue-by-region-category-age-band", (req, res) => {
    const data = loadAnalytics()
    res.json(data.revenue_by_region_category_age_band ?? [])
})

app.get("/api/top-products", (req, res) => {
    const data = loadAnalytics()
    res.json(data.top_products)
})

app.get("/api/top-products-by-region", (req, res) => {
    const data = loadAnalytics()
    const region = req.query.region as string | undefined
    const topProductsByRegion = data.top_products_by_region ?? []

    if (!region || region === "All regions") {
        res.json(topProductsByRegion)
        return
    }

    const filtered = topProductsByRegion.filter(
        (item: { region: string }) => item.region === region
    )

    res.json(filtered)
})

app.get("/api/top-products-by-region-age-band", (req, res) => {
    const data = loadAnalytics()
    res.json(data.top_products_by_region_age_band ?? [])
})

app.get("/api/top-products-by-category", (req, res) => {
    const data = loadAnalytics()
    const category = req.query.category as string | undefined
    const topProductsByCategory = data.top_products_by_category ?? []

    if (!category || category === "All categories") {
        res.json(topProductsByCategory.slice(0, 10))
        return
    }

    const filtered = topProductsByCategory
        .filter((item: { category: string }) => item.category === category)
        .slice(0, 10)

    res.json(filtered)
})

app.get("/api/category-revenue", (req, res) => {
    const data = loadAnalytics()
    res.json(data.category_revenue)
})

app.get("/api/revenue-by-region-category", (req, res) => {
    const data = loadAnalytics()
    res.json(data.revenue_by_region_category ?? [])
})

app.get("/api/top-category-by-region", (req, res) => {
    const data = loadAnalytics()
    const region = req.query.region as string | undefined
    const topCategoryByRegion = data.top_category_by_region ?? []

    if (!region || region === "All regions") {
        res.json(topCategoryByRegion)
        return
    }

    const match = topCategoryByRegion.find(
        (item: { region: string }) => item.region === region
    )

    res.json(match ? [match] : [])
})

// -----------------------------

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
})