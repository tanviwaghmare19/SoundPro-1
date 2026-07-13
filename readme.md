# SoundPro

Audio equipment billing & inventory management system with GST support (CGST/SGST/IGST), e-Way bill generation, customer management, and PDF invoice printing.

## Features

- **Billing** — Create bills with CGST+SGST or IGST tax split, e-Way bill auto-generation for orders > ₹50,000
- **Customer Management** — Add, search, and delete customers via API
- **Inventory** — Product catalog with categories, pricing, and stock tracking
- **PDF Viewer** — Professional tax invoice PDF with QR code and e-Way bill page
- **Authentication** — Login system with bcrypt password hashing

## Tech Stack

- **Backend:** Node.js, Express, MySQL2
- **Frontend:** HTML, CSS, JavaScript, Font Awesome
- **PDF:** jsPDF

## Quick Start

```
npm install
# Create .env file (see commands.md)
# Import schema.sql into MySQL
npm run setup
npm start
```

Open http://localhost:3000 — Login: `admin@soundpro.com` / `admin123`
