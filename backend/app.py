from flask import Flask
from flask_cors import CORS

# Importing blueprints
from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp 
from routes.equipment_routes import equipment_bp
from routes.overview_routes import overview_bp
from routes.maintenance_routes import assign_maintenance_bp
from routes.company_routes import company_bp
from routes.records_routes import records_bp
from routes.reports_routes import reports_bp

app = Flask(__name__)

# Enable CORS for frontend at localhost:3000
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(employee_bp, url_prefix='/employees') 
app.register_blueprint(equipment_bp, url_prefix='/equipment')
app.register_blueprint(overview_bp, url_prefix='/overview')
app.register_blueprint(assign_maintenance_bp, url_prefix='/assign_maintenance')
app.register_blueprint(company_bp,url_prefix='/company')
app.register_blueprint(records_bp,url_prefix='/records')
app.register_blueprint(reports_bp,url_prefix='/reports')

if __name__ == '__main__':
    print("🚀 Server running on http://localhost:5000")
    app.run(debug=True)
