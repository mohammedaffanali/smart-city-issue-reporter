const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files (index.html and other assets)
app.use(express.static(path.join(__dirname)));

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dlab',
  database: 'smart_city_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database (create tables if they don't exist)
async function initializeDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Create users table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create issues table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS issues (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        photo LONGTEXT NOT NULL,
        location JSON NOT NULL,
        status VARCHAR(50) DEFAULT 'New',
        reported_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create storage table (generic key-value storage)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS storage (
        key_name VARCHAR(255) PRIMARY KEY,
        value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    if (conn) conn.release();
  }
}

// API: GET /api/storage/:key
app.get('/api/storage/:key', async (req, res) => {
  const { key } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT value FROM storage WHERE key_name = ?', [key]);
    
    if (rows.length > 0) {
      res.json({ value: rows[0].value });
    } else {
      res.status(404).json({ error: 'Key not found' });
    }
  } catch (err) {
    console.error('GET /api/storage/:key error:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// API: POST /api/storage/:key
app.post('/api/storage/:key', async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.execute(
      'INSERT INTO storage (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [key, value, value]
    );
    res.json({ key, value });
  } catch (err) {
    console.error('POST /api/storage/:key error:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// API: DELETE /api/storage/:key
app.delete('/api/storage/:key', async (req, res) => {
  const { key } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.execute('DELETE FROM storage WHERE key_name = ?', [key]);
    res.json({ key, deleted: true });
  } catch (err) {
    console.error('DELETE /api/storage/:key error:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) conn.release();
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initializeDatabase();
});
