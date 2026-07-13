# SoundPro — Commands & Setup Guide

## Prerequisites

| Tool | Windows | macOS | Linux |
|------|---------|-------|-------|
| **Node.js** | [nodejs.org](https://nodejs.org) — LTS version | `brew install node` | `sudo apt install nodejs npm` |
| **MySQL** | [dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/) | `brew install mysql` | `sudo apt install mysql-server` |
| **Git** | [git-scm.com](https://git-scm.com/) | `brew install git` | `sudo apt install git` |

---

## 1. Clone the Repository

```bash
git clone <repo-url>
cd SoundPro
```

---

## 2. Create `.env` File (Required)

`.env` is ignored by git — you must create it manually.

Create a file named `.env` in the project root with:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=soundpro
PORT=3000
```

Replace `your_mysql_password` with your actual MySQL root password.

---

## 3. Set Up MySQL Database

### Windows
**Option A — MySQL Workbench (GUI):**
1. Open MySQL Workbench
2. File → Open SQL Script → select `schema.sql`
3. Click Execute (lightning icon)

**Option B — Command line:**
```bash
mysql -u root -p < schema.sql
```

### macOS
```bash
mysql -u root -p < schema.sql
```

### Linux
```bash
sudo mysql -u root -p < schema.sql
```

---

## 4. Install Dependencies

```bash
npm install
```

(Runs on all platforms identically.)

---

## 5. Seed Database (Create Admin + Demo Data)

```bash
npm run setup
```

Login credentials: `admin@soundpro.com` / `admin123`

---

## 6. Start the Server

```bash
npm start
```

Open browser → http://localhost:3000

---

## New API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User login |
| POST | `/api/clients` | Create a new customer |
| GET | `/api/clients` | Fetch all customers |
| GET | `/api/clients/search?q=` | Search customers by name/phone |
| DELETE | `/api/clients/:id` | Delete a customer |
| POST | `/api/bills` | Save a bill |
| GET | `/api/bills` | Fetch all saved bills |

---

## Troubleshooting

### MySQL not starting

| Platform | Command |
|----------|---------|
| Windows | `net start MySQL` (Run as Admin) |
| macOS | `brew services start mysql` |
| Linux | `sudo systemctl start mysql` |

### "Access denied for user 'root'"

**Windows:**
```bash
mysql -u root -p
```
Enter the password you set during MySQL installation.

**macOS / Linux:**
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
FLUSH PRIVILEGES;
```

Then update `DB_PASSWORD` in `.env`.

### "mysql: command not found"

Add MySQL's `bin` folder to your system PATH:
- **Windows:** `C:\Program Files\MySQL\MySQL Server 8.x\bin`
- **macOS:** `export PATH="/usr/local/mysql/bin:$PATH"` (add to `~/.zshrc`)
- **Linux:** `export PATH="/usr/bin/mysql:$PATH"`

### Port 3000 already in use

Change the port in `.env`:
```
PORT=3001
```
Then restart with `npm start`.

### Node.js not found

Install from [nodejs.org](https://nodejs.org) (LTS version). Restart terminal after install.

### "Cannot find module" errors

```bash
rm -rf node_modules && npm install
```

---

## Quick Reference

```bash
# Clone
git clone <url> && cd SoundPro

# Setup (first time only)
# 1. Create .env file
# 2. Run schema.sql in MySQL
# 3. Install + seed
npm install
npm run setup

# Run
npm start

# Open
http://localhost:3000
```
