DELIMITER $$

-- 1️⃣ Get All Employees
CREATE PROCEDURE sp_GetEmployees()
BEGIN
    SELECT * FROM Employee;
END$$

-- 2️⃣ Get Employee by SSN
CREATE PROCEDURE sp_GetEmployeeBySSN(IN emp_ssn INT)
BEGIN
    SELECT * FROM Employee WHERE SSN = emp_ssn;
END$$

-- 3️⃣ Add Employee
CREATE PROCEDURE sp_AddEmployee(IN emp_ssn INT, IN emp_name VARCHAR(100), IN emp_address VARCHAR(255), 
                                IN emp_department VARCHAR(50), IN emp_specialty VARCHAR(50), IN emp_employmentDate DATE)
BEGIN
    INSERT INTO Employee (SSN, Name, Address, Department, Specialty, EmploymentDate) 
    VALUES (emp_ssn, emp_name, emp_address, emp_department, emp_specialty, emp_employmentDate);
END$$

-- 4️⃣ Update Employee
CREATE PROCEDURE sp_UpdateEmployee(IN emp_ssn INT, IN emp_name VARCHAR(100), IN emp_address VARCHAR(255), 
                                   IN emp_department VARCHAR(50), IN emp_specialty VARCHAR(50), IN emp_employmentDate DATE)
BEGIN
    UPDATE Employee
    SET Name = emp_name, Address = emp_address, Department = emp_department, 
        Specialty = emp_specialty, EmploymentDate = emp_employmentDate
    WHERE SSN = emp_ssn;
END$$

-- 5️⃣ Delete Employee
CREATE PROCEDURE sp_DeleteEmployee(IN emp_ssn INT)
BEGIN
    DELETE FROM Employee WHERE SSN = emp_ssn;
END$$

DELIMITER ;
