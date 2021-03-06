import * as express from "express";
const app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

const activeUsers: any = {};

io.on("connection", (socket: any) => {
  //when receiving a message, relay message to other people
  console.log("USER HAS CONNECTED", socket.id);
  socket.on("send message", (message: string) => {
    console.log("SENDING", socket.id);
    io.emit("message", message);
  });

  //after registering a nickname, populate other user lists
  //announce user entering channel
  socket.on("new user", (username: string) => {
    console.log(`new user ${username} has joined. socketID: ${socket.id}`);
    activeUsers[socket.id] = username;
    io.emit("new user", { username, id: socket.id });
    io.to(`${socket.id}`).emit("personal info", { username, id: socket.id });
    io.emit("load user list", activeUsers);
    console.log(activeUsers);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing", activeUsers[socket.id]);
  });
  socket.on("end typing", () => {
    socket.broadcast.emit("end typing", activeUsers[socket.id]);
  });

  //when disconnecting, let other users know.
  socket.on("disconnect", (reason: string) => {
    console.log("user disconnected: " + reason);
    //removes user from userList
    const id = socket.id;
    io.emit("user disconnected", { username: activeUsers[id], id });
    delete activeUsers[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
