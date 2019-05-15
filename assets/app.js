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

socket.on("new user", username => {
  console.log("new user:" + username);
  const userList = document.querySelector(".display-users");
  const newDiv = document.createElement("div");
  newDiv.textContent = username;
  userList.append(newDiv);
});

socket.on("disconnect", () => {
  socket.emit("disconnect", "test");
});
