document.addEventListener('DOMContentLoaded', () => {//Ensures the script runs only after the entire HTML document has loaded
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    };

    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (totalTasks > 0 && completedTasks === totalTasks) {
            launchConfetti();
        }
    };

    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(taskList.children).map(li => ({
            text: li.querySelector('span')?.textContent || li.querySelector('.edit-input')?.value,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed));
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        //yaha hamne let use kiya hai
        let taskSpan = li.querySelector('span');

        // Function to toggle between view and edit mode
        const toggleEditMode = () => {
            const isEditing = li.classList.contains('editing');

            if (isEditing) {
                // --- Switch from EDIT to VIEW mode ---
                const editInput = li.querySelector('.edit-input');
                const newText = editInput.value.trim();

                if (newText) {
                    taskSpan = document.createElement('span');
                    taskSpan.textContent = newText;
                    editInput.replaceWith(taskSpan);
                    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
                    li.classList.remove('editing');//if task is being edited then the existing task will be removedd
                    saveTasksToLocalStorage();
                }
            } else {
                // --- Switch from VIEW to EDIT mode ---
                const currentText = taskSpan.textContent;
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = currentText;
                editInput.className = 'edit-input';

                taskSpan.replaceWith(editInput);
                editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                li.classList.add('editing');
                editInput.focus();

                // Save when user presses Enter
                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        toggleEditMode();
                    }
                });
            }
        };

        // --- Event Listeners ---
        editBtn.addEventListener('click', toggleEditMode);

        deleteBtn.addEventListener('click', () => {
            li.remove();
            updateProgress();
            saveTasksToLocalStorage();
            toggleEmptyState();
        });

        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            editBtn.disabled = checkbox.checked;
            editBtn.style.opacity = checkbox.checked ? '0.5' : '1';
            updateProgress();
            saveTasksToLocalStorage();
        });

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
        }

        taskList.appendChild(li);
        taskInput.value = '';
        updateProgress();
        saveTasksToLocalStorage();
        toggleEmptyState();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        addTask();
    };

    document.querySelector('.input-area').addEventListener('submit', handleFormSubmit);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFormSubmit(e);
    });

    loadTasksFromLocalStorage();
});


const launchConfetti = () => {
    const count = 200,
        defaults = {
            origin: {
                y: 0.7
            },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};