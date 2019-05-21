"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./style.scss");
const date_fns_1 = require("date-fns");
const io = require("socket.io-client");
let username = "";
let userId = "";
let typing = false;
let lastMsgTime = new Date(1999);
const chatEntry = document.querySelector("input.text-entry");
const socket = io("http://localhost:3000");
const forms = document.querySelectorAll("form");
const addToDiv = (divClass, message, className, id) => {
    const container = document.querySelector(divClass);
    const newDiv = document.createElement("div");
    if (message !== null)
        newDiv.textContent = message;
    if (id && id !== null)
        newDiv.id = id;
    if (className && className !== null)
        newDiv.classList.add(className);
    container.append(newDiv);
};
forms.forEach(form => form.addEventListener("submit", e => {
    e.preventDefault();
    if (e.target.classList.contains("text-entry"))
        handleChatSubmit();
    if (e.target.classList.contains("username-form"))
        createUsername();
}));
/***********************
 * CREATE NEW USER
 ***********************/
//creates username
const createUsername = () => {
    const usernameForm = document.getElementById("enter-username");
    socket.emit("new user", usernameForm.value);
    username = usernameForm.value;
    const formOverlay = document.querySelector(".register-username");
    formOverlay.style.display = "none";
    //shows username in statusbar
    addToDiv(".status-bar", `Signed in as ${username}`, null, "statusbar__current-user");
    document.getElementById("statusbar__current-user").style.cssText =
        "justify-self: flex-end; width: 200px";
    chatEntry.setAttribute("placeholder", `${username}: `);
};
/***************
 * SEND MESSAGE
 **************/
chatEntry.addEventListener("keyup", () => {
    const currentlyTyping = chatEntry.value.length > 0;
    if (currentlyTyping && typing)
        return;
    typing = currentlyTyping;
    socket.emit(typing ? "typing" : "end typing");
});
chatEntry.onblur = () => chatEntry.setAttribute("placeholder", `${username}: `);
chatEntry.onfocus = () => chatEntry.setAttribute("placeholder", ``);
//submits chat message to socket server
const handleChatSubmit = () => {
    socket.emit("send message", { username, msg: chatEntry.value, id: userId });
    chatEntry.value = "";
};
/**********************
 * SOCKET LISTENERS
 **********************/
//RECEIVE CHAT MESSAGE - DISPLAY
socket.on("message", ({ username, msg, id }) => {
    const chatbox = document.querySelector(".display-chat");
    const msgContainer = document.createElement("div");
    msgContainer.classList.add("display-chat__message-container");
    msgContainer.dataset.id = id;
    const messageNotRecent = date_fns_1.differenceInMinutes(new Date(), lastMsgTime) > 3;
    console.log(date_fns_1.differenceInMinutes(new Date(), lastMsgTime));
    const allMsg = Array.from(document.querySelectorAll(".display-chat__message-container"));
    const notMostRecentSender = allMsg.length && allMsg[allMsg.length - 1].dataset.id !== id;
    console.log(messageNotRecent, notMostRecentSender, !messageNotRecent && notMostRecentSender);
    // if (notMostRecentSender && messageNotRecent) {
    const author = document.createElement("div");
    author.classList.add("display-chat__message-author");
    author.textContent = username;
    msgContainer.append(author);
    msgContainer.style.marginTop = "1rem";
    // }
    const message = document.createElement("div");
    message.classList.add("display-chat__message-content");
    message.textContent = msg;
    lastMsgTime = new Date();
    msgContainer.append(message);
    chatbox.append(msgContainer);
});
//NEW USER HAS JOINED
socket.on("new user", (user) => {
    addToDiv(".display-chat", `${user.username} has joined the chat.`);
});
socket.on("personal info", (user) => {
    userId = user.id;
    username = user.username;
});
socket.on("load user list", (activeUsers) => {
    //populate other users
    document.querySelectorAll(".userlist div").forEach(user => user.remove());
    for (const id in activeUsers) {
        addToDiv(".userlist", activeUsers[id], "userlist__name", id);
    }
});
socket.on("user disconnected", (id) => {
    //removes user from userList
    document.getElementById(id).remove();
    //announces left the chat
    addToDiv(".display-chat", `${username} has left the chat`);
});
//# sourceMappingURL=app.js.map