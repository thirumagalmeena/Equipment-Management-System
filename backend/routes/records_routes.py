from flask import Blueprint, jsonify
from database import get_db

records_bp = Blueprint('records', __name__)

# Get all maintenance records
@records_bp.route('/maintenance_records', methods=['GET'])
def get_maintenance_records():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT MR.MaintenanceID, M.Name AS MaintenanceName, MR.HoursWorked, MR.EmployeeID
        FROM MaintenanceRecord MR
        LEFT JOIN Maintenance M ON MR.MaintenanceID = M.MaintenanceID
    """
    )
    records = cursor.fetchall()
    
    maintenance_records = []
    for record in records:
        maintenance_records.append({
            "maintenanceId": record[0],
            "maintenanceName": record[1],
            "hoursWorked": record[2],
            "employeeId": record[3]
        })
    
    return jsonify(maintenance_records)

# Get all component replacement records
@records_bp.route('/component_replacements', methods=['GET'])
def get_component_replacements():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT CR.ReplacementID, CR.ComponentID, C.Name AS ComponentName, CR.EquipmentID, E.Name AS EquipmentName, 
               CR.ReplacementDate, CR.ManHoursUsed, CR.QuantityUsed
        FROM ComponentReplacement CR
        JOIN Component C ON CR.ComponentID = C.ComponentID
        JOIN Equipment E ON CR.EquipmentID = E.EquipmentID
    """
    )
    records = cursor.fetchall()
    
    component_replacements = []
    for record in records:
        component_replacements.append({
            "replacementId": record[0],
            "componentId": record[1],
            "componentName": record[2],
            "equipmentId": record[3],
            "equipmentName": record[4],
            "replacementDate": record[5].strftime('%Y-%m-%d') if record[5] else None,
            "manHoursUsed": record[6],
            "quantityUsed": record[7]
        })
    
    return jsonify(component_replacements)
