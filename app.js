// app.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Connect to the MySQL database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON request body
app.use(express.json());

// GET request to fetch all inventory items
app.get('/api/inventory', (req, res) => {
  const query = 'SELECT * FROM inventory';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching inventory:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// POST request to add an inventory item
app.post('/api/inventory', (req, res) => {
  const { name, quantity, price } = req.body;
  if (!name || !quantity || !price || isNaN(quantity) || isNaN(price)) {
    res.status(400).json({ error: 'Invalid input data' });
    return;
  }
  const query = 'INSERT INTO inventory (name, quantity, price) VALUES (?, ?, ?)';
  connection.query(query, [name, quantity, price], (err, result) => {
    if (err) {
      console.error('Error adding item:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Item added successfully', id: result.insertId });
  });
});

// PUT request to update an inventory item
app.put('/api/inventory/:id', (req, res) => {
  const itemId = req.params.id;
  const { name, quantity, price } = req.body;
  if (!name || !quantity || !price || isNaN(quantity) || isNaN(price)) {
    res.status(400).json({ error: 'Invalid input data' });
    return;
  }
  const query = 'UPDATE inventory SET name = ?, quantity = ?, price = ? WHERE id = ?';
  connection.query(query, [name, quantity, price, itemId], (err, result) => {
    if (err) {
      console.error('Error updating item:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item updated successfully' });
  });
});

// DELETE request to delete an inventory item
app.delete('/api/inventory/:id', (req, res) => {
  const itemId = req.params.id;
  const query = 'DELETE FROM inventory WHERE id = ?';
  connection.query(query, [itemId], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
