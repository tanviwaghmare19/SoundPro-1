const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const config = {
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
};
const DB_NAME = process.env.PG_DATABASE || 'soundpro';

async function setup() {
  // Step 1: Bootstrap — create database if missing
  const bootstrapPool = new Pool({ ...config, database: 'postgres' });
  const bootClient = await bootstrapPool.connect();
  try {
    const { rows } = await bootClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]
    );
    if (rows.length === 0) {
      await bootClient.query(`CREATE DATABASE "${DB_NAME}" OWNER '${config.user}'`);
      console.log(`Created database "${DB_NAME}"`);
    } else {
      console.log(`Database "${DB_NAME}" already exists`);
    }
  } finally {
    bootClient.release();
    await bootstrapPool.end();
  }

  // Step 2: Connect to target database and run schema + data
  const pool = new Pool({ ...config, database: DB_NAME });
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL');

    await client.query('BEGIN');

    // Schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema-pg.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('Schema created successfully');

    // Admin user
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

    // Import data from SQL folder
    const sqlDir = path.join(__dirname, 'SQL');
    const dataFiles = [
      'companies_rows.sql', 'categories_rows.sql', 'inventory_items_rows.sql',
      'clients_rows.sql', 'bills_rows.sql', 'quotations_rows.sql',
    ];

    for (const file of dataFiles) {
      const filePath = path.join(sqlDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`File not found, skipping: ${file}`);
        continue;
      }
      const content = fs.readFileSync(filePath, 'utf8').trim();
      if (!content) continue;

      const tableMatch = content.match(/INSERT INTO\s+"public"\.\"(\w+)"/);
      if (!tableMatch) {
        console.log(`Could not parse table name from ${file}, skipping`);
        continue;
      }
      const tableName = tableMatch[1];
      const count = await client.query(`SELECT COUNT(*)::int AS cnt FROM "${tableName}"`);
      if (count.rows[0].cnt > 0) {
        console.log(`${tableName} already has ${count.rows[0].cnt} rows, skipping import`);
        continue;
      }

      const statements = content.split(/\n(?=INSERT INTO)/);
      for (const stmt of statements) {
        const trimmed = stmt.trim();
        if (trimmed) {
          try { await client.query(trimmed); }
          catch (err) { console.error(`Error inserting into ${tableName}: ${err.message}`); }
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
