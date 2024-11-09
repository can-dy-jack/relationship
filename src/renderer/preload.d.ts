type Character = import('@prisma/client').Character;
type Group = import('@prisma/client').Group;
type GroupRelation = import('@prisma/client').GroupRelation;

type GroupRelationInfo = GroupRelation & {
  group: Group;
};
type CharacterInfo = Character & {
  groups: GroupRelationInfo[];
};

declare global {
  interface Window {
    apis: {
      getCharacters: () => Promise<CharacterInfo[]>;
      createCharacter: (
        name: string,
        comments: string,
        groups: number[],
      ) => Promise<CharacterInfo>;
      updateCharacter: (
        id: number,
        name: string,
        comments: string,
        groups: number[],
      ) => Promise<CharacterInfo>;
      deleteCharacters: (ids: number[]) => Promise<CharacterInfo[]>;

      getGroups: () => Promise<Group[]>;
      createGroup: (name: string, comments: string) => Promise<Group>;
      updateGroup: (
        id: number,
        name: string,
        comments: string,
      ) => Promise<Group>;
      deleteGroups: (ids: number[]) => Promise<Group>;
    };
  }
}

export {};
