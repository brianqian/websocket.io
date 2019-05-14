const textForm = document.querySelector("form");
const socket = io();

textForm.addEventListener("submit", e => {
  e.preventDefault();
  const input = document.querySelector("input");
  socket.emit("chat message", input.value);
  input.value = "";
});
