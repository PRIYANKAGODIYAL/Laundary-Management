const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Admin Login (checks against 'admins' table)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = `SELECT * FROM admins WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('❌ Database error during admin login:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      console.log(`✅ Admin '${username}' logged in`);
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// ✅ Get all laundry orders with customer details
router.get('/orders', (req, res) => {
  const query = `
    SELECT 
      c.email AS customer_email,
      o.date_ordered AS pickup_date,
      o.time_slot,
      o.type_of_clothes,
      o.male_clothes,
      o.female_clothes
      -- REMOVE o.services if it doesn't exist
    FROM orders o
    JOIN customers c ON o.email = c.email
    ORDER BY o.date_ordered DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching orders:", err.message);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    console.log(`📦 ${results.length} orders fetched for dashboard`);
    res.status(200).json(results);
  });
});
module.exports = router;
