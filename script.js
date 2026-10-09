let taskInput = document.getElementById("taskInput");
let priorityInput = document.getElementById("priorityInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let taskMessage = document.getElementById("taskMessage");
let taskList = document.getElementById("taskList");
let emptyState = document.getElementById("emptyState");
let searchInput = document.getElementById("searchInput");
let filterInput = document.getElementById("filterInput");
let darkModeBtn = document.getElementById("darkModeBtn");

let editSection = document.getElementById("editSection");
let editTaskInput = document.getElementById("editTaskInput");
let editPriorityInput = document.getElementById("editPriorityInput");
let saveEditBtn = document.getElementById("saveEditBtn");
let cancelEditBtn = document.getElementById("cancelEditBtn");

let tasks = [];
let editingTaskId = null;

/* Save Task */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save Dark Mode //

function saveDarkMode() {
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "true");
    } else {
        localStorage.setItem("darkMode", "false");
    }
}

// Dark Mode // 

darkModeBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        darkModeBtn.textContent = "☀️";
    } else {
        darkModeBtn.textContent = "🌙";
    }
    saveDarkMode();
});


// Load Dark Mode //

function loadDarkMode() {
    let savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
        document.body.classList.add("dark");
        darkModeBtn.textContent = "☀️";
    } else {
        document.body.classList.remove("dark");
        darkModeBtn.textContent = "🌙";
    }
}

// Load Tasks //

function loadTasks() {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks !== null) {
        tasks = JSON.parse(savedTasks);
    }
    displayTasks();
}



function showTaskMessage(message, type = "success") {
    taskMessage.textContent = message;
    taskMessage.classList.remove("hidden", "text-green-600", "text-red-600");

    if (type === "success") {
        taskMessage.classList.add("text-green-600");
    } else {
        taskMessage.classList.add("text-red-600");
    }
}

addTaskBtn.addEventListener("click", function () {
    let taskName = taskInput.value.trim();
    let priority = priorityInput.value;

    if (taskName === "") {
        showTaskMessage("Please enter a task before adding it.", "error");
        return;
    }

    let task = {
        id: Date.now(),
        name: taskName,
        priority: priority,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    taskInput.value = "";
    taskInput.focus();
    showTaskMessage('Task added successfully: "' + taskName + '".');
    displayTasks();
});

searchInput.addEventListener("input", function () {
    displayTasks();
});

filterInput.addEventListener("change", function () {
    displayTasks();
});

function displayTasks() {
    taskList.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();
    let selectedFilter = filterInput.value;
    let filteredTasks = tasks.filter(function (task) {
        let matchesSearch = task.name.toLowerCase().includes(searchText);
        let matchesFilter = true;

        if (selectedFilter === "pending") {
            matchesFilter = task.completed === false;
        }

        if (selectedFilter === "completed") {
            matchesFilter = task.completed === true;
        }

        return matchesSearch && matchesFilter;
    });

    emptyState.classList.toggle("hidden", filteredTasks.length !== 0);

    filteredTasks.forEach(function (task) {
        let taskHTML = `
        <div class="task-card bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- LEFT SIDE -->
                <div class="flex items-center gap-2 flex-wrap">

                    <input type="checkbox" class="task-checkbox w-5 h-5 cursor-pointer" data-id="${task.id}" ${task.completed ? "checked" : ""}>
                        <div>
                            <h3 class="font-semibold break-word ${task.completed? "line-through text-gray-400" : "text-gray-800"}">
                                ${task.name}
                            </h3>

                            <p class="text-sm text-gray-500 mt-1">
                                ${task.completed ? "Completed" : task.priority + "Priority"}
                            </p>
                        </div>
                </div>

                <!-- RIGHT SIDE -->
                <div class="flex items-center gap-2">

                    <!-- PRIORITY -->
                    <span class="text-sm px-3 py-1 rounded-full ${task.completed ? "bg-gray-100 text-gray-500" : task.priority === "High" ? "bg-red-100 text-red-600" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}">
                        ${task.priority}
                    </span>

                    <!-- EDIT -->
                    <button class="edit-btn w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600" data-id="${task.id}" type="button">
                        ✏️
                    </button>

                    <!-- DELETE -->
                    <button class="delete-btn w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-600" data-id="${task.id}" type="button">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `;

        taskList.innerHTML += taskHTML;
    });

    updateStatistics();
    addCheckboxEvents();
    addDeleteEvents();
    addEditEvents();
}

function addCheckboxEvents() {
    let checkboxes = document.querySelectorAll('.task-checkbox');

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            let taskId = Number(checkbox.dataset.id);
            tasks.forEach(function (task) {
                if (task.id === taskId) {
                    task.completed = checkbox.checked;
                }
                saveTasks();
                displayTasks();
            });

        });
    });
}

function addDeleteEvents() {
    let deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            let taskId = Number(button.dataset.id);
            tasks = tasks.filter(function (task) {
                return task.id !== taskId;
            });

            saveTasks();
            displayTasks();
        });
    });
}

/* Edit Task */

function addEditEvents() {
    let editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            let taskId = Number(button.dataset.id);
            tasks.forEach(function (task) {
                if (task.id === taskId) {
                    editingTaskId = task.id;
                    editTaskInput.value = task.name;
                    editPriorityInput.value = task.priority;
                    editSection.classList.remove("hidden");
                    editTaskInput.focus();
                }
            });
        });
    });
}

// Save Edited Task //

saveEditBtn.addEventListener("click", function () {
    let newTaskName = editTaskInput.value.trim;
    let newPriority = editPriorityInput.value;

    if (newTaskName === "") {
        alert("Please Enter a task name.");
        return;
    }

    tasks.forEach(function (task) {
        if (task.id === editingTaskId) {
            task.name = newTaskName;
            task.priority = newPriority;
        }
    });

    saveTasks();
    editSection.classList.add("hidden");
    editingTaskId = null;
    displayTasks();
})


// Cancel Edit //

cancelEditBtn.addEventListener("click", function () {
    editSection.classList.add("hidden");
    editingTaskId = null
})

function updateStatistics() {
    let totalTasks = tasks.length;
    let completedTasks = tasks.filter(function (task) {
        return task.completed === true;
    }).length;

    let pendingTasks = totalTasks - completedTasks;

    document.getElementById("totalTasks").textContent = totalTasks;
    document.getElementById("pendingTasks").textContent = pendingTasks;
    document.getElementById("completedTasks").textContent = completedTasks;
    document.getElementById("taskCount").textContent = totalTasks + (totalTasks === 1 ? " task" : " tasks");
    document.getElementById("navTaskCount").textContent = totalTasks;
}

loadTasks();
loadDarkMode();