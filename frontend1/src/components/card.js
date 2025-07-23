import React from "react";
import "../styles/styles.css";

const Card = ({ title, value, description, onClick }) => {
  return (
    <div className="card" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <h3>{title}</h3>
      {value !== undefined && <p className="card-value">{value}</p>} {/* ✅ Prevents empty `undefined` display */}
      {description && <p className="card-description">{description}</p>}
    </div>
  );
};

export default Card;
