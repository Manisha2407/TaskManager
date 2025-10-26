import React, { useState, useEffect } from "react";
import "../styles/mansi.css";
import { Link } from "react-router-dom";

const Mansi = () => {
  // --- State ---
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [notifications, setNotifications] = useState([]);

  // --- Load tasks and theme from localStorage ---
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("planforge-tasks")) || [];
    setTasks(savedTasks);

    const savedTheme = localStorage.getItem("planforge-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // --- Save tasks to localStorage whenever tasks change ---
  useEffect(() => {
    localStorage.setItem("planforge-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // --- Save theme to localStorage ---
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("planforge-theme", theme);
  }, [theme]);

  // --- Handlers ---
  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification("Task title is required", "error");
      return;
    }
    if (title.trim().length < 3) {
      showNotification("Task title must be at least 3 characters", "error");
      return;
    }
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    showNotification("Task added successfully!", "success");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    const toggledTask = tasks.find(t => t.id === id);
    if (toggledTask) {
      showNotification(
        toggledTask.completed ? "Task marked as pending" : "Task completed!",
        "success"
      );
    }
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
      showNotification("Task deleted successfully", "success");
    }
  };

  const filteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter(task => task.completed);
      case "pending":
        return tasks.filter(task => !task.completed);
      case "high":
        return tasks.filter(task => task.priority === "high");
      default:
        return tasks;
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  // --- Notifications ---
  const showNotification = (message, type) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // --- Statistics ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">⚒️</span> PlanForge
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-btn">Back to Home</Link>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-container">
          {/* Task Form */}
          <section className="task-form-section">
            <h2 className="section-title">Add New Task</h2>
            <form className="task-form" onSubmit={addTask}>
              <div className="form-group">
                <label htmlFor="taskTitle" className="form-label">Task Title *</label>
                <input
                  type="text"
                  id="taskTitle"
                  className="form-input"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDescription" className="form-label">Description</label>
                <textarea
                  id="taskDescription"
                  className="form-input"
                  rows="3"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="taskPriority" className="form-label">Priority</label>
                  <select
                    id="taskPriority"
                    className="form-input"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    id="taskDueDate"
                    className="form-input"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add Task</button>
            </form>
          </section>

          {/* Statistics */}
          <section className="stats-section">
            <h2 className="section-title">Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{pendingTasks}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </section>

          {/* Task List */}
          <section className="task-list-area">
            <div className="filters-section">
              <div className="filters">
                {["all", "pending", "completed", "high"].map(f => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="tasks-section">
              {filteredTasks().length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started!</p>
                </div>
              ) : (
                <div className="tasks-container">
                  {filteredTasks().map(task => (
                    <div
                      key={task.id}
                      className={`task-card ${task.completed ? "completed" : ""} priority-${task.priority}`}
                    >
                      <div className="task-header">
                        <div
                          className={`task-checkbox ${task.completed ? "checked" : ""}`}
                          onClick={() => toggleTask(task.id)}
                        ></div>
                        <div className="task-content">
                          <div className="task-title">{task.title}</div>
                          {task.description && <div className="task-description">{task.description}</div>}
                          {task.dueDate && (
                            <div className={`task-badge due-date ${new Date(task.dueDate) < new Date() && !task.completed ? "overdue" : ""}`}>
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                        </div>
                        <div className="task-actions">
                          <button className="task-action-btn delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 PlanForge. Built by Manisha.</p>
      </footer>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>{n.message}</div>
        ))}
      </div>
    </div>
  );
};

export default Mansi;
