# SoundPro — Commands & Setup Guide

## Prerequisites

| Tool | Windows | macOS | Linux |
|------|---------|-------|-------|
| **Node.js** | [nodejs.org](https://nodejs.org) — LTS v18+ | `brew install node` | `sudo apt install nodejs npm` |
| **MySQL** (optional) | [dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/) | `brew install mysql` | `sudo apt install mysql-server` |
| **Docker** (recommended for PostgreSQL) | [docker.com](https://www.docker.com/products/docker-desktop/) | `brew install --cask docker` | `sudo apt install docker.io docker-compose` |
| **Git** | [git-scm.com](https://git-scm.com/) | `brew install git` | `sudo apt install git` |

---

## 1. Clone the Repository

Replace `<YOUR_TOKEN>` with a GitHub personal access token (Settings → Developer settings → Personal access tokens → Fine-grained tokens).

```bash
# Using HTTPS (recommended)
git clone https://github.com/tanviwaghmare19/SoundPro-1.git
cd SoundPro-1

# Using SSH (if configured)
git clone git@github.com:tanviwaghmare19/SoundPro-1.git
cd SoundPro-1

# Using token-based authentication
#   Username: tanviwaghmare19
#   Password: <YOUR_TOKEN>
```

---

## 2. Create `.env` File (Required)

`.env` is ignored by git — you must create it manually. Create a file named `.env` in the project root:

### For PostgreSQL (via Docker — recommended)
```
PG_HOST=localhost
PG_PORT=5433
PG_USER=postgres
PG_PASSWORD=soundpro123
PG_DB=soundpro
PORT=3000
```

### For MySQL (legacy)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=soundpro
PORT=3000
```

---

## 3. Database Setup

### Option A — PostgreSQL via Docker (Recommended)

```bash
# Start PostgreSQL container
docker run -d --name soundpro-pg \
  -e POSTGRES_PASSWORD=soundpro123 \
  -e POSTGRES_DB=soundpro \
  -p 5433:5432 \
  postgres:16-alpine

# Stop container
docker stop soundpro-pg

# Start again
docker start soundpro-pg

# Remove and recreate
docker stop soundpro-pg && docker rm soundpro-pg
docker run -d --name soundpro-pg -e POSTGRES_PASSWORD=soundpro123 -e POSTGRES_DB=soundpro -p 5433:5432 postgres:16-alpine
```

### Option B — MySQL (Legacy)

| Platform | Command |
|----------|---------|
| Windows (cmd) | `mysql -u root -p < schema.sql` |
| macOS/Linux | `sudo mysql -u root -p < schema.sql` |

---

## 4. Install Dependencies

```bash
# npm (all platforms)
npm install

# If you get permission errors on Linux/macOS
sudo npm install

# If you get "package not found", clear cache and retry
rm -rf node_modules package-lock.json && npm install
```

---

## 5. Seed the Database

### PostgreSQL
```bash
npm run setup-pg
```

### MySQL (legacy)
```bash
npm run setup
```

### Default Login
| Field | Value |
|-------|-------|
| Email | `admin@soundpro.com` |
| Password | `admin123` |

---

## 6. Start the Server

```bash
# PostgreSQL
npm run start-pg

# MySQL (legacy)
npm start
```

Open browser → [http://localhost:3000](http://localhost:3000)

---

## 7. Git — Push / Deploy

### First-time push to GitHub

```bash
# Add remote (only needed once)
git remote add origin https://github.com/tanviwaghmare19/SoundPro-1.git

# Verify remote
git remote -v

# Push to main branch
git push -u origin main

# If your default branch is "master"
git push -u origin master
```

### Daily workflow

```bash
# Check status
git status

# Stage all changes
git add .

# Or stage specific files
git add package.json server-pg.js schema-pg.sql
git add js/dashboard.js js/products.js js/orders.js

# Commit
git commit -m "describe what changed"

# Push to GitHub
git push

# Pull latest changes
git pull
```

### Authentication on push

If you get a password prompt when pushing:

- **Option 1 — PAT (Personal Access Token):**  
  Use your token as the password when prompted.
  Username: `tanviwaghmare19`  
  Password: `<YOUR_TOKEN>`

- **Option 2 — GitHub CLI:**  
  ```bash
  # Install: https://cli.github.com/
  gh auth login
  # Then push normally
  git push
  ```

- **Option 3 — SSH key (recommended for repeat pushes):**  
  ```bash
  ssh-keygen -t ed25519 -C "your@email.com"   # generate key
  cat ~/.ssh/id_ed25519.pub                    # copy output
  ```
  Paste the key at: GitHub → Settings → SSH and GPG keys → New SSH key.  
  Then change remote:
  ```bash
  git remote set-url origin git@github.com:tanviwaghmare19/SoundPro-1.git
  git push
  ```

### Undo / Fix mistakes

```bash
# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Discard all uncommitted changes
git restore .
git checkout -- .

# Create a new branch and switch to it
git checkout -b my-feature-branch

# Switch branches
git checkout main

# Merge a branch
git merge my-feature-branch
```

---

## 8. VSCode Integration

### Open project
```bash
code .                          # Open entire project in VSCode
code pages/dashboard.html       # Open a specific file
code -r .                       # Open in current window (no new tab)
```

### Extensions to install (Ctrl+Shift+X)
- **Docker** — manage Docker containers from sidebar
- **GitLens** — inline git blame, history explorer
- **Prettier** — auto-format code on save
- **ESLint** — catch JS errors as you type
- **Live Server** — (alternative) hot-reload frontend
- **PostgreSQL** (by Chris Kolkman) — connect to PG from VSCode

### Recommended VSCode settings (`Ctrl+,` → open JSON)
Create `.vscode/settings.json` in the project root:
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "files.exclude": {
    "node_modules/": true,
    ".git/": true
  },
  "git.autofetch": true,
  "git.enableSmartCommit": true
}
```

### Debug server in VSCode
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug server-pg",
      "program": "${workspaceFolder}/server-pg.js",
      "env": { "PORT": "3000" }
    }
  ]
}
```
Then press **F5** to start debugging with breakpoints.

### Docker integration in VSCode
- Install **Docker** extension
- Click the Docker icon in the left sidebar
- Right-click `soundpro-pg` container → Start / Stop / View Logs

---

## 9. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User login |
| GET | `/api/dashboard/stats` | Dashboard statistics (products, orders, revenue) |
| GET | `/api/products` | All products (supports `?category=X`) |
| GET | `/api/products/search?q=` | Search products by name/SKU/brand |
| GET | `/api/products/low-stock?threshold=N` | Low stock products |
| GET | `/api/products/:id` | Single product details |
| POST | `/api/products` | Create a new product |
| PUT | `/api/products/:id` | Update a product |
| PATCH | `/api/products/:id/stock` | Increment product stock |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/orders` | All orders (from bills table) |
| GET | `/api/clients` | All customers |
| POST | `/api/clients` | Create a new customer |
| DELETE | `/api/clients/:id` | Delete a customer |
| POST | `/api/bills` | Save a bill (with CGST/SGST/IGST) |
| GET | `/api/quotations` | All quotations |
| GET | `/api/reports/sales?month=&year=` | Sales report |
| GET | `/api/reports/top-products` | Top 10 best-selling products |

### Test endpoints with curl (any platform)

```bash
# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@soundpro.com\",\"password\":\"admin123\"}"

# Dashboard
curl http://localhost:3000/api/dashboard/stats

# Products
curl http://localhost:3000/api/products

# Orders
curl http://localhost:3000/api/orders

# Search products
curl "http://localhost:3000/api/products/search?q=speaker"

# Low stock
curl "http://localhost:3000/api/products/low-stock?threshold=5"

# Create a bill
curl -X POST http://localhost:3000/api/bills \
  -H "Content-Type: application/json" \
  -d "{\"invoice_no\":\"INV001\",\"customer_name\":\"Test\",\"subtotal\":1000,\"cgst\":9,\"sgst\":9,\"cgst_amount\":90,\"sgst_amount\":90,\"grand_total\":1180}"

# Sales report
curl http://localhost:3000/api/reports/sales
```

---

## 10. Project Structure

```
SoundPro-1/
├── server-pg.js                # PostgreSQL server (uses PG_* env vars)
├── server.js                   # MySQL server (legacy, uses DB_* env vars)
├── schema-pg.sql               # PostgreSQL schema
├── schema.sql                  # MySQL schema (legacy)
├── setup-pg.js                 # PostgreSQL seed script
├── setup.js                    # MySQL seed script (legacy)
├── package.json                # Dependencies & scripts
├── .env                        # Environment config (git-ignored)
├── js/                         # Frontend JS (one file per page)
│   ├── auth.js                 # Login check (included on every page)
│   ├── LoginPage.js            # Login form handler
│   ├── dashboard.js            # Dashboard stats from API
│   ├── products.js             # Product listing + CRUD from API
│   ├── addProduct.js           # Add/edit product form (API)
│   ├── orders.js               # Orders from API
│   ├── lowStock.js             # Low stock from API
│   ├── reports.js              # Sales report filter
│   ├── salesReport.js          # Sales report display
│   ├── createBill.js           # Customer management for billing
│   ├── addProductsbilling.js   # Product selection for billing
│   ├── billPreview.js          # Bill preview with GST calc
│   ├── billGenerated.js        # Final bill page (saves to API)
│   ├── pdfViewer.js            # PDF/print bill view
│   ├── ewayBill.js             # E-way bill generation
│   ├── profile.js              # Admin profile (localStorage)
│   ├── settings.js             # App settings (localStorage)
│   └── changePassword.js       # Password change (localStorage)
├── pages/                      # HTML pages
│   ├── LoginPage.html
│   ├── dashboard.html
│   ├── products.html
│   ├── addProduct.html
│   ├── orders.html
│   ├── createBill.html
│   ├── addProductsbilling.html
│   ├── billPreview.html
│   ├── billGenerated.html
│   ├── pdfViewer.html
│   ├── lowStock.html
│   ├── reports.html
│   ├── salesReport.html
│   ├── profile.html
│   ├── settings.html
│   └── changePassword.html
├── css/                        # Stylesheets
├── components/                 # Shared components (sidebar)
├── assets/                     # Images & icons
└── SQL/                        # Production data dumps for PostgreSQL
```

---

## 11. npm Scripts

```bash
npm run setup-pg       # Seed PostgreSQL database
npm run start-pg       # Start server with PostgreSQL
npm run setup          # Seed MySQL database (legacy)
npm start              # Start server with MySQL (legacy)
npm install            # Install all dependencies
```

---

## 12. Troubleshooting

### Docker — PostgreSQL

| Problem | Solution |
|---------|----------|
| `port 5433 already in use` | `docker stop soundpro-pg && docker rm soundpro-pg` then re-run |
| Container keeps restarting | `docker logs soundpro-pg` to see error |
| Connection refused | Ensure container is running: `docker ps \| grep soundpro-pg` |
| Reset database | `docker stop soundpro-pg && docker rm soundpro-pg` then re-run setup |

### Docker commands (all platforms)

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# View logs
docker logs soundpro-pg

# Restart
docker restart soundpro-pg

# Enter container shell
docker exec -it soundpro-pg psql -U postgres -d soundpro
```

### Port 3000 already in use

```bash
# Find what's using port 3000
# Windows (PowerShell):
netstat -ano | findstr :3000

# Linux / macOS:
lsof -i :3000
sudo lsof -i :3000

# Kill the process
# Windows: taskkill /PID <PID> /F
# Linux/macOS: kill -9 <PID>
```

Then change `PORT` in `.env` to a different value (e.g. `PORT=3001`) and restart.

### Node.js issues

```bash
# Check version
node --version   # must be v18+
npm --version

# "Cannot find module" errors
rm -rf node_modules package-lock.json && npm install

# Permission errors (Linux/macOS)
sudo npm install

# "command not found: node"
# Install from https://nodejs.org (LTS version)
# Restart terminal after install
```

---

## Quick Reference

```bash
# Clone
git clone https://github.com/tanviwaghmare19/SoundPro-1.git
cd SoundPro-1

# Start Docker PostgreSQL
docker run -d --name soundpro-pg -e POSTGRES_PASSWORD=soundpro123 -e POSTGRES_DB=soundpro -p 5433:5432 postgres:16-alpine

# Create .env with PG config, then:
npm install
npm run setup-pg
npm run start-pg

# Open browser
open http://localhost:3000

# Git push
git add .
git commit -m "description"
git push
```
