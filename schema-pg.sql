-- SoundPro PostgreSQL Schema
-- Run: psql -U postgres -d soundpro -f schema-pg.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  category VARCHAR(255),
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  hsn VARCHAR(100),
  watt VARCHAR(100),
  dealer_price DECIMAL(12,2) DEFAULT 0,
  mrp DECIMAL(12,2) DEFAULT 0,
  selling_price DECIMAL(12,2) DEFAULT 0,
  cost_price DECIMAL(12,2) DEFAULT 0,
  quantity INT DEFAULT 0,
  image_url TEXT,
  company_name VARCHAR(255),
  company_id UUID REFERENCES companies(id),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name VARCHAR(255) NOT NULL,
  customer_address TEXT,
  customer_phone VARCHAR(50),
  customer_gst VARCHAR(50),
  company_name VARCHAR(255),
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_no VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  subtotal DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  grand_total DECIMAL(12,2) DEFAULT 0,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  gst_percentage DECIMAL(12,2) DEFAULT 18,
  gst_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_with_gst DECIMAL(12,2) NOT NULL DEFAULT 0,
  cgst DECIMAL(12,2) DEFAULT 0,
  sgst DECIMAL(12,2) DEFAULT 0,
  igst DECIMAL(12,2) DEFAULT 0,
  cgst_amount DECIMAL(12,2) DEFAULT 0,
  sgst_amount DECIMAL(12,2) DEFAULT 0,
  igst_amount DECIMAL(12,2) DEFAULT 0,
  igst_enabled BOOLEAN DEFAULT FALSE,
  date VARCHAR(255) NOT NULL,
  payment_mode VARCHAR(255) NOT NULL,
  notes TEXT,
  user_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  mode_of_transport VARCHAR(255),
  rr_gr_no VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_no VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  cgst_amount DECIMAL(12,2) DEFAULT 0,
  sgst_amount DECIMAL(12,2) DEFAULT 0,
  igst_amount DECIMAL(12,2) DEFAULT 0,
  valid_till VARCHAR(255) NOT NULL,
  terms_and_conditions TEXT,
  user_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
