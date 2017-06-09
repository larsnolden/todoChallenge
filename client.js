const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
const input = document.getElementById('todo-input');

//on hit enter add todo
input.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) send_AddTodo()
})

//render from localStorage on connection Error
server.addEventListener('connect_error', () => renderAll(fromLocal(localStorage.todos)))

//--listeners for events from the server
server.on('load', (todos) => {
    renderAll(todos);
    localStorage.todos = toLocal(todos);
});

server.on('addTodo', (todo) => {
    addTodo(todo);
    localStorage.todos = toLocal(fromLocal(localStorage).push(todo));
});

server.on('removeTodo', (todo) => {
    removeTodo(todo);
    localStorage.todos = toLocal(fromLocal(localStorage).filter((t) => (t != todo)));
});

server.on('completeTodo', (todo) => {
    completeTodo(todo);
    localStorage.todos = toLocal(fromLocal(localStorage).map((t) => {
        if (t = todo) {
            t.done = !t.done
            return t
        }
        else return t
    }))
})

server.on('removeAll', () => {
    removeAll()
})

server.on('completeAll', () => {
    completeAll();
})

//--emitter to signalise changes to the server

//emit new todo to server
function send_AddTodo() {
    //only submit todos with content
    if (input.value) {
        server.emit('addTodo', {
            title: input.value
        });
    }

    // Clear the input
    input.value = '';
    input.focus();
}

//emmit remove todo to server
function send_RemoveTodo(todo) {
    server.emit('removeTodo', todo)
    input.focus();
}

//emmit a complete todo to server
function send_CompleteTodo(todo) {
    server.emit('completeTodo', todo)
    input.focus();
}

//emit remove all todos to server
function send_RemoveAll() {
    server.emit('removeAll')
    input.focus();
}

//emit complete all todos to server
function send_CompleteAll() {
    server.emit('completeAll')
    input.focus();
}


//--functions to modify the list locally

//render single Todo
function addTodo(todo) {
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);

    //add remove button
    let removeButton = Button('fi-trash', 'remove-btn', () => send_RemoveTodo(todo))
    listItem.appendChild(removeButton);

    //add complete button
    let completeButton = Button('fi-check', 'complete-btn', () => send_CompleteTodo(todo))
    listItem.appendChild(completeButton);

    //render done todos correclty
    if (todo.done) listItem.classList.add('done')
    list.append(listItem);
}

//remove specific todo
function removeTodo(todo) {
    if (list) {
        for (let child of list.childNodes) {
            if (child.firstChild.data == todo.title) list.removeChild(child)
        }
    }
}

//toogle complete on single Todo
function completeTodo(todo) {
    if (list) {
        for (let child of list.childNodes) {
            if (child.firstChild.data == todo.title) child.classList.toggle('done')
        }
    }
}

//mark all Todos as complete
function completeAll() {
    if (list) {
        for (let child of list.childNodes) {
            child.classList.add('done')
        }
    }
}

//render all Todos
function renderAll(todos) {
    removeAll()
    todos.forEach((todo) => addTodo(todo))
}

//remmove all Todos
function removeAll() {
    list.innerHTML = '';
}

//helper to store objects in localStorage
function toLocal(value) {
    return JSON.stringify(value)
}

//helper to retrieve object from local storage
function fromLocal(string) {
    return JSON.parse(string)
}