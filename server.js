const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
var DB = firstTodos.map((t) => {
    // Form new Todo objects
    return new Todo(title = t.title);
});

server.on('connection', (client) => {

    // Sends a message to the client:
    // - to reload all Todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    // - to add a Todo
    const send_AddTodo = (todo) => {
        server.emit('addTodo', todo);
    }

    // - to remove a Todos
    const send_RemoveTodo = (todo) => {
        server.emit('removeTodo', todo)
    }

    // - to complete a Todos
    const send_CompleteTodo = (todo) => {
        server.emit('completeTodo', todo)
    }

    // - to remove all Todos
    const send_RemoveAll = () => {
        server.emit('removeAll')
    }

    // - to complete all Todos
    const send_CompleteAll = () => {
        server.emit('completeAll')
    }


    // Accepts when: 
    // - a client adds a Todo
    client.on('addTodo', (t) => {
        console.log(`add todo: ${JSON.stringify(t)}`);
        // Make a new todo
        const newTodo = new Todo(title = t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        send_AddTodo(t);
    });

    // - a client removes a Todo
    client.on('removeTodo', (t) => {
        console.log(`removed todo: ${JSON.stringify(t)}`);
        DB = DB.filter((todo) => (t.title != todo.title))
        send_RemoveTodo(t)
    })

    // - a client completes a Todo
    client.on('completeTodo', (t) => {
        console.log(`completed todo: ${JSON.stringify(t)}`)
        DB = DB.map((todo) => {
            if (t.title == todo.title) {
                todo.done = !todo.done
                return todo
            }
            else return todo
        })

        send_CompleteTodo(t)
    })

    // - a client removes all Todos
    client.on('removeAll', () => {
        DB = []
        console.log(`DB: ${JSON.stringify(DB)}`)
        send_RemoveAll()
    })

    // - a client completes all Todos
    client.on('completeAll', () => {
        //lazy for each
        DB.forEach((todo) => todo.done = true)
        console.log(`DB: ${JSON.stringify(DB)}`)
        send_CompleteAll();
    })

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
