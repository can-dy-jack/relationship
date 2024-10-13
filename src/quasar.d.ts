/* eslint-disable */

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-vite" />

type Character = import('@prisma/client').Character;
type Group = import('@prisma/client').Group;
type GroupRelation = import('@prisma/client').GroupRelation;

type GroupRelationInfo = GroupRelation & {
  group: Group;
};
type CharacterInfo = Character & {
  groups: GroupRelationInfo[];
};

declare const apis: {
  getCharacters: () => Promise<CharacterInfo[]>;
  createCharacter: (
    name: string,
    comments: string,
    groups: string[]
  ) => Promise<Boolean>;
  // getGroups: () => Promise<Group[]>;
  // createGroup: (name: string, comments: string) => Promise<Boolean>;
};

