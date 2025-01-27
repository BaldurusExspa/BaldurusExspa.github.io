const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");
const allFilterButton = document.getElementById("all");
const activeFilterButton = document.getElementById("active");
const completedFilterButton = document.getElementById("completed");

let taskList = [];
let filterState = "all";

const createElement = (
  htmlTag = "div",
  param = { id: Date.now(), innerHTML: "hello world", className: "div" }
) => {
  const element = document.createElement(htmlTag);
  for (let val in param) {
    element[val] = param[val];
  }
  return element;
};

const renderTasks = () => {
  const competedTasks = taskList.filter((task) => task.checkedState); //TODO: Избавиться от этих переменных
  const activeTasks = taskList.filter((task) => !task.checkedState); //TODO: Вычислять только при использовании

  todoCount.innerHTML = taskList.filter((task) => !task.checkedState).length; //TODO: Перенести в displayFooter
  listContainer.replaceChildren();

  сhooseList(filterState, activeTasks, competedTasks).forEach((element) => {
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

  displayFooter();
};

const displayFooter = () => {
  if (taskList.length > 0) {
    footer.className = "footer";
  } else {
    footer.className = "footer invisible";
  }
};

const сhooseList = (fil, a, b) => {
  if (fil === "all") {
    return taskList;
  }
  if (fil === "active") {
    return a;
  }
  return b;
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
  event.target.className = "selected";
  filterState = event.target.id;

  if (event.target.id === "all") {
    activeFilterButton.className = "";
    completedFilterButton.className = "";
  } else if (event.target.id === "active") {
    allFilterButton.className = "";
    completedFilterButton.className = "";
  } else {
    allFilterButton.className = "";
    activeFilterButton.className = "";
  }

  renderTasks();
};

inputTodo.addEventListener("keydown", addTask); // Отлавливает нажатия всех кнопок
allFilterButton.addEventListener("click", changeFilter);
activeFilterButton.addEventListener("click", changeFilter);
completedFilterButton.addEventListener("click", changeFilter);
