// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('apis', {
  getCharacters: () => ipcRenderer.invoke('getCharacters'),
  // 前端： window.apis.getCharacters().then(console.log)
  createCharacter: (name: string, comments: string, groups: number[]) =>
    ipcRenderer.invoke('createCharacter', name, comments, groups),
  deleteCharacters: (ids: number[]) => ipcRenderer.invoke('deleteCharacters', ids)
})
