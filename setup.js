const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'soundpro',
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const [existingUser] = await connection.execute(
    'SELECT id FROM users WHERE email = ?',
    ['admin@soundpro.com']
  );

  if (existingUser.length === 0) {
    await connection.execute(
      'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)',
      [crypto.randomUUID(), 'Admin', 'admin@soundpro.com', hashedPassword]
    );
    console.log('✓ User created: admin@soundpro.com / admin123');
  } else {
    console.log('→ User already exists, skipping');
  }

  const [existingCompany] = await connection.execute(
    'SELECT id FROM companies WHERE name = ?',
    ['SoundPro Demo']
  );

  let companyId;
  if (existingCompany.length === 0) {
    companyId = crypto.randomUUID();
    await connection.execute(
      'INSERT INTO companies (id, name) VALUES (?, ?)',
      [companyId, 'SoundPro Demo']
    );
    console.log('✓ Company created: SoundPro Demo');
  } else {
    companyId = existingCompany[0].id;
    console.log('→ Company already exists, skipping');
  }

  const categoryNames = ['Speakers', 'Amplifiers', 'Microphones', 'Cables', 'Accessories'];
  const categoryIds = {};

  for (const name of categoryNames) {
    const [existing] = await connection.execute(
      'SELECT id FROM categories WHERE name = ? AND company_id = ?',
      [name, companyId]
    );
    if (existing.length === 0) {
      const id = crypto.randomUUID();
      await connection.execute(
        'INSERT INTO categories (id, name, company_id) VALUES (?, ?, ?)',
        [id, name, companyId]
      );
      categoryIds[name] = id;
    } else {
      categoryIds[name] = existing[0].id;
    }
  }
  console.log('✓ Categories created: ' + categoryNames.join(', '));

  const items = [
    { cat: 'Speakers', name: '8" Passive Speaker', sku: 'SPK-001', hsn: '8518', watt: '200W', cost: 2500, dealer: 3500, mrp: 5000, qty: 20 },
    { cat: 'Speakers', name: '12" Active Speaker', sku: 'SPK-002', hsn: '8518', watt: '500W', cost: 5500, dealer: 7500, mrp: 10000, qty: 15 },
    { cat: 'Speakers', name: '15" Subwoofer', sku: 'SPK-003', hsn: '8518', watt: '800W', cost: 8000, dealer: 11000, mrp: 15000, qty: 10 },
    { cat: 'Amplifiers', name: '500W Power Amplifier', sku: 'AMP-001', hsn: '8518', watt: '500W', cost: 7000, dealer: 9500, mrp: 13000, qty: 12 },
    { cat: 'Amplifiers', name: '1000W Power Amplifier', sku: 'AMP-002', hsn: '8518', watt: '1000W', cost: 12000, dealer: 16000, mrp: 22000, qty: 8 },
    { cat: 'Microphones', name: 'Dynamic Microphone', sku: 'MIC-001', hsn: '8518', watt: null, cost: 800, dealer: 1200, mrp: 1800, qty: 30 },
    { cat: 'Microphones', name: 'Wireless Handheld Mic', sku: 'MIC-002', hsn: '8518', watt: null, cost: 3000, dealer: 4500, mrp: 6500, qty: 15 },
    { cat: 'Cables', name: '10m Speakon Cable', sku: 'CBL-001', hsn: '8544', watt: null, cost: 400, dealer: 600, mrp: 900, qty: 50 },
    { cat: 'Cables', name: '5m XLR Cable', sku: 'CBL-002', hsn: '8544', watt: null, cost: 250, dealer: 400, mrp: 600, qty: 60 },
    { cat: 'Accessories', name: 'Speaker Stand', sku: 'ACC-001', hsn: '7616', watt: null, cost: 1200, dealer: 1800, mrp: 2500, qty: 25 },
    { cat: 'Accessories', name: '8-Channel Mixer', sku: 'ACC-002', hsn: '8518', watt: '50W', cost: 5000, dealer: 7000, mrp: 9500, qty: 10 },
  ];

  for (const item of items) {
    const [existing] = await connection.execute(
      'SELECT id FROM inventory_items WHERE sku = ?',
      [item.sku]
    );
    if (existing.length === 0) {
      const id = crypto.randomUUID();
      await connection.execute(
        `INSERT INTO inventory_items (id, product_name, sku, hsn, watt, cost_price, dealer_price, selling_price, mrp, quantity, company_id, category_id, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
        [id, item.name, item.sku, item.hsn, item.watt, item.cost, item.dealer, item.dealer, item.mrp, item.qty, companyId, categoryIds[item.cat]]
      );
    }
  }
  console.log('✓ Inventory items created: ' + items.length + ' products');

  await connection.end();
  console.log('\n✔ Setup complete! You can now run: npm start');
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
