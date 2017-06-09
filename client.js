const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');
const input = document.getElementById('todo-input');

//on hit enter add todo
input.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) add()
})

//render from localStorage on connection Error
server.addEventListener('connect_error', () => renderAll(fromLocal(localStorage.todos)))

//--listeners for events from the server
server.on('load', (todos) => {
    renderAll(todos);
    localStorage.todos = toLocal(todos);
});

server.on('addTodo', (todo) => {
    render(todo);
    localStorage.todos = toLocal(fromLocal(localStorage).push(todo));
});

server.on('removeTodo', (todo) => {
    clean(todo);
    localStorage.todos = toLocal(fromLocal(localStorage).filter((t) => (t != todo)));
});

server.on('completeToggleTodo', (todo) => {
    completeToggleTodo(todo);
    localStorage.todos = toLocal(fromLocal(localStorage).map((t) => {
        if (t = todo) {
            t.done = !t.done
            return t
        }
        else return t
    }))
})

server.on('removeAllTodos', () => {
    cleanAll()
})

server.on('toggleCompleteAllTodos', () => {
    toggleCompleteAllTodos();
})

//--emitter to signalise changes to the server

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

//emmit a complete todo to server
function completeToggle(todo) {
    server.emit('completeToggle', todo)
}

//emit remove all todos to server
function removeAll() {
    server.emit('removeAll')
}

//emit complete all todos to server
function toggleCompleteAll() {
    server.emit('toggleCompleteAll')
}

//--functions to modify the list locally

//render single Todo
function render(todo) {
    const listItem = document.createElement('li');
    const listItemText = document.createTextNode(todo.title);
    listItem.appendChild(listItemText);

    //add remove button
    let removeButton = button('remove', 'remove-btn', () => remove(todo))
    listItem.appendChild(removeButton);

    //add complete button
    let completeButton = button('complete', 'complete-btn', () => completeToggle(todo))
    listItem.appendChild(completeButton);

    //render done todos correclty
    if (todo.done) console.log(listItem.classList.add('done'))
    list.append(listItem);
}

//button creator
//make module
function button(title, className, onClick) {
    let button = document.createElement('button');
    let buttonText = document.createTextNode(title);
    button.appendChild(buttonText)
    button.setAttribute("class", className);
    button.addEventListener('click', onClick)

    return button
}

//remove specific todo
function clean(todo) {
    if (list) {
        for (let child of list.childNodes) {
            if (child.firstChild.data == todo.title) list.removeChild(child)
        }
    }
}

//toogle complete on single Todo
function completeToggleTodo(todo) {
    if (list) {
        for (let child of list.childNodes) {
            if (child.firstChild.data == todo.title) child.classList.toggle('done')
        }
    }
}

function toggleCompleteAllTodos() {
    if (list) {
        for (let child of list.childNodes) {
            child.classList.add('done')
        }
    }
}

//render Todos
function renderAll(todos) {
    cleanAll()
    todos.forEach((todo) => render(todo))
}

//remmove all todos
function cleanAll() {
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