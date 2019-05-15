const socket = io();
let username = "";
const forms = document.querySelectorAll("form");

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
socket.on("message", msg => {
  console.log("msg: " + msg);
  const chatbox = document.querySelector(".display-chat");
  const newDiv = document.createElement("div");
  newDiv.textContent = `${msg.username}: ${msg.message}`;
  chatbox.append(newDiv);
});

//new user
socket.on("new user", user => {
  console.log("new user:" + user.username);
  const userList = document.querySelector(".display-users");
  const newDiv = document.createElement("div");
  newDiv.textContent = user.username;
  newDiv.id = user.id;
  userList.append(newDiv);
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
  document.getElementById(id).remove();
});
