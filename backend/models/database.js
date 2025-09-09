const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../health_chatbot.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    age INTEGER,
    location TEXT,
    language TEXT DEFAULT 'hi',
    medical_conditions TEXT DEFAULT '[]',
    total_quiz_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Health alerts
  db.run(`CREATE TABLE IF NOT EXISTS health_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT,
    disease TEXT,
    message TEXT,
    severity TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample data
  db.run(`INSERT OR IGNORE INTO health_alerts (id, alert_type, disease, message, severity, location) VALUES
    (1, 'seasonal', 'Dengue', 'मानसून में डेंगू से बचाव करें। पानी जमा न होने दें।', 'high', 'Mumbai'),
    (2, 'outbreak', 'Chikungunya', 'चिकनगुनिया के मामले बढ़े हैं। मच्छरों से बचें।', 'medium', 'Delhi'),
    (3, 'vaccination', 'COVID-19', 'कोविड बूस्टर डोज़ लगवाएं।', 'medium', 'All India')`);
});

module.exports = db;