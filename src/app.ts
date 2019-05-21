import "./style.scss";

let username: string = "";
let userId: string = "";
let typing: boolean = false;
let lastMsgTime: Date = new Date(1999);
const chatEntry = document.querySelector("input.text-entry");

const forms = document.querySelectorAll("form");

const addToDiv = (divClass: string, message: string, className: string, id: string) => {
  const container = document.querySelector(divClass);
  const newDiv = document.createElement("div");
  if (message !== null) newDiv.textContent = message;
  if (id && id !== null) newDiv.id = id;
  if (className && className !== null) newDiv.classList.add(className);
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

socket.on("message", ({ username, msg, id }) => {
  const chatbox = document.querySelector(".display-chat");
  const msgContainer = document.createElement("div");
  msgContainer.classList.add("display-chat__message-container");
  msgContainer.dataset.id = id;
  const messageNotRecent = dateFns.differenceInMinutes(new Date(), lastMsgTime) > 3;
  console.log(dateFns.differenceInMinutes(new Date(), lastMsgTime));
  const allMsg = [...document.querySelectorAll(".display-chat__message-container")];
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
socket.on("new user", user => {
  addToDiv(".display-chat", `${user.username} has joined the chat.`);
});

socket.on("personal info", info => {
  userId = info.id;
  username = info.username;
});

socket.on("load user list", activeUsers => {
  //populate other users
  document.querySelectorAll(".userlist div").forEach(user => user.remove());
  for (const userId in activeUsers) {
    addToDiv(".userlist", activeUsers[userId], "userlist__name", userId);
  }
});

socket.on("user disconnected", id => {
  //removes user from userList
  document.getElementById(id).remove();
  //announces left the chat
  addToDiv(".display-chat", `${username} has left the chat`);
});
