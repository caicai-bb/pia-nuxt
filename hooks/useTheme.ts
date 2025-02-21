import type { GlobalThemeOverrides } from 'naive-ui'
import { computed, watch } from 'vue'
import { darkTheme, useOsTheme } from 'naive-ui'
import { useAppStore } from '@/store'

export function useTheme() {
  const appStore = useAppStore()

  const OsTheme = useOsTheme()

  const isDark = computed(() => {
    if (appStore.theme === 'auto')
      return OsTheme.value === 'dark'
    else
      return appStore.theme === 'dark'
  })

  const theme = computed(() => {
    return isDark.value ? darkTheme : undefined
  })

  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    if (isDark.value) {
      return {
        common: {
          primaryColor: '#fe5997',
          primaryColorHover: '#eb4e8a',
          primaryColorPressed: '#fe5997',
          modalColor: '#171634d1',
          baseColor: '#171634d1',
          color: '#fff',
          borderRadius: '15px',
          // fontSize: '',
        },
        Avatar: {
          color: '#fe5997',
          fontSize: '30px',
        },
        Input: {
          color: '#171634d1',
          colorFocus: '#171634d1',
          borderRadius: '15px',
          placeholderColor: '#d3d3d3',
          border: '1px solid #888893',
          borderHover: '1px solid #888893',
          borderFocus: '1px solid #888893',
        },
        Popover: {
          // fontSize: string;
          // borderRadius: string;
          // color: 'none',
          color: '#171634bf',
          dividerColor: '#fff',
          // textColor: string;
          // boxShadow: string;
          // space: string;
          // spaceArrow: string;
          // arrowOffset: string;
          // arrowOffsetVertical: string;
          // arrowHeight: string;
          // padding: string;
        },
      }
    }
    return {}
  })

  watch(
    () => isDark.value,
    (dark) => {
      if (dark)
        if( process.client)
        document.documentElement.classList.add('dark')
      else
        if( process.client)
        document.documentElement.classList.remove('dark')
    },
    { immediate: true },
  )

  return { theme, themeOverrides }
}
