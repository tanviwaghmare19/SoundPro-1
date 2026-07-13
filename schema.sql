CREATE DATABASE IF NOT EXISTS soundpro;
USE soundpro;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS companies (
  id VARCHAR(36) DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  company_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id VARCHAR(36) DEFAULT (UUID()),
  name VARCHAR(255),
  category VARCHAR(255),
  selling_price DECIMAL(10,2) DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  quantity INT DEFAULT 0,
  image_url TEXT,
  company_name VARCHAR(255),
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(100),
  hsn VARCHAR(100),
  watt VARCHAR(100),
  company_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36) NOT NULL,
  dealer_price DECIMAL(10,2) DEFAULT 0,
  mrp DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS bills (
  id VARCHAR(36) DEFAULT (UUID()),
  igst_enabled BOOLEAN DEFAULT FALSE,
  invoice_no VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  subtotal DECIMAL(10,2) DEFAULT 0,
  cgst DECIMAL(10,2) DEFAULT 0,
  sgst DECIMAL(10,2) DEFAULT 0,
  igst DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  grand_total DECIMAL(10,2) DEFAULT 0,
  amount DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2) NOT NULL,
  total_with_gst DECIMAL(10,2) NOT NULL,
  date VARCHAR(255) NOT NULL,
  payment_mode VARCHAR(255) NOT NULL,
  notes TEXT,
  user_email VARCHAR(255) NOT NULL,
  gst_percentage DECIMAL(10,2) DEFAULT 18,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending',
  mode_of_transport VARCHAR(255),
  rr_gr_no VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS quotations (
  id VARCHAR(36) DEFAULT (UUID()),
  quotation_no VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  valid_till VARCHAR(255) NOT NULL,
  terms_and_conditions TEXT,
  user_email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) DEFAULT (UUID()),
  customer_name VARCHAR(255) NOT NULL,
  customer_address TEXT,
  customer_phone VARCHAR(50),
  customer_gst VARCHAR(50),
  company_name VARCHAR(255),
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
