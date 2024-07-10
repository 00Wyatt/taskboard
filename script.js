/*
Daily Task List.
Create, edit, delete, and duplicate tasks.
Reorder tasks.
*/

const dailyTaskInput = document.querySelector("#dailyTaskInput");
const dailyAddBtn = document.querySelector("#dailyAddTask");
const dailyTaskList = document.querySelector("#dailyTasks");

const weeklyTaskInput = document.querySelector("#weeklyTaskInput");
const weeklyAddBtn = document.querySelector("#weeklyAddTask");
const weeklyTaskList = document.querySelector("#weeklyTasks");

let dailyTasksArray = JSON.parse(localStorage.getItem("dailyTasks")) || [];
let weeklyTasksArray = JSON.parse(localStorage.getItem("weeklyTasks")) || [];

function refreshList(taskList, tasksArray) {
	taskList.innerHTML = "";
	tasksArray.forEach((task, index) => addToList(taskList, task, index));
	console.log(tasksArray);
}

function addToList(taskList, task, index) {
	if (task) {
		const li = document.createElement("li");
		li.dataset.index = index;
		li.innerHTML = `
			<div><button class="move-up-btn">↑</button>
			<button class="move-down-btn">↓</button></div>
			<span class="task-text">${task}</span>
			<div><button class="duplicate-btn">+</button>
			<button class="remove-btn">X</button></div>
    	`;
		taskList.appendChild(li);
	}
}

function createTask(taskInput, tasksArray, storageKey, taskList) {
	const taskText = taskInput.value.trim();
	if (taskText) {
		tasksArray.push(taskText);
		localStorage.setItem(storageKey, JSON.stringify(tasksArray));
		addToList(taskList, taskText, tasksArray.length - 1);
		taskInput.value = "";
	}
}

function removeTask(index, tasksArray, storageKey, taskList) {
	tasksArray.splice(index, 1);
	localStorage.setItem(storageKey, JSON.stringify(tasksArray));
	refreshList(taskList, tasksArray);
}

function editTask(index, newText, tasksArray, storageKey, taskList) {
	tasksArray[index] = newText;
	localStorage.setItem(storageKey, JSON.stringify(tasksArray));
	refreshList(taskList, tasksArray);
}

function duplicateTask(index, tasksArray, storageKey, taskList) {
	const taskText = tasksArray[index];
	tasksArray.splice(index, 0, taskText);
	localStorage.setItem(storageKey, JSON.stringify(tasksArray));
	refreshList(taskList, tasksArray);
}

function moveTaskUp(index, tasksArray, storageKey, taskList) {
	if (index > 0) {
		[tasksArray[index], tasksArray[index - 1]] = [
			tasksArray[index - 1],
			tasksArray[index],
		];
		localStorage.setItem(storageKey, JSON.stringify(tasksArray));
		refreshList(taskList, tasksArray);
	}
}

function moveTaskDown(index, tasksArray, storageKey, taskList) {
	if (index < tasksArray.length - 1) {
		[tasksArray[index], tasksArray[index + 1]] = [
			tasksArray[index + 1],
			tasksArray[index],
		];
		localStorage.setItem(storageKey, JSON.stringify(tasksArray));
		refreshList(taskList, tasksArray);
	}
}

function handleTaskClick(e, tasksArray, storageKey, taskList) {
	const target = e.target;
	const li = target.closest("li");
	const index = parseInt(li.dataset.index, 10);

	if (target.classList.contains("remove-btn")) {
		removeTask(index, tasksArray, storageKey, taskList);
	} else if (target.classList.contains("duplicate-btn")) {
		duplicateTask(index, tasksArray, storageKey, taskList);
	} else if (target.classList.contains("move-up-btn")) {
		moveTaskUp(index, tasksArray, storageKey, taskList);
	} else if (target.classList.contains("move-down-btn")) {
		moveTaskDown(index, tasksArray, storageKey, taskList);
	} else if (target.classList.contains("task-text")) {
		const taskText = li.querySelector(".task-text").textContent;
		li.innerHTML = `
            <input type="text" class="edit-input" value="${taskText}">
            <button class="save-btn">Save</button>
        `;
		const editInput = li.querySelector(".edit-input");
		const saveBtn = li.querySelector(".save-btn");

		editInput.focus();
		editInput.setSelectionRange(editInput.value.length, editInput.value.length);

		const saveChanges = () => {
			const newText = editInput.value.trim();
			if (newText) {
				editTask(index, newText, tasksArray, storageKey, taskList);
			} else {
				removeTask(index, tasksArray, storageKey, taskList);
			}
		};

		editInput.addEventListener("blur", saveChanges, { once: true });
		saveBtn.addEventListener("click", saveChanges);
		editInput.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				saveChanges();
			}
		});
	}
}

dailyAddBtn.addEventListener("click", () =>
	createTask(dailyTaskInput, dailyTasksArray, "dailyTasks", dailyTaskList)
);
dailyTaskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		createTask(dailyTaskInput, dailyTasksArray, "dailyTasks", dailyTaskList);
	}
});
dailyTaskList.addEventListener("click", (e) =>
	handleTaskClick(e, dailyTasksArray, "dailyTasks", dailyTaskList)
);

weeklyAddBtn.addEventListener("click", () =>
	createTask(weeklyTaskInput, weeklyTasksArray, "weeklyTasks", weeklyTaskList)
);
weeklyTaskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		createTask(
			weeklyTaskInput,
			weeklyTasksArray,
			"weeklyTasks",
			weeklyTaskList
		);
	}
});
weeklyTaskList.addEventListener("click", (e) =>
	handleTaskClick(e, weeklyTasksArray, "weeklyTasks", weeklyTaskList)
);

// Initial render of the task lists
refreshList(dailyTaskList, dailyTasksArray);
refreshList(weeklyTaskList, weeklyTasksArray);

// TODO
//
// Add previous days list.
// Add better styles.
// Add picture that changes from API.
// Add GSAP to project.
// Click and drag tasks to reorder.
// Move tasks from one list to another.
