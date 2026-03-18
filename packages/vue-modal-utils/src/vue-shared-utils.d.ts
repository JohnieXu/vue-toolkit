declare module 'vue-shared-utils' {
  import type { App, Component, ComponentPublicInstance } from 'vue'

  export interface MountComponentOptions {
    unmountDelay?: number
    parent?: HTMLElement
  }

  export interface MountComponentResult<TInstance = ComponentPublicInstance | null> {
    app: App
    instance: TInstance
    container: HTMLElement
    unmount: (onDone?: () => void) => void
  }

  export function mountComponent<TInstance = ComponentPublicInstance | null>(
    component: Component | { setup: () => () => unknown },
    options?: MountComponentOptions
  ): MountComponentResult<TInstance>
}
