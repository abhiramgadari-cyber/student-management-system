// Student Management System - JavaScript

let students = [];
let editingStudentId = null;

// Load students from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    displayUserGreeting();
    
    loadStudents();
    displayStudents();
    setupEventListeners();
});

// Check if user is authenticated
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
    }
}

// Display user greeting
function displayUserGreeting() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const greeting = document.getElementById('userGreeting');
        if (greeting) {
            greeting.textContent = `Welcome, ${user.name}!`;
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('studentForm').addEventListener('submit', addStudent);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('searchInput').addEventListener('input', filterStudents);
    document.getElementById('filterCourse').addEventListener('change', filterStudents);
    document.getElementById('filterStatus').addEventListener('change', filterStudents);
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);

    // Modal event listeners
    document.querySelector('.close').addEventListener('click', closeEditModal);
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('editModal');
        if (event.target == modal) {
            closeEditModal();
        }
    });

    document.getElementById('editForm').addEventListener('submit', updateStudent);
}

// Load students from localStorage
function loadStudents() {
    const stored = localStorage.getItem('students');
    if (stored) {
        students = JSON.parse(stored);
    } else {
        students = [];
    }
}

// Save students to localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Add new student
function addStudent(e) {
    e.preventDefault();

    const student = {
        id: document.getElementById('studentId').value,
        name: document.getElementById('studentName').value,
        email: document.getElementById('studentEmail').value,
        phone: document.getElementById('studentPhone').value,
        course: document.getElementById('studentCourse').value,
        gpa: parseFloat(document.getElementById('studentGPA').value),
        status: document.getElementById('studentStatus').value,
        dateAdded: new Date().toLocaleDateString()
    };

    // Check if student ID already exists
    if (students.some(s => s.id === student.id)) {
        alert('Student ID already exists!');
        return;
    }

    students.push(student);
    saveStudents();
    displayStudents();
    resetForm();

    showNotification('Student added successfully!');
}

// Reset form
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentCourse').value = '';
    document.getElementById('studentStatus').value = 'Active';
}

// Display students in table
function displayStudents() {
    const table = document.getElementById('studentsTable');
    const tableBody = document.getElementById('studentsTableBody');
    const noStudents = document.getElementById('noStudents');
    const studentCount = document.getElementById('studentCount');

    tableBody.innerHTML = '';

    if (students.length === 0) {
        table.classList.add('hidden');
        noStudents.style.display = 'block';
        studentCount.textContent = '(0)';
        return;
    }

    noStudents.style.display = 'none';
    table.classList.remove('hidden');
    studentCount.textContent = `(${students.length})`;

    students.forEach(student => {
        const row = document.createElement('tr');
        const statusClass = `status-${student.status.toLowerCase()}`;
        row.innerHTML = `
            <td><strong>${student.id}</strong></td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.course}</td>
            <td>${student.gpa.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${student.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="openEditModal('${student.id}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteStudent('${student.id}')">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Delete student
function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== studentId);
        saveStudents();
        displayStudents();
        showNotification('Student deleted successfully!');
    }
}

// Open edit modal
function openEditModal(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    editingStudentId = studentId;

    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentPhone').value = student.phone;
    document.getElementById('editStudentCourse').value = student.course;
    document.getElementById('editStudentGPA').value = student.gpa;
    document.getElementById('editStudentStatus').value = student.status;

    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingStudentId = null;
}

// Update student
function updateStudent(e) {
    e.preventDefault();

    const student = students.find(s => s.id === editingStudentId);
    if (!student) return;

    student.name = document.getElementById('editStudentName').value;
    student.email = document.getElementById('editStudentEmail').value;
    student.phone = document.getElementById('editStudentPhone').value;
    student.course = document.getElementById('editStudentCourse').value;
    student.gpa = parseFloat(document.getElementById('editStudentGPA').value);
    student.status = document.getElementById('editStudentStatus').value;

    saveStudents();
    displayStudents();
    closeEditModal();
    showNotification('Student updated successfully!');
}

// Filter students
function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const courseFilter = document.getElementById('filterCourse').value;
    const statusFilter = document.getElementById('filterStatus').value;

    const tableBody = document.getElementById('studentsTableBody');
    const rows = tableBody.querySelectorAll('tr');

    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const course = row.cells[4].textContent;
        const status = row.cells[6].textContent.trim();

        const matchesSearch = text.includes(searchTerm);
        const matchesCourse = !courseFilter || course === courseFilter;
        const matchesStatus = !statusFilter || status === statusFilter;

        if (matchesSearch && matchesCourse && matchesStatus) {
            row.style.display = 'table-row';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Update count
    document.getElementById('studentCount').textContent = `(${visibleCount})`;
}

// Export to CSV
function exportToCSV() {
    if (students.length === 0) {
        alert('No students to export!');
        return;
    }

    let csv = 'Student ID,Name,Email,Phone,Course,GPA,Status,Date Added\n';

    students.forEach(student => {
        csv += `"${student.id}","${student.name}","${student.email}","${student.phone}","${student.course}",${student.gpa},"${student.status}","${student.dateAdded}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `students_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Students exported to CSV!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
