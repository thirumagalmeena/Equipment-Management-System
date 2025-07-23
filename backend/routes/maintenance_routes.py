from flask import Blueprint, request, jsonify
from database import get_db

assign_maintenance_bp = Blueprint('assign_maintenance', __name__)

# Get pending maintenance tasks
@assign_maintenance_bp.route('/pending', methods=['GET'])
def get_pending_maintenance():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM Maintenance WHERE Status = 'Pending'")
    pending_maintenance = cursor.fetchall()
    
    cursor.close()
    return jsonify(pending_maintenance)

@assign_maintenance_bp.route('/delete/<int:maintenance_id>', methods=['DELETE'])
def delete_maintenance(maintenance_id):
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("DELETE FROM Maintenance WHERE MaintenanceID = %s", (maintenance_id,))
        db.commit()

        cursor.close()
        return jsonify({"status": "success", "message": "Maintenance task deleted successfully."})
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)})

# Assign maintenance task
@assign_maintenance_bp.route('/<int:maintenance_id>', methods=['POST'])
def assign_maintenance(maintenance_id):
    db = get_db()
    cursor = db.cursor()
    
    try:
        # Call the stored procedure
        cursor.callproc("AssignMaintenanceTask", [maintenance_id])
        
        # Check if an employee was assigned
        cursor.execute("SELECT COUNT(*) FROM MaintenanceRecord WHERE MaintenanceID = %s", (maintenance_id,))
        assigned = cursor.fetchone()[0]

        if assigned > 0:
            cursor.execute("UPDATE Maintenance SET Status = 'In Progress' WHERE MaintenanceID = %s", (maintenance_id,))
            db.commit()
            return jsonify({"status": "success", "message": "Maintenance assigned successfully!"}), 200
        else:
            return jsonify({"status": "failed", "message": "No employees available. Redirecting to company assignment..."}), 400
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()

@assign_maintenance_bp.route('/edit/<int:maintenance_id>', methods=['PUT'])
def edit_maintenance(maintenance_id):
    data = request.json
    new_status = data.get("status")

    if not new_status:
        return jsonify({"status": "error", "message": "Status is required"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Call the stored procedure
        cursor.callproc("UpdateMaintenanceStatus", (maintenance_id, new_status))

        # Commit changes
        db.commit()

        return jsonify({"status": "success", "message": "Status updated successfully!"}), 200
    except Exception as e:
        db.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()


@assign_maintenance_bp.route('/status', methods=['GET'])
def get_maintenance_status():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            m.MaintenanceID, 
            m.Name, 
            m.Status, 
            m.EquipmentID, 
            e.Name AS EquipmentName
        FROM Maintenance m
        JOIN Equipment e ON m.EquipmentID = e.EquipmentID
    """)
    
    status_list = cursor.fetchall()
    
    cursor.close()
    return jsonify(status_list)


@assign_maintenance_bp.route('/downtime', methods=['GET'])
def monitor_downtime():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT EquipmentID, SUM(TotalHours) AS TotalDowntime 
        FROM Maintenance 
        GROUP BY EquipmentID
    """)
    downtime_data = cursor.fetchall()

    cursor.close()
    return jsonify(downtime_data)


@assign_maintenance_bp.route('/cost', methods=['GET'])
def view_cost_breakdown():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT m.MaintenanceID, m.Name, e.BreakdownCost AS Cost
        FROM Maintenance m
        JOIN Equipment e ON m.EquipmentID = e.EquipmentID
    """)
    cost_data = cursor.fetchall()

    cursor.close()
    return jsonify(cost_data)

# View assigned employees (both in progress and completed)
@assign_maintenance_bp.route('/assigned-employees', methods=['GET'])
def view_assigned_employees():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            m.MaintenanceID, 
            m.EquipmentID, 
            e.Name AS EquipmentName, 
            m.Name AS MaintenanceName, 
            r.EmployeeID, 
            m.Status,
            emp.Name AS EmployeeName
        FROM MaintenanceRecord r
        JOIN Maintenance m ON r.MaintenanceID = m.MaintenanceID
        JOIN Equipment e ON m.EquipmentID = e.EquipmentID
        JOIN Employee emp ON r.EmployeeID = emp.SSN
        WHERE m.Status IN ('In Progress', 'Completed')
    """)
    
    assigned_employees = cursor.fetchall()
    cursor.close()
    return jsonify(assigned_employees)