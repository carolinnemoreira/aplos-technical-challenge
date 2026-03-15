# Aplos Technical Challenge

This repository contains the solution for the Aplos Software Engineering technical challenge.

This project implements a simplified retail analytics platform.  
It models the data domain, generates synthetic datasets, processes the data through a Python ETL pipeline, exposes analytics endpoints via a TypeScript API, and presents insights through a React dashboard.


---

## Project Structure

```
aplos-technical-challenge
│
├── ontology
├── data
├── pipeline
├── backend
└── frontend
```


## Ontology Model

The ontology models the core entities of a retail system, including customers, products, sales transactions, inventory, and product categories.

The model separates sales transactions from individual sale items, allowing a single purchase to contain multiple products. This design supports more accurate analytical queries such as revenue per product, category performance, and customer purchasing patterns.

Main entities:

- **Customers** — represents retail customers and their demographic attributes.
- **Sales** — represents purchase transactions performed by customers.
- **SaleItems** — represents individual products included in a sale.
- **Products** — represents items available in the retail catalog.
- **Categories** — groups products into logical segments.
- **Inventory** — tracks current stock levels for each product.

This structure enables the generation of business metrics such as:

- revenue by region
- top-selling products
- category performance
- customer purchasing behavior

The ontology diagram is available in:

ontology/ontology.png

---

## Setup (Python)

From the repository root, install dependencies with the project virtual environment:

```bash
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

If you do not have a virtual environment yet:

```bash
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## Data Generation

Synthetic datasets were generated to simulate a retail environment.

A Python script is used to automatically generate realistic CSV datasets representing customers, products, and sales transactions.
Product names are generated based on their category to create more realistic retail datasets.

The generated datasets include:

- **customers.csv** → customer demographic information
- **products.csv** → product catalog and categories
- **sales.csv** → purchase transactions linking customers and products

The datasets are generated using the **Faker** library to create realistic names and randomized attributes.

Run data generation:

```bash
.venv\Scripts\python.exe pipeline/generate_data.py
```

## ETL Pipeline

A Python ETL pipeline processes the generated datasets.

The pipeline performs:

- Data loading from CSV files
- Data cleaning (removal of duplicates and missing values)
- Outlier handling using the IQR method (for quantity and price)
- Data transformation through dataset joins
- Metric generation for analytics

Generated metrics include:

- revenue by region
- top-selling products
- category revenue
- revenue by region + category + age band
- top-selling products by region + age band

Run ETL:

```bash
.venv\Scripts\python.exe pipeline/etl.py
```

## API Service

A TypeScript API exposes analytics endpoints for the frontend dashboard.

Available endpoints:

- `/api/revenue-by-region`
- `/api/top-products`
- `/api/top-products-by-category`
- `/api/category-revenue`
- `/api/revenue-by-region-category`
- `/api/revenue-by-region-category-age-band`
- `/api/top-products-by-region`
- `/api/top-products-by-region-age-band`

Run the API:

```bash
cd backend
npx ts-node src/server.ts
```

---

## Setup (Node/TypeScript Backend)

In this project, dependency management is split by stack:

- Python dependencies are in `requirements.txt`
- Node/TypeScript dependencies are in `backend/package.json`

Install backend dependencies:

```bash
cd backend
npm install
```

Run backend in development mode:

```bash
npm run dev
```

Optional type-check:

```bash
npm run typecheck
```

## Frontend Interface

The dashboard contains two visualizations and supports exploration through combined filters.

The React interface consumes the analytics API and allows interactive exploration of revenue and product performance through filtering by region, category, and customer age band.

The dashboard includes:

- Revenue by region chart
- Top-selling products chart

Filters available:

- **Revenue by Region**: Category filter + Age band filter (`18–25`, `26–35`, `36–45`, `46–60`, `60+`)
- **Top-Selling Products**: Region filter + Age band filter (`18–25`, `26–35`, `36–45`, `46–60`, `60+`)
- Top products chart shows the **top 10 items** for the selected filter combination

## Architecture Overview

The project follows a simple analytics architecture:

1. Synthetic retail datasets are generated using Python and Faker.
2. A Python ETL pipeline cleans, transforms, and aggregates the data.
3. The processed analytics are exposed through a TypeScript API.
4. A React dashboard consumes the API and visualizes the insights.

This architecture demonstrates a full data flow from raw data generation to business insight visualization.

## Business Insights

Based on the processed dataset, the following business insights were identified:

### 1. Sports and Fashion Concentrate Most of the Revenue

The **Sports** category generated the largest revenue (**$234,914**, **31.26%** of total revenue), followed by **Fashion** (**$200,483**, **26.68%**). Together, these two categories represent **57.94%** of all revenue, indicating that inventory availability and campaign investment should prioritize these segments.

### 2. Regional Revenue Shows a Clear Performance Gap

The **North** region leads total revenue with **$204,998** (**27.28%**), while the **West** region is lowest with **$168,175** (**22.38%**). This creates a gap of **$36,823** (about **21.9%** above the West baseline), suggesting targeted regional actions are needed to unlock growth in lower-performing geographies.

### 3. Product Volume Is Concentrated in a Small Set of SKUs

A small group of products drives a significant share of sold units. The top three products (**Football: 317**, **Running Shoes: 245**, **T-Shirt: 237**) total **799 units**, which is **39.91%** of all units inside the top-10 ranking. This indicates operational dependence on a few high-demand SKUs and the need for safety stock policies.

### 4. Age Segmentation Reveals Distinct Category Preferences

By age band, **Sports** is the top revenue category for **18–25**, **26–35**, **36–45**, and **46–60**. In contrast, for **60+**, the top category shifts to **Fashion** (**34.36%** of revenue in that age band). This supports differentiated segmentation strategy: sports-oriented offers for younger/mid-age groups and fashion-focused offers for senior customers.

### 5. South Region Over-Indexes in Electronics and Leads in Fashion

In the **South** region, **Electronics** accounts for **21.24%** of regional revenue, above the national electronics share (**19.33%**), a relative uplift of **9.9%**. At the same time, **Fashion** is the top category in South (**30.11%** of the region's revenue). This suggests regional assortment and campaigns should emphasize both Fashion and Electronics for stronger conversion.

These insights demonstrate how combining transactional data with product and customer attributes can support strategic decisions in pricing, inventory planning, and marketing.
