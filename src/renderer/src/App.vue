<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">{{ $t('app.appName') }}</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <n-select v-model:value="lang" :options="options" @update:value="handleChangeLang" />
  <Versions />
</template>

<script setup lang="ts">
import Versions from './components/Versions.vue'
import { ref } from 'vue'

const lang = ref(window.i18n.language)
const options = [
  { label: '中文', value: 'zh-cn' },
  { label: '英文', value: 'en' }
]

const handleChangeLang = (newLng: string) => {
  console.log('handleChangeLang', window.i18n.changeLanguage(newLng))
}
</script>
