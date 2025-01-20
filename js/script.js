const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");

let taskList = [];

const renderElement = (
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
  listContainer.innerHTML = "";

  taskList.forEach((element) => {
    const listElement = renderElement("li", { id: `task-${element.id}` });
    const viewBox = renderElement("div", { className: "view" });
    const checkbox = renderElement("input", {
      id: `check-${element.id}`,
      type: "checkbox",
      checked: element.chekedState,
    });
    const title = renderElement("label", { innerHTML: element.title });
    const deleteButton = renderElement("button", {
      id: `btn-${element.id}`,
      innerHTML: "X",
    });

    viewBox.append(checkbox, title, deleteButton);
    listElement.appendChild(viewBox);
    listContainer.appendChild(listElement);

    deleteButton.onclick = () => {
      deleteTask(element.id);
    };
  });

  todoCount.innerHTML = taskList.length;

  displayFooter();
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
        chekedState: false,
        editingState: false,
      };

      taskList.push(task);

      renderTasks();

      inputTodo.value = "";
    }
  }
};

inputTodo.addEventListener("keydown", addTask);
