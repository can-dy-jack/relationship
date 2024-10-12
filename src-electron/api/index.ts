// const prisma = require('./client');
import { prisma } from './client';

export async function getCharacters() {
  const characters = await prisma.character.findMany({
    include: {
      groups: {
        include: {
          group: true,
        },
      },
    },
  });
  return characters;
}

export async function createCharacter(
  name: string,
  comments: string,
  groups: number[]
) {
  const newCharacter = await prisma.character.create({
    data: {
      name,
      comments,
    },
  });
  for (const id of groups) {
    await prisma.groupRelation.create({
      data: {
        characterId: newCharacter.id,
        groupId: id,
      },
    });
  }
}

export async function getGroups() {
  return await prisma.group.findMany();
}

export async function createGroup(name: string, comments: string) {
  return await prisma.group.create({
    data: {
      name,
      comments,
    },
  });
}
