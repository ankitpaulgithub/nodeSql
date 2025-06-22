const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: './config.env' });

const dbPath = process.env.DB_PATH || './database/app.db';

// Create database directory if it doesn't exist
const dbDir = path.dirname(dbPath);
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Helper function to promisify SQLite operations
function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');

      try {
        // Enable foreign keys
        await runAsync(db, 'PRAGMA foreign_keys = ON');

        // Create users table
        await runAsync(db, `
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Users table created or already exists');

        // Create products table
        await runAsync(db, `
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT,
            stock_quantity INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('Products table created or already exists');

        // Create orders table
        await runAsync(db, `
          CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
          )
        `);
        console.log('Orders table created or already exists');

        // Insert sample users
        const sampleUsers = [
          ['John Doe', 'john@example.com', 30],
          ['Jane Smith', 'jane@example.com', 25],
          ['Bob Johnson', 'bob@example.com', 35],
          ['Alice Brown', 'alice@example.com', 28],
          ['Charlie Wilson', 'charlie@example.com', 32]
        ];

        for (const user of sampleUsers) {
          try {
            await runAsync(db, 'INSERT OR IGNORE INTO users (name, email, age) VALUES (?, ?, ?)', user);
          } catch (error) {
            console.error('Error inserting user:', error.message);
          }
        }
        console.log('Sample users inserted');

        // Insert sample products
        const sampleProducts = [
          ['Laptop', 'High-performance laptop for work and gaming', 999.99, 'Electronics', 50],
          ['Smartphone', 'Latest smartphone with advanced features', 699.99, 'Electronics', 100],
          ['Coffee Maker', 'Automatic coffee maker for home use', 89.99, 'Home & Kitchen', 25],
          ['Running Shoes', 'Comfortable running shoes for athletes', 129.99, 'Sports', 75],
          ['Backpack', 'Durable backpack for daily use', 49.99, 'Fashion', 60],
          ['Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 'Electronics', 40],
          ['Yoga Mat', 'Non-slip yoga mat for fitness', 29.99, 'Sports', 100],
          ['Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 'Home & Kitchen', 30]
        ];

        for (const product of sampleProducts) {
          try {
            await runAsync(db, 'INSERT OR IGNORE INTO products (name, description, price, category, stock_quantity) VALUES (?, ?, ?, ?, ?)', product);
          } catch (error) {
            console.error('Error inserting product:', error.message);
          }
        }
        console.log('Sample products inserted');

        // Insert sample orders
        const sampleOrders = [
          [1, 999.99, 'delivered'],
          [2, 89.99, 'shipped'],
          [3, 129.99, 'processing'],
          [1, 199.99, 'pending'],
          [4, 49.99, 'delivered']
        ];

        for (const order of sampleOrders) {
          try {
            await runAsync(db, 'INSERT OR IGNORE INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)', order);
          } catch (error) {
            console.error('Error inserting order:', error.message);
          }
        }
        console.log('Sample orders inserted');

        console.log('Database initialization completed successfully!');
        
        // Close database connection
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            reject(err);
          } else {
            resolve();
          }
        });

      } catch (error) {
        console.error('Error during initialization:', error);
        db.close();
        reject(error);
      }
    });
  });
}

initializeDatabase().catch(console.error); 