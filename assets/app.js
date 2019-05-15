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
function createUsername() {
  const usernameForm = document.getElementById("enter-username");
  socket.emit("new user", usernameForm.value);
  username = usernameForm.value;
  const formOverlay = document.querySelector(".register-username");
  formOverlay.style.display = "none";
}

//submits chat message to socket server
function handleChatSubmit() {
  const input = document.querySelector("input.text-entry");
  socket.emit("chat message", { username, message: input.value });
  input.value = "";
}

//displays message when submitted
//receiving message
socket.on("message", msg => {
  addToDiv(".display-chat", `${msg.username}: ${msg.message}`);
});

//new user has joined
socket.on("new user", user => {
  console.log("new user:" + user.username);
  const { username, id } = user;
  //display new user in userList
  // addToDiv(".display-users", username, null, id);
  //announce new user in chat
  addToDiv(".display-chat", `${username} has joined the chat.`);
  //send username/id to server
});

socket.on("load other users", activeUsers => {
  //populate other users
  document.querySelectorAll(".display-users div").forEach(user => user.remove());
  for (const userId in activeUsers) {
    // if (!document.getElementById(userId)) continue;
    addToDiv(".display-users", activeUsers[userId], null, userId);
  }
});

socket.on("generate current users", usersObj => {
  console.log(usersObj);
  const userList = document.querySelector(".display-users");
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
