// const { contextBridge, ipcRenderer } = require('electron');
import { contextBridge, ipcRenderer } from 'electron';
import { TableSearchParams } from './type';

contextBridge.exposeInMainWorld('apis', {
  getCharacters: (searchParams: TableSearchParams) =>
    ipcRenderer.invoke('getCharacters', searchParams),
  getCharactersWithoutGroup: () =>
    ipcRenderer.invoke('getCharactersWithoutGroup'),
  // 前端： window.apis.getCharacters().then(console.log)
  createCharacter: (name: string, comments: string, groups: number[]) =>
    ipcRenderer.invoke('createCharacter', name, comments, groups),
  updateCharacter: (
    id: number,
    name: string,
    comments: string,
    groups: number[],
  ) => ipcRenderer.invoke('updateCharacter', id, name, comments, groups),
  deleteCharacters: (ids: number[]) =>
    ipcRenderer.invoke('deleteCharacters', ids),

  // 分组api
  getGroups: (searchParams: TableSearchParams) =>
    ipcRenderer.invoke('getGroups', searchParams),
  createGroup: (name: string, comments: string) =>
    ipcRenderer.invoke('createGroup', name, comments),
  updateGroup: (id: number, name: string, comments: string) =>
    ipcRenderer.invoke('updateGroup', id, name, comments),
  deleteGroups: (ids: number[]) => ipcRenderer.invoke('deleteGroups', ids),

  // 人物关系
  getRelations: (searchParams: TableSearchParams) =>
    ipcRenderer.invoke('getRelations', searchParams),
  createRelation: (
    characterId: number,
    relativeCharactorId: number,
    name: string,
  ) =>
    ipcRenderer.invoke(
      'createRelation',
      characterId,
      relativeCharactorId,
      name,
    ),
  updateRelation: (id: number, name: string) =>
    ipcRenderer.invoke('updateRelation', id, name),
  deleteRelation: (ids: number[]) => ipcRenderer.invoke('deleteRelation', ids),

  // Excel
  exportExcel: () => ipcRenderer.invoke('exportExcel'),
});
