const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
const input = document.getElementById('todo-input');

input.addEventListener('keypress', (event) => {
    //on hit enter
    if (event.keyCode === 13) add()
})

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

function clean() {
    list.innerHTML = '';
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    clean()
    console.log(`received new set of todos: ${JSON.stringify(todos)}`)
    todos.forEach((todo) => render(todo));
});

server.on('newTodo', (todo) => {
    render(todo)
});