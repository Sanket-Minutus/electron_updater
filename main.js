const { app, BrowserWindow, ipcMain, ipcRenderer ,Notification } = require("electron");
const MainScreen = require("./screens/main/mainScreen");
const Globals = require("./globals");
const { autoUpdater, AppUpdater } = require("electron-updater");

let curWindow;

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  curWindow = new MainScreen();
  curWindow.window.webContents.on("did-finish-load", () => {
    console.log("Sending version message to renderer");
    curWindow.window.webContents.send(
      "updateMessage",
      `Checking for updates. Current version ${app.getVersion()}`
    );
    autoUpdater.checkForUpdates();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });

});
// Function to send a native notification
function showNotification (title, body) {
  new Notification({ title, body }).show();
}
autoUpdater.on("update-available", () => {
  curWindow.window.webContents.send("updateMessage", "Update available! Click 'Update' to download.");
   // Send notification about the update
  showNotification("Update Available", "A new update is available! Click 'Update' to download.");
  curWindow.window.webContents.send("enableUpdateButton");
});

autoUpdater.on("update-not-available", () => {
  console.log("Sending version message to renderer for not available")
  curWindow.window.webContents.send("updateMessage", `No update available. Current version ${app.getVersion()}`);
});

autoUpdater.on("update-downloaded", () => {
  curWindow.window.webContents.send("updateMessage", "Update downloaded. Restarting to install...");
  showNotification("Update Downloaded", "The update has been downloaded. The app will restart to install.");
  // Automatically quit the app and install the update
  autoUpdater.quitAndInstall(); // This will quit the app and install the update
});
// **NEW** Listen to download progress and send to renderer
autoUpdater.on("download-progress", (progressObj) => {
  let percent = progressObj.percent.toFixed(2); // Get the percentage
  curWindow.window.webContents.send("downloadProgress", percent); // Send percentage to renderer
  console.log(`Download progress: ${percent}%`);
});

ipcMain.on("startUpdate", () => {
  autoUpdater.downloadUpdate();
});

autoUpdater.on("error", (info) => {
  curWindow.window.webContents.send("updateMessage", `Error: ${err.message}`);
});




//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});