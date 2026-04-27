/**
 * 可转换为视口单位的 px 输入。
 *
 * @public
 */
export type ViewportUnitPxValue = number | string | null | undefined

/**
 * 支持的视口单位。
 *
 * @public
 */
export type ViewportUnit = 'vw' | 'vh' | 'vmin' | 'vmax'

/**
 * px 转视口单位的配置项。
 *
 * @public
 */
export interface PxToViewportUnitOptions {
  /**
   * 设计稿尺寸。横向换算通常传设计稿宽度，纵向换算通常传设计稿高度。
   *
   * 默认值：`375`
   */
  designSize?: number
  /**
   * 兼容业务中常见的设计稿宽度命名，优先级低于 `designSize`。
   *
   * 默认值：`375`
   */
  designWidth?: number
  /**
   * 输出的视口单位。
   *
   * 默认值：`vw`
   */
  unit?: ViewportUnit
  /**
   * 小数精度。
   *
   * 默认值：`6`
   */
  precision?: number
  /**
   * 字符串输入是否原样返回，便于传入 `10px`、`10vw`、`clamp(...)` 等值。
   *
   * 默认值：`true`
   */
  passthroughString?: boolean
  /**
   * 输入无法转换为有限数字时的兜底值。
   *
   * 默认值：`0${unit}`
   */
  fallbackValue?: string
}

/**
 * `useViewportUnit` 的配置项。
 *
 * @public
 */
export type UseViewportUnitOptions = PxToViewportUnitOptions

/**
 * `useViewportUnit` 返回值。
 *
 * @public
 */
export interface UseViewportUnitResult {
  /**
   * 按默认配置或调用时覆盖配置将 px 转为指定视口单位。
   */
  pxToViewportUnit: (px: ViewportUnitPxValue, options?: PxToViewportUnitOptions) => string
  /**
   * 将 px 转为 vw，保留业务侧常用的调用语义。
   */
  pxToVw: (px: ViewportUnitPxValue, options?: Omit<PxToViewportUnitOptions, 'unit'>) => string
}

const DEFAULT_DESIGN_SIZE = 375
const DEFAULT_PRECISION = 6

const normalizePositiveNumber = (value: unknown, fallback: number) => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : fallback
}

const normalizePrecision = (value: unknown) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return DEFAULT_PRECISION
  return Math.max(0, Math.floor(numericValue))
}

const formatNumber = (value: number, precision: number) => {
  return Number(value.toFixed(precision)).toString()
}

const resolveOptions = (options: PxToViewportUnitOptions = {}) => {
  const unit = options.unit ?? 'vw'
  const designSize = normalizePositiveNumber(options.designSize ?? options.designWidth, DEFAULT_DESIGN_SIZE)
  const precision = normalizePrecision(options.precision)
  const passthroughString = options.passthroughString ?? true
  const fallbackValue = options.fallbackValue ?? `0${unit}`

  return {
    unit,
    designSize,
    precision,
    passthroughString,
    fallbackValue,
  }
}

/**
 * 将设计稿 px 值换算为视口单位，适合运行时动态样式值。
 *
 * @param px - 需要转换的 px 值；字符串默认原样返回。
 * @param options - 换算配置。
 * @returns 视口单位字符串。
 * @public
 */
export function pxToViewportUnit(px: ViewportUnitPxValue, options: PxToViewportUnitOptions = {}): string {
  const resolvedOptions = resolveOptions(options)

  if (typeof px === 'string' && resolvedOptions.passthroughString) return px

  const value = Number(px)
  if (!Number.isFinite(value)) return resolvedOptions.fallbackValue

  const convertedValue = (value / resolvedOptions.designSize) * 100
  return `${formatNumber(convertedValue, resolvedOptions.precision)}${resolvedOptions.unit}`
}

/**
 * 提供运行时 px 到视口单位的换算方法。
 *
 * @param options - 默认换算配置，可在每次调用时覆盖。
 * @returns `pxToViewportUnit` 与常用的 `pxToVw`。
 * @remarks
 * 模板动态绑定值不会经过 PostCSS 的 px-to-viewport 转换时，可使用该 Hook 统一处理。
 * @public
 */
export function useViewportUnit(options: UseViewportUnitOptions = {}): UseViewportUnitResult {
  const pxToViewportUnitWithDefaults = (
    px: ViewportUnitPxValue,
    overrideOptions: PxToViewportUnitOptions = {}
  ) => {
    return pxToViewportUnit(px, {
      ...options,
      ...overrideOptions,
    })
  }

  const pxToVw = (px: ViewportUnitPxValue, overrideOptions: Omit<PxToViewportUnitOptions, 'unit'> = {}) => {
    return pxToViewportUnit(px, {
      ...options,
      ...overrideOptions,
      unit: 'vw',
    })
  }

  return {
    pxToViewportUnit: pxToViewportUnitWithDefaults,
    pxToVw,
  }
}
