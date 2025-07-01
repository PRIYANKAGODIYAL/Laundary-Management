const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/submit-order', (req, res) => {
  const { email, date_ordered, time_slot, type_of_clothes, male_clothes, female_clothes, services_requested } = req.body;

  const query = 'INSERT INTO orders (email, date_ordered, time_slot, type_of_clothes, male_clothes, female_clothes, services_requested) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [email, date_ordered, time_slot, type_of_clothes, male_clothes, female_clothes, services_requested], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err.message);
      return res.status(500).json({ error: 'Failed to insert order' });
    }
    res.status(200).json({ message: 'Order inserted successfully' });
  });
});

module.exports = router;
