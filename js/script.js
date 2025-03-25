const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");
const allFilterButton = document.getElementById("all");
const activeFilterButton = document.getElementById("active");
const completedFilterButton = document.getElementById("completed");
const clearCompletedButton = document.getElementById("clear-completed-button");
const markCompletedButton = document.getElementById(
  "mark-all-as-complete-checkbox"
);
const markCompletedInput = document.getElementById(
  "mark-all-as-complete-input"
);

let taskList = JSON.parse(localStorage.getItem("todos")) || [];
let filterState = "all";
// let validation = /[`"'\/\\]/gi;

/* ____________Utils Functions____________ */

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(taskList));
};

const createElement = (htmlTag = "div", param = {}) => {
  const element = document.createElement(htmlTag);
  for (let val in param) {
    element[val] = param[val];
  }
  return element;
};

/* ____________Main Functions____________ */

// Writing down the task data / Creating a task
const addTask = (e) => {
  // We check that the button inside event = (e) is pressed.
  if (e.key === "Enter") {
    // Validation
    // if (!!inputTodo.value.match(validation)) {
    if (inputTodo.value.startsWith(" ")) {
      return false;
    } else {
      if (inputTodo.value != "") {
        const task = {
          id: Date.now(),
          title: inputTodo.value,
          checkedState: false,
        };

        taskList.unshift(task);

        renderTasks();
      }

      inputTodo.value = "";
      markCompletedInput.checked = false;
    }
  }
};

// Deleting the task data
const deleteTask = (taskId) => {
  const filteredTasks = taskList.filter((task) => task.id !== taskId);

  taskList = filteredTasks;

  renderTasks();
};

// Toggle the task `checkedState` data
const toggleTask = (taskId) => {
  const newTaskList = taskList.map((task) => ({
    ...task,
    checkedState: task.id === taskId ? !task.checkedState : task.checkedState,
  }));

  taskList = newTaskList;

  renderTasks();
};

// Deleting the task with `chackedState === true` data
const deleteCompletedTask = () => {
  const filteredTasks = taskList.filter((task) => !task.checkedState);

  taskList = filteredTasks;

  renderTasks();
};

// Changing the filter and recording data about it
const changeFilter = (event) => {
  filterState = event.target.id;

  activeFilterButton.className = "";
  completedFilterButton.className = "";
  allFilterButton.className = "";

  event.target.className = "selected";

  renderTasks();
};

// Processing data about filters and return filtered tasks array
const сhooseList = (filter) => {
  if (filter === "all") {
    return taskList;
  }
  if (filter === "active") {
    return taskList.filter((task) => !task.checkedState);
  }
  return taskList.filter((task) => task.checkedState);
};

// Changing checked state of all tasks
const markAllCompleted = (checked) => {
  taskList.forEach((element) => {
    element.checkedState = checked;
  });

  renderTasks();
};

/* ____________Render Functions____________ */

// A function for render all tasks
const renderTasks = () => {
  listContainer.replaceChildren();

  сhooseList(filterState).forEach((element) => {
    const listElement = createElement("li", { id: `task-${element.id}` });
    const viewBox = createElement("div", { className: "view" });
    // Custom checkbox
    const inputGroupCheckbox = createElement("label", {
      className: "input-group-checkbox",
    });
    const checkbox = createElement("input", {
      id: `check-${element.id}`,
      type: "checkbox",
      checked: element.checkedState,
    });
    const customCheckbox = createElement("span", {
      className: "custom-checkbox",
      checked: checkbox.checked,
    });
    //
    const title = createElement("label", {
      innerHTML: element.title,
      className: element.checkedState ? "task-value completed" : "task-value",
    });
    title.setAttribute("maxlenght", "50");
    const deleteButton = createElement("button", {
      id: `btn-${element.id}`,
    });

    inputGroupCheckbox.append(checkbox, customCheckbox);
    viewBox.append(inputGroupCheckbox, title, deleteButton);
    listElement.appendChild(viewBox);
    listContainer.appendChild(listElement);

    deleteButton.onclick = () => {
      deleteTask(element.id);
    };

    deleteButton.ondblclick = (event) => {
      event.stopPropagation();
    };

    viewBox.ondblclick = () => {
      editTask(element.id, title.innerHTML);
    };

    if (title.innerHTML === "") {
      deleteTask(element.id);
    }

    checkbox.onchange = () => {
      toggleTask(element.id);
    };

    customCheckbox.ondblclick = (event) => {
      event.stopPropagation();
    };
  });

  if (taskList.length > 0) {
    markCompletedButton.classList.remove("invisible");
  } else {
    markCompletedButton.classList.add("invisible");
  }

  renderFooter();
  saveToLocalStorage();
};

// A function for render footer and footer elements
const renderFooter = () => {
  const activeTasks = taskList.filter((task) => !task.checkedState);
  todoCount.innerHTML = activeTasks.length;

  if (taskList.length > 0) {
    footer.classList.remove("invisible");
  } else {
    footer.classList.add("invisible");
  }

  if (taskList.length - activeTasks.length > 0) {
    clearCompletedButton.classList.remove("invisible");
  } else {
    clearCompletedButton.classList.add("invisible");
  }
};

// A function for displaying and updating data when editing an issue
const editTask = (taskId, value) => {
  const element = document.getElementById(`task-${taskId}`);
  const input = createElement("input", { className: "edit", value: value });

  element.replaceChildren();
  element.append(input);
  input.focus();
  input.onkeydown = (e) => {
    if (e.key === "Escape") {
      input.onblur = () => renderTasks();
      input.blur();
    }
    if (e.key === "Enter") {
      // Validation
      if (input.value.startsWith(' ')) {
        // input.onblur = () => renderTasks();
        return false;
      }
      input.blur();
    }
  };
  input.onblur = () => {
    // Validation
    if (input.value.startsWith(' ')) {
      return renderTasks();
    }
    let temp = input.value;
    const newTaskList = taskList.map((task) => {
      if (task.id === taskId) {
        return { ...task, title: temp };
      }
      return task;
    });

    taskList = newTaskList;

    renderTasks();
  };
};

inputTodo.addEventListener("keydown", addTask); // Listens to all keydowns on the keyboard
allFilterButton.addEventListener("click", changeFilter); // Listenter on filter button
activeFilterButton.addEventListener("click", changeFilter); // Listenter on filter button
completedFilterButton.addEventListener("click", changeFilter); // Listenter on filter button
clearCompletedButton.addEventListener("click", deleteCompletedTask); // Listenter on clear completed button
markCompletedInput.addEventListener("change", () => {
  markAllCompleted(markCompletedInput.checked);
}); // Listener on mark all task as complete checkbox

renderTasks();
