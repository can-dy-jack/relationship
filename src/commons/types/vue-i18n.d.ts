// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

declare module '@vue/runtime-core' {
  // 扩展全局变量的接口内容，需要扩展ComponentCustomProperties这个接口，不要乱改成别的
  interface ComponentCustomProperties {
    $t: (key, args?) => string
  }
}

declare global {
  interface Window {
    i18n: any
  }
}
