// Get DOM elements
const textInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");

// Retrieve tasks from localStorage or initialize an empty array
let tasksArray = JSON.parse(localStorage.getItem("tasks")) || [];

// Initial render of the task list
refreshList(tasksArray);

function refreshList(list) {
    // Clear existing list to avoid duplication
    taskList.innerHTML = "";
    // Add each task to the list
    list.forEach(addToList);
}

function addToList(task) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${task}</span><span class="remove-btn">X</span>`;
    taskList.appendChild(li);
}

function createTask() {
    const taskText = textInput.value.trim();
    if (taskText) {
        tasksArray.push(taskText);
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
        addToList(taskText);
        textInput.value = "";
    }
}

function removeTask(task) {
    const index = tasksArray.indexOf(task);
    if (index !== -1) {
        tasksArray.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
        refreshList(tasksArray);
    }
}

// Add event listeners
addBtn.addEventListener("click", createTask);

taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
        const task = e.target.previousSibling.textContent;
        removeTask(task);
    }
});