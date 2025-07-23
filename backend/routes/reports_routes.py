from flask import Blueprint, jsonify, send_file, request
from database import get_db
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import os
from datetime import datetime
from flask_cors import CORS
import logging
from io import BytesIO
from functools import wraps

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure static directory exists
if not os.path.exists('static'):
    os.makedirs('static')

# Set Seaborn style
sns.set_theme(style="whitegrid")

# Create Blueprint
reports_bp = Blueprint('reports', __name__)
CORS(reports_bp)

# ================== Decorators ================== #

def handle_errors(f):
    """Decorator for consistent error handling across routes."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            response = f(*args, **kwargs)
            if isinstance(response, tuple) and len(response) == 2:
                return add_timestamp(response[0]), response[1]
            return add_timestamp(response)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}", exc_info=True)
            return add_timestamp({"error": str(e)}), 500
    return wrapper

def with_database(f):
    """Decorator for managing database connections."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        db = None
        cursor = None
        try:
            db = get_db()
            cursor = db.cursor()
            return f(cursor, *args, **kwargs)
        finally:
            if cursor:
                cursor.close()
            if db:
                db.close()
    return wrapper

# ================== Helper Functions ================== #

def add_timestamp(response):
    """Add timestamp to API responses."""
    if isinstance(response, dict):
        response['timestamp'] = datetime.now().isoformat()
    return response

@with_database
def fetch_data(cursor, proc_name, params=None):
    """Fetch data from stored procedures with proper error handling."""
    try:
        if params:
            cursor.callproc(proc_name, params)
        else:
            cursor.callproc(proc_name)
        
        results = []
        for result in cursor.stored_results():
            columns = [col[0] for col in result.description]
            data = result.fetchall()
            results.extend([dict(zip(columns, row)) for row in data])
        
        if not results:
            logger.warning(f"No data returned from procedure: {proc_name}")
            return []
            
        return results
    except Exception as e:
        logger.error(f"Error in {proc_name}: {str(e)}", exc_info=True)
        raise

def generate_plot(df, plot_kind, x=None, y=None, title=None, figsize=(10, 6), rotate_xticks=False, autopct=None, labels=None, legend=True):
    """Generate plot and return as image bytes."""
    try:
        if isinstance(y, list):
            for col in y:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        elif y:
            df[y] = pd.to_numeric(df[y], errors='coerce').fillna(0)
        
        plt.figure(figsize=figsize)
        if plot_kind == 'pie':
            df.plot(kind=plot_kind, y=y, labels=labels, autopct=autopct, 
                   textprops={'fontsize': 8}, legend=legend)
        else:
            df.plot(kind=plot_kind, x=x, y=y, legend=legend)
        
        if rotate_xticks:
            plt.xticks(rotation=45, ha='right')
        
        if title:
            plt.title(title, pad=20)
        
        plt.tight_layout()
        
        img_buffer = BytesIO()
        plt.savefig(img_buffer, format='png', dpi=300, bbox_inches='tight')
        img_buffer.seek(0)
        plt.close()
        
        return img_buffer
    except Exception as e:
        logger.error(f"Error generating plot: {str(e)}")
        raise

# ================== Report Routes ================== #

@reports_bp.route('/equipment-costs', methods=['GET'])
@handle_errors
def get_equipment_costs():
    """Get equipment costs data."""
    data = fetch_data('GetEquipmentCosts')
    return jsonify(data)

@reports_bp.route('/employee-workload', methods=['GET'])
@handle_errors
def get_employee_workload():
    """Get employee workload data."""
    data = fetch_data('GetEmployeeWorkload')
    return jsonify(data)

@reports_bp.route('/maintenance-status', methods=['GET'])
@handle_errors
def get_maintenance_status():
    """Get maintenance status data."""
    data = fetch_data('GetMaintenanceStatus')
    return jsonify(data)

@reports_bp.route('/most-replaced-components', methods=['GET'])
@handle_errors
def get_most_replaced_components():
    """Get most replaced components data."""
    data = fetch_data('GetMostReplacedComponents')
    return jsonify(data)

@reports_bp.route('/low-inventory-components', methods=['GET'])
@handle_errors
def get_low_inventory_components():
    """Get low inventory components with fallback data."""
    try:
        data = fetch_data('GetLowInventoryComponents')
        if not data:
            return jsonify({
                "error": "No low inventory components found",
                "default_data": [
                    {"InventoryLevel": 5, "Name": "Engine"},
                    {"InventoryLevel": 8, "Name": "Boom Arm"},
                    {"InventoryLevel": 7, "Name": "Dump Bed"},
                    {"InventoryLevel": 5, "Name": "Paver Screed"},
                    {"InventoryLevel": 6, "Name": "Telehandler Forks"},
                    {"InventoryLevel": 8, "Name": "Asphalt Roller Drum"},
                    {"InventoryLevel": 5, "Name": "Bulldozer Final Drive"}
                ]
            })
        
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error fetching inventory components: {str(e)}")
        return jsonify({
            "error": "Failed to fetch inventory data",
            "default_data": [
                {"InventoryLevel": 5, "Name": "Engine"},
                {"InventoryLevel": 8, "Name": "Boom Arm"},
                {"InventoryLevel": 7, "Name": "Dump Bed"},
                {"InventoryLevel": 5, "Name": "Paver Screed"},
                {"InventoryLevel": 6, "Name": "Telehandler Forks"},
                {"InventoryLevel": 8, "Name": "Asphalt Roller Drum"},
                {"InventoryLevel": 5, "Name": "Bulldozer Final Drive"}
            ]
        })

@reports_bp.route('/outsourced-hours', methods=['GET'])
@handle_errors
def get_outsourced_hours():
    """Get outsourced hours data."""
    data = fetch_data('GetOutsourcedHours')
    return jsonify(data)

# API routes with consistent naming
@reports_bp.route('/api/breakdown_vs_shutdown', methods=['GET'])
@handle_errors
def get_breakdown_vs_shutdown():
    """Get breakdown vs shutdown costs data."""
    data = fetch_data('GetBreakdownVsShutdownCosts')
    return jsonify(data)

@reports_bp.route('/api/maintenance_cost_trend', methods=['GET'])
@handle_errors
def get_maintenance_cost_trend():
    """Get maintenance cost trend data."""
    data = fetch_data('GetMaintenanceCostTrend')
    return jsonify(data)

@reports_bp.route('/api/total_hours_worked', methods=['GET'])
@handle_errors
def get_total_hours_worked():
    """Get total hours worked data."""
    data = fetch_data('GetTotalHoursWorkedByEmployees')
    return jsonify(data)

@reports_bp.route('/api/employee_work_trend', methods=['GET'])
@handle_errors
def get_employee_work_trend():
    """Get employee work trend data."""
    data = fetch_data('GetEmployeeWorkTrend')
    return jsonify(data)

@reports_bp.route('/api/maintenance_completion_trend', methods=['GET'])
@handle_errors
def get_maintenance_completion_trend():
    """Get maintenance completion trend data."""
    data = fetch_data('GetMaintenanceCompletionTrend')
    return jsonify(data)

@reports_bp.route('/api/component_costs_trend', methods=['GET'])
@handle_errors
def get_component_costs_trend():
    """Get component costs trend data."""
    data = fetch_data('GetComponentCostsOverTime')
    return jsonify(data)

@reports_bp.route('/api/most_active_companies', methods=['GET'])
@handle_errors
def get_most_active_companies():
    """Get most active companies data."""
    data = fetch_data('GetMostActiveMaintenanceCompanies')
    return jsonify(data)

@reports_bp.route('/api/outsourced_vs_inhouse', methods=['GET'])
@handle_errors
def get_outsourced_vs_inhouse():
    """Get outsourced vs inhouse hours data."""
    data = fetch_data('GetOutsourcedVsInHouseHours')
    return jsonify(data)