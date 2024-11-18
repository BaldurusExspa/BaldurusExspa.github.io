const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");

let taskList = [];

const getNumbersFromString = (str) => +str.replace(/\D/g, "");

const renderTasks = () => {
  listContainer.innerHTML = "";

  taskList.forEach((element) => {
    const listElement = document.createElement("li");
    const viewBox = document.createElement("div");
    const checkbox = document.createElement("input");
    const title = document.createElement("label");
    const deleteButton = document.createElement("button");

    listElement.id = `task-${element.id}`;
    viewBox.className = "view";
    checkbox.id = `check-${element.id}`;
    checkbox.type = "checkbox";
    checkbox.checked = element.chekedState;
    title.innerHTML = element.title;
    deleteButton.id = `btn-${element.id}`;
    deleteButton.innerHTML = "X";

    viewBox.appendChild(checkbox);
    viewBox.appendChild(title);
    viewBox.appendChild(deleteButton);
    listElement.appendChild(viewBox);
    listContainer.appendChild(listElement);

    deleteButton.onclick = deleteTask;

    // if (checkbox.checked == true) {
    //   title.classList.add("completed");
    // } else if (checkbox.checked == false) {
    //   title.classList.remove("completed");
    // };
  });

  todoCount.innerHTML = taskList.length;

  displayFooter();
};

const deleteTask = (event) => {
  const taskId = getNumbersFromString(event.target.id);
  const filteredTasks = taskList.filter((task) => task.id !== taskId);
  taskList = filteredTasks;
  renderTasks();
};

const displayFooter = () => {
  if (taskList.length > 0) {
    footer.style.display = "flex";
    // todoCount.innerHTML = taskList.length;
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
