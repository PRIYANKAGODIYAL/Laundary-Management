const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
const customerRoutes = require('./routes/customer');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');

// Route Registration
app.use('/', customerRoutes);
app.use('/', orderRoutes);
app.use('/admin', adminRoutes);

// Payment Submission Route
app.post('/submit-payment', (req, res) => {
  const { email, payment_method, amount, transaction_id, payment_status } = req.body;

  // Debug log
  console.log('🔔 Received payment request:', req.body);

  // Validate required fields
  if (!email || !payment_method || !amount || !transaction_id) {
    console.warn('⚠️ Missing fields in payment request');
    return res.status(400).json({
      message: 'Missing required fields',
      data: req.body
    });
  }

  const sql = `
    INSERT INTO payments (email, payment_method, amount, transaction_id, payment_status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [email, payment_method, amount, transaction_id, payment_status || 'pending'],
    (err, result) => {
      if (err) {
        console.error('❌ Database error while inserting payment:', err);
        return res.status(500).json({
          message: 'Database error',
          error: err.message
        });
      }

      console.log('✅ Payment recorded:', result);
      return res.status(200).json({ message: 'Payment submitted successfully' });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
