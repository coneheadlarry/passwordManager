const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Function to generate a password based on given criteria
function generatePassword(specialChars, numbers, length) {
  const specialCharSet = '!@#$%^&*()_+[]{}|;:,.<>?';
  const numberSet = '0123456789';
  const letterSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let charset = letterSet;
  if (parseInt(specialChars) > 0) charset += specialCharSet;
  if (parseInt(numbers) > 0) charset += numberSet;

  let password = '';
  for (let i = 0; i < parseInt(length); i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

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

// IPC handlers
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

// Add the generatePassword handler
ipcMain.handle('generatePassword', async (event, specialChars, numbers, length) => {
  try {
    const password = generatePassword(specialChars, numbers, length);
    return password;
  } catch (err) {
    console.error('Error generating password:', err);
    return 'Error';
  }
});
