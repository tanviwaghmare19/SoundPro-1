# SoundPro (Audiotonics) — Project Documentation

> Audio equipment billing & inventory management system with GST support.

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 4.21 |
| Database | MySQL via mysql2 driver |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Icons | Font Awesome 6.x (CDN) |
| Font | Poppins (Google Fonts, CDN) |
| QR Code | qrcodejs (CDN) + qrcode npm for server |
| PDF | jsPDF 2.5.1 (CDN, loaded but unused) |
| Auth | localStorage boolean flag (no JWT) |
| Build | None — raw files served as static assets |

---

## 2. Directory Structure

```
SoundPro-1/
├── index.html                      # Root entry — redirects to pages/LoginPage.html
├── server.js                       # Express backend — API routes + static file serving
├── setup.js                        # DB seeding script (npm run setup)
├── schema.sql                      # MySQL schema (5 tables)
├── package.json                    # Dependencies & scripts
├── package-lock.json
├── .gitignore                      # node_modules/, .env
├── commands.md                     # Setup instructions
├── readme.md                       # Project readme
├── sitemap.xml                     # SEO sitemap
├── wireframe-improvements.md       # Architecture docs & known bugs
├── out/
│   └── app-flow.mp4                # Demo video
├── assets/
│   └── admin.png                   # Default admin avatar
├── components/
│   ├── sidebar.html                # Sidebar markup template
│   ├── sidebar.css                 # Sidebar styles
│   └── sidebar.js                  # Self-injecting sidebar (IIFE)
├── css/
│   ├── LoginPage.css
│   ├── dashboard.css
│   ├── products.css
│   ├── addProduct.css
│   ├── orders.css
│   ├── lowStock.css
│   ├── createBill.css
│   ├── addProductsbilling.css
│   ├── billPreview.css
│   ├── billGenerated.css
│   ├── pdfViewer.css
│   ├── reports.css
│   ├── salesReport.css
│   ├── profile.css
│   ├── settings.css
│   └── changePassword.css
├── js/
│   ├── auth.js                     # Auth guard (redirects if not logged in)
│   ├── login.js                    # Legacy hardcoded login
│   ├── LoginPage.js                # API-based login + dark mode
│   ├── dashboard.js                # Dashboard sidebar toggle, animations
│   ├── products.js                 # Product listing, search, filter, CRUD
│   ├── addProduct.js               # Add/Edit product form
│   ├── orders.js                   # Orders list with detail modal
│   ├── lowStock.js                 # Low stock alerts
│   ├── createBill.js               # Customer search/select, API CRUD
│   ├── addProductsbilling.js       # Product entry, GST calc, bill data prep
│   ├── billPreview.js              # Bill preview, dynamic tax display
│   ├── billGenerated.js            # Bill saved confirmation + save to API
│   ├── pdfViewer.js                # Tax invoice PDF + e-Way bill + QR codes
│   ├── qrCode.js                   # QR generation for e-Way bill
│   ├── ewayBill.js                 # Standalone e-Way bill logic (stub)
│   ├── reports.js                  # Reports dashboard
│   ├── salesReport.js              # Sales report with download
│   ├── profile.js                  # Admin profile edit
│   ├── settings.js                 # Settings toggle
│   └── changePassword.js           # Password change with strength meter
└── pages/
    ├── LoginPage.html              # Login
    ├── dashboard.html              # Main dashboard
    ├── products.html               # Product catalog
    ├── addProduct.html             # Add/Edit product form
    ├── orders.html                 # Orders list
    ├── lowStock.html               # Low stock alerts
    ├── createBill.html             # Step 1: Select/create customer
    ├── addProductsbilling.html     # Step 2: Add products, select GST
    ├── billPreview.html            # Step 3: Preview bill
    ├── billGenerated.html          # Step 4: Success + Save/PDF/Print
    ├── pdfViewer.html              # Step 5: Tax invoice + e-Way bill
    ├── reports.html                # Reports dashboard
    ├── salesReport.html            # Detailed sales report
    ├── profile.html                # Admin profile
    ├── settings.html               # App settings
    └── changePassword.html         # Change password
```

---

## 3. Architecture & Patterns

### 3.1 Pattern: Monolithic Multi-Page App
Each page is a standalone HTML file with its own CSS and JS. Navigation happens via `window.location.href` or `onclick` attributes — no client-side router.

### 3.2 State Management
- **localStorage** is the primary state layer — data flows between pages through it
- **Server (MySQL)** persists only clients and bills
- Products, orders, reports, and user profiles are entirely client-side

### 3.3 Authentication
- Login sends `POST /api/login` → server verifies with bcrypt
- On success: `localStorage.setItem("isLoggedIn", "true")`
- `auth.js` checks this flag on every protected page; redirects to `LoginPage.html` if missing
- No JWT, no sessions, no token — trivially bypassable

### 3.4 Sidebar Injection
- `sidebar.js` uses an IIFE (Immediately Invoked Function Expression)
- On load, it checks if a sidebar already exists; if not, dynamically creates the full DOM (HTML + CSS) and inserts it as the first child of `<body>`
- Auto-highlights the current page's nav link based on `window.location.pathname`
- Auto-creates a floating hamburger button if no menu button exists on the page
- Global click listener closes the sidebar when clicking outside

### 3.5 Data Persistence Strategy
- **MySQL tables:** `users`, `companies`, `categories`, `inventory_items`, `bills`, `quotations`, `clients`
- **API-backed:** clients (CRUD), bills (write-only), login
- **Client-side only:** products, orders, low stock, reports, user profile, password
- **Demo data:** Dashboard stats, orders list, low stock items, report data — all hardcoded in JS

---

## 4. Server (server.js)

### 4.1 Setup
- Express on port 3000 (configurable via `PORT` env)
- Middleware: CORS, JSON body parser, static file serving from project root
- MySQL2 connection pool to database `soundpro`

### 4.2 API Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|-------------|----------|
| POST | `/api/login` | Authenticate user | `{ email, password }` | `{ success, userName, email }` or `{ success: false }` |
| POST | `/api/clients` | Create customer | `{ name, phone, address, company }` | `{ success, client }` |
| GET | `/api/clients` | List all clients | — | Array of clients |
| GET | `/api/clients/search?q=` | Search clients | — | Filtered array (LIKE on name/phone) |
| DELETE | `/api/clients/:id` | Delete client | — | `{ success }` |
| POST | `/api/bills` | Save a bill | `{ invoice_no, customer_name, subtotal, cgst, sgst, igst, discount, grand_total, ... }` | `{ success, bill }` |
| GET | `/api/bills` | List all bills | — | Array of bills |

**Note:** All API routes are duplicated in `server.js` (merge conflict artifact — lines 60–81 = 158–179, etc.).

### 4.3 Database Schema (schema.sql)

**Tables:** `users`, `companies`, `categories`, `inventory_items`, `bills`, `quotations`, `clients`

All use UUID primary keys. Key relationships:
- `categories.company_id → companies.id`
- `inventory_items.company_id → companies.id`, `inventory_items.category_id → categories.id`

The `bills` table stores: invoice_no, customer_name, subtotal, cgst/sgst/igst, discount, grand_total, amount, gst_amount, total_with_gst, date, payment_mode, notes, user_email, gst_percentage, status, mode_of_transport, rr_gr_no.

### 4.4 DB Seeding (setup.js)
Run via `npm run setup`. Creates:
- Default admin: `admin@soundpro.com` / `admin123` (bcrypt hashed)
- Demo company: "SoundPro Demo"
- 5 categories: Speakers, Amplifiers, Microphones, Cables, Accessories
- 11 demo inventory items with cost/dealer/MRP pricing and stock qty

---

## 5. Page-by-Page Code Flow

### 5.1 Authentication Flow

```
index.html
  └─ meta refresh → pages/LoginPage.html

LoginPage.html
  ├─ login() → POST /api/login
  │   ├─ Success: localStorage.set("isLoggedIn", "true")
  │   │            localStorage.set("userName", res.userName)
  │   │            window.location = "dashboard.html"
  │   └─ Fail: alert("Invalid email or password")
  └─ Dark mode toggle (localStorage "theme")

auth.js (loaded on every protected page)
  └─ if !isLoggedIn → redirect to ../LoginPage.html
```

### 5.2 Dashboard

```
dashboard.html
  ├─ Static stats cards: Total Products, Low Stock, Orders, Revenue
  ├─ SVG revenue line graph (hardcoded)
  ├─ CSS conic-gradient pie chart (stock overview)
  └─ Links: products.html, lowStock.html, orders.html

dashboard.js
  ├─ Auth guard
  ├─ toggleSidebar() / closeSidebar()
  ├─ ESC key closes sidebar
  ├─ Card fade-in animation on load
  └─ logout() — clear localStorage → LoginPage
```

### 5.3 Products (Client-Side Only)

```
products.html
  ├─ Search bar (filters by name/brand/category/SKU)
  ├─ Slide-out filter panel: category, brand, price range, stock level, sort
  ├─ Product cards: image, name, brand, category, SKU, price, stock qty + update
  ├─ Edit/Delete per product
  └─ Floating + button → addProduct.html

products.js
  ├─ localStorage key: "products"
  ├─ Seeds 4 default products on first visit
  ├─ displayProducts() — renders cards from localStorage
  ├─ searchProducts() — real-time filter
  ├─ filterProducts() — category/brand filter panel
  ├─ updateStock(index, qty) — in-place update
  ├─ deleteProduct(index) — confirm → remove
  └─ editProduct(index) — sets localStorage "editIndex" → redirects addProduct.html

addProduct.html
  ├─ Image upload with preview (FileReader)
  ├─ Fields: name, SKU, price, stock, category dropdown, brand
  └─ Save button

addProduct.js
  ├─ Edit mode: reads "editIndex" from localStorage, pre-fills form
  ├─ saveProduct() — validates, creates object, push/update to "products"
  └─ On save → redirect to products.html
```

### 5.4 Orders (Hardcoded Demo Data)

```
orders.html
  ├─ Search by customer name or order ID
  ├─ Filter buttons: All / Pending / Processing / Delivered / Cancelled
  ├─ Order cards: ID, date, customer, amount, status badge
  └─ Click → modal with full order detail

orders.js
  ├─ localStorage not used — 5 hardcoded orders with products
  ├─ displayOrders() — renders filtered list
  ├─ openOrder(id) — populates modal with:
  │   ├─ Customer details, payment info
  │   ├─ Product table (name, qty, price, total)
  │   └─ Summary: subtotal, GST, shipping, discount, grand total
  └─ Modal: Print, Download, Close buttons
```

### 5.5 Low Stock (Hardcoded Demo Data)

```
lowStock.html
  └─ 5 hardcoded product cards with low stock warning

lowStock.js
  ├─ Auth guard
  ├─ goDashboard, logout
  └─ Fade-in animation on load
```

### 5.6 Billing Flow (5-Step Wizard)

All data passes between steps via `localStorage`.

```
STEP 1: createBill.html + createBill.js
├─ GET /api/clients → loadRecentCustomers()
├─ Search: filters by name/mobile/code client-side
├─ Click customer → localStorage "selectedCustomer" → redirect Step 2
├─ Add customer modal → POST /api/clients → refresh list
├─ Delete customer (with confirmation) → DELETE /api/clients/:id
└─ Menu/back button handlers

STEP 2: addProductsbilling.html + addProductsbilling.js
├─ Loads "selectedCustomer" from localStorage
├─ GST radio buttons: No GST / CGST+SGST / IGST / CGST+SGST+IGST
│   └─ Dynamic table rebuild — tax columns change based on selection
├─ Product search (by name)
├─ Product table: Sr No, Name, Rate, Qty, dynamic tax cols, Amount, Delete
├─ Bill summary: Subtotal, dynamic GST rows, Net Total
├─ Delete product with confirmation
└─ Generate Bill → saves to localStorage:
    "selectedProducts", "subtotal", "gstType", "gstBreakdown",
    "grandTotal", "invoiceNo", "billDate" → redirect Step 3

STEP 3: billPreview.html + billPreview.js
├─ Loads customer, products, gstBreakdown from localStorage
├─ Renders product summary (4-col grid: Product / Qty / Rate / Amount)
├─ Summary: Subtotal, dynamic GST rows, Grand Total
├─ If grandTotal >= 50000:
│   ├─ Generates random 8-digit e-Way bill number (prefix "EWB")
│   └─ Shows e-Way section
├─ numberToWords() — converts amount to Indian currency words
└─ "Generate Final Bill" → saves "currentInvoice" to localStorage → redirect Step 4

STEP 4: billGenerated.html + billGenerated.js
├─ Loads "currentInvoice" from localStorage
├─ Shows success icon + invoice card:
│   ├─ Invoice No, Customer, Subtotal
│   ├─ CGST/SGST/IGST (conditionally hidden if 0)
│   ├─ Total Amount
│   └─ E-Way Bill No (conditionally shown)
├─ "Save Bill" → POST /api/bills + localStorage "invoiceHistory"
├─ "PDF" → redirect to pdfViewer.html
├─ "Print" → window.print()
└─ "Home" / "New Bill" — navigation

STEP 5: pdfViewer.html + pdfViewer.js
├─ Loads invoice from localStorage
├─── PAGE 1: TAX INVOICE ───
│   ├─ Company: Audio Tonic Traders (GSTIN, address)
│   ├─ Invoice meta: No, Date, Place of Supply, Transport, E-Way No
│   ├─ Billing / Shipping addresses
│   ├─ Product table: S.No, Description, HSN, Qty, Price, SGST, CGST, Amount
│   ├─ Tax summary table: HSN, Tax Rate, Taxable Amt, SGST/CGST/Total Tax
│   ├─ Amount in words, bank details, T&C, authorized signatory
│   └─ QR code (185x185) — URL with encoded invoice data
├─── PAGE 2: E-WAY BILL (if grandTotal >= 50000) ───
│   ├─ IRN, addresses, goods table, transportation/vehicle details
│   └─ QR code (165x165) — URL with #ewayBillPage hash
└─ Print CSS: @page { size: A4 }, page-break between pages
```

### 5.7 Reports (Hardcoded Demo Data)

```
reports.html
├─ Month select dropdown
├─ 4 stat cards: Total Sales, Orders, New Customers, Top Product
├─ CSS bar chart (desktop/mobile split)
└─ "View Detailed Sales Report" → salesReport.html

reports.js — month filter logs to console only

salesReport.html
├─ Date range display, total revenue
├─ SVG line graph (hardcoded)
├─ Top 3 products (hardcoded)
└─ "Download Report" → generates text file via Blob download

salesReport.js — auth guard, fade-in animations
```

### 5.8 Settings Pages

```
profile.html + profile.js
├─ Displays admin info from localStorage "adminProfile"
├─ Edit button: enables all inputs
├─ Save: validates → saves to localStorage → disables inputs
└─ Cancel: reverts to saved values

settings.html + settings.js
├─ Profile link, Change Password link
├─ Notifications toggle (alerts on/off)
├─ Backup & Restore, About Us (placeholder)
└─ Known bug: two #backBtn listeners conflict

changePassword.html + changePassword.js
├─ Seeds default password "admin123" to localStorage "adminPassword"
├─ Show/hide password toggle
├─ Real-time strength meter: length, upper, lower, number, special
├─ Validates current password, confirms match, checks strength
└─ Saves new password to localStorage
```

---

## 6. localStorage Data Structures

| Key | Type | Description | Set By |
|-----|------|-------------|--------|
| `isLoggedIn` | string `"true"` | Auth flag | LoginPage.js |
| `userName` | string | Logged-in user name | LoginPage.js |
| `userEmail` | string | Logged-in user email | LoginPage.js |
| `theme` | string | `"dark"` or `"light"` | LoginPage.js |
| `products` | object[] | Product catalog | products.js |
| `editIndex` | number | Index of product being edited | products.js → addProduct.js |
| `adminProfile` | object | `{ adminName, mobile, email, role, company, address }` | profile.js |
| `adminPassword` | string | Plain-text password | changePassword.js |
| `selectedCustomer` | object | `{ id, name, mobile, city, color }` | createBill.js |
| `selectedProducts` | object[] | Products on current bill | addProductsbilling.js |
| `subtotal` | number | Bill subtotal | addProductsbilling.js |
| `gstType` | string | GST selection | addProductsbilling.js |
| `gstBreakdown` | object[] | `[{ type, rate, totalAmount }]` | addProductsbilling.js |
| `cgst`, `sgst`, `igst` | number | Tax rates (percent) | addProductsbilling.js |
| `grandTotal` | number | Total with GST | addProductsbilling.js |
| `invoiceNo` | string | Generated invoice number | addProductsbilling.js |
| `billDate` | string | Date of bill | addProductsbilling.js |
| `currentInvoice` | object | Complete invoice data | billPreview.js |
| `invoiceHistory` | object[] | Saved bill history | billGenerated.js |

---

## 7. Setup & Commands

### 7.1 Prerequisites

| Dependency | Version | Check Command |
|-----------|---------|---------------|
| Node.js | >= 18.x | `node --version` |
| npm | >= 9.x | `npm --version` |
| MySQL | >= 8.x | `mysql --version` |
| Git | any | `git --version` |

### 7.2 Setup Instructions

#### Windows (PowerShell / CMD)

```powershell
REM 1. Clone the repository
git clone <repo-url> SoundPro-1
cd SoundPro-1

REM 2. Create environment file
copy NUL .env
echo DB_HOST=localhost>> .env
echo DB_USER=root>> .env
echo DB_PASSWORD=your_mysql_password>> .env
echo DB_NAME=soundpro>> .env
echo PORT=3000>> .env

REM 3. Install npm dependencies
npm install

REM 4. Create MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS soundpro;"

REM 5. Import schema
mysql -u root -p soundpro < schema.sql

REM 6. Seed demo data
npm run setup

REM 7. Start the server
npm start

REM Server runs at http://localhost:3000
```

#### Ubuntu / Debian (Bash)

```bash
# 1. Clone the repository
git clone <repo-url> SoundPro-1
cd SoundPro-1

# 2. Create environment file
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=soundpro
PORT=3000
EOF

# 3. Install npm dependencies
npm install

# 4. Create MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS soundpro;"

# 5. Import schema
mysql -u root -p soundpro < schema.sql

# 6. Seed demo data
npm run setup

# 7. Start the server
npm start

# Server runs at http://localhost:3000
```

### 7.3 Quick Command Reference

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Seed database | `npm run setup` |
| Start server | `npm start` |
| Create database | `mysql -u root -p -e "CREATE DATABASE soundpro;"` |
| Import schema | `mysql -u root -p soundpro < schema.sql` |
| Login (seeded) | Email: `admin@soundpro.com` / Password: `admin123` |

### 7.4 Troubleshooting

**Port 3000 already in use:**
- Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
- Ubuntu: `sudo lsof -i :3000` then `kill -9 <PID>`
- Or set `PORT=3001` in `.env`

**MySQL connection refused:**
- Windows: Check `services.msc` → MySQL80 is running
- Ubuntu: `sudo systemctl status mysql` → `sudo systemctl start mysql`

**bcrypt build error on Windows:**
```powershell
npm install --global windows-build-tools
npm rebuild bcrypt
```

---

## 8. Known Issues

### Unresolved Merge Conflict Artifacts
Nearly all JS files and several HTML/CSS files contain unresolved merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`). This results in:
- Duplicated code blocks
- Competing implementations (e.g., two GST calculation systems in `addProductsbilling.js`)
- Duplicate variable declarations
- Duplicate function definitions

### Critical Bugs
1. **orders.js:299** — `document.querySelector(".logout")` returns `null` because `sidebar.js` hasn't injected yet. Crashes all code after that line.
2. **Login redirect paths** — `LoginPage.js` redirects to `dashboard.html` (wrong path; should be `pages/dashboard.html`)
3. **settings.js** — Two event listeners on `#backBtn`: one navigates to `products.html`, the other calls `history.back()`. Conflict.
4. **auth.js guard paths** — Hardcoded as `../LoginPage.html`, which may break depending on page depth.
5. **Products client-side only** — The `inventory_items` MySQL table exists and gets seeded, but the frontend never uses it. Products live only in localStorage.

### Architectural Issues
- **No real auth** — `isLoggedIn` boolean in localStorage is trivially manipulated
- **Password in plaintext** — Stored in localStorage by `changePassword.js`
- **QR code circular reference** — `pdfViewer.html` QR encodes a URL to itself
- **e-Way bill is fake** — Random number, not from government API
- **All demo data is hardcoded** — Dashboard, orders, low stock, reports have no live data integration
- **API routes duplicated** — Every route in `server.js` appears twice due to bad merge
- **jsPDF loaded but unused** — Loaded in `billGenerated.html` but never called; PDF is an HTML page for printing

---

## 9. Merge Conflict Summary

| File | Conflict Lines | Impact |
|------|---------------|--------|
| `server.js` | Lines 60–252 | Every API route defined twice |
| `dashboard.js` | Lines ~50–70 | Sidebar toggle duplicated |
| `orders.js` | Lines 293–303 | Sidebar logic duplicated |
| `createBill.js` | Entire file | Full code block repeated |
| `addProductsbilling.js` | Entire file | Two competing GST systems |
| `billPreview.js` | Entire file | Two competing implementations |
| `ewayBill.js` | Entire file | Two versions |
| `js/pdfViewer.js` | Entire file | Minor variable conflicts |

---

*Generated from codebase analysis — July 2026*
