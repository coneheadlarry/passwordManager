const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { ipcMain } = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');

  // Check if the file exists
  const firstOpenPath = path.join(__dirname, 'firstOpen.txt');
  fs.access(firstOpenPath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create it
      fs.writeFile(firstOpenPath, 'True', (err) => {
        if (err) console.error('Error creating file:', err);
      });
    } else {
      // File exists, read it
      fs.readFile(firstOpenPath, 'utf8', (err, data) => {
        if (err) console.error('Error reading file:', err);
        if (data.trim() === 'True') {
          mainWindow.webContents.send('show-dialog', true);
        }
      });
    }
  });

  // Create JSON file to track generation history
  const generationHistoryPath = path.join(__dirname, 'generationHistory.json');
  fs.access(generationHistoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist, create it
      fs.writeFile(generationHistoryPath, '[]', (err) => {
        if (err) console.error('Error creating file:', err);
      });
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Delete generationHistory.json when all windows are closed
  const generationHistoryPath = path.join(__dirname, 'generationHistory.json');
  fs.unlink(generationHistoryPath, (err) => {
    if (err) {
      console.error('Error deleting generationHistory.json:', err);
    } else {
      console.log('generationHistory.json deleted successfully.');
    }
  });

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// need for communcation between main and renderer process
ipcMain.handle('get-file-data', async () => {
  const firstOpenPath = path.join(__dirname, 'firstOpen.txt');
  try {
    const data = await fs.promises.readFile(firstOpenPath, 'utf8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
    return 'Error';
  }
});

ipcMain.handle('update-file-data', async (event, data) => {
  const firstOpenPath = path.join(__dirname, 'firstOpen.txt');
  try {
    await fs.promises.writeFile(firstOpenPath, data);
  } catch (err) {
    console.error('Error updating file:', err);
  }
});
