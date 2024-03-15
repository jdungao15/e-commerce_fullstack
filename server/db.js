require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/ecommerce_db');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT = process.env.JWT_SECRET_KEY || 'supersecretkey';
const { userData } = require('./utils');


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
            id UUID PRIMARY KEY,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
        );

        CREATE TABLE roles (
            id UUID PRIMARY KEY,
            role VARCHAR(100) UNIQUE NOT NULL
        );

        CREATE TABLE user_roles (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            role_id UUID REFERENCES roles(id)
        );

        CREATE TABLE products (
            id UUID PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            price DECIMAL NOT NULL,
            category VARCHAR(100),
            image_url TEXT
        );

        CREATE TABLE carts (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id)
        );

        CREATE TABLE cart_items (
            id UUID PRIMARY KEY,
            cart_id UUID REFERENCES carts(id),
            product_id UUID REFERENCES products(id),
            quantity INTEGER
        );

        CREATE TABLE orders (
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            order_date DATE
        );

        CREATE TABLE order_items (
            id UUID PRIMARY KEY,
            order_id UUID REFERENCES orders(id),
            product_id UUID REFERENCES products(id),
            quantity INTEGER
        );
        
    `;
    await client.query(SQL);
}
const createUser = async (user) => {
    console.log(user)
    const SQL = `
        INSERT INTO users (id, first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const hash = await bcrypt.hash(user.password, 10);
    const values = [uuid.v4(), user.first_name, user.last_name, user.email, hash];
    const response = await client.query(SQL, values);
    return response.rows[0];
}


// Use me to seed the database
const seedData = async () => {
    const users = userData();
    for (let user of users) {
        await createUser(user);
    }
}
module.exports = { client, createUser, seedData };