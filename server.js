const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soundpro',
  waitForConnections: true,
  connectionLimit: 10,
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/clients', async (req, res) => {
  const { customer_name, customer_phone, customer_address, company_name, user_email } = req.body;

  if (!customer_name || !customer_phone) {
    return res.status(400).json({ success: false, message: 'Name and contact number are required' });
  }

  try {
    await pool.execute(
      `INSERT INTO clients (id, customer_name, customer_phone, customer_address, company_name, user_email)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [customer_name, customer_phone, customer_address || null, company_name || null, user_email || 'admin@soundpro.com']
    );

    const [rows] = await pool.execute('SELECT * FROM clients WHERE customer_phone = ? ORDER BY created_at DESC LIMIT 1', [customer_phone]);

    res.status(201).json({ success: true, message: 'Customer saved successfully', client: rows[0] });
  } catch (err) {
    console.error('Add client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients ORDER BY created_at DESC');
    res.json({ success: true, clients: rows });
  } catch (err) {
    console.error('Fetch clients error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/clients/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM clients WHERE customer_name LIKE ? OR customer_phone LIKE ? ORDER BY created_at DESC',
      [`%${q}%`, `%${q}%`]
    );
    res.json({ success: true, clients: rows });
  } catch (err) {
    console.error('Search clients error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/bills', async (req, res) => {
  const { invoice_no, customer_name, subtotal, cgst, sgst, igst, discount, grand_total } = req.body;

  if (!invoice_no || !customer_name || subtotal === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required bill fields' });
  }

  try {
    await pool.execute(
      `INSERT INTO bills (invoice_no, customer_name, subtotal, cgst, sgst, igst, discount, grand_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [invoice_no, customer_name, subtotal, cgst || 0, sgst || 0, igst || 0, discount || 0, grand_total]
    );
    res.status(201).json({ success: true, message: 'Bill saved successfully' });
  } catch (err) {
    console.error('Save bill error:', err);
    res.status(500).json({ success: false, message: 'Server error', detail: err.message });
  }
});

app.get('/api/bills', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM bills ORDER BY bill_date DESC');
    res.json({ success: true, bills: rows });
  } catch (err) {
    console.error('Fetch bills error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute('DELETE FROM clients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`SoundPro server running at http://localhost:${PORT}`);
});
