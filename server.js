const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3000;
const DB_SOURCE = 'database.db';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Database setup
const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS admissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT NOT NULL,
            parent_name TEXT NOT NULL,
            class TEXT NOT NULL,
            dob TEXT NOT NULL,
            gender TEXT NOT NULL,
            address TEXT NOT NULL,
            contact_number TEXT NOT NULL,
            email TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        console.log('Database tables created/checked.');
    }
});

// Basic route to test if the server is running
app.get('/', (req, res) => {
    res.send('Node.js Backend is running!');
});

// Route to handle admission form submission
app.post('/submit_admission', (req, res) => {
    const { student_name, parent_name, class: class_val, dob, gender, address, contact_number, email } = req.body;

    // Basic validation
    if (!student_name || !parent_name || !class_val || !dob || !gender || !contact_number || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO admissions (student_name, parent_name, class, dob, gender, address, contact_number, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [student_name, parent_name, class_val, dob, gender, address, contact_number, email];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error inserting admission data:', err.message);
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
        res.status(200).json({ message: 'Admission data saved successfully!', id: this.lastID });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}/`);
});