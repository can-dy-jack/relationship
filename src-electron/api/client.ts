import { is } from '@electron-toolkit/utils';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const dbPath = is.dev
  ? 'dev.db'
  : path.join(process.resourcesPath, 'database/prod.db');

// 保证只有一个实例
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
  });
