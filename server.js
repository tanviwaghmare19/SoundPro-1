const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'soundpro',
  waitForConnections: true,
  connectionLimit: 10,
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password FROM users WHERE email = ?',
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

    res.json({
      success: true,
      message: 'Login successful',
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`SoundPro server running at http://localhost:${PORT}`);
});
app.post("/api/customers", (req,res)=>{

    const {
        customer_name,
        customer_address,
        customer_phone,
        customer_gst,
        user_email
    } = req.body;

    const sql = `
    INSERT INTO clients
    (customer_name,
    customer_address,
    customer_phone,
    customer_gst,
    user_email)

    VALUES (?,?,?,?,?)
    `;

    db.query(sql,[
        customer_name,
        customer_address,
        customer_phone,
        customer_gst,
        user_email
    ],(err,result)=>{

        if(err){
            console.log(err);
            return res.status(500).json({
                success:false
            });
        }

        res.json({
            success:true,
            message:"Customer Saved"
        });

    });

});
