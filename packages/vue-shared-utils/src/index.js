/**
 * vue-shared-utils
 * 供 vue-toolkit 各子包复用的共享工具方法
 */
import { createApp } from 'vue'

/**
 * 将 Vue 组件挂载到 body 下的独立容器，返回实例与卸载方法
 * @param {import('vue').Component | Object} component - Vue 组件或 { setup: () => render }
 * @param {Object} [options]
 * @param {number} [options.unmountDelay=0] - 卸载前延迟（ms），用于关闭动画
 * @param {HTMLElement} [options.parent=document.body] - 挂载父节点
 * @returns {{ app: import('vue').App, instance: any, container: HTMLElement, unmount: (onDone?: () => void) => void }}
 */
export function mountComponent(component, options = {}) {
  const { unmountDelay = 0, parent = document.body } = options
  const app = createApp(component)
  const container = document.createElement('div')
  parent.appendChild(container)
  const instance = app.mount(container)

  const doUnmount = () => {
    app.unmount()
    container.remove()
  }

  const unmount = (onDone) => {
    const run = () => {
      doUnmount()
      onDone?.()
    }
    unmountDelay > 0 ? setTimeout(run, unmountDelay) : run()
  }

  return { app, instance, container, unmount }
}
