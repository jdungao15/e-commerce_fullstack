require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost:5432/ecommerce_db');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT = process.env.JWT_SECRET_KEY || 'supersecretkey';








module.exports = {client};