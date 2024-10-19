import path from 'path'
import i18next from 'i18next'
import NodeFsBackend from 'i18next-node-fs-backend'
import LanguageDetector from 'i18next-electron-language-detector'
import { is } from '@electron-toolkit/utils'
import { app, ipcMain } from 'electron'

i18next
  .use(LanguageDetector)
  .use(NodeFsBackend)
  .init({
    debug: is.dev,
    lowerCaseLng: true,
    load: 'all',
    lng: app.getLocale(),
    fallbackLng: ['zh-CN'],
    ns: ['common'],
    fallbackNS: 'common',
    backend: {
      loadPath: path.join(
        is.dev
          ? app.getAppPath() + '/resources'
          : process.resourcesPath + '/app.asar.unpacked/resources',
        '/locales/{{lng}}/{{ns}}.json'
      ),
      jsonIndent: 2
    }
  })

ipcMain.on('i18n:changeLanguage', (event, lng) => {
  i18next.changeLanguage(lng).then(() => {
    event.returnValue = i18next.language.toLocaleLowerCase()
  })
})

ipcMain.on('i18n:language', (event) => {
  event.returnValue = i18next.language.toLocaleLowerCase()
  // return i18next.language
})

ipcMain.on('i18n:t', (event, key, options?) => {
  const tr = i18next.t(key, options)
  event.returnValue = tr
  // return i18next.t(key, options)
})
export default i18next
