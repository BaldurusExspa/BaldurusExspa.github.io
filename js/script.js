const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");

let taskList = [];

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
  listContainer.replaceChildren();

  taskList.forEach((element) => {
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
  });

  todoCount.innerHTML = taskList.length;

  displayFooter();
};

const toggleTask = (taskId) => {
  const newTaskList = taskList.map((task) => {
    const state = task.checkedState;

    const resultObject =
      task.id === taskId && task.checkedState === state
        ? { ...task, checkedState: !state }
        : task;

    return resultObject;
  });

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

const displayFooter = () => {
  if (taskList.length > 0) {
    footer.style.display = "flex";
  } else {
    footer.style.display = "none";
  }
};

const addTask = (e) => {
  if (e.key === "Enter") {
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

inputTodo.addEventListener("keydown", addTask);
