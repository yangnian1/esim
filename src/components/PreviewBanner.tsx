'use client'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    preview_mode: 'Preview Mode',
    preview_notice: 'This is a draft preview. Other users cannot see this article.',
  },
  vi: {
    preview_mode: 'Chế độ xem trước',
    preview_notice: 'Đây là bản xem trước bản nháp. Người dùng khác không thể thấy bài viết này.',
  },
  de: {
    preview_mode: 'Vorschaumodus',
    preview_notice: 'Dies ist eine Entwurfsvorschau. Andere Benutzer können diesen Artikel nicht sehen.',
  },
  zh: {
    preview_mode: '预览模式',
    preview_notice: '这是草稿预览，其他用户无法看到此文章。',
  },
  fr: {
    preview_mode: 'Mode Aperçu',
    preview_notice: 'Ceci est un aperçu de brouillon. Les autres utilisateurs ne peuvent pas voir cet article.',
  },
  es: {
    preview_mode: 'Modo Vista Previa',
    preview_notice: 'Esta es una vista previa del borrador. Otros usuarios no pueden ver este artículo.',
  },
  ja: {
    preview_mode: 'プレビューモード',
    preview_notice: 'これは下書きプレビューです。他のユーザーはこの記事を見ることができません。',
  },
}

interface PreviewBannerProps {
  lng: string
}

export function PreviewBanner({ lng }: PreviewBannerProps) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <div>
          <p className="font-semibold">{t('preview_mode')}</p>
          <p className="text-sm mt-1">{t('preview_notice')}</p>
        </div>
      </div>
    </div>
  )
}


