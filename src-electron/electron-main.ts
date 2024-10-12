import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import { getCharacters, createCharacter, getGroups, createGroup } from './api';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});

/**
 * apis
 */
ipcMain.handle('getCharacters', async () => {
  return await getCharacters();
});

ipcMain.handle(
  'createCharacter',
  async (e, name: string, comments: string, groups: number[]) => {
    try {
      await createCharacter(name, comments, groups);
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }
);
ipcMain.handle('getGroups', async () => {
  return await getGroups();
});

ipcMain.handle('createGroup', async (e, name: string, comments: string) => {
  try {
    await createGroup(name, comments);
    return true;
  } catch (e) {
    console.warn(e);
    return false;
  }
});
