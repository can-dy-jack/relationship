import { ipcMain } from 'electron'
import { test } from './apis'

export default function initApis() {
  ipcMain.on(`apis:test`, async (event) => {
    console.log(1, event)
    event.returnValue = await test()
  })
}
