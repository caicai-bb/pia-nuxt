import { setupStore } from "@/store";
import { setupI18n } from '@/locales'
import vue3GoogleLogin from 'vue3-google-login'
import { setupScrollbarStyle } from '~/assets/assscrollbar'
import { setup } from '@css-render/vue3-ssr'

export default defineNuxtPlugin((nuxtApp) => {

   const app = nuxtApp.vueApp;
   setupScrollbarStyle()
  setupStore(app);  // 这里相当于app.use(store)

  setupI18n(app)
  if(process.client){

    app.use(vue3GoogleLogin, {
      clientId: '382932083673-7r2fh7aav1ue96pc3i9kjas57cqk30vp.apps.googleusercontent.com',
    })
  }
  if (process.server) {
    const { collect } = setup(nuxtApp.vueApp)
    const originalRenderMeta = nuxtApp.ssrContext?.renderMeta
    nuxtApp.ssrContext = nuxtApp.ssrContext || {}
    nuxtApp.ssrContext.renderMeta = () => {
      if (!originalRenderMeta) {
        return {
          headTags: collect()
        }
      }
      const originalMeta = originalRenderMeta()
      if ('then' in originalMeta) {
        return originalMeta.then((resolvedOriginalMeta) => {
          return {
            ...resolvedOriginalMeta,
            headTags: resolvedOriginalMeta['headTags'] + collect()
          }
        })
      } else {
        return {
          ...originalMeta,
          headTags: originalMeta['headTags'] + collect()
        }
      }
    }
  }
});
