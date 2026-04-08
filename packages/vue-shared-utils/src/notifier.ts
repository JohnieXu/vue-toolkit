/**
 * 通知函数附加选项。
 *
 * @public
 */
export interface NotifyOptions {
  /** 是否输出调试日志；默认使用全局配置 */
  enableConsoleLog?: boolean
  [key: string]: unknown
}

/**
 * 通知器运行时配置。
 *
 * @public
 */
export interface NotifierConfig {
  /** 默认是否打印日志 */
  enableConsoleLog: boolean
  /** 日志前缀 */
  logPrefix: string
}

/**
 * 创建通知器时的配置。
 *
 * @public
 */
export interface CreateNotifierOptions extends Partial<NotifierConfig> {
  /**
   * 日志消息提取器。
   *
   * 默认行为：
   * - string 入参直接使用
   * - 对象入参优先读取 `message` 字段
   */
  resolveLogMessage?: (payload: unknown, options: NotifyOptions) => string
  /** 自定义日志输出器，默认 `console.log` */
  logger?: (...args: unknown[]) => void
}

/**
 * 真实通知分发器（例如 Vant 的 `showToast`）。
 *
 * @public
 */
export type NotifierDispatch<TResult = unknown> = (
  payload: unknown,
  options?: NotifyOptions
) => TResult

/**
 * 通知器实例。
 *
 * @public
 */
export interface Notifier<TResult = unknown> {
  notify: (payload: unknown, options?: NotifyOptions) => TResult
  setConfig: (partialConfig?: Partial<NotifierConfig>) => void
  getConfig: () => NotifierConfig
}

const defaultResolveLogMessage = (payload: unknown, options: NotifyOptions) => {
  if (typeof payload === 'string') return payload
  if (payload && typeof payload === 'object' && typeof (payload as { message?: string }).message === 'string') {
    return (payload as { message: string }).message
  }
  if (typeof options.message === 'string') return options.message
  return ''
}

/**
 * 创建一个“通知 + 可选日志”的统一封装。
 *
 * @param dispatch - 实际通知实现。
 * @param options - 初始化配置。
 * @returns 通知器实例。
 * @public
 */
export function createNotifier<TResult = unknown>(
  dispatch: NotifierDispatch<TResult>,
  options: CreateNotifierOptions = {}
): Notifier<TResult> {
  const runtimeConfig: NotifierConfig = {
    enableConsoleLog: options.enableConsoleLog ?? true,
    logPrefix: options.logPrefix ?? '[notifier]',
  }
  const resolveLogMessage = options.resolveLogMessage ?? defaultResolveLogMessage
  const logger = options.logger ?? console.log

  const setConfig = (partialConfig: Partial<NotifierConfig> = {}) => {
    if (typeof partialConfig !== 'object' || partialConfig === null) return
    Object.assign(runtimeConfig, partialConfig)
  }

  const getConfig = () => ({ ...runtimeConfig })

  const notify = (payload: unknown, notifyOptions: NotifyOptions = {}) => {
    const result = dispatch(payload, notifyOptions)
    const enableConsoleLog =
      typeof notifyOptions.enableConsoleLog === 'boolean'
        ? notifyOptions.enableConsoleLog
        : runtimeConfig.enableConsoleLog

    if (enableConsoleLog) {
      const message = resolveLogMessage(payload, notifyOptions)
      logger(runtimeConfig.logPrefix, message, { payload, options: notifyOptions })
    }

    return result
  }

  return { notify, setConfig, getConfig }
}
