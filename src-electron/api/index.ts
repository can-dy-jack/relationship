import { prisma } from './client';

export async function getCharacters() {
  return await prisma.character.findMany({
    include: {
      groups: {
        include: {
          group: true
        }
      }
    }
  });
}

export async function createCharater(name: string, comments: string, groups: number[]) {
  const newCharacter = await prisma.character.create({
    data: {
      name,
      comments
    }
  });
  for (const group of groups) {
    await prisma.groupRelation.create({
      data: {
        characterId: newCharacter.id,
        groupId: group
      }
    });
  }
  return true;
}
