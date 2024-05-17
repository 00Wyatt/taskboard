const textInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");
let tasksArray = localStorage.getItem("tasks") ?
JSON.parse(localStorage.getItem("tasks")) : [];

refreshList(tasksArray);

function refreshList(list) {
    list.forEach(addToList);
    console.log(localStorage);
}

function addToList(task) {
    const li = document.createElement('li');
    li.textContent = task;
    taskList.appendChild(li);
}

function createTask() {
    if (textInput.value.trim()) {
        tasksArray.push(textInput.value);
        localStorage.setItem("tasks", JSON.stringify(tasksArray));
        addToList(textInput.value);
        console.log(localStorage);
    }
    textInput.value = "";
}

function removeTask(task) {
    let index = tasksArray.indexOf(task);
    if (index !== -1) {
        tasksArray.splice(index, 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
    taskList.innerHTML = "";
    refreshList(tasksArray);
}

addBtn.addEventListener("click", createTask);

taskList.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
        removeTask(e.target.textContent);
    }
});
