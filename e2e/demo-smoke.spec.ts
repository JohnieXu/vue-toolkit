import { expect, test } from '@playwright/test'

test('navigates from home to package pages and back', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'vue-toolkit' })).toBeVisible()

  await page.getByText('vue-hooks-utils', { exact: true }).click()
  await expect(page.getByRole('heading', { name: 'vue-hooks-utils' })).toBeVisible()

  await page.locator('.van-nav-bar__left').click()
  await expect(page.getByRole('heading', { name: 'vue-toolkit' })).toBeVisible()

  await page.getByText('vue-modal-utils', { exact: true }).click()
  await expect(page.getByText('弹窗命令式调用 API 示例')).toBeVisible()
})

test('opens and closes the common bottom popup', async ({ page }) => {
  await page.goto('/vue-modal-utils/phase1')

  await page.getByText('企业规则提示').click()

  await expect(page.getByText('你的企业已配置相关预订管控规则，不支持购买儿童票')).toBeVisible()

  await page.getByRole('button', { name: '知道了' }).click()

  await expect(page.getByText('上次操作: corporateRule')).toBeVisible()
  await expect(page.getByText('你的企业已配置相关预订管控规则，不支持购买儿童票')).toBeHidden()
})

test('opens the basic modal and resolves confirm action', async ({ page }) => {
  await page.goto('/vue-modal-utils/phase2')

  await page.getByText('底部单按钮').click()

  await expect(page.getByText('这是底部位置的确认弹窗')).toBeVisible()

  await page.getByRole('button', { name: '知道了' }).click()

  await expect(page.getByText('上次操作: bottom:confirm')).toBeVisible()
})

test('writes preview content into iframe', async ({ page }) => {
  await page.goto('/vue-hooks-utils/iframe-write')

  await page.getByRole('button', { name: '打开预览' }).click()

  await expect(page.getByText('已通过 document.write 注入以下内容：')).toBeVisible()
  await expect(page.frameLocator('iframe.iframe-view').getByText('iframe document.write Demo')).toBeVisible()
  await expect(page.frameLocator('iframe.iframe-view').getByText('该内容来自 useIframeDocumentWrite。')).toBeVisible()
})
