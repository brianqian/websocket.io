"use strict";
exports.__esModule = true;
require("./style.scss");
var date_fns_1 = require("date-fns");
var io = require("socket.io-client");
var username = "";
var userId = "";
var typing = false;
var lastMsgTime = new Date(1999);
var chatEntry = document.querySelector("input.text-entry");
var socket = io("http://localhost");
var forms = document.querySelectorAll("form");
var addToDiv = function (divClass, message, className, id) {
    var container = document.querySelector(divClass);
    var newDiv = document.createElement("div");
    if (message !== null)
        newDiv.textContent = message;
    if (id && id !== null)
        newDiv.id = id;
    if (className && className !== null)
        newDiv.classList.add(className);
    container.append(newDiv);
};
forms.forEach(function (form) {
    return form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (e.target.classList.contains("text-entry"))
            handleChatSubmit();
        if (e.target.classList.contains("username-form"))
            createUsername();
    });
});
/***********************
 * CREATE NEW USER
 ***********************/
//creates username
var createUsername = function () {
    var usernameForm = document.getElementById("enter-username");
    socket.emit("new user", usernameForm.value);
    username = usernameForm.value;
    var formOverlay = document.querySelector(".register-username");
    formOverlay.style.display = "none";
    //shows username in statusbar
    addToDiv(".status-bar", "Signed in as " + username, null, "statusbar__current-user");
    document.getElementById("statusbar__current-user").style.cssText =
        "justify-self: flex-end; width: 200px";
    chatEntry.setAttribute("placeholder", username + ": ");
};
/***************
 * SEND MESSAGE
 **************/
chatEntry.addEventListener("keyup", function () {
    var currentlyTyping = chatEntry.value.length > 0;
    if (currentlyTyping && typing)
        return;
    typing = currentlyTyping;
    socket.emit(typing ? "typing" : "end typing");
});
chatEntry.onblur = function () { return chatEntry.setAttribute("placeholder", username + ": "); };
chatEntry.onfocus = function () { return chatEntry.setAttribute("placeholder", ""); };
//submits chat message to socket server
var handleChatSubmit = function () {
    socket.emit("send message", { username: username, msg: chatEntry.value, id: userId });
    chatEntry.value = "";
};
/**********************
 * SOCKET LISTENERS
 **********************/
//RECEIVE CHAT MESSAGE - DISPLAY
socket.on("message", function (_a) {
    var username = _a.username, msg = _a.msg, id = _a.id;
    var chatbox = document.querySelector(".display-chat");
    var msgContainer = document.createElement("div");
    msgContainer.classList.add("display-chat__message-container");
    msgContainer.dataset.id = id;
    var messageNotRecent = date_fns_1.differenceInMinutes(new Date(), lastMsgTime) > 3;
    console.log(date_fns_1.differenceInMinutes(new Date(), lastMsgTime));
    var allMsg = Array.from(document.querySelectorAll(".display-chat__message-container"));
    var notMostRecentSender = allMsg.length && allMsg[allMsg.length - 1].dataset.id !== id;
    console.log(messageNotRecent, notMostRecentSender, !messageNotRecent && notMostRecentSender);
    // if (notMostRecentSender && messageNotRecent) {
    var author = document.createElement("div");
    author.classList.add("display-chat__message-author");
    author.textContent = username;
    msgContainer.append(author);
    msgContainer.style.marginTop = "1rem";
    // }
    var message = document.createElement("div");
    message.classList.add("display-chat__message-content");
    message.textContent = msg;
    lastMsgTime = new Date();
    msgContainer.append(message);
    chatbox.append(msgContainer);
});
//NEW USER HAS JOINED
socket.on("new user", function (user) {
    addToDiv(".display-chat", user.username + " has joined the chat.");
});
socket.on("personal info", function (user) {
    userId = user.id;
    username = user.username;
});
socket.on("load user list", function (activeUsers) {
    //populate other users
    document.querySelectorAll(".userlist div").forEach(function (user) { return user.remove(); });
    for (var id in activeUsers) {
        addToDiv(".userlist", activeUsers[id], "userlist__name", id);
    }
});
socket.on("user disconnected", function (id) {
    //removes user from userList
    document.getElementById(id).remove();
    //announces left the chat
    addToDiv(".display-chat", username + " has left the chat");
});
