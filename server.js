const express = require("express");
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("/src"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

const activeUsers = {};

io.on("connection", socket => {
  //when receiving a message, relay message to other people
  console.log("a user connected", `socketID: ${socket.id}`);
  socket.on("chat message", message => {
    console.log(`message: ${message}`);
    io.emit("message", message);
  });

  //after registering a nickname, populate other user lists
  //announce user entering channel
  socket.on("new user", username => {
    console.log(`new user ${username} has joined. socketID: ${socket.id}`);
    activeUsers[socket.id] = username;
    io.emit("new user", { username, id: socket.id });
    io.emit("load user list", activeUsers);
    console.log(activeUsers);
  });

  //when disconnecting, let other users know.
  socket.on("disconnect", reason => {
    console.log("user disconnected: " + reason);
    //removes user from userList
    io.emit("user disconnected", socket.id);
    delete activeUsers[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
