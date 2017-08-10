USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INTEGER(11) NOT NULL,
  stock_quantity INTEGER(11) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Sony Headphones", "Electronics", 200, 25),
("Pilot G2 Pens - 12 Pack", "Office Supplies", 10, 300),
("Nike Killshot Sneakers", "Clothing", 90, 15),
("Happy Hacking Mechanical Keyboard", "Electronics", 299, 50),
("Roku 32 inch TV", "Electronics",399, 10),
("Javascript and jQuery: A Comprehensive Guide", "Books", 25, 80),
("Dell 15 inch Laptop", "Electronics", 600, 45),
("Adidas Stan Smith Leather Sneakers", "Clothing", 75, 75),
("Field Notes 3 Pack", "Office Supplies", 15, 100),
("Laptop Charger", "Electronics", 50, 150);

CREATE TABLE departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs INTEGER(11) NOT NULL,
  product_sales INTEGER(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (department_id)
)

INSERT INTO products (department_name, over_head_costs)
VALUES 
("Electronics", 20000),
("Office Supplies", 16000),
("Clothing", 24000),
("Books", 14500);

SELECT * FROM products;
SELECT * FROM departments