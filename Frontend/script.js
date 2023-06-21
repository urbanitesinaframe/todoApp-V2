"use strict";

//Hilfsfunktionen
function selectByID(ID) {
  return document.getElementById(ID);
}
//Hinterlegt eventListener auf NEW TODO button
addNewToDoBtn.addEventListener("click", addNewToDo);
//Hinterlegt eventlistener auf INPUT FELD
toDoInput.addEventListener("keyup", function (e) {
  console.log(e.key);
  if (["Enter"].includes(e.key)) {
    addNewToDo();
  }
});
//Hinterlegt eventlistener auf DELETE Button
delBtn.addEventListener("click", deleteDone);

//Erstellt ein Element basierend auf Parameter 1 und fügt dem Element Atrribute mittels Parameter 2 in Form eines Objektes hinzu
function addElement(ElName, options = {}) {
  const newElement = document.createElement(ElName);

  for (let option in options) {
    newElement[option] = options[option];
  }
  return newElement;
}

// state for status and todos
let state = {
  todo: [],
};

//Fügt Funktion zu den Filter Radio Buttons hinzu
selectByID("filterContainer").addEventListener("change", render);

//fuegt loeschfunktion hinzu
function deleteDone() {
  let fetchedPromises = [];
  for (let i = state.todo.length - 1; i >= 0; i--) {
    if (state.todo[i].done === true) {
      let id = state.todo[i].id;

      fetchedPromises.push(
        fetch(`http://localhost:4730/todos/${id}`, {
          method: "DELETE",
        })
      );
    }
  }

  Promise.all(fetchedPromises).then(render);
  selectByID("All").checked = true;
}

//create ToDo list elements in html//
function render() {
  fetch("http://localhost:4730/todos")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      state.todo = data;
      //Prüft, ob überhaupt Daten zum Rendern vorhanden sind
      if (state.todo.length === 0) {
        toDoList.innerHTML = "Type in your 1st ToDo to create a list";
      } else {
        toDoList.innerHTML = "";
        // Rendert die ToDo Liste entsprechend des Filters
        let todos = [];
        if (selectByID("Open").checked) {
          todos = state.todo.filter((todo) => todo.done === false);
        } else if (selectByID("Done").checked) {
          todos = state.todo.filter((todo) => todo.done === true);
        } else {
          todos = state.todo;
        }

        for (let toDoListEntry of todos) {
          const newToDoListEntry = addElement("li", {
            innerText: toDoListEntry.description,
          });

          const toDoCheckbox = addElement("input", {
            id: toDoListEntry.id,
            type: "checkbox",
            name: "toDoStatus",
            checked: toDoListEntry.done,
          });

          if (toDoListEntry.done) {
            newToDoListEntry.classList.add("strikeThrough");
          } else {
            newToDoListEntry.classList.remove("strikeThrough");
          }

          toDoCheckbox.addEventListener("change", changeDone);

          newToDoListEntry.appendChild(toDoCheckbox);
          toDoList.appendChild(newToDoListEntry);
        }
      }
    });
}

//Fügt Funktion Ändern des Done Status beim Auslösen der Checkboxen aus
function changeDone(event) {
  const id = event.target.id;
  const index = state.todo.findIndex((item) => item.id == event.target.id);

  state.todo[index].done = event.target.checked;
  fetch(`http://localhost:4730/todos/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(state.todo[index]),
  }).then(render);
}

//fuegt neue Todo hinzu
function addNewToDo() {
  let newToDo = { description: toDoInput.value, done: false };
  if (toDoInput.value.length < 3) {
    alert("Please add a task with more than 2 Letters!");
  } else {
    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newToDo),
    }).then(render());
    console.log(state.todo);
  }
  toDoInput.value = "";
}

render();
