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
    clean()
    console.log(todos)
    console.log(toLocal(todos))
    localStorage.todos = toLocal(todos)
    renderAll(todos)
});

server.on('newTodo', (todo) => {
    localStorage.todos.push(todo);
    render(todo)
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
    console.log(todo);
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);
    list.append(listItem);
}

function renderAll(todos) {
    todos.forEach((todo) => render(todo));
}

function toLocal(value) {
    return JSON.stringify(value)
}

function fromLocal(string) {
    return JSON.parse(string)
}

function clean() {
    list.innerHTML = '';
}