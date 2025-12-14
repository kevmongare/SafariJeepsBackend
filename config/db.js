// config/db.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',       // MySQL host
  user: 'root',            // MySQL username
  password: 'Mirambo1king',// MySQL password
  database: 'safari',      // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool to use in other files
module.exports = pool;
