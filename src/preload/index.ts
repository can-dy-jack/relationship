import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('i18n', {
      t: (key: string, options?: any) => {
        return ipcRenderer.sendSync('i18n:t', key, options)
      },
      changeLanguage: (lang: string) => {
        return ipcRenderer.sendSync('i18n:changeLanguage', lang)
      },
      language: ipcRenderer.sendSync('i18n:language')
    })
    contextBridge.exposeInMainWorld('apis', {
      // apis.test()
      test: () => ipcRenderer.sendSync('apis:test')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.i18n = {
    t: (key: string, options?: any) => ipcRenderer.sendSync('i18n:t', key, options),
    changeLanguage: (lang: string) => ipcRenderer.sendSync('i18n:changeLanguage', lang),
    languages: ipcRenderer.sendSync('i18n:language')
  }
}
