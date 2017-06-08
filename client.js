const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
const input = document.getElementById('todo-input');

input.addEventListener('keypress', (event) => {
    //on hit enter
    if (event.keyCode === 13) add()
})

if (localStorage.todos) renderAll(fromLocal(localStorage.todos));

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    renderAll(todos)
    localStorage.todos = toLocal(todos)
});

server.on('newTodo', (todo) => {
    render(todo)
    localStorage.todos = toLocal(fromLocal(localStorage).push(todo));
});

//emit new todo to server
function add() {
    console.warn(event);
    // Emit the new todo as some data to the server

    //only submit todos with content
    if (input.value) {
        server.emit('make', {
            title: input.value
        });
    }

    // Clear the input
    input.value = '';
    // TODO: refocus the element
}

//render single Todo
function render(todo) {
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);
    list.append(listItem);
}

//render Todos
function renderAll(todos) {
    cleanTodos()
    todos.forEach((todo) => render(todo));
}

function cleanTodos() {
    list.innerHTML = '';
}

//helper to store objects in localStorage
function toLocal(value) {
    return JSON.stringify(value)
}

function fromLocal(string) {
    return JSON.parse(string)
}