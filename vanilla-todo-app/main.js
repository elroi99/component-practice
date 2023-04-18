(() => {
  let notes = [
    { id: 1, content: "first" },
    { id: 2, content: "second" },
  ];

  // trying out local storage
  window.localStorage.setItem("cat", "meow");
  let cat = window.localStorage.getItem("cat");
  console.log(cat);

  let input = document.querySelector("input");
  let createNoteBtn = document.querySelector(".todo-creator__create-note-btn");
  let inputBtn = document.querySelector(".todo-creator__clear-input-btn");
  let todoDisplaySection = document.querySelector(".todo-display-section");
  createNoteBtn.addEventListener("click", () => {
    let noteContent = input.value;
    createNote(noteContent);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      createNote(input.value);
    }
  });
  inputBtn.addEventListener("click", (e) => {
    input.value = "";
  });

  renderNotes();

  function createNote(noteContent) {
    let uid = Date.now(); // jugaad
    let noteObj = {
      content: noteContent,
      id: uid,
    };
    // update state
    notes.push(noteObj);
    // add note to localstorage
    localStorage.setItem(`${uid}`, JSON.stringify(noteObj));
    // update UI
    renderNotes();
  }

  // creates and appends a single note into the correct section
  function createAndAppendNoteUI(noteObj) {
    let temp = `
      <div class"noteTextSection"> <span class="noteSpan"> ${noteObj.content} </span></div>
      <button class="deleteBtn"> delete </button>
      `;

    let noteDiv = document.createElement("div");
    let noteIsBeingEdited = false;
    noteDiv.classList.add("todo-display-section__note");
    noteDiv.innerHTML = temp;
    let deleteButton = noteDiv.querySelector(".deleteBtn");
    let noteSpan = noteDiv.querySelector(".noteSpan");
    let noteTextSection;
    deleteButton.addEventListener("click", (e) => {
      deleteNote(noteObj.id);
    });
    // make the note editable. ie set up the text area
    // double click should make editable, click away should stop the edit, enter should stop the edit
    function handleNoteSpanClick(e) {
      e.stopPropagation();
      console.log(this);
      noteSpan.contentEditable = true;
    }

    noteSpan.addEventListener("click", handleNoteSpanClick);
    // if user presses enter, update the note, make noteSpan uneditable
    function handleNoteSpanEnterKeyDown(e) {
      if (e.key === "Enter") {
        console.log(this);
        noteSpan.contentEditable = false;
        updateNote(noteObj.id, this.innerText);
        renderNotes(); // will render (updated) notes
      }
    }
    noteSpan.addEventListener("keydown", handleNoteSpanEnterKeyDown);
    // when user clicks away, update the note, make noteSpan uneditable

    todoDisplaySection.append(noteDiv);
  }

  function updateNote(noteId, contentValue) {
    console.log(noteId, contentValue);
    // update state
    let matchedNote = notes.find((note) => note.id === noteId);
    matchedNote.content = contentValue;
    // update note in localstorage
    let item = JSON.parse(localStorage.getItem(noteId));
    item.content = contentValue;
    localStorage.setItem(`${note.id}`, JSON.stringify(item));
    // update UI
    renderNotes();
  }

  function renderNotes() {
    todoDisplaySection.innerHTML = "";
    notes.forEach((note) => {
      createAndAppendNoteUI(note);
    });
  }

  function deleteNote(noteId) {
    notes = notes.filter((note) => !(note.id == noteId));
    localhost.removeItem(`${noteId}`);
    renderNotes();
  }
})();
