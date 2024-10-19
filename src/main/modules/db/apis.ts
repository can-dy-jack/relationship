import { prisma } from './database'

export async function test() {
  return await prisma.collection.findMany()
}
