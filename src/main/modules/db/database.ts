import path from 'node:path'
import { app } from 'electron'
import { type Database, verbose } from 'sqlite3'
import fs from 'fs'
import { is } from '@electron-toolkit/utils'
import { PrismaClient } from '@prisma/client'

const DB_DIR = path.join(is.dev ? app.getAppPath() : app.getPath('userData'), 'db')
const DB_FILE = path.join(DB_DIR, 'example.db')

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

/**
 * 初始化数据库
 */
export function initDatabase() {
  // 连接到 SQLite 数据库
  const DB_INSTANCE: Database = new (verbose().Database)(DB_FILE, (err) => {
    if (err) {
      console.error('Failed to connect to the database:', err.message)
    } else {
      console.log('Connected to the SQLite database.')
    }
  })
  // 创建 下载记录 表
  const createDownloadsTableSql = `CREATE TABLE IF NOT EXISTS download_record (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thumb TEXT NOT NULL,
      url TEXT NOT NULL,
      path TEXT NOT NULL,
      status INTEGER NOT NULL,
      created_at DATETIME NOT NULL
  )`
  DB_INSTANCE.run(createDownloadsTableSql, (err) => {
    if (err) {
      console.error('Failed to create table [download_record]:', err.message)
    } else {
      console.log('Table [download_record] created successfully.')
    }
  })
  // 创建 收藏夹 表
  const createCollectionsTableSql = `CREATE TABLE IF NOT EXISTS collection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      desc TEXT NOT NULL,
      created_at DATETIME NOT NULL
  )`
  DB_INSTANCE.run(createCollectionsTableSql, (err) => {
    if (err) {
      console.error('Failed to create table [collection]:', err.message)
    } else {
      console.log('Table [collection] created successfully.')
      // 插入默认收藏夹
      DB_INSTANCE.run(
        `INSERT INTO collection (id, name, desc, created_at) VALUES (0, '默认收藏夹', '默认收藏夹', datetime('now', 'localtime'))`,
        (err) => {
          if (err) {
            console.error('Failed to insert default collection:', err.message)
          } else {
            console.log('Default collection inserted successfully.')
          }
        }
      )
    }
  })
  // 创建 收藏 表
  const createFavoritesTableSql = `CREATE TABLE IF NOT EXISTS collection_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      collection_id INTEGER NOT NULL,
      wallpaper_url TEXT NOT NULL,
      small_thumb TEXT,
      original_thumb TEXT,
      created_at DATETIME NOT NULL
  )`
  DB_INSTANCE.run(createFavoritesTableSql, (err) => {
    if (err) {
      console.error('Failed to create table [collection_item]:', err.message)
    } else {
      console.log('Table [collection_item] created successfully.')
    }
  })
  DB_INSTANCE.close()
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
// 保证只有一个实例
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: `file:${DB_FILE}`
      }
    }
  })
