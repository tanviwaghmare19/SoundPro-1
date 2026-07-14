const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'soundpro',
});

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});

// ──────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
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
    res.json({ success: true, message: 'Login successful', name: user.name, email: user.email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// CLIENTS
// ──────────────────────────────────────────────

app.post('/api/clients', async (req, res) => {
  const { customer_name, customer_phone, customer_address, company_name, user_email } = req.body;
  if (!customer_name || !customer_phone) {
    return res.status(400).json({ success: false, message: 'Name and contact number are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO clients (customer_name, customer_phone, customer_address, company_name, user_email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customer_name, customer_phone, customer_address || null, company_name || null, user_email || 'admin@soundpro.com']
    );
    res.status(201).json({ success: true, message: 'Customer saved successfully', client: rows[0] });
  } catch (err) {
    console.error('Add client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json({ success: true, clients: rows });
  } catch (err) {
    console.error('Fetch clients error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/clients/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clients WHERE customer_name ILIKE $1 OR customer_phone ILIKE $1 ORDER BY created_at DESC',
      [`%${q}%`]
    );
    res.json({ success: true, clients: rows });
  } catch (err) {
    console.error('Search clients error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// BILLS
// ──────────────────────────────────────────────

app.post('/api/bills', async (req, res) => {
  const {
    invoice_no, customer_name, subtotal, cgst, sgst, igst,
    discount, grand_total, amount, gst_amount, total_with_gst,
    date, payment_mode, notes, user_email, gst_percentage,
    status, mode_of_transport, rr_gr_no, igst_enabled,
    cgst_amount, sgst_amount, igst_amount
  } = req.body;

  if (!invoice_no || !customer_name || subtotal === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required bill fields' });
  }

  try {
    await pool.query(
      `INSERT INTO bills (
        invoice_no, customer_name, subtotal, cgst, sgst, igst,
        discount, grand_total, amount, gst_amount, total_with_gst,
        date, payment_mode, notes, user_email, gst_percentage,
        status, mode_of_transport, rr_gr_no, igst_enabled,
        cgst_amount, sgst_amount, igst_amount
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
      [
        invoice_no, customer_name, subtotal || 0,
        cgst || 0, sgst || 0, igst || 0,
        discount || 0, grand_total || 0,
        amount || grand_total || 0, gst_amount || 0, total_with_gst || grand_total || 0,
        date || new Date().toISOString().split('T')[0],
        payment_mode || 'Cash', notes || null,
        user_email || 'admin@soundpro.com', gst_percentage || 0,
        status || 'approved', mode_of_transport || null, rr_gr_no || null,
        igst_enabled || false,
        cgst_amount || 0, sgst_amount || 0, igst_amount || 0
      ]
    );
    res.status(201).json({ success: true, message: 'Bill saved successfully' });
  } catch (err) {
    console.error('Save bill error:', err);
    res.status(500).json({ success: false, message: 'Server error', detail: err.message });
  }
});

app.get('/api/bills', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM bills ORDER BY created_at DESC');
    res.json({ success: true, bills: rows });
  } catch (err) {
    console.error('Fetch bills error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// PRODUCTS (inventory_items)
// ──────────────────────────────────────────────

app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, product_name AS name, sku, quantity AS stock, selling_price AS price,
              hsn, description, image_url AS image, company_name AS brand,
              dealer_price, mrp, watt, category, category_id, company_id
       FROM inventory_items ORDER BY created_at DESC`
    );
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/products/search', async (req, res) => {
  const q = req.query.q || '';
  try {
    const { rows } = await pool.query(
      `SELECT id, product_name AS name, sku, quantity AS stock, selling_price AS price,
              hsn, description, image_url AS image, company_name AS brand,
              dealer_price, mrp, watt, category, category_id, company_id
       FROM inventory_items
       WHERE product_name ILIKE $1 OR sku ILIKE $1 OR hsn ILIKE $1 OR company_name ILIKE $1
       ORDER BY created_at DESC`,
      [`%${q}%`]
    );
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('Search products error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/products/low-stock', async (req, res) => {
  const threshold = parseInt(req.query.threshold) || 10;
  try {
    const { rows } = await pool.query(
      `SELECT id, product_name AS name, sku, quantity AS stock, selling_price AS price,
              image_url AS image, company_name AS brand
       FROM inventory_items WHERE quantity < $1 ORDER BY quantity ASC`,
      [threshold]
    );
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('Fetch low stock error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, product_name AS name, sku, quantity AS stock, selling_price AS price,
              hsn, description, image_url AS image, company_name AS brand,
              dealer_price, mrp, watt, category, category_id, company_id
       FROM inventory_items WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error('Fetch product error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, sku, price, stock, category, brand, image, hsn, description } = req.body;
  if (!name || !sku) {
    return res.status(400).json({ success: false, message: 'Name and SKU are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO inventory_items (product_name, sku, selling_price, quantity, company_name, image_url, hsn, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, product_name AS name, sku, quantity AS stock, selling_price AS price,
                 image_url AS image, company_name AS brand, hsn, description`,
      [name, sku, price || 0, stock || 0, brand || '', image || null, hsn || null, description || null]
    );
    res.status(201).json({ success: true, message: 'Product added successfully', product: rows[0] });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  const { name, sku, price, stock, category, brand, image, hsn, description } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE inventory_items SET
        product_name = COALESCE($1, product_name),
        sku = COALESCE($2, sku),
        selling_price = COALESCE($3, selling_price),
        quantity = COALESCE($4, quantity),
        company_name = COALESCE($5, company_name),
        image_url = COALESCE($6, image_url),
        hsn = COALESCE($7, hsn),
        description = COALESCE($8, description)
       WHERE id = $9
       RETURNING id, product_name AS name, sku, quantity AS stock, selling_price AS price,
                 image_url AS image, company_name AS brand, hsn, description`,
      [name, sku, price, stock, brand, image, hsn, description, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', product: rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.patch('/api/products/:id/stock', async (req, res) => {
  const { increment } = req.body;
  if (!increment || increment <= 0) {
    return res.status(400).json({ success: false, message: 'Valid increment value required' });
  }
  try {
    const { rows } = await pool.query(
      'UPDATE inventory_items SET quantity = quantity + $1 WHERE id = $2 RETURNING id, quantity AS stock',
      [increment, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, stock: rows[0].stock });
  } catch (err) {
    console.error('Update stock error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM inventory_items WHERE id = $1', [req.params.id]);
    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// ORDERS (from bills)
// ──────────────────────────────────────────────

app.get('/api/orders', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, invoice_no, customer_name,
              COALESCE(total_with_gst, amount, grand_total, 0) AS total,
              date, status, payment_mode, notes, created_at
       FROM bills ORDER BY created_at DESC`
    );
    const orders = rows.map(row => {
      let items = [];
      try {
        const notes = typeof row.notes === 'string' ? JSON.parse(row.notes) : row.notes;
        items = (notes && notes.items) ? notes.items.map(item => ({
          name: item.partName || item.name || 'Item',
          qty: item.quantity || 1,
          price: item.price || 0,
        })) : [];
      } catch (e) { items = []; }

      return {
        id: row.invoice_no,
        customer: row.customer_name,
        total: parseFloat(row.total) || 0,
        date: row.date,
        status: row.status || 'Pending',
        payment: row.payment_mode || 'Cash',
        products: items,
      };
    });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM bills WHERE invoice_no = $1 OR id::text = $1',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    const bill = rows[0];
    let items = [];
    try {
      const notes = typeof bill.notes === 'string' ? JSON.parse(bill.notes) : bill.notes;
      items = (notes && notes.items) ? notes.items.map(item => ({
        name: item.partName || item.name || 'Item',
        qty: item.quantity || 1,
        price: item.price || 0,
      })) : [];
    } catch (e) { items = []; }

    res.json({
      success: true,
      order: {
        id: bill.invoice_no,
        customer: bill.customer_name,
        phone: '',
        email: '',
        address: '',
        payment: bill.payment_mode || 'Cash',
        status: bill.status || 'Pending',
        total: parseFloat(bill.total_with_gst || bill.amount || bill.grand_total) || 0,
        subtotal: parseFloat(bill.subtotal || bill.amount) || 0,
        cgst: parseFloat(bill.cgst) || 0,
        sgst: parseFloat(bill.sgst) || 0,
        igst: parseFloat(bill.igst) || 0,
        discount: parseFloat(bill.discount) || 0,
        date: bill.date,
        products: items,
      }
    });
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// DASHBOARD STATS
// ──────────────────────────────────────────────

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [
      { rows: productCount },
      { rows: lowStockCount },
      { rows: orderCount },
      { rows: revenueResult },
    ] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM inventory_items'),
      pool.query("SELECT COUNT(*)::int AS count FROM inventory_items WHERE quantity < 10"),
      pool.query("SELECT COUNT(*)::int AS count FROM bills WHERE status != 'cancelled'"),
      pool.query("SELECT COALESCE(SUM(COALESCE(total_with_gst, amount, grand_total, 0)), 0)::float AS total FROM bills WHERE status != 'cancelled'"),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts: productCount[0]?.count || 0,
        lowStockCount: lowStockCount[0]?.count || 0,
        totalOrders: orderCount[0]?.count || 0,
        totalRevenue: parseFloat(revenueResult[0]?.total || 0),
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// REPORTS
// ──────────────────────────────────────────────

app.get('/api/reports/sales', async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;
  try {
    let query = `SELECT * FROM bills WHERE status != 'cancelled'`;
    const params = [];
    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2`;
      params.push(parseInt(month), parseInt(year));
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);

    const totalRevenue = rows.reduce((sum, r) => sum + parseFloat(r.total_with_gst || r.amount || r.grand_total || 0), 0);
    const totalOrders = rows.length;

    res.json({
      success: true,
      report: {
        totalRevenue,
        totalOrders,
        period: month && year ? `${month}/${year}` : 'All time',
        bills: rows,
      }
    });
  } catch (err) {
    console.error('Sales report error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/reports/top-products', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, product_name AS name, selling_price AS price, quantity AS stock
      FROM inventory_items ORDER BY quantity DESC LIMIT 10
    `);
    res.json({ success: true, products: rows });
  } catch (err) {
    console.error('Top products error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ──────────────────────────────────────────────
// QUOTATIONS
// ──────────────────────────────────────────────

app.get('/api/quotations', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM quotations ORDER BY created_at DESC');
    res.json({ success: true, quotations: rows });
  } catch (err) {
    console.error('Fetch quotations error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/quotations/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM quotations WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    res.json({ success: true, quotation: rows[0] });
  } catch (err) {
    console.error('Fetch quotation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/quotations', async (req, res) => {
  const { quotation_no, client_name, amount, subtotal, discount, cgst_amount, sgst_amount, igst_amount, valid_till, terms_and_conditions, user_email, status } = req.body;
  if (!quotation_no || !client_name) {
    return res.status(400).json({ success: false, message: 'Quotation number and client name are required' });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO quotations (quotation_no, client_name, amount, subtotal, discount, cgst_amount, sgst_amount, igst_amount, valid_till, terms_and_conditions, user_email, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [quotation_no, client_name, amount || 0, subtotal || 0, discount || 0, cgst_amount || 0, sgst_amount || 0, igst_amount || 0, valid_till, terms_and_conditions || null, user_email || 'admin@soundpro.com', status || 'pending']
    );
    res.status(201).json({ success: true, message: 'Quotation saved successfully', quotation: rows[0] });
  } catch (err) {
    console.error('Save quotation error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`SoundPro (PostgreSQL) running at http://localhost:${PORT}`);
});
