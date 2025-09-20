from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS # Import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for your app
DATABASE = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row # This allows accessing columns by name
    return conn

def init_db():
    with app.app_context():
        conn = get_db_connection()
        cursor = conn.cursor()
        # Create admissions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS admissions (
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
            )
        ''')
        # Create feedback table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

@app.route('/')
def index():
    return "Backend is running!"

@app.route('/submit_admission', methods=['POST'])
def submit_admission():
    try:
        data = request.get_json()

        student_name = data.get('student-name')
        parent_name = data.get('parent-name')
        class_val = data.get('class') # Renamed to avoid conflict with Python's 'class' keyword
        dob = data.get('dob')
        gender = data.get('gender')
        address = data.get('address')
        contact_number = data.get('contact-number')
        email = data.get('email')

        # Basic validation
        if not all([student_name, parent_name, class_val, dob, gender, contact_number, email]):
            return jsonify({"message": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO admissions (student_name, parent_name, class, dob, gender, address, contact_number, email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (student_name, parent_name, class_val, dob, gender, address, contact_number, email))
        conn.commit()
        conn.close()

        return jsonify({"message": "Admission data saved successfully!"}), 200

    except Exception as e:
        print(f"Error submitting admission: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        # Basic validation
        if not all([name, email, subject, message]):
            return jsonify({"message": "Missing required fields"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO feedback (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        ''', (name, email, subject, message))
        conn.commit()
        conn.close()

        return jsonify({"message": "Feedback submitted successfully!"}), 200

    except Exception as e:
        print(f"Error submitting feedback: {e}")
        return jsonify({"message": "Internal server error"}), 500

if __name__ == '__main__':
    init_db() # Initialize database when the app starts
    app.run(debug=True) # Run the Flask app in debug mode