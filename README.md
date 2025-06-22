# Node.js MySQL API Server

A complete REST API server built with Node.js, Express, and MySQL with sample data for testing API calls.

## Features

- **RESTful API** with full CRUD operations
- **MySQL Database** integration with connection pooling
- **Sample Data** pre-loaded for testing
- **Comprehensive Error Handling**
- **CORS enabled** for cross-origin requests
- **Environment Configuration** support
- **Modular Route Structure**

## Database Schema

### Users Table
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `age` (INT)
- `created_at` (TIMESTAMP)

### Products Table
- `id` (Primary Key, Auto Increment)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `category` (VARCHAR)
- `stock_quantity` (INT)
- `created_at` (TIMESTAMP)

### Orders Table
- `id` (Primary Key, Auto Increment)
- `user_id` (Foreign Key to users.id)
- `total_amount` (DECIMAL)
- `status` (ENUM: pending, processing, shipped, delivered, cancelled)
- `created_at` (TIMESTAMP)

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd mysql-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Edit `config.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=node_mysql_demo
   DB_PORT=3306
   PORT=3000
   ```

4. **Initialize database**
   ```bash
   npm run init-db
   ```
   This will create the database, tables, and insert sample data.

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/users/:id/orders` | Get user's orders |

### Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/category/:category` | Get products by category |
| GET | `/api/products/categories/list` | Get all categories |

**Product Filters:**
- `?category=Electronics` - Filter by category
- `?minPrice=100&maxPrice=500` - Filter by price range
- `?search=laptop` - Search in name and description

### Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/orders/status/:status` | Get orders by status |

**Order Filters:**
- `?status=pending` - Filter by status
- `?userId=1` - Filter by user ID

## Sample API Calls

### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "age": 28
  }'
```

### Get All Products
```bash
curl http://localhost:3000/api/products
```

### Get Products by Category
```bash
curl http://localhost:3000/api/products?category=Electronics
```

### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "total_amount": 299.99,
    "status": "pending"
  }'
```

### Update Order Status
```bash
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped"
  }'
```

## Sample Data

The database comes pre-loaded with:

- **5 Users** with different names, emails, and ages
- **8 Products** across different categories (Electronics, Home & Kitchen, Sports, Fashion)
- **5 Orders** with different statuses and amounts

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "message": "Operation successful"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Scripts

- `npm start` - Start the server
- `npm run dev` - Start in development mode with auto-restart
- `npm run init-db` - Initialize database and sample data

## Environment Variables

Create a `config.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=node_mysql_demo
DB_PORT=3306
PORT=3000
```

## Error Handling

The API includes comprehensive error handling for:
- Database connection errors
- Invalid input validation
- Duplicate email addresses
- Missing required fields
- Non-existent resources
- Invalid order statuses

## CORS

CORS is enabled for all origins to allow cross-origin requests from frontend applications.

## License

MIT License 