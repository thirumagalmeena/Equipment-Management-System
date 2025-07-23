import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";
import "../../styles/EquipmentManagement.css";

const ReportsManagement = () => {
    const [view, setView] = useState("equipment-costs");
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState("");
    
    const reportCategories = [
        {
            name: "Data Reports",
            reports: [
                { name: "Equipment Costs", key: "equipment-costs" },
                { name: "Employee Workload", key: "employee-workload" },
                { name: "Maintenance Status", key: "maintenance-status" },
                { name: "Most Replaced Components", key: "most-replaced-components" },
                { name: "Low Inventory Components", key: "low-inventory-components" },
                { name: "Outsourced Hours", key: "outsourced-hours" }
            ]
        },
        {
            name: "Visual Reports", 
            reports: [
                { name: "Breakdown vs Shutdown", key: "breakdown_vs_shutdown" },
                { name: "Maintenance Cost Trend", key: "maintenance_cost_trend" },
                { name: "Total Hours Worked", key: "total_hours_worked" },
                { name: "Employee Work Trend", key: "employee_work_trend" },
                { name: "Completion Trend", key: "maintenance_completion_trend" },
                { name: "Component Costs", key: "component_costs_trend" },
                { name: "Active Companies", key: "most_active_companies" },
                { name: "Outsourced vs In-House", key: "outsourced_vs_inhouse" }
            ]
        }
    ];

    const isVisualReport = reportCategories[1].reports.some(report => report.key === view);

    const fetchReportData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const endpoint = isVisualReport 
                ? `/api/${view}` 
                : `/${view}`;
                
            const response = await axios.get(`http://localhost:5000/reports${endpoint}`);
            
            // Handle fallback data for low inventory components
            if (view === "low-inventory-components" && response.data.error && response.data.default_data) {
                setReportData(response.data.default_data);
                setError(response.data.error);
            } else {
                setReportData(response.data);
            }
            
            // Set timestamp from response if available, otherwise use current time
            setLastUpdated(response.data.timestamp 
                ? new Date(response.data.timestamp).toLocaleTimeString() 
                : new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Error fetching report data:", error);
            setError("Failed to fetch report data. Please try again later.");
            
            // Special case for low inventory fallback
            if (view === "low-inventory-components") {
                setReportData([
                    {"InventoryLevel": 5, "Name": "Engine"},
                    {"InventoryLevel": 8, "Name": "Boom Arm"},
                    {"InventoryLevel": 7, "Name": "Dump Bed"},
                    {"InventoryLevel": 5, "Name": "Paver Screed"},
                    {"InventoryLevel": 6, "Name": "Telehandler Forks"},
                    {"InventoryLevel": 8, "Name": "Asphalt Roller Drum"},
                    {"InventoryLevel": 5, "Name": "Bulldozer Final Drive"}
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchReportData();
    };

    const handleViewChange = (viewKey) => {
        setView(viewKey);
    };

    useEffect(() => {
        fetchReportData();
    }, [view]);

    const formatHeader = (header) => {
        return header
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatValue = (value) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'number') {
            return Number.isInteger(value) 
                ? value.toLocaleString() 
                : value.toFixed(2).toLocaleString();
        }
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            return new Date(value).toLocaleDateString();
        }
        return value;
    };

    return (
        <div className="reports-page">
            <Header />
            
            <main className="reports-container">
                <div className="reports-header">
                    <h1>Reports Dashboard</h1>
                    <div className="report-controls">
                        <span className="last-updated">
                            {lastUpdated && `Last updated: ${lastUpdated}`}
                        </span>
                        <button 
                            onClick={handleRefresh}
                            className="refresh-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                <div className="reports-layout">
                    <nav className="reports-sidebar">
                        {reportCategories.map((category) => (
                            <div key={category.name} className="sidebar-category">
                                <h3>{category.name}</h3>
                                <div className="sidebar-buttons">
                                    {category.reports.map((report) => (
                                        <button
                                            key={report.key}
                                            onClick={() => handleViewChange(report.key)}
                                            className={`sidebar-button ${view === report.key ? 'active' : ''}`}
                                        >
                                            {report.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <section className="report-content">
                        {error && (
                            <div className="error-message">
                                <p>{error}</p>
                                <button onClick={fetchReportData}>Retry</button>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                                <p>Loading report data...</p>
                            </div>
                        ) : reportData.length > 0 ? (
                            <div className="data-report">
                                <div className="data-table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                {Object.keys(reportData[0]).map((key) => (
                                                    <th key={key}>{formatHeader(key)}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.map((row, index) => (
                                                <tr key={index}>
                                                    {Object.values(row).map((value, idx) => (
                                                        <td key={idx}>
                                                            {formatValue(value)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="no-data">
                                <p>No data available for this report.</p>
                                <button onClick={fetchReportData}>Try Again</button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ReportsManagement;