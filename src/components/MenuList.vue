<script lang="ts" setup>
const menus = [
  {
    title: 'home',
    icon: 'school',
    link: '/',
  },
  {
    title: '人物',
    icon: 'person',
    link: '/character',
  },
  {
    title: '分组',
    icon: 'group',
    link: '/group',
  },
];
</script>

<template>
  <q-item :to="menu.link" v-for="menu in menus" :key="menu.link" exact>
    <q-item-section v-if="menu.icon" avatar>
      <q-icon :name="menu.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ menu.title }}</q-item-label>
      <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
    </q-item-section>
  </q-item>
</template>
