export const fallbackLng = 'de'
export const languages = [fallbackLng, 'en', 'zh']
export const defaultNS = 'common'
export const cookieName = 'i18next'

export function getOptions (lng: string = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
} 