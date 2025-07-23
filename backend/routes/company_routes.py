from flask import Blueprint, jsonify, request
from database import get_db

company_bp = Blueprint('company', __name__)

@company_bp.route('/assign_company', methods=['POST'])
def assign_company():
    db= get_db()
    data = request.json
    maintenance_id = data.get('maintenance_id')

    if not maintenance_id:
        return jsonify({'error': 'Maintenance ID is required'}), 400

    try:
        cursor = db.cursor()
        cursor.callproc('AssignCompanyToMaintenance', [maintenance_id])
        db.commit()
        cursor.close()

        return jsonify({'message': 'Company assigned successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# ✅ Get all maintenance companies
@company_bp.route('/companies', methods=['GET'])
def get_companies():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM MaintenanceCompany")
    companies = cursor.fetchall()

    cursor.close()
    return jsonify(companies)

# ✅ Get all outsourced maintenance work
@company_bp.route('/outsourced-work', methods=['GET'])
def get_outsourced_work():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT o.MaintenanceID, o.HoursWorked, c.Name AS CompanyName, c.ContactPerson, c.ContactTelephone
        FROM OutsourcedTo o
        JOIN MaintenanceCompany c ON o.CompanyID = c.CompanyID
    """
    cursor.execute(query)
    outsourced_work = cursor.fetchall()

    cursor.close()
    return jsonify(outsourced_work)
