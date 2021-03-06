"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static("dist"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
var activeUsers = {};
io.on("connection", function (socket) {
    //when receiving a message, relay message to other people
    console.log("USER HAS CONNECTED", socket.id);
    socket.on("send message", function (message) {
        console.log("SENDING", socket.id);
        io.emit("message", message);
    });
    //after registering a nickname, populate other user lists
    //announce user entering channel
    socket.on("new user", function (username) {
        console.log("new user " + username + " has joined. socketID: " + socket.id);
        activeUsers[socket.id] = username;
        io.emit("new user", { username: username, id: socket.id });
        io.to("" + socket.id).emit("personal info", { username: username, id: socket.id });
        io.emit("load user list", activeUsers);
        console.log(activeUsers);
    });
    socket.on("typing", function () {
        socket.broadcast.emit("typing", activeUsers[socket.id]);
    });
    socket.on("end typing", function () {
        socket.broadcast.emit("end typing", activeUsers[socket.id]);
    });
    //when disconnecting, let other users know.
    socket.on("disconnect", function (reason) {
        console.log("user disconnected: " + reason);
        //removes user from userList
        var id = socket.id;
        io.emit("user disconnected", { username: activeUsers[id], id: id });
        delete activeUsers[socket.id];
    });
});
http.listen(PORT, function () {
    console.log("listening on " + PORT);
});
