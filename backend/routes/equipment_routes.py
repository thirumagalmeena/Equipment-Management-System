from flask import Blueprint, request, jsonify
from database import get_db

equipment_bp = Blueprint('equipment', __name__)

# Get all equipment
@equipment_bp.route('/', methods=['GET'])
def get_all_equipment():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT EquipmentID, Name, Description, Location, PurchaseCost, PurchaseDate, 
               BreakdownCost, ShutdownHours, Lifetime, Speciality, Specialization
        FROM Equipment
    """)
    equipment = cursor.fetchall()
    
    equipment_list = []
    for eq in equipment:
        equipment_list.append({
            "equipmentId": eq[0],
            "name": eq[1],
            "description": eq[2],
            "location": eq[3],
            "purchaseCost": eq[4],
            "purchaseDate": eq[5].strftime('%Y-%m-%d') if eq[5] else None,
            "breakdownCost": eq[6],
            "shutdownHours": eq[7],
            "lifetime": eq[8],
            "speciality": eq[9],
            "specialization": eq[10]
        })
    
    return jsonify(equipment_list)

# get all components
@equipment_bp.route('/components', methods=['GET'])
def get_all_components():
    db = get_db()
    cursor = db.cursor()

    query = """
    SELECT ComponentID, Name, EquipmentId, PurchaseDate, Lifetime, InventoryLevel, UnitCost, SupplierName, ContactPerson, ContactTelephone
    FROM Component
    """

    cursor.execute(query)
    components = cursor.fetchall()
    cursor.close()  # Closing cursor to free resources

    if not components:
        return jsonify({"message": "No components available in the database"}), 404

    component_list = []
    for component in components:
        component_list.append({
            "componentId": component[0],
            "componentName": component[1],
            "equipmentId": component[2],
            "purchaseDate": component[3].strftime('%Y-%m-%d') if component[3] else None,
            "lifetime": component[4],
            "inventoryLevel": component[5],
            "unitCost": component[6],
            "supplierName": component[7],
            "contactPerson": component[8],
            "contactTelephone": component[9]
        })

    return jsonify(component_list)


# Get a specific equipment
@equipment_bp.route('/<int:equipment_id>', methods=['GET'])
def get_equipment(equipment_id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT EquipmentID, Name, Description, Location, PurchaseCost, PurchaseDate, 
               BreakdownCost, ShutdownHours, Lifetime, Speciality, Specialization 
        FROM Equipment WHERE EquipmentID = %s
    """, (equipment_id,))
    equipment = cursor.fetchone()

    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404

    return jsonify({
        "equipmentId": equipment[0],
        "name": equipment[1],
        "description": equipment[2],
        "location": equipment[3],
        "purchaseCost": equipment[4],
        "purchaseDate": equipment[5].strftime('%Y-%m-%d') if equipment[5] else None,
        "breakdownCost": equipment[6],
        "shutdownHours": equipment[7],
        "lifetime": equipment[8],
        "speciality": equipment[9],
        "specialization": equipment[10]
    })


@equipment_bp.route('/', methods=['POST'])
def add_equipment():
    db = get_db()
    data = request.json

    try:
        equipment_id = int(data.get("equipmentId"))  
        name = str(data.get("name"))
        description = str(data.get("description"))
        location = str(data.get("location"))
        purchase_cost = float(data.get("purchaseCost"))
        purchase_date = str(data.get("purchaseDate"))
        breakdown_cost = float(data.get("breakdownCost"))
        shutdown_hours = int(data.get("shutdownHours"))
        lifetime = int(data.get("lifetime"))
        speciality = str(data.get("speciality"))
        specialization = str(data.get("specialization"))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format"}), 400

    cursor = db.cursor()

    # ✅ Check if Equipment ID already exists
    cursor.execute("SELECT COUNT(*) FROM Equipment WHERE EquipmentID = %s", (equipment_id,))
    exists = cursor.fetchone()[0]

    if exists > 0:
        return jsonify({"error": "Equipment ID already exists"}), 400

    # ✅ Insert Equipment first
    equipment_query = """
    INSERT INTO Equipment (EquipmentID, Name, Description, Location, PurchaseCost, PurchaseDate, 
                           BreakdownCost, ShutdownHours, Lifetime, Speciality, Specialization)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    equipment_values = (equipment_id, name, description, location, purchase_cost, purchase_date, 
                        breakdown_cost, shutdown_hours, lifetime, speciality, specialization)

    try:
        cursor.execute(equipment_query, equipment_values)
        db.commit()  # ✅ Commit Equipment before inserting Component

        # ✅ Fetch the last ComponentID and increment it safely
        cursor.execute("SELECT MAX(ComponentID) FROM Component")
        last_component_id = cursor.fetchone()[0]
        new_component_id = (int(last_component_id) + 1) if last_component_id is not None else 1  # Start from 1

        # ✅ Insert Default Component
        default_component_query = """
        INSERT INTO Component (ComponentID, Name, EquipmentId, PurchaseDate, Lifetime, InventoryLevel, UnitCost, SupplierName, ContactPerson, ContactTelephone)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        default_component_values = (
            new_component_id,  
            "Default Component",
            equipment_id,
            purchase_date,
            5,  
            10,  
            100.0,  
            "Default Supplier",
            "Supplier Contact",
            "1234567890"
        )

        cursor.execute(default_component_query, default_component_values)
        db.commit()

        return jsonify({"message": "Equipment and default component added successfully"}), 201

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()


# Update equipment details
@equipment_bp.route('/<int:equipment_id>', methods=['PUT'])
def update_equipment(equipment_id):
    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    db = get_db()
    cursor = db.cursor()

    # Check if the equipment exists
    cursor.execute("SELECT * FROM Equipment WHERE EquipmentID = %s", (equipment_id,))
    equipment = cursor.fetchone()

    if not equipment:
        return jsonify({"error": "Equipment not found"}), 404

    cursor.execute("""
        UPDATE Equipment 
        SET Name = %s, 
            Description = %s, 
            Location = %s, 
            PurchaseCost = %s, 
            PurchaseDate = %s, 
            BreakdownCost = %s, 
            ShutdownHours = %s, 
            Lifetime = %s, 
            Speciality = %s, 
            Specialization = %s 
        WHERE EquipmentID = %s
    """, (
        data.get('name', equipment[1]),  
        data.get('description', equipment[2]),
        data.get('location', equipment[3]),
        data.get('purchaseCost', equipment[4]),
        data.get('purchaseDate', equipment[5]),
        data.get('breakdownCost', equipment[6]),
        data.get('shutdownHours', equipment[7]),
        data.get('lifetime', equipment[8]),
        data.get('speciality', equipment[9]),
        data.get('specialization', equipment[10]),
        equipment_id
    ))

    db.commit()
    return jsonify({'message': 'Equipment updated successfully'})

# Delete equipment
@equipment_bp.route('/<int:equipment_id>', methods=['DELETE'])
def delete_equipment(equipment_id):
    db = get_db()
    cursor = db.cursor()
    
    # Check if the equipment exists
    cursor.execute("SELECT * FROM Equipment WHERE EquipmentID = %s", (equipment_id,))
    if not cursor.fetchone():
        return jsonify({"error": "Equipment not found"}), 404

    cursor.execute("DELETE FROM Equipment WHERE EquipmentID=%s", (equipment_id,))
    db.commit()
    return jsonify({'message': 'Equipment deleted successfully'})

# Assign a maintenance task to equipment
@equipment_bp.route('/assign-maintenance', methods=['POST'])
def assign_maintenance():
    data = request.json
    db = get_db()
    cursor = db.cursor()

    # Check if the equipment exists
    cursor.execute("SELECT EquipmentID FROM Equipment WHERE EquipmentID = %s", (data['equipmentId'],))
    if not cursor.fetchone():
        return jsonify({"error": "Equipment not found"}), 404

    # Check if the maintenance task exists
    cursor.execute("SELECT MaintenanceID FROM Maintenance WHERE MaintenanceID = %s", (data['maintenanceId'],))
    if not cursor.fetchone():
        return jsonify({"error": "Maintenance task not found"}), 404

    cursor.execute("""
        INSERT INTO MaintenanceRecord (EquipmentID, MaintenanceID, HoursWorked) 
        VALUES (%s, %s, 0)
    """, (data['equipmentId'], data['maintenanceId']))
    
    db.commit()
    return jsonify({'message': 'Maintenance assigned successfully'}), 201

# Get equipment maintenance history
@equipment_bp.route('/maintenance-history/<int:equipment_id>', methods=['GET'])
def maintenance_history(equipment_id):
    db = get_db()
    cursor = db.cursor()
    
    query = """
        SELECT m.MaintenanceID, m.Date, m.Description, mr.HoursWorked, e.Name AS Employee
        FROM MaintenanceRecord mr
        JOIN Maintenance m ON mr.MaintenanceID = m.MaintenanceID
        LEFT JOIN Employee e ON mr.SSN = e.SSN
        WHERE mr.EquipmentID = %s
        ORDER BY m.Date DESC
    """
    cursor.execute(query, (equipment_id,))
    history = cursor.fetchall()

    history_list = []
    for record in history:
        history_list.append({
            "maintenanceId": record[0],
            "date": record[1].strftime('%Y-%m-%d') if record[1] else None,
            "description": record[2],
            "hoursWorked": record[3],
            "employee": record[4] if record[4] else "Unassigned"
        })

    return jsonify(history_list)

# Add a new component
@equipment_bp.route('/components', methods=['POST'])
def add_component():
    db = get_db()
    data = request.json
    cursor = db.cursor()

    try:
        # ✅ Generate next available ComponentID
        cursor.execute("SELECT COALESCE(MAX(ComponentID), 0) + 1 FROM Component")
        component_id = cursor.fetchone()[0]

        # ✅ Extract and validate input data
        equipment_id = int(data.get("equipmentId"))
        name = str(data.get("componentName"))
        purchase_date = str(data.get("purchaseDate"))
        lifetime = int(data.get("lifetime"))
        inventory_level = int(data.get("inventoryLevel"))
        unit_cost = float(data.get("unitCost"))
        supplier_name = str(data.get("supplierName"))
        contact_person = str(data.get("contactPerson"))
        contact_telephone = str(data.get("contactTelephone"))

    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format"}), 400

    # ✅ Check if Equipment ID exists
    cursor.execute("SELECT COUNT(*) FROM Equipment WHERE EquipmentID = %s", (equipment_id,))
    equipment_exists = cursor.fetchone()[0]

    if equipment_exists == 0:
        return jsonify({"error": "Equipment ID does not exist"}), 400

    # ✅ Insert Component
    component_query = """
    INSERT INTO Component (ComponentID, EquipmentID, Name, PurchaseDate, Lifetime, InventoryLevel, UnitCost, SupplierName, ContactPerson, ContactTelephone)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    component_values = (
        component_id, equipment_id, name, purchase_date, lifetime, inventory_level,
        unit_cost, supplier_name, contact_person, contact_telephone
    )

    try:
        cursor.execute(component_query, component_values)
        db.commit()
        return jsonify({"message": "Component added successfully"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()


# Update a component
@equipment_bp.route('/components/<int:component_id>', methods=['PUT'])
def update_component(component_id):
    db = get_db()
    data = request.json
    cursor = db.cursor()

    cursor.execute("SELECT * FROM Component WHERE ComponentID = %s", (component_id,))
    component = cursor.fetchone()
    
    if not component:
        return jsonify({"error": "Component not found"}), 404

    try:
        query = """
        UPDATE Component 
        SET EquipmentID = %s, Name = %s, PurchaseDate = %s, Lifetime = %s, InventoryLevel = %s, 
            UnitCost = %s, SupplierName = %s, ContactPerson = %s, ContactTelephone = %s
        WHERE ComponentID = %s
        """
        values = (
            data["equipmentId"], data["componentName"], data["purchaseDate"], 
            data["lifetime"], data["inventoryLevel"], data["unitCost"], 
            data["supplierName"], data["contactPerson"], data["contactTelephone"], 
            component_id
        )
        cursor.execute(query, values)
        db.commit()
        return jsonify({"message": "Component updated successfully"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()


# Delete a component
@equipment_bp.route('/components/<int:component_id>', methods=['DELETE'])
def delete_component(component_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM Component WHERE ComponentID = %s", (component_id,))
    if not cursor.fetchone():
        return jsonify({"error": "Component not found"}), 404

    try:
        cursor.execute("DELETE FROM Component WHERE ComponentID = %s", (component_id,))
        db.commit()
        return jsonify({"message": "Component deleted successfully"})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        cursor.close()