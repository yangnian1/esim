import type { TocHeading } from '@/lib/markdown'

type TocProps = {
  headings: TocHeading[]
  title?: string
}

export function Toc({ headings, title = 'Contents' }: TocProps) {
  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {title ? (
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">{title}</h2>
      ) : null}
      <ul className="space-y-2 text-sm text-gray-700">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <a href={`#${heading.id}`} className="hover:text-blue-600 transition-colors">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
