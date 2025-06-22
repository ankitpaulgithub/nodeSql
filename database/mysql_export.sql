-- MySQL Database Export (Converted from SQLite)
-- Generated on: 2025-06-22T13:56:39.809Z
-- 
-- This file contains MySQL-compatible SQL statements converted from SQLite
-- 
-- Usage:
-- 1. Create a MySQL database
-- 2. Run: mysql -u username -p database_name < mysql_export.sql
-- 
-- MySQL Settings:
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- SQLite Database Export
-- Generated on: 2025-06-22T13:48:14.346Z

-- Table structure for products
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255),
  `price` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(255),
  `stock_quantity` INT DEFAULT '0',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table products
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (1, 'Laptop', 'High-performance laptop for work and gaming', 999.99, 'Electronics', 50, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (2, 'Smartphone', 'Latest smartphone with advanced features', 699.99, 'Electronics', 100, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (3, 'Coffee Maker', 'Automatic coffee maker for home use', 89.99, 'Home & Kitchen', 25, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (4, 'Running Shoes', 'Comfortable running shoes for athletes', 129.99, 'Sports', 75, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (5, 'Backpack', 'Durable backpack for daily use', 49.99, 'Fashion', 60, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (6, 'Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 'Electronics', 40, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (7, 'Yoga Mat', 'Non-slip yoga mat for fitness', 29.99, 'Sports', 100, '2025-06-22 12:19:30');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`) VALUES (8, 'Desk Lamp', 'LED desk lamp with adjustable brightness', 39.99, 'Home & Kitchen', 30, '2025-06-22 12:19:30');

-- Table structure for users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `age` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table users
INSERT INTO `users` (`id`, `name`, `email`, `age`, `created_at`) VALUES (1, 'John Doe', 'john@example.com', 30, '2025-06-22 12:19:29');
INSERT INTO `users` (`id`, `name`, `email`, `age`, `created_at`) VALUES (2, 'Jane Smith', 'jane@example.com', 25, '2025-06-22 12:19:30');
INSERT INTO `users` (`id`, `name`, `email`, `age`, `created_at`) VALUES (3, 'Bob Johnson', 'bob@example.com', 35, '2025-06-22 12:19:30');
INSERT INTO `users` (`id`, `name`, `email`, `age`, `created_at`) VALUES (4, 'Alice Brown', 'alice@example.com', 28, '2025-06-22 12:19:30');
INSERT INTO `users` (`id`, `name`, `email`, `age`, `created_at`) VALUES (5, 'Charlie Wilson', 'charlie@example.com', 32, '2025-06-22 12:19:30');

-- Table structure for orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(255) DEFAULT ''pending'',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table orders
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`) VALUES (1, 1, 999.99, 'delivered', '2025-06-22 12:19:30');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`) VALUES (2, 2, 89.99, 'shipped', '2025-06-22 12:19:30');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`) VALUES (3, 3, 129.99, 'processing', '2025-06-22 12:19:30');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`) VALUES (4, 1, 199.99, 'pending', '2025-06-22 12:19:30');
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`) VALUES (5, 4, 49.99, 'delivered', '2025-06-22 12:19:30');


-- End of MySQL Export
COMMIT;
