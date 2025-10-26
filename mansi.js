// Task Manager Application - Vanilla JavaScript

// Application State
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const tasksContainer = document.getElementById('tasksContainer');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter-btn');

// Statistics Elements
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    bindEvents();
    updateStatistics();
    renderTasks();
    loadTheme();
});

// Event Listeners
function bindEvents() {
    // Form submission
    taskForm.addEventListener('submit', handleFormSubmit);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterChange);
    });
    
    // Form validation
    const titleInput = document.getElementById('taskTitle');
    titleInput.addEventListener('blur', validateTitle);
    titleInput.addEventListener('input', clearError);
}

// Form Handling and Validation
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(taskForm);
    const task = createTaskFromForm(formData);
    
    addTask(task);
    taskForm.reset();
    document.getElementById('taskTitle').focus(); // Refocus on the title input
    showSuccessMessage('Task added successfully!');
}

function validateForm() {
    const titleInput = document.getElementById('taskTitle');
    const title = titleInput.value.trim();
    
    if (!title) {
        showError('title-error', 'Task title is required');
        titleInput.focus();
        return false;
    }
    
    if (title.length < 3) {
        showError('title-error', 'Task title must be at least 3 characters long');
        titleInput.focus();
        return false;
    }
    
    return true;
}

function validateTitle() {
    const titleInput = document.getElementById('taskTitle');
    const title = titleInput.value.trim();
    
    if (title && title.length < 3) {
        showError('title-error', 'Task title must be at least 3 characters long');
    }
}

function clearError() {
    const errorEl = document.getElementById('title-error');
    errorEl.textContent = '';
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
}

function createTaskFromForm(formData) {
    return {
        id: generateId(),
        title: formData.get('taskTitle').trim(),
        description: formData.get('taskDescription').trim(),
        priority: formData.get('taskPriority'),
        dueDate: formData.get('taskDueDate'),
        completed: false,
        createdAt: new Date().toISOString()
    };
}

// Task Management Functions
function addTask(task) {
    tasks.push(task);
    saveTasks();
    updateStatistics();
    renderTasks();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        updateStatistics();
        renderTasks();
        
        const message = task.completed ? 'Task completed!' : 'Task marked as pending';
        showSuccessMessage(message);
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        updateStatistics();
        renderTasks();
        showSuccessMessage('Task deleted successfully');
    }
}

// Filtering Functions
function handleFilterChange(event) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentFilter = event.target.dataset.filter;
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'high':
            return tasks.filter(task => task.priority === 'high');
        default:
            return tasks;
    }
}

// Rendering Functions
function renderTasks() {
    const filteredTasks = getFilteredTasks().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (filteredTasks.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    tasksContainer.innerHTML = filteredTasks
        .map(task => createTaskHTML(task))
        .join('');
    
    bindTaskEvents();
}

function createTaskHTML(task) {
    const dueDate = task.dueDate ? formatDate(task.dueDate) : null;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    // ✅ CORRECTED THIS ENTIRE TEMPLATE STRING
    return `
        <div class="task-card ${task.completed ? 'completed' : ''} priority-${task.priority}" data-task-id="${task.id}">
            <div class="task-header">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="toggleTask('${task.id}')" 
                     role="button" 
                     tabindex="0"
                     aria-label="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
                </div>
                <div class="task-content">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                    <div class="task-meta">
                        <span class="task-badge priority-${task.priority}">${task.priority}</span>
                        ${dueDate ? `<span class="task-badge due-date ${isOverdue ? 'overdue' : ''}">${dueDate}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn delete-btn" 
                            onclick="deleteTask('${task.id}')"
                            aria-label="Delete task">
                        🗑
                    </button>
                </div>
            </div>
        </div>
    `;
}

function bindTaskEvents() {
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

function showEmptyState() {
    tasksContainer.style.display = 'none';
    emptyState.style.display = 'block';
}

function hideEmptyState() {
    tasksContainer.style.display = 'flex';
    emptyState.style.display = 'none';
}

// Statistics Functions
function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Theme Management
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('planforge-theme') || 'light';
    setTheme(savedTheme);
}

function saveTheme(theme) {
    localStorage.setItem('planforge-theme', theme);
}

// Local Storage Functions
function saveTasks() {
    try {
        localStorage.setItem('planforge-tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
        showErrorMessage('Failed to save tasks');
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('planforge-tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
        showErrorMessage('Failed to load tasks');
    }
}

// Utility Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    // ✅ CORRECTED THESE LINES
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString();
}

// Notification Functions
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(calc(100% + 20px))',
        transition: 'transform 0.4s ease-in-out',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(calc(100% + 20px))';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('taskTitle').focus();
    }
    
    if (event.key === 'Escape' && document.activeElement.tagName !== 'BODY') {
        document.activeElement.blur();
    }
});