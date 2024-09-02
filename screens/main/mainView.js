const updateButton = document.getElementById("updateButton");
const messageDiv = document.getElementById("message");
const progressDiv = document.getElementById("progress");

window.bridge.updateMessage((event, message) => {
  console.log("Message received in renderer:", message);
  messageDiv.textContent = message;
});
window.bridge.enableUpdateButton(() => {
  updateButton.disabled = false;
});
window.bridge.downloadProgress((percent) => {
  progressDiv.textContent = `Download Progress: ${percent}%`;
});

updateButton.addEventListener("click", () => {
  window.bridge.startUpdate();
  updateButton.disabled = true;
  messageDiv.textContent = "Downloading update...";
});