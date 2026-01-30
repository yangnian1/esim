export const fallbackLng = 'en'
export const languages = [fallbackLng, 'zh', 'de']
export const defaultNS = 'common'
export const cookieName = 'i18next'

export function getOptions(lng: string = fallbackLng, ns: string | string[] = defaultNS) {
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