import { PrismaClient } from '@prisma/client';
import { ipcMain } from 'electron';

export default function InitApis(prisma: PrismaClient) {
  ipcMain.handle('getCharacters', async () => {
    const res = await prisma.character.findMany({
      include: {
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
    return res;
    // event.reply('test', res)
  });

  ipcMain.handle(
    'createCharacter',
    async (event, name: string, comments: string, groups: number[]) => {
      const newCharacter = await prisma.character.create({
        data: {
          name,
          comments,
        },
      });
      groups.forEach((id: number) => { // TODO fail
        prisma.groupRelation.create({
          data: {
            characterId: newCharacter.id,
            groupId: id,
          },
        });
      });

      // event.reply('test2', res);
      return newCharacter;
    },
  );

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
          in: ids,
        },
      },
    });
    return popItems;
  });

  // 分组
  ipcMain.handle('getGroups', async () => {
    const res = await prisma.group.findMany();
    return res;
  });
  ipcMain.handle(
    'createGroup',
    async (event, name: string, comments: string) => {
      const newGroup = await prisma.group.create({
        data: {
          name,
          comments,
        },
      });
      return newGroup;
    },
  );

  ipcMain.handle(
    'updateGroup',
    async (event, id: number, name: string, comments: string) => {
      await prisma.group.update({
        data: {
          name,
          comments,
        },
        where: {
          id,
        },
      });
      return true;
    },
  );

  ipcMain.handle('deleteGroups', async (event, ids) => {
    const popItems = await prisma.group.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return popItems;
  });
}
