const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getFileData: () => ipcRenderer.invoke('get-file-data'),
  updateFileData: (data) => ipcRenderer.invoke('update-file-data', data),
  generatePassword: (specialChars, numbers, length) => ipcRenderer.invoke('generatePassword', specialChars, numbers, length)
});
