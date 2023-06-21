#!/usr/bin/env node

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(__dirname + "/db.json");
const middlewares = jsonServer.defaults({});

server.use(middlewares);

router.db._.id = "id";

server.use(router);
const port = process.env.PORT || 4730;
server.listen(port, function () {
  console.log(`JSON Server is running on http://localhost:${port}`);
  console.log(
    `Open http://localhost:${port}/todos in your browser to see the todos ✅`
  );
});
