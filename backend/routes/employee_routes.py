from flask import Blueprint, request, jsonify
from database import get_db

employee_bp = Blueprint('employee', __name__)

 #Add a new employee
@employee_bp.route('/', methods=['POST'])
def add_employee():
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.callproc('AddEmployee', (
        data['ssn'], data['name'], data.get('address', ''), data['department'], 
        data.get('specialty', ''), data.get('employmentDate', None), data.get('status', 'Active')
    ))
    
    db.commit()
    return jsonify({'message': 'Employee added successfully'}), 201

# Get all employees
@employee_bp.route('/', methods=['GET'])
def get_employees():
    db = get_db()
    cursor = db.cursor()
    cursor.callproc('GetAllEmployees')
    
    employees = []
    for result in cursor.stored_results():
        employees = result.fetchall()
    
    employees_list = [{
        "ssn": emp[0],
        "name": emp[1],
        "address": emp[2],
        "department": emp[3],
        "specialty": emp[4],
        "employmentDate": emp[5].strftime('%Y-%m-%d') if emp[5] else None,
        "status": emp[6]
    } for emp in employees]
    
    return jsonify(employees_list)

# Get a specific employee
@employee_bp.route('/<int:ssn>', methods=['GET'])
def get_employee(ssn):
    db = get_db()
    cursor = db.cursor()
    cursor.callproc('GetEmployee', (ssn,))
    
    employee = None
    for result in cursor.stored_results():
        employee = result.fetchone()
    
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    return jsonify({
        "ssn": employee[0],
        "name": employee[1],
        "address": employee[2],
        "department": employee[3],
        "specialty": employee[4],
        "employmentDate": employee[5].strftime('%Y-%m-%d') if employee[5] else None,
        "status": employee[6]
    })

# Update an employee
@employee_bp.route('/<int:ssn>', methods=['PUT'])
def update_employee(ssn):
    data = request.json
    db = get_db()
    cursor = db.cursor()
    cursor.callproc('UpdateEmployee', (
        ssn, data.get('name', ''), data.get('address', ''),
        data.get('department', ''), data.get('specialty', ''),
        data.get('employmentDate', None), data.get('status', 'Active')
    ))
    
    db.commit()
    if cursor.rowcount == 0:
        return jsonify({'error': 'Employee not found or no changes made'}), 404
    
    return jsonify({'message': 'Employee updated successfully'})

# Delete an employee
@employee_bp.route('/<int:ssn>', methods=['DELETE'])
def delete_employee(ssn):
    db = get_db()
    cursor = db.cursor()
    cursor.callproc('DeleteEmployee', (ssn,))
    db.commit()
    
    if cursor.rowcount == 0:
        return jsonify({'error': 'Employee not found'}), 404
    
    return jsonify({'message': 'Employee deleted successfully'})

# Assign a maintenance task to an employee
@employee_bp.route('/assign-task', methods=['POST'])
def assign_task():
    data = request.json
    if 'ssn' not in data or 'maintenanceId' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    db = get_db()
    cursor = db.cursor()
    cursor.callproc('AssignTask', (data['ssn'], data['maintenanceId']))
    
    db.commit()
    return jsonify({'message': 'Task assigned successfully'}), 201
