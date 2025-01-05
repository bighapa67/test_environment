import sqlite3
import os

# Get the absolute path to the database file
db_path = os.path.expanduser('~/test.db')

def create_test_database():
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create products table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL
    )
    ''')

    # Sample product data
    products = [
        ('Widget', 19.99),
        ('Gadget', 29.99),
        ('Gizmo', 39.99),
        ('Smart Watch', 199.99),
        ('Wireless Earbuds', 89.99),
        ('Portable Charger', 24.99),
        ('Bluetooth Speaker', 79.99),
        ('Phone Stand', 15.99),
        ('Laptop Sleeve', 34.99),
        ('Mini Drone', 299.99),
        ('LED Desk Lamp', 45.99),
        ('Keyboard', 129.99),
        ('Mouse Pad', 12.99),
        ('USB Hub', 49.99),
        ('Webcam', 69.99),
        ('Screen Protector', 9.99),
        ('Travel Adapter', 27.99),
        ('Gaming Headset', 159.99),
        ('Fitness Tracker', 119.99),
        ('Portable SSD', 179.99)
    ]

    # Insert products
    cursor.executemany('INSERT OR REPLACE INTO products (name, price) VALUES (?, ?)', products)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

def test_query():
    # Test connection and query
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM products LIMIT 5')
    results = cursor.fetchall()
    
    print("\nTest Query Results (first 5 products):")
    for row in results:
        print(f"ID: {row[0]}, Name: {row[1]}, Price: ${row[2]}")
    
    conn.close()

if __name__ == "__main__":
    print("Creating test database...")
    create_test_database()
    # test_query()
    print(f"\nDatabase created successfully at: {db_path}") 