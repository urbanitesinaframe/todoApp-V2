# todo-api

The todo-api is a demo api to list, get, create, update and delete todos.

## Installation & Usage

- Clone repository and `cd` into the cloned folder
- Run `npm install` to install the dependencies
- Start the todo api server with `npm start`
- Open the documentation on `http://localhost:4730/`

## Supported actions

Get all todos

```
GET /todos
```

Get a specific todo by ID

```
GET /todos/:id
```

Create a new todo

```
POST /todos
```

Update a todo by ID

```
PUT /todos/:id
```

Delete a todo by ID

```
DELETE /todos/:id
```
