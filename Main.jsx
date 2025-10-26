import React from "react";
import { Link } from "react-router-dom";
import "../styles/land.css"; // you can create a separate main.css if needed

const Main = () => {
  return (
    <div className="main-page">
      <header>
        <nav>
          <div className="logo">⚒️PlanForge</div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/mansi">Mansi</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/login">Logout</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{ paddingTop: "100px", textAlign: "center" }}>
        <h1>Welcome to your Task Manager Dashboard</h1>
        <p>Manage all your tasks efficiently.</p>
      </main>

      <footer style={{ textAlign: "center", marginTop: "50px" }}>
        <p>&copy; 2025 Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main;
