import pandas as pd
import json

# -----------------------------
# Load datasets
# -----------------------------

customers = pd.read_csv("data/customers.csv")
products = pd.read_csv("data/products.csv")
sales = pd.read_csv("data/sales.csv")

# -----------------------------
# Data Cleaning
# -----------------------------

# remove duplicates
customers = customers.drop_duplicates()
products = products.drop_duplicates()
sales = sales.drop_duplicates()

# handle missing values
customers = customers.dropna()
products = products.dropna()
sales = sales.dropna()

# ensure correct data types
sales["quantity"] = sales["quantity"].astype(int)
products["price"] = products["price"].astype(float)

# -----------------------------
# Data Transformation
# -----------------------------

# join sales with product data
sales_products = sales.merge(
    products,
    left_on="product_id",
    right_on="id",
    suffixes=("_sale", "_product")
)

# calculate total sale value
sales_products["total_value"] = sales_products["quantity"] * sales_products["price"]

# join with customers
full_data = sales_products.merge(
    customers,
    left_on="customer_id",
    right_on="id",
    suffixes=("", "_customer")
)

# -----------------------------
# Analytics Metrics
# -----------------------------

# revenue by region
revenue_by_region = (
    full_data.groupby("region")["total_value"]
    .sum()
    .reset_index()
)

# top selling products
top_products = (
    full_data.groupby("name")["quantity"]
    .sum()
    .sort_values(ascending=False)
    .head(10)
    .reset_index()
)

# category revenue
category_revenue = (
    full_data.groupby("category")["total_value"]
    .sum()
    .reset_index()
)

# -----------------------------
# Export results
# -----------------------------

output = {
    "revenue_by_region": revenue_by_region.to_dict(orient="records"),
    "top_products": top_products.to_dict(orient="records"),
    "category_revenue": category_revenue.to_dict(orient="records")
}

with open("pipeline/analytics.json", "w") as f:
    json.dump(output, f, indent=4)

print("ETL pipeline completed successfully!")