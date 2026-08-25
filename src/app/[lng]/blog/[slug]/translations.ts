// 博客详情页 + 预览页共用的文案。
// 只保留 i18n/settings.ts 里真正启用的三种语言（en / zh / de）；
// 原来这里还有 vi / fr / es / ja，但 middleware 不会路由到那些语种，属于死代码。
export const blogDetailTranslations: Record<string, Record<string, string>> = {
  en: {
    back_to_blog: 'Back to Blog',
    not_found: 'Article not found',
    error: 'Failed to load article',
    unauthorized: 'You do not have permission to preview this article',
    login_required: 'Please log in to preview drafts',
    toc_title: 'Contents',
    faq_title: 'FAQ',
  },
  de: {
    back_to_blog: 'Zurück zum Blog',
    not_found: 'Artikel nicht gefunden',
    error: 'Artikel konnte nicht geladen werden',
    unauthorized: 'Sie haben keine Berechtigung, diesen Artikel in der Vorschau anzuzeigen',
    login_required: 'Bitte melden Sie sich an, um Entwürfe in der Vorschau anzuzeigen',
    toc_title: 'Inhalt',
    faq_title: 'Häufige Fragen',
  },
  zh: {
    back_to_blog: '返回博客',
    not_found: '文章未找到',
    error: '加载失败',
    unauthorized: '您没有权限预览此文章',
    login_required: '请先登录以预览草稿',
    toc_title: '目录',
    faq_title: '常见问题',
  },
}

export function getBlogDetailT(lng: string) {
  return (key: string) =>
    blogDetailTranslations[lng]?.[key] || blogDetailTranslations.en?.[key] || key
}
