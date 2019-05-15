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
  console.log("a user connected");
  socket.on("chat message", message => {
    console.log(`message: ${message}`);
    io.emit("message", message);
  });
  socket.on("new user", username => {
    console.log(`new user ${username} has joined`);
    io.emit("new user", username);
  });
  socket.on("disconnect", reason => {
    console.log("user disconnected: " + msg);
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
