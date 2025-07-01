const express = require('express');
const router = express.Router();
const db = require('../db');

// Customer Submission Route
router.post('/submit-customer-details', (req, res) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Step 1: Check if customer already exists
  db.query('SELECT * FROM customers WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('❌ Error checking customer:', err);
      return res.status(500).json({ message: 'Database error while checking customer' });
    }

    if (results.length > 0) {
      console.log('⚠️ Customer already exists:', email);
      return res.status(200).json({ message: 'Customer already exists' });
    }

    // Step 2: Insert if customer does not exist
    const insertSql = `
      INSERT INTO customers (name, email, phone, address)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertSql, [name, email, phone, address], (insertErr, result) => {
      if (insertErr) {
        console.error('❌ Error inserting customer:', insertErr);
        return res.status(500).json({ message: 'Database error during insert' });
      }

      console.log('✅ New customer added:', email);
      res.status(201).json({ message: 'Customer added successfully' });
    });
  });
});

module.exports = router;
