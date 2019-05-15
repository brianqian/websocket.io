const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("assets"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  const activeUsers = {};

  console.log("a user connected", `socketID: ${socket.id}`);
  socket.on("chat message", message => {
    console.log(`message: ${message}`);
    io.emit("message", message);
  });
  socket.on("new user", username => {
    console.log(`new user ${username} has joined. socketID: ${socket.id}`);
    io.emit("generate current users", activeUsers);
    io.emit("new user", { username, id: socket.id });
    activeUsers[socket.id] = username;
    console.log(activeUsers);
  });
  socket.on("disconnect", reason => {
    console.log("user disconnected: " + reason);
    io.emit("user disconnected", socket.id);
    delete activeUsers[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
