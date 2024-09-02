const { contextBridge, ipcRenderer } = require("electron");

let bridge = {
  updateMessage: (callback) => ipcRenderer.on("updateMessage", (event, message) => {
    console.log("Message received in preload:", message);
    callback(event, message);  // Pass the message to the callback
  }),
    enableUpdateButton: (callback) => ipcRenderer.on("enableUpdateButton", callback),
    startUpdate: () => ipcRenderer.send("startUpdate"),
    // Listens for download progress and passes the percentage to the callback
  downloadProgress: (callback) => ipcRenderer.on("downloadProgress", (event, percent) => {
    callback(percent);  // Pass the progress percentage to the callback
  }),
  };
  
  contextBridge.exposeInMainWorld("bridge", bridge);