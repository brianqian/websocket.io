import "./style.scss";

const socket = io();
let username = "";
let userId = "";

const forms = document.querySelectorAll("form");

const addToDiv = (divClass, message, className, id) => {
  const container = document.querySelector(divClass);
  const newDiv = document.createElement("div");
  newDiv.textContent = message;
  if (id) newDiv.id = id;
  if (className) newDiv.classList.add(className);
  container.append(newDiv);
};

forms.forEach(form =>
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (e.target.classList.contains("text-entry")) handleChatSubmit();
    if (e.target.classList.contains("username-form")) createUsername();
  })
);

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
};

const chatEntry = document.querySelector("input.text-entry");
chatEntry.addEventListener("keydown", () => {
  socket.emit(chatEntry.value.length > 0 ? "typing" : "end typing");
});

//submits chat message to socket server
const handleChatSubmit = () => {
  socket.emit("chat message", { username, message: chatEntry.value });
  chatEntry.value = "";
};

//displays message when submitted
//receiving message
socket.on("message", msg => {
  addToDiv(".display-chat", `${msg.username}: ${msg.message}`);
});

//new user has joined
socket.on("new user", user => {
  const { username, id } = user;
  //display new user in userList
  // addToDiv(".display-users", username, null, id);
  //announce new user in chat
  addToDiv(".display-chat", `${username} has joined the chat.`);
  //send username/id to server
});

socket.on("load user list", activeUsers => {
  //populate other users
  document.querySelectorAll(".userlist div").forEach(user => user.remove());
  for (const userId in activeUsers) {
    // if (!document.getElementById(userId)) continue;
    addToDiv(".userlist", activeUsers[userId], "userlist__name", userId);
  }
});

socket.on("generate current users", usersObj => {
  const userList = document.querySelector(".userlist");
  for (const user in usersObj) {
    const newDiv = document.createElement("div");
    newDiv.id = user.id;
    newDiv.textContent = user.username;
    userList.append(newDiv);
  }
});

socket.on("user disconnected", id => {
  //removes user from userList
  document.getElementById(id).remove();
  //announces left the chat
  addToDiv(".display-chat", `${username} has left the chat`);
});
