const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  database: process.env.PG_DATABASE || 'soundpro',
});

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL');

    await client.query('BEGIN');

    // 1. Run schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema-pg.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('Schema created successfully');

    // 2. Seed admin user (skip if exists)
    const existingUser = await client.query("SELECT id FROM users WHERE email = 'admin@soundpro.com'");
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        ['Admin', 'admin@soundpro.com', hashedPassword]
      );
      console.log('Default admin user created: admin@soundpro.com / admin123');
    } else {
      console.log('Admin user already exists, skipping');
    }

    // 3. Import data from SQL folder (PostgreSQL dumps)
    const sqlDir = path.join(__dirname, 'SQL');
    const dataFiles = [
      'companies_rows.sql',
      'categories_rows.sql',
      'inventory_items_rows.sql',
      'clients_rows.sql',
      'bills_rows.sql',
      'quotations_rows.sql',
    ];

    for (const file of dataFiles) {
      const filePath = path.join(sqlDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`File not found, skipping: ${file}`);
        continue;
      }
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (!content) continue;

      // Extract table name from INSERT INTO "public"."tablename"
      const tableMatch = content.match(/INSERT INTO\s+"public"\.\"(\w+)"/);
      if (!tableMatch) {
        console.log(`Could not parse table name from ${file}, skipping`);
        continue;
      }
      const tableName = tableMatch[1];

      // Check if data already exists
      const count = await client.query(`SELECT COUNT(*)::int AS cnt FROM "${tableName}"`);
      if (count.rows[0].cnt > 0) {
        console.log(`${tableName} already has ${count.rows[0].cnt} rows, skipping import`);
        continue;
      }

      // Split by INSERT INTO to handle multi-line files
      const statements = content.split(/\n(?=INSERT INTO)/);
      for (const stmt of statements) {
        const trimmed = stmt.trim();
        if (trimmed) {
          try {
            await client.query(trimmed);
          } catch (err) {
            console.error(`Error inserting into ${tableName}: ${err.message}`);
          }
        }
      }
      console.log(`Imported data into ${tableName}`);
    }

    await client.query('COMMIT');
    console.log('\nSetup complete!');
    console.log('Login: admin@soundpro.com / admin123');
    console.log('Start server: npm run start-pg');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Setup failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
