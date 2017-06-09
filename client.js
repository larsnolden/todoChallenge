const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
const input = document.getElementById('todo-input');

//on hit enter add todo
input.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) add()
})

if (localStorage.todos) renderAll(fromLocal(localStorage.todos));

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    renderAll(todos)
    localStorage.todos = toLocal(todos)
});

server.on('addTodo', (todo) => {
    render(todo)
    localStorage.todos = toLocal(fromLocal(localStorage).push(todo));
});

server.on('removeTodo', (todo) => {
    clean(todo)
    localStorage.todos = toLocal(fromLocal(localStorage).filter((t) => (t != todo)));
});

//emit new todo to server
function add() {
    console.warn(event);

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

//emmit remove todo to server
function remove(todo) {
    server.emit('remove', todo)
}

//render single Todo
function render(todo) {
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);

    //add button
    const button = document.createElement('button');
    const buttonText = document.createTextNode('remove');
    button.appendChild(buttonText)
    button.setAttribute("class", "remove-btn");
    button.addEventListener('click', () => remove(todo))
    listItem.appendChild(button);

    list.append(listItem);
}

function clean(todo) {
    if (list) {
        for (let child of list.childNodes) {
            if (child.firstChild.data == todo.title) list.removeChild(child)
        }
    }
}

//render Todos
function renderAll(todos) {
    cleanAll()
    todos.forEach((todo) => render(todo))
}

function cleanAll() {
    list.innerHTML = '';
}

//helper to store objects in localStorage
function toLocal(value) {
    return JSON.stringify(value)
}

function fromLocal(string) {
    return JSON.parse(string)
}