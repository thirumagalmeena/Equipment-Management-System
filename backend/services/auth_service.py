import csv
import os

def load_users(role):
    # Define dynamic base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))

    if role == 'admin' or role == 'administrator':
        csv_file = os.path.join(base_dir, '..', 'data', 'admin.txt')
    elif role == 'employee':
        csv_file = os.path.join(base_dir, '..', 'data', 'employee.txt')
    else:
        return None, "Invalid role!"

    users = []
    try:
        with open(csv_file, mode='r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                users.append(row)
        return users, None
    except FileNotFoundError:
        return None, f"User file for '{role}' not found at {csv_file}"

def login_user(username, password, role):
    users, error = load_users(role)
    if error:
        return False, error

    for user in users:
        if user['username'] == username and user['password'] == password:
            return True, "Login successful!"
    return False, "Invalid username or password."
