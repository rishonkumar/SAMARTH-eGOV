const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
});

connection.connect();

const authenticate = (req, res, next) => {
    const apiKey = req.headers['api-key'];
  
    if (!apiKey || apiKey !== 'your_secret_api_key') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };
  

app.post('/items', (req, res) => {
    const { name, price, supplierInfo } = req.body;
  
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
  
    const sql = 'INSERT INTO items (name, price, supplier_info) VALUES (?, ?, ?)';
    connection.query(sql, [name, price, supplierInfo], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error creating item' });
      }
      return res.status(201).json({ message: 'Item created successfully', id: result.insertId });
    });
  });
  
  app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items';
    connection.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching items' });
      }
      return res.json(results);
    });
  });
  
  app.get('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const sql = 'SELECT * FROM items WHERE id = ?';
    connection.query(sql, [itemId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching item details' });
      }
  
      if (!result[0]) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      return res.json(result[0]);
    });
  });
  app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const { name, price, supplierInfo } = req.body;
  
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
  
    const sql = 'UPDATE items SET name = ?, price = ?, supplier_info = ? WHERE id = ?';
    connection.query(sql, [name, price, supplierInfo, itemId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating item' });
      }
      return res.json({ message: 'Item updated successfully' });
    });
  });
  app.delete('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const sql = 'DELETE FROM items WHERE id = ?';
    connection.query(sql, [itemId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error deleting item' });
      }
      return res.json({ message: 'Item deleted successfully' });
    });
  });
  app.get('/api/items/:id', (req, res) => {
    const itemId = req.params.id;
      fetchDataFromExternalAPI(itemId)
      .then((data) => {
        storeFetchedDataLocally(itemId, data);
        res.json({ message: 'Data fetched and stored successfully', data });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Error fetching and storing data' });
      });
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
