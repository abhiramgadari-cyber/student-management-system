from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Database file
DATA_FILE = 'students.json'

# Load students from JSON file
def load_students():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Save students to JSON file
def save_students(students):
    with open(DATA_FILE, 'w') as f:
        json.dump(students, f, indent=2)

# Get all students
@app.route('/api/students', methods=['GET'])
def get_students():
    students = load_students()
    return jsonify(students)

# Get single student by ID
@app.route('/api/students/<student_id>', methods=['GET'])
def get_student(student_id):
    students = load_students()
    student = next((s for s in students if s['id'] == student_id), None)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    return jsonify(student)

# Add new student
@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.json
    students = load_students()

    # Validate required fields
    required_fields = ['id', 'name', 'email', 'phone', 'course', 'gpa', 'status']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if student ID already exists
    if any(s['id'] == data['id'] for s in students):
        return jsonify({'error': 'Student ID already exists'}), 400

    # Create new student
    new_student = {
        'id': data['id'],
        'name': data['name'],
        'email': data['email'],
        'phone': data['phone'],
        'course': data['course'],
        'gpa': float(data['gpa']),
        'status': data['status'],
        'dateAdded': datetime.now().strftime('%Y-%m-%d')
    }

    students.append(new_student)
    save_students(students)
    return jsonify(new_student), 201

# Update student
@app.route('/api/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    students = load_students()
    student = next((s for s in students if s['id'] == student_id), None)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    # Update fields
    student['name'] = data.get('name', student['name'])
    student['email'] = data.get('email', student['email'])
    student['phone'] = data.get('phone', student['phone'])
    student['course'] = data.get('course', student['course'])
    student['gpa'] = float(data.get('gpa', student['gpa']))
    student['status'] = data.get('status', student['status'])

    save_students(students)
    return jsonify(student)

# Delete student
@app.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    students = load_students()
    students = [s for s in students if s['id'] != student_id]
    save_students(students)
    return jsonify({'message': 'Student deleted successfully'})

# Get statistics
@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    students = load_students()
    
    total_students = len(students)
    active_students = len([s for s in students if s['status'] == 'Active'])
    average_gpa = sum(s['gpa'] for s in students) / total_students if total_students > 0 else 0
    
    courses = {}
    for student in students:
        course = student['course']
        courses[course] = courses.get(course, 0) + 1
    
    return jsonify({
        'total_students': total_students,
        'active_students': active_students,
        'average_gpa': round(average_gpa, 2),
        'courses': courses
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'API is running'})

@app.route('/')
def home():
    return jsonify({
        "status": "running",
        "message": "Student Management System API is live"
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
