const inputTodo = document.getElementById("new-todo");
const listContainer = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const footer = document.getElementById("footer");

const addTodo = (e) => {
  if (e.key === "Enter") {
    if (inputTodo.value !== "") {
      let li = document.createElement("li");
      let view = document.createElement("div");
      let label = document.createElement("label");

      listContainer.appendChild(li);
      li.appendChild(view);
      view.className = "view";
      view.appendChild(label);
      label.innerHTML = inputTodo.value;
      todoCount.textContent = listContainer.childElementCount;

      li.addEventListener("dblclick", () => {
        view.classList.add("editing");
        let input = document.createElement("input");
        li.appendChild(input);
        input.classList.add("edit");
        input.value = label.textContent;
        input.focus();

        // if (input.onkeydown == true) {
        //   (event) => {
        //     if (event.key === "Enter") {
        //       view.classList.remove("editing");
        //       label.textContent = input.value;
        //       input.remove();
        //     }
        //   }
        // } else if (input.onblur == true) {
        //   view.classList.remove("editing");
        //   label.textContent = input.value;
        //   input.remove();
        // }

        input.onkeyup = (event) => {
          if (event.key === "Enter") {
            view.classList.remove("editing");
            label.textContent = input.value;
            input.remove();
          }
        };
        
        input.onblur = () => {
          view.classList.remove("editing");
          label.textContent = input.value;
          input.remove();
        };
      });

      if (label.textContent === "") {
        console.log("1");
        li.remove();
      }
    }
    inputTodo.value = "";

    if (listContainer.childElementCount === 0) {
      footer.style.display = "none";
    } else {
      footer.style.display = "flex";
    }
  }
};

inputTodo.addEventListener("keydown", addTodo);

//Константа для создания Template - хз как ей пользоватся
/*
const createTodoItem = ({id, title, completed, checked}) => `
<li data=id="${id}" class="${completed}">
    <div class="view">
        <input class="toggle" type="checkbox" ${checked}>
        <label>${title}</label>
        <button class="destroy"></button>
    </div>
</li>
`;
*/

// Переключение фильтров
/*
const filter = document.getElementsByClassName("a");

filter.forEach(btn =>
    btn.addEventListener('click', () =>  {
        const selectedFilter = document.getElementsByClassName("a.selected")

        if(selectedFilter) {
            selectedFilter.classList.remove(".selected")
        }
        btn.classList.add(".selected")
    })
);
*/
