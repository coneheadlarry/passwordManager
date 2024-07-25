const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getFileData: () => ipcRenderer.invoke('get-file-data'),
  updateFileData: (data) => ipcRenderer.invoke('update-file-data', data)
});
