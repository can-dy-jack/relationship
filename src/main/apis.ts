import { PrismaClient } from '@prisma/client';
import { ipcMain } from 'electron';
import { TableSearchParams } from './type';
import { exportExcel } from './util';

export default function InitApis(prisma: PrismaClient) {
  ipcMain.handle(
    'getCharacters',
    async (e, searchParams: TableSearchParams) => {
      const { pagination, sortOrder, sortField, searchStr } = searchParams;
      const { current, pageSize } = pagination || {};

      const sql: any = {
        include: {
          groups: {
            include: {
              group: true,
            },
          },
        },
      };

      // 分页
      if (pagination && current !== undefined && pageSize !== undefined) {
        sql.skip = (current - 1) * pageSize;
        sql.take = pageSize;
      }

      // 过滤
      if (searchStr) {
        sql.where = {
          OR: [
            {
              name: {
                contains: searchStr,
              },
            },
            {
              comments: {
                contains: searchStr,
              },
            },
          ],
        };
      }

      // 排序
      if (sortField && sortOrder) {
        sql.orderBy = [
          {
            [sortField]: sortOrder === 'ascend' ? 'asc' : 'desc',
          },
        ];
      }

      const data = await prisma.character.findMany(sql);
      const total = await prisma.character.count();

      return {
        total,
        data,
      };
    },
  );

  ipcMain.handle('getCharactersWithoutGroup', async () => {
    const res = await prisma.character.findMany();
    return res;
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
  ipcMain.handle('getGroups', async (e, searchParams: TableSearchParams) => {
    const { pagination, sortOrder, sortField, searchStr } = searchParams;
    const { current, pageSize } = pagination || {};

    const sql: any = {};

    // 分页
    if (pagination && current !== undefined && pageSize !== undefined) {
      sql.skip = (current - 1) * pageSize;
      sql.take = pageSize;
    }

    // 过滤
    if (searchStr) {
      sql.where = {
        OR: [
          {
            name: {
              contains: searchStr,
            },
          },
          {
            comments: {
              contains: searchStr,
            },
          },
        ],
      };
    }

    // 排序
    if (sortField && sortOrder) {
      sql.orderBy = [
        {
          [sortField]: sortOrder === 'ascend' ? 'asc' : 'desc',
        },
      ];
    }

    const data = await prisma.group.findMany(sql);
    const total = await prisma.group.count();

    return {
      total,
      data,
    };
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

  // 关系
  ipcMain.handle('getRelations', async (e, searchParams: TableSearchParams) => {
    const { pagination, sortOrder, sortField, searchStr } = searchParams;
    const { current, pageSize } = pagination || {};

    const sql: any = {
      include: {
        character: true,
        relativeCharactor: true,
      },
    };

    // 分页
    if (pagination && current !== undefined && pageSize !== undefined) {
      sql.skip = (current - 1) * pageSize;
      sql.take = pageSize;
    }

    // 过滤
    if (searchStr) {
      sql.where = {
        relationName: {
          contains: searchStr,
        },
      };
    }

    // 排序
    if (sortField && sortOrder) {
      sql.orderBy = [
        {
          relationName: sortOrder === 'ascend' ? 'asc' : 'desc',
        },
      ];
    }

    const data = await prisma.relationship.findMany(sql);
    const total = await prisma.relationship.count();

    return {
      total,
      data,
    };
  });

  ipcMain.handle(
    'createRelation',
    async (
      e,
      characterId: number,
      relativeCharactorId: number,
      name: string,
    ) => {
      const res = await prisma.relationship.create({
        data: {
          characterId,
          relativeCharactorId,
          relationName: name,
        },
      });
      return res;
    },
  );

  ipcMain.handle('updateRelation', async (e, id: number, name: string) => {
    const res = await prisma.relationship.update({
      data: {
        relationName: name,
      },
      where: {
        id,
      },
    });
    return res;
  });

  ipcMain.handle('deleteRelation', async (e, ids: number[]) => {
    const res = await prisma.relationship.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return res;
  });

  ipcMain.handle('exportExcel', async () => {
    const characters = await prisma.character.findMany({});
    const groups = await prisma.group.findMany({});
    const groupRelations = await prisma.groupRelation.findMany({});
    const relationships = await prisma.relationship.findMany({});
    return exportExcel({
      人物列表: characters,
      分组列表: groups,
      人物分组列表: groupRelations,
      人物关系列表: relationships,
    });
  });
}
