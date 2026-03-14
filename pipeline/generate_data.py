import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

from faker import Faker


fake = Faker()


NUM_CUSTOMERS = 200
NUM_PRODUCTS = 50
NUM_SALES = 1000

REGIONS = ["North", "South", "East", "West"]
CATEGORIES = ["Electronics", "Fashion", "Home", "Sports", "Books"]
SUPPLIERS = ["Supplier A", "Supplier B", "Supplier C", "Supplier D"]


def generate_customers() -> list[list[object]]:
    return [
        [
            customer_id,
            fake.name(),
            random.randint(18, 70),
            random.choice(REGIONS),
        ]
        for customer_id in range(1, NUM_CUSTOMERS + 1)
    ]


def generate_products() -> list[list[object]]:

    product_names = {
        "Electronics": ["Smartphone", "Laptop", "Headphones", "Tablet", "Monitor"],
        "Fashion": ["T-Shirt", "Jeans", "Jacket", "Sneakers", "Sweater"],
        "Home": ["Chair", "Table", "Lamp", "Sofa", "Bookshelf"],
        "Sports": ["Basketball", "Football", "Running Shoes", "Tennis Racket", "Gym Bag"],
        "Books": ["Novel", "Cookbook", "Biography", "Science Book", "History Book"],
    }

    products = []

    for product_id in range(1, NUM_PRODUCTS + 1):

        category = random.choice(CATEGORIES)
        name = random.choice(product_names[category])

        products.append(
            [
                product_id,
                name,
                category,
                round(random.uniform(5, 500), 2),
                random.choice(SUPPLIERS),
            ]
        )

    return products


def generate_sales() -> list[list[object]]:
    start_date = datetime.now() - timedelta(days=365)
    return [
        [
            sale_id,
            random.randint(1, NUM_CUSTOMERS),
            random.randint(1, NUM_PRODUCTS),
            (start_date + timedelta(days=random.randint(0, 365))).strftime("%Y-%m-%d"),
            random.randint(1, 5),
        ]
        for sale_id in range(1, NUM_SALES + 1)
    ]


def write_csv(file_path: Path, headers: list[str], rows: list[list[object]]) -> None:
    with file_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(rows)


def main() -> None:
    project_root = Path(__file__).resolve().parents[1]
    data_dir = project_root / "data"
    data_dir.mkdir(parents=True, exist_ok=True)

    write_csv(
        data_dir / "customers.csv",
        ["id", "name", "age", "region"],
        generate_customers(),
    )
    write_csv(
        data_dir / "products.csv",
        ["id", "name", "category", "price", "supplier"],
        generate_products(),
    )
    write_csv(
        data_dir / "sales.csv",
        ["id", "customer_id", "product_id", "date", "quantity"],
        generate_sales(),
    )

    print(f"Datasets generated successfully in {data_dir}")


if __name__ == "__main__":
    main()
