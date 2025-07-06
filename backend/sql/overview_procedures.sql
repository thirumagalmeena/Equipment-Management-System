DELIMITER $$

-- Procedure to fetch overview statistics
CREATE PROCEDURE GetOverview()
BEGIN
    -- Equipment count
    SELECT COUNT(*) AS total_equipment FROM Equipment;

    -- Active maintenance tasks count
    SELECT COUNT(*) AS active_maintenance_tasks FROM Maintenance;

    -- Employee count
    SELECT COUNT(*) AS total_employees FROM Employee;

    -- Breakdown maintenance count
    SELECT COUNT(*) AS total_breakdown FROM Maintenance WHERE Type='Breakdown';

    -- Shutdown maintenance count
    SELECT COUNT(*) AS total_shutdown FROM Maintenance WHERE Type='Shutdown';

    -- Monthly maintenance cost
    SELECT COALESCE(SUM(BreakdownCost), 0.0) AS monthly_maintenance_cost FROM Equipment;

    -- High maintenance equipment
    SELECT Name, COALESCE(BreakdownCost, 0.0) AS BreakdownCost 
    FROM Equipment 
    ORDER BY BreakdownCost DESC 
    LIMIT 1;
END $$

DELIMITER ;
