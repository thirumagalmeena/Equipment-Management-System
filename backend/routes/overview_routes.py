from flask import Blueprint, jsonify
from database import get_db

overview_bp = Blueprint('overview', __name__)

@overview_bp.route('/', methods=['GET'])
def get_overview():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Call the stored procedure
    cursor.callproc("GetOverview")

    # Fetch results
    results = [result.fetchall() for result in cursor.stored_results()]
    
    cursor.close()

    # Ensure response is correctly structured
    return jsonify({
        "total_equipment": results[0][0]["total_equipment"],
        "active_maintenance_tasks": results[1][0]["active_maintenance_tasks"],
        "total_employees": results[2][0]["total_employees"],
        "total_breakdown": results[3][0]["total_breakdown"],
        "total_shutdown": results[4][0]["total_shutdown"],
        "monthly_maintenance_cost": results[5][0]["monthly_maintenance_cost"],
        "high_maintenance_alert": results[6][0] if results[6] else {"Name": "N/A", "BreakdownCost": 0.0}
    })

