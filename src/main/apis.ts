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
      try {
        const newCharacter = await prisma.character.create({
          data: {
            name,
            comments,
          },
        });

        const groupsData = groups.map((id) => ({
          characterId: newCharacter.id,
          groupId: id,
        }));

        await prisma.groupRelation.createMany({
          data: groupsData,
        });

        return true;
      } catch (e) {
        // TODO LOG
        // console.warn(e);
        return new Error('新增失败👀');
      }
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
      try {
        await prisma.character.update({
          data: {
            name,
            comments,
          },
          where: {
            id,
          },
        });

        const oldRelations = await prisma.groupRelation.findMany({
          where: {
            characterId: id,
          },
        });

        const newIds = new Set(groups); // [1,4]
        const oldIds = new Set(oldRelations.map((item) => item.groupId)); // [1, 3]

        const needDeleteIds = oldRelations
          .filter((item) => !newIds.has(item.groupId))
          .map((item) => item.groupId); // [3]

        const needAddIds = groups.filter((item) => !oldIds.has(item)); // [4]

        if (needDeleteIds.length > 0) {
          await prisma.groupRelation.deleteMany({
            where: {
              groupId: {
                in: needDeleteIds,
              },
            },
          });
        }
        if (needAddIds.length > 0) {
          await prisma.groupRelation.createMany({
            data: needAddIds.map((item) => ({
              characterId: id,
              groupId: item,
            })),
          });
        }

        return true;
      } catch (e) {
        // TODO LOG
        // console.warn(e);
        return new Error('更新失败👀');
      }
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
