import type { Component, VNodeChild } from 'vue'

/**
 * `vue-modal-utils` 全局配置项。
 *
 * @public
 */
export interface ModalGlobalConfig {
  /** 动画时长，支持数字（毫秒）或 CSS 时间字符串（如 `300ms`、`0.3s`）。 */
  animationDuration?: number | string
}

/**
 * `showCommonBottomPopup` 的入参。
 *
 * @public
 */
export interface ShowCommonBottomPopupOptions {
  title?: string
  message?: string
  buttonText?: string
  showClose?: boolean
  animationDuration?: number | string
}

/**
 * 多按钮模式下的按钮配置。
 *
 * @public
 */
export interface ModalButton {
  text: string
  type?: string
  key?: string
  onClick?: () => void
}

/**
 * 弹窗关闭/交互动作。
 *
 * @public
 */
export type ModalAction = 'confirm' | 'cancel' | 'overlay' | 'close' | string

/**
 * 自定义内容渲染方式。
 *
 * @public
 */
export type ModalContent = (() => VNodeChild) | { render: () => VNodeChild } | null

/**
 * `showModal` 的入参。
 *
 * @public
 */
export interface ShowModalOptions {
  position?: 'bottom' | 'center' | 'top'
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  showCancelButton?: boolean
  showClose?: boolean
  content?: ModalContent
  component?: Component | null
  componentProps?: Record<string, unknown>
  modalComponent?: Component | null
  modalComponentProps?: Record<string, unknown>
  buttons?: ModalButton[] | null
  onOpen?: () => void
  onClose?: () => void
  beforeClose?: (action: ModalAction, payload?: unknown) => Promise<boolean | void> | boolean | void
  animationDuration?: number | string
}

/**
 * `ModalRenderer` 组件的 Props。
 *
 * @public
 */
export interface ModalRendererProps {
  show?: boolean
  position?: 'bottom' | 'center' | 'top'
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  showCancelButton?: boolean
  showClose?: boolean
  content?: ModalContent
  component?: Component | null
  componentProps?: Record<string, unknown>
  modalComponent?: Component | null
  modalComponentProps?: Record<string, unknown>
  buttons?: ModalButton[] | null
}
