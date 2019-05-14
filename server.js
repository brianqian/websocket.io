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
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
