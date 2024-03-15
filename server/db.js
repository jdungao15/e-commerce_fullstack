require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/ecommerce_db"
);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT = process.env.JWT_SECRET_KEY || "supersecretkey";
const { userData } = require("./db.utils");

const createTables = async () => {
  // Only use this function to drop tables and recreate them
  const SQL = `
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS cart_items;
        DROP TABLE IF EXISTS carts;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS user_roles;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS roles;

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE roles (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE
        );
          
        CREATE TABLE IF NOT EXISTS user_roles (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            role_id INT REFERENCES roles(id)
          );
          
          CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            descriptions TEXT,
            price DECIMAL(10,2),
            stock_quantity INT,
            image_url VARCHAR(255)
          );
          
          CREATE TABLE IF NOT EXISTS carts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id)
          );
          
          CREATE TABLE IF NOT EXISTS cart_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            cart_id UUID REFERENCES carts(id),
            product_id INT REFERENCES products(id),
            quantity INT
          );
          
          CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            total_price DECIMAL,
            order_date TIMESTAMP,
            status VARCHAR
          );
          
          CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INT REFERENCES orders(id),
            product_id INT REFERENCES products(id),
            quantity INT,
            price DECIMAL
          );
    `;
  await client.query(SQL);
};
// Create User
const createUser = async (user) => {
  const SQL = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
  const hash = await bcrypt.hash(user.password, 10);
  const values = [user.first_name, user.last_name, user.email, hash];
  const response = await client.query(SQL, values);
  return response.rows[0];
};

// Get All Products
const getAllProducts = async () => {
  const SQL = `SELECT * FROM products;`;
  const response = await client.query(SQL);
  return response.rows;
};

// Get Single Product
const getSingleProduct = async (id) => {
  const SQL = `SELECT * FROM products WHERE id = $1;`;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const createProduct = async (product) => {
  const SQL = `
        INSERT INTO products (name, descriptions, price, stock_quantity, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
  const newProduct = await client.query(SQL, [
    product.name,
    product.descriptions,
    product.price,
    product.stock_quantity,
    product.image_url,
  ]);
  return newProduct.rows[0];
};

// This is for only testing and debugging purposes
const run = async () => {
  console.log(await getAllProducts());
};

// Use this function to seed data
const seedData = async () => {
  const users = userData();
  for (let user of users) {
    await createUser(user);
  }
};
module.exports = {
  client,
  createUser,
  seedData,
  createTables,
  getAllProducts,
  getSingleProduct,
  createProduct,
};
