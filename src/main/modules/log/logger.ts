import log from 'electron-log'
import path from 'path'
import { app } from 'electron'

export function loggerInit() {
  // 配置 log
  log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs/example.log')
  // 设置日志文件的最大大小为 2 MB
  log.transports.file.maxSize = 2 * 1024 * 1024
  // 绑定 console 事件
  console.log = log.log.bind(log)
  console.error = log.error.bind(log)
  console.warn = log.warn.bind(log)
  console.info = log.info.bind(log)
  console.debug = log.debug.bind(log)
  log.info('Logger initialized')
}
