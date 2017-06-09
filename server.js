const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db

// FIXME: DB is reloading on client refresh. It should be persistent on new client
// connections from the last time the server was run...
var DB = firstTodos.map((t) => {
    // Form new Todo objects
    return new Todo(title = t.title);
});

server.on('connection', (client) => {

    // Sends a message to the client to reload all todos
    const reloadTodos = () => {
        server.emit('load', DB);
    }

    const sendAddTodo = (todo) => {
        server.emit('addTodo', todo);
    }

    const sendRemoveTodo = (todo) => {
        server.emit('removeTodo', todo)
    }

    // Accepts when a client makes a new todo
    client.on('make', (t) => {
        console.log(`add todo: ${JSON.stringify(t)}`);
        // Make a new todo
        const newTodo = new Todo(title = t.title);

        // Push this newly created todo to our database
        DB.push(newTodo);

        // Send the latest todos to the client
        // FIXME: This sends all todos every time, could this be more efficient?
        sendAddTodo(t);
    });

    //Accepts when a client removes a new todo
    client.on('remove', (t) => {
        console.log(`removed todo: ${JSON.stringify(t)}`);
        DB = DB.filter((todo) => (t.title != todo.title))
        sendRemoveTodo(t)
    })

    // Send the DB downstream on connect
    reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
