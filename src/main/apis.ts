import { PrismaClient } from '@prisma/client';
import { ipcMain } from 'electron';

export default function InitApis(prisma: PrismaClient) {
  ipcMain.handle('getCharacters', async () => {
    const res = await prisma.character.findMany()
    return res
    // event.reply('test', res)
  })

  ipcMain.handle(
    'createCharacter',
    async (event, name: string, comments: string, groups: number[]) => {
      const newCharacter = await prisma.character.create({
        data: {
          name,
          comments
        }
      })
      groups.forEach((id: number) => {
        prisma.groupRelation.create({
          data: {
            characterId: newCharacter.id,
            groupId: id
          }
        })
      })

      // event.reply('test2', res);
      return newCharacter
    }
  )

  ipcMain.handle(
    'updateCharacter', // new
    async (
      event,
      id: number,
      name: string,
      comments: string,
      groups: number[],
    ) => {
      await prisma.character.update({
        data: {
          name,
          comments,
        },
        where: {
          id,
        },
      });

      prisma.groupRelation.deleteMany({
        where: {
          characterId: id,
        },
      });

      groups.forEach((item: number) => {
        prisma.groupRelation.create({
          data: {
            characterId: id,
            groupId: item,
          },
        });
      });

      return true;
    },
  );

  ipcMain.handle('deleteCharacters', async (event, ids) => {
    const popItems = await prisma.character.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })
    return popItems
  })
}
