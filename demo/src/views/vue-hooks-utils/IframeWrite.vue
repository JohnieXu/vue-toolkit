<script setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import { useIframeDocumentWrite } from 'vue-hooks-utils'

  const decodeHtmlEntities = (html) => {
    if (!html) return ''
    const source = String(html)
    if (typeof document === 'undefined') return source
    const textArea = document.createElement('textarea')
    textArea.innerHTML = source
    return textArea.value
  }

  const visible = ref(false)
  const encodedInput = ref(
    '&lt;h2 style="margin:8px 0;color:#1989fa"&gt;iframe document.write Demo&lt;/h2&gt;' +
      '&lt;p style="margin:6px 0"&gt;该内容来自 useIframeDocumentWrite。&lt;/p&gt;' +
      '&lt;ul style="padding-left:18px;margin:6px 0"&gt;' +
      '&lt;li&gt;适配小程序 web-view 容器&lt;/li&gt;' +
      '&lt;li&gt;挂载后写入 + 内容变更重写&lt;/li&gt;' +
      '&lt;/ul&gt;'
  )

  const decodedHtml = computed(() => decodeHtmlEntities(encodedInput.value))
  const { iframeRef, writeIframeContent } = useIframeDocumentWrite(decodedHtml, {
    retry: 2,
    retryDelay: 60,
  })

  const writeNow = async () => {
    await nextTick()
    await writeIframeContent()
  }

  watch(visible, async (value) => {
    if (!value) return
    await writeNow()
  })

  watch(decodedHtml, async () => {
    if (!visible.value) return
    await writeNow()
  })
</script>

<template>
  <div class="iframe-demo">
    <p class="desc">演示场景：不使用 iframe srcdoc，改用 useIframeDocumentWrite 写入 HTML。</p>

    <van-field
      v-model="encodedInput"
      type="textarea"
      rows="8"
      autosize
      label="HTML(可编辑)"
      placeholder="请输入 HTML 或 HTML 实体"
    />

    <div class="actions">
      <van-button type="primary" block @click="visible = true">打开预览</van-button>
      <van-button block @click="writeNow">手动重写 iframe</van-button>
    </div>

    <van-popup v-model:show="visible" round position="bottom" :style="{ height: '70%' }">
      <div class="popup-body">
        <div class="hint">已通过 document.write 注入以下内容：</div>
        <iframe ref="iframeRef" class="iframe-view" />
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="scss">
  .iframe-demo {
    padding: 16px;
  }
  .desc {
    margin: 0 0 12px;
    color: #666;
    font-size: 13px;
    line-height: 1.5;
  }
  .actions {
    margin-top: 12px;
    display: grid;
    gap: 8px;
  }
  .popup-body {
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    background: #f7f8fa;
  }
  .hint {
    margin-bottom: 8px;
    color: #666;
    font-size: 12px;
  }
  .iframe-view {
    width: 100%;
    height: calc(100% - 24px);
    border: none;
    border-radius: 8px;
    background: #fff;
  }
</style>
