const express = require('express');
const router = express.Router();
const db = require('../database/config');

// Helper function to promisify SQLite queries
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

// GET all orders
router.get('/', async (req, res) => {
  try {
    const { status, userId } = req.query;
    let sql = `
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
    `;
    let params = [];
    
    // Build WHERE clause based on filters
    const conditions = [];
    
    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }
    
    if (userId) {
      conditions.push('o.user_id = ?');
      params.push(userId);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY o.created_at DESC';
    
    const rows = await query(sql, params);
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const rows = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    const { user_id, total_amount, status } = req.body;
    
    if (!total_amount) {
      return res.status(400).json({
        success: false,
        message: 'Total amount is required'
      });
    }
    
    // Check if user exists (if user_id is provided)
    if (user_id) {
      const user = await query('SELECT * FROM users WHERE id = ?', [user_id]);
      if (user.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'User not found'
        });
      }
    }
    
    const result = await run(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [user_id || null, total_amount, status || 'pending']
    );
    
    const newOrder = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [result.id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder[0]
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  try {
    const { user_id, total_amount, status } = req.body;
    const orderId = req.params.id;
    
    // Check if order exists
    const existingOrder = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user exists (if user_id is provided)
    if (user_id) {
      const user = await query('SELECT * FROM users WHERE id = ?', [user_id]);
      if (user.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'User not found'
        });
      }
    }
    
    // Update order
    await run(
      'UPDATE orders SET user_id = ?, total_amount = ?, status = ? WHERE id = ?',
      [
        user_id !== undefined ? user_id : existingOrder[0].user_id,
        total_amount || existingOrder[0].total_amount,
        status || existingOrder[0].status,
        orderId
      ]
    );
    
    const updatedOrder = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [orderId]
    );
    
    res.json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder[0]
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Check if order exists
    const existingOrder = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Delete order
    await run('DELETE FROM orders WHERE id = ?', [orderId]);
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    // Check if order exists
    const existingOrder = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    await run('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    
    const updatedOrder = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`,
      [orderId]
    );
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder[0]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// GET orders by status
router.get('/status/:status', async (req, res) => {
  try {
    const status = req.params.status;
    
    const rows = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       WHERE o.status = ? 
       ORDER BY o.created_at DESC`,
      [status]
    );
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders by status',
      error: error.message
    });
  }
});

module.exports = router; 