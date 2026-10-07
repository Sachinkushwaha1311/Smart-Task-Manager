let taskInput = document.getElementById("taskInput");
let priorityInput = document.getElementById("priorityInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let taskMessage = document.getElementById("taskMessage");
let taskList = document.getElementById("taskList");
let emptyState = document.getElementById("emptyState");
let searchInput = document.getElementById("searchInput");
let filterInput = document.getElementById("filterInput");
let darkModeBtn = document.getElementById("darkModeBtn");

let tasks = [];

/* Save Task */

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save Dark Mode //

function saveDarkMode(){
    if(document.body.classList.contains("dark")){
        localStorage.setItem("darkMode", "true");
    } else{
        localStorage.setItem("darkMode", "false");
    }
}

// Load Tasks //

function loadTasks(){
    let savedTasks = localStorage.getItem("tasks");
    if(savedTasks !== null){
        tasks = JSON.parse(savedTasks);
    }
    displayTasks();
}

// Dark Mode // 

darkModeBtn.addEventListener("click", function(){
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        darkModeBtn.textContent = "☀️";
    } else{
        darkModeBtn.textContent = "🌙";
    }
});

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
            <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <input type="checkbox" class="task-checkbox w-5 h-5 cursor-pointer" data-id="${task.id}" ${task.completed ? "checked" : ""}>

                    <div>
                        <h3 class="font-semibold ${task.completed ? "line-through text-gray-400" : "text-gray-800"}">
                            ${task.name}
                        </h3>

                        <p class="text-sm text-gray-500">
                            ${task.priority} Priority
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-sm px-3 py-1 rounded-full ${task.priority === "High" ? "bg-red-100 text-red-600" : task.priority === "Medium" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}">
                        ${task.priority}
                    </span>

                    <button type="button" class="edit-btn text-blue-500 hover:text-blue-700" data-id="${task.id}">
                        ✏️
                    </button>

                    <button type="button" class="delete-btn text-red-500 hover:text-red-700" data-id="${task.id}">
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

function addEditEvents(){
    let editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(function(button){
        button.addEventListener("click", function(){
            let taskId = Number(button.dataset.id);
            let taskToEdit = tasks.find(function(task){
                return task.id === taskId;
            });

            if (!taskToEdit) return;

            let newTaskName = prompt("Edit task name:", taskToEdit.name);
            let trimmedTaskName = newTaskName ? newTaskName.trim() : "";

            if (trimmedTaskName !== "") {
                taskToEdit.name = trimmedTaskName;
            }
            saveTasks();
            displayTasks();
        });
    });
}

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