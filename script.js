document.addEventListener("DOMContentLoaded", () => {
	const dailyTaskInput = document.querySelector("#dailyTaskInput");
	const dailyAddBtn = document.querySelector("#dailyAddTask");
	const dailyTaskList = document.querySelector("#dailyTasks");

	const previousDayList = document.querySelector("#previousDay");
	const copyDayBtn = document.querySelector("#copyDay");

	const weeklyTaskInput = document.querySelector("#weeklyTaskInput");
	const weeklyAddBtn = document.querySelector("#weeklyAddTask");
	const weeklyTaskList = document.querySelector("#weeklyTasks");

	const previousWeekList = document.querySelector("#previousWeek");
	const copyWeekBtn = document.querySelector("#copyWeek");

	const remindersInput = document.querySelector("#remindersInput");
	const reminderAddBtn = document.querySelector("#addReminder");
	const remindersList = document.querySelector("#remindersList");

	// Initialize arrays
	let dailyTasksArray = JSON.parse(localStorage.getItem("dailyTasks")) || [];
	let previousDayArray = JSON.parse(localStorage.getItem("previousDay")) || [];
	let weeklyTasksArray = JSON.parse(localStorage.getItem("weeklyTasks")) || [];
	let previousWeekArray =
		JSON.parse(localStorage.getItem("previousWeek")) || [];
	let remindersArray = JSON.parse(localStorage.getItem("reminders")) || [];

	function refreshList(taskList, tasksArray) {
		taskList.innerHTML = "";
		tasksArray.forEach((task, index) => addToList(taskList, task, index));
	}

	function refreshPreviousList(previousList, previousArray) {
		previousList.innerHTML = "";
		previousArray.forEach((task, index) => {
			const li = document.createElement("li");
			li.dataset.index = index;
			li.innerHTML = `<span class="task-text">${task}</span>`;
			previousList.appendChild(li);
		});
	}

	function addToList(taskList, task, index) {
		if (task) {
			const li = document.createElement("li");
			li.dataset.index = index;
			li.innerHTML = `
				<div>
					<div class="order-btns">
						<button class="move-up-btn">
							<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M10.9376 6.06062L6.56943 0.963122C6.49902 0.881001 6.41168 0.815081 6.3134 0.769887C6.21512 0.724693 6.10823 0.701294 6.00005 0.701294C5.89188 0.701294 5.78499 0.724693 5.68671 0.769887C5.58843 0.815081 5.50109 0.881001 5.43068 0.963122L1.06255 6.06062C0.645678 6.54718 0.991303 7.29875 1.63193 7.29875H10.3694C11.0101 7.29875 11.3557 6.54718 10.9376 6.06062Z" fill="currentColor"/>
							</svg>
						</button>
						<button class="move-down-btn">
							<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M1.06252 1.93942L5.43065 7.03692C5.50106 7.11904 5.5884 7.18496 5.68668 7.23015C5.78496 7.27535 5.89185 7.29875 6.00002 7.29875C6.10819 7.29875 6.21509 7.27535 6.31337 7.23015C6.41165 7.18496 6.49899 7.11904 6.5694 7.03692L10.9375 1.93942C11.3544 1.45286 11.0088 0.701294 10.3681 0.701294H1.63065C0.990022 0.701294 0.644397 1.45286 1.06252 1.93942Z" fill="currentColor"/>
							</svg>
						</button>
					</div>
					<span class="task-text">${task}</span>
				</div>
				<div class="option-btns">
					<button class="duplicate-btn">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 9H9M9 9H15M9 9V3M9 9V15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button class="remove-btn">
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M9 9L4 4M9 9L14 14M9 9L14 4M9 9L4 14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>
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

	function copyToPrevious(currentArray, previousKey, previousList) {
		localStorage.setItem(previousKey, JSON.stringify(currentArray));
		refreshPreviousList(previousList, currentArray);
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
			editInput.setSelectionRange(
				editInput.value.length,
				editInput.value.length
			);

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

	// Daily Tasks
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
	copyDayBtn.addEventListener("click", () =>
		copyToPrevious(dailyTasksArray, "previousDay", previousDayList)
	);

	// Weekly Tasks
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
	copyWeekBtn.addEventListener("click", () =>
		copyToPrevious(weeklyTasksArray, "previousWeek", previousWeekList)
	);

	// Reminders
	reminderAddBtn.addEventListener("click", () =>
		createTask(remindersInput, remindersArray, "reminders", remindersList)
	);
	remindersInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			createTask(remindersInput, remindersArray, "reminders", remindersList);
		}
	});
	remindersList.addEventListener("click", (e) =>
		handleTaskClick(e, remindersArray, "reminders", remindersList)
	);

	// Initial render of the task lists
	refreshPreviousList(previousDayList, previousDayArray);
	refreshPreviousList(previousWeekList, previousWeekArray);

	refreshList(dailyTaskList, dailyTasksArray);
	refreshList(weeklyTaskList, weeklyTasksArray);
});
