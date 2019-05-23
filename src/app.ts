import "./style.scss";
import { differenceInMinutes } from "date-fns";
import * as io from "socket.io-client";
let username: string = "";
let userId: string = "";
let typing: boolean = false;
let lastMsgTime: Date = new Date(1999);
const chatEntry: HTMLInputElement = document.querySelector("input.text-entry");
const socket = io("http://localhost:3000");

const forms = document.querySelectorAll("form");

const addToDiv = (divClass: string, message: string, className?: string[], id?: string) => {
  const container = document.querySelector(divClass);
  const newDiv = document.createElement("div");
  if (message !== null) newDiv.textContent = message;
  if (id && id !== null) newDiv.id = id;
  if (className && className !== null) newDiv.classList.add(...className);
  container.append(newDiv);
};

forms.forEach(form =>
  form.addEventListener("submit", e => {
    e.preventDefault();
    if ((<HTMLElement>e.target).classList.contains("text-entry")) handleChatSubmit();
    if ((<HTMLElement>e.target).classList.contains("username-form")) createUsername();
  })
);

/***********************
 * CREATE NEW USER
 ***********************/

//creates username
const createUsername = () => {
  const usernameForm = <HTMLInputElement>document.getElementById("enter-username");
  socket.emit("new user", usernameForm.value);
  username = usernameForm.value;
  const formOverlay: HTMLElement = document.querySelector(".register-username");
  formOverlay.style.display = "none";
  //shows username in statusbar
  addToDiv(".status-bar", `Signed in as ${username}`, ["statusbar__current-user"]);
  chatEntry.setAttribute("placeholder", `${username}: `);
};

/***************
 * SEND MESSAGE
 **************/
chatEntry.addEventListener("keyup", () => {
  const currentlyTyping: boolean = chatEntry.value.length > 0;
  if (currentlyTyping && typing) return;
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

socket.on("message", ({ username, msg, id }: Message) => {
  const chatbox = document.querySelector(".display-chat");
  const msgContainer = document.createElement("div");
  msgContainer.classList.add("display-chat__message-container");
  msgContainer.dataset.id = id;
  const messageNotRecent: boolean = differenceInMinutes(new Date(), lastMsgTime) > 3;
  const allMsg: any[] = Array.from(document.querySelectorAll(".display-chat__message-container"));
  const notMostRecentSender: boolean = allMsg.length && allMsg[allMsg.length - 1].dataset.id !== id;
  // console.log(messageNotRecent, notMostRecentSender, messageNotRecent || notMostRecentSender);
  if (notMostRecentSender || messageNotRecent) {
    const author = document.createElement("div");
    author.classList.add("display-chat__message-author");
    author.textContent = username;
    msgContainer.append(author);
    msgContainer.style.marginTop = "1rem";
  }
  const message = document.createElement("div");
  message.classList.add("display-chat__message-content");
  message.textContent = msg;
  lastMsgTime = new Date();

  msgContainer.append(message);
  chatbox.append(msgContainer);
});

//NEW USER HAS JOINED
socket.on("new user", (user: User) => {
  addToDiv(".display-chat", `${user.username} has joined the chat.`, [
    "display-chat__status",
    "display-chat__status-enter",
  ]);
});

socket.on("personal info", (user: User) => {
  userId = user.id;
  username = user.username;
});

socket.on("load user list", (activeUsers: User) => {
  //populate other users
  document.querySelectorAll(".userlist div").forEach(user => user.remove());
  for (const id in activeUsers) {
    addToDiv(".userlist", activeUsers[id], ["userlist__name"], id);
  }
});

socket.on("user disconnected", (id: string) => {
  //removes user from userList
  document.getElementById(id).remove();
  //announces left the chat
  addToDiv(".display-chat", `${username} has left the chat`, [
    "display-chat__status",
    "display-chat__status-exit",
  ]);
});

interface User {
  username: string;
  id?: string;
  [id: string]: string;
}

interface Message extends User {
  msg: string;
}
