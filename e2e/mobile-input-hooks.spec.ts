import { expect, test } from '@playwright/test'

test('mobile input hooks demo is reachable from vue-hooks-utils index', async ({ page }) => {
  await page.goto('/vue-hooks-utils')

  await page.getByText('Demo: 移动端输入 Hooks').click()

  await expect(page).toHaveURL(/\/vue-hooks-utils\/mobile-input$/)
  await expect(page.getByText('软键盘状态', { exact: true })).toBeVisible()
  await expect(page.getByText('底部栏保持展示')).toBeVisible()
})

test('useAutoScrollOnFocus scrolls focused input into view inside demo panel', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'iPhone',
    })
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      value: 1,
    })
  })
  await page.goto('/vue-hooks-utils/mobile-input')

  const panel = page.getByTestId('mobile-input-panel')
  await expect(panel).toBeVisible()
  await expect.poll(async () => panel.evaluate((element) => element.scrollTop)).toBe(0)

  await page.getByPlaceholder('聚焦后自动滚动到可视区域').evaluate((input) => {
    ;(input as HTMLInputElement).focus()
  })

  await expect.poll(async () => panel.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
})

test('useSoftKeyboardVisibility reacts to visualViewport resize in demo', async ({ page }) => {
  await page.addInitScript(() => {
    const visualViewport = new EventTarget() as VisualViewport
    Object.defineProperty(visualViewport, 'height', {
      configurable: true,
      value: 720,
    })
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: visualViewport,
    })
    Object.defineProperty(window, '__setDemoVisualViewportHeight', {
      configurable: true,
      value(height: number) {
        Object.defineProperty(visualViewport, 'height', {
          configurable: true,
          value: height,
        })
        visualViewport.dispatchEvent(new Event('resize'))
      },
    })
  })

  await page.goto('/vue-hooks-utils/mobile-input')
  await expect(page.getByText('键盘隐藏')).toBeVisible()

  await page.evaluate(() => {
    const setHeight = (window as unknown as { __setDemoVisualViewportHeight: (height: number) => void })
      .__setDemoVisualViewportHeight
    setHeight(window.innerHeight - 180)
  })

  await expect(page.getByText('键盘可见')).toBeVisible()
  await expect(page.getByText('键盘弹出，业务可隐藏底部栏')).toBeVisible()
})
