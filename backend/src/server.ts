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
    res.json(data.revenue_by_region)
})

app.get("/api/top-products", (req, res) => {
    const data = loadAnalytics()
    res.json(data.top_products)
})

app.get("/api/category-revenue", (req, res) => {
    const data = loadAnalytics()
    res.json(data.category_revenue)
})

// -----------------------------

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
})