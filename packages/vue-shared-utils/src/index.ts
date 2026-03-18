/**
 * `vue-shared-utils`：供 `vue-toolkit` 子包复用的共享工具方法。
 *
 * @packageDocumentation
 */
import { createApp, type App, type Component, type ComponentPublicInstance } from 'vue'

/**
 * 挂载配置。
 *
 * @public
 */
export interface MountComponentOptions {
  /** 卸载前延迟（ms），用于关闭动画 */
  unmountDelay?: number
  /** 挂载父节点，默认 document.body */
  parent?: HTMLElement
}

/**
 * 挂载结果。
 *
 * @typeParam TInstance - Vue 组件实例类型。
 * @public
 */
export interface MountComponentResult<TInstance = ComponentPublicInstance | null> {
  app: App
  instance: TInstance
  container: HTMLElement
  unmount: (onDone?: () => void) => void
}

/**
 * 将 Vue 组件挂载到独立容器，并返回卸载控制能力。
 *
 * @typeParam TInstance - 组件实例类型。
 * @param component - 待挂载组件或渲染对象。
 * @param options - 挂载选项。
 * @returns 包含 app、instance、container 与 unmount 的对象。
 * @public
 */
export function mountComponent<TInstance = ComponentPublicInstance | null>(
  component: Component | { setup: () => () => unknown },
  options: MountComponentOptions = {}
): MountComponentResult<TInstance> {
  const { unmountDelay = 0, parent = document.body } = options
  const app = createApp(component)
  const container = document.createElement('div')
  parent.appendChild(container)
  const instance = app.mount(container) as TInstance

  const doUnmount = () => {
    app.unmount()
    container.remove()
  }

  const unmount = (onDone?: () => void) => {
    const run = () => {
      doUnmount()
      onDone?.()
    }
    unmountDelay > 0 ? setTimeout(run, unmountDelay) : run()
  }

  return { app, instance, container, unmount }
}
