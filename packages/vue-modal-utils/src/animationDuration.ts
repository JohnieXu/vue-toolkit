const DEFAULT_ANIMATION_DURATION = 300
const VANT_ANIMATION_DURATION_VARS = ['--van-duration-base', '--van-animation-duration-base']

/**
 * 动画时长解析配置。
 *
 * @internal
 */
export interface AnimationDurationConfig {
  /** 全局动画时长配置。 */
  animationDuration?: number | string
}

/**
 * 将数字、ms、s 或纯数字字符串解析为毫秒数。
 *
 * @param value - 待解析的动画时长。
 * @returns 解析后的非负毫秒数，无法解析时返回 `null`。
 * @internal
 */
export function parseAnimationDuration(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.round(value))
  }

  if (typeof value !== 'string') return null

  const normalized = value.trim().split(',')[0]?.trim()
  if (!normalized) return null

  const msMatch = normalized.match(/^(-?\d+(?:\.\d+)?)ms$/i)
  if (msMatch) return Math.max(0, Math.round(Number(msMatch[1])))

  const sMatch = normalized.match(/^(-?\d+(?:\.\d+)?)s$/i)
  if (sMatch) return Math.max(0, Math.round(Number(sMatch[1]) * 1000))

  const rawNumber = Number(normalized)
  return Number.isFinite(rawNumber) ? Math.max(0, Math.round(rawNumber)) : null
}

function readVantAnimationDurationFromCssVar(): number | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null

  const styles = window.getComputedStyle(document.documentElement)
  for (const cssVarName of VANT_ANIMATION_DURATION_VARS) {
    const cssVarValue = styles.getPropertyValue(cssVarName)
    const parsed = parseAnimationDuration(cssVarValue)
    if (parsed !== null) return parsed
  }

  return null
}

/**
 * 按调用配置、全局配置、Vant CSS 变量、默认值的顺序解析动画时长。
 *
 * @param options - 单次调用配置。
 * @param globalConfig - 全局配置。
 * @returns 最终动画时长，单位为毫秒。
 * @internal
 */
export function resolveAnimationDuration(
  options: AnimationDurationConfig = {},
  globalConfig: AnimationDurationConfig = {}
): number {
  const fromCall = parseAnimationDuration(options.animationDuration)
  if (fromCall !== null) return fromCall

  const fromGlobalConfig = parseAnimationDuration(globalConfig.animationDuration)
  if (fromGlobalConfig !== null) return fromGlobalConfig

  const fromVantCssVar = readVantAnimationDurationFromCssVar()
  if (fromVantCssVar !== null) return fromVantCssVar

  return DEFAULT_ANIMATION_DURATION
}
