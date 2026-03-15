import pandas as pd
import json


def map_age_band(age: int) -> str:
    if 18 <= age <= 25:
        return "18–25"
    if 26 <= age <= 35:
        return "26–35"
    if 36 <= age <= 45:
        return "36–45"
    if 46 <= age <= 60:
        return "46–60"
    return "60+"


def remove_outliers_iqr(dataframe: pd.DataFrame, column: str) -> pd.DataFrame:
    q1 = dataframe[column].quantile(0.25)
    q3 = dataframe[column].quantile(0.75)
    iqr = q3 - q1

    if iqr == 0:
        return dataframe

    lower_bound = q1 - (1.5 * iqr)
    upper_bound = q3 + (1.5 * iqr)

    return dataframe[(dataframe[column] >= lower_bound) & (dataframe[column] <= upper_bound)]

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

# handle outliers (IQR method)
sales = remove_outliers_iqr(sales, "quantity")
products = remove_outliers_iqr(products, "price")

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

full_data["age_band"] = full_data["age"].apply(map_age_band)

# -----------------------------
# Analytics Metrics
# -----------------------------

# revenue by region
revenue_by_region = (
    full_data.groupby("region")["total_value"]
    .sum()
    .reset_index()
)

# revenue by region and category
revenue_by_region_category = (
    full_data.groupby(["region", "category"])["total_value"]
    .sum()
    .reset_index()
)

# revenue by region, category and age band
revenue_by_region_category_age_band = (
    full_data.groupby(["region", "category", "age_band"])["total_value"]
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

# products sold by region
top_products_by_region = (
    full_data.groupby(["region", "name"])["quantity"]
    .sum()
    .reset_index()
    .sort_values(["region", "quantity"], ascending=[True, False])
)

# products sold by region and age band
top_products_by_region_age_band = (
    full_data.groupby(["region", "age_band", "name"])["quantity"]
    .sum()
    .reset_index()
    .sort_values(["region", "age_band", "quantity"], ascending=[True, True, False])
)

# top selling products by category
top_products_by_category = (
    full_data.groupby(["category", "name"])["quantity"]
    .sum()
    .reset_index()
    .sort_values(["category", "quantity"], ascending=[True, False])
)

# category revenue
category_revenue = (
    full_data.groupby("category")["total_value"]
    .sum()
    .reset_index()
)

# most purchased category by region
top_category_by_region = (
    full_data.groupby(["region", "category"])["quantity"]
    .sum()
    .reset_index()
    .sort_values(["region", "quantity"], ascending=[True, False])
    .drop_duplicates(subset=["region"], keep="first")
)

# -----------------------------
# Export results
# -----------------------------

output = {
    "revenue_by_region": revenue_by_region.to_dict(orient="records"),
    "revenue_by_region_category": revenue_by_region_category.to_dict(orient="records"),
    "revenue_by_region_category_age_band": revenue_by_region_category_age_band.to_dict(orient="records"),
    "top_products": top_products.to_dict(orient="records"),
    "top_products_by_region": top_products_by_region.to_dict(orient="records"),
    "top_products_by_region_age_band": top_products_by_region_age_band.to_dict(orient="records"),
    "top_products_by_category": top_products_by_category.to_dict(orient="records"),
    "category_revenue": category_revenue.to_dict(orient="records"),
    "top_category_by_region": top_category_by_region.to_dict(orient="records"),
}

with open("pipeline/analytics.json", "w") as f:
    json.dump(output, f, indent=4)

print("ETL pipeline completed successfully!")