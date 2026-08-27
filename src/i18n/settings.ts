/**
 * 前期只做德语。
 *
 * 理由是内容的实际分布，不是偏好：
 * 已发布的 2 篇文章和 1 个落地页全部只有德语；en/zh 只有 12 条产品文案
 * （机器翻译来的），没有任何文章。结果是 /en/blog 和 /zh/blog 会渲染出
 * 两张**标题为空**的卡片，链接指向 /en/blog/xxx —— 而那些页面根本没生成，
 * 访问就是 404。对一个还没被索引的新站，这种薄页面只会拖累整站评价。
 *
 * 想恢复英语：把 'en' 加回 languages 即可。
 * 页面里的 en/zh 文案、DB 里的 en/zh product_localizations 都原样留着，
 * 没有删任何数据。
 */
export const fallbackLng = 'de'
export const languages = [fallbackLng]

/**
 * 曾经上线、现在下线的语种。middleware 把这些前缀重定向回 fallbackLng，
 * 避免已经存在的 /en/... /zh/... 链接直接 404。
 */
export const retiredLanguages = ['en', 'zh']

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
