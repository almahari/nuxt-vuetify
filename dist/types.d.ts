
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['vuetify']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['vuetify']?: ModuleOptions }
}


export { ModuleOptions, TVuetifyOptions, default } from './module'
