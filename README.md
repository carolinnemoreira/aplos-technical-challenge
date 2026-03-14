# Aplos Technical Challenge

This repository contains the solution for the Aplos Software Engineering technical challenge.

The objective of this project is to model a retail data domain, generate synthetic datasets, process the data through an ETL pipeline, expose analytics endpoints via a TypeScript service, and present insights through a React interface.

---

# Project Structure


aplos-technical-challenge
│
├── ontology → conceptual data model
├── data → generated CSV datasets
├── pipeline → Python ETL pipeline
├── backend → TypeScript API service
├── frontend → React analytics dashboard


---

# Ontology Model

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

# Setup (Python)

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

# Generate Synthetic Data

Run the data generation pipeline:

```bash
.venv\Scripts\python.exe pipeline/generate_data.py
```

This generates:

- data/customers.csv
- data/products.csv
- data/sales.csv