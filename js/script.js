const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");
const allFilterButton = document.getElementById("all");
const activeFilterButton = document.getElementById("active");
const completedFilterButton = document.getElementById("completed");
const clearCompletedButton = document.getElementById("clear-completed-button");

let taskList = JSON.parse(localStorage.getItem("todos")) || [];
let filterState = "all";

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

const renderTasks = () => {
  listContainer.replaceChildren();

  сhooseList(filterState).forEach((element) => {
    const listElement = createElement("li", { id: `task-${element.id}` });
    const viewBox = createElement("div", { className: "view" });
    const checkbox = createElement("input", {
      id: `check-${element.id}`,
      type: "checkbox",
      checked: element.checkedState,
    });
    const title = createElement("label", {
      innerHTML: element.title,
      className: `completed-${element.checkedState}`,
    });
    const deleteButton = createElement("button", {
      id: `btn-${element.id}`,
      innerHTML: "X",
    });

    viewBox.append(checkbox, title, deleteButton);
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

    checkbox.ondblclick = (event) => {
      event.stopPropagation();
    };
  });

  renderFooter();
  saveToLocalStorage();
};

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

const сhooseList = (filter) => {
  if (filter === "all") {
    return taskList;
  }
  if (filter === "active") {
    return taskList.filter((task) => !task.checkedState);
  }
  return taskList.filter((task) => task.checkedState);
};

const toggleTask = (taskId) => {
  const newTaskList = taskList.map((task) => ({
    ...task,
    checkedState: task.id === taskId ? !task.checkedState : task.checkedState,
  }));

  taskList = newTaskList;

  renderTasks();
};

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
      input.blur();
    }
  };
  input.onblur = () => {
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

const deleteTask = (taskId) => {
  const filteredTasks = taskList.filter((task) => task.id !== taskId);

  taskList = filteredTasks;

  renderTasks();
};

const deleteCompletedTask = () => {
  const filteredTasks = taskList.filter((task) => !task.checkedState);

  taskList = filteredTasks;

  renderTasks();
};

const addTask = (e) => {
  if (e.key === "Enter") {
    // Проверяем что за кнопка внутри event = (e) нажата
    if (inputTodo.value != "") {
      const task = {
        id: Date.now(),
        title: inputTodo.value,
        checkedState: false,
      };

      // taskList.push(task);
      taskList.unshift(task);

      renderTasks();

      inputTodo.value = "";
    }
  }
};

const changeFilter = (event) => {
  filterState = event.target.id;

  activeFilterButton.className = "";
  completedFilterButton.className = "";
  allFilterButton.className = "";

  event.target.className = "selected";

  renderTasks();
};

inputTodo.addEventListener("keydown", addTask); // Отлавливает нажатия всех кнопок
allFilterButton.addEventListener("click", changeFilter);
activeFilterButton.addEventListener("click", changeFilter);
completedFilterButton.addEventListener("click", changeFilter);
clearCompletedButton.addEventListener("click", deleteCompletedTask);

renderTasks();
