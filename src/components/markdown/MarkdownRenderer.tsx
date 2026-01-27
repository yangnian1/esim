import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { extractHeadings, type TocHeading } from '@/lib/markdown'

type MarkdownRendererProps = {
  markdown: string
  headings?: TocHeading[]
  className?: string
  widgetMap?: Record<string, ReactNode>
}

const getTextContent = (node: unknown): string => {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props
    return getTextContent(props?.children)
  }
  return ''
}

export function MarkdownRenderer({ markdown, headings, className, widgetMap }: MarkdownRendererProps) {
  const resolvedHeadings = headings ?? extractHeadings(markdown)
  let headingIndex = 0

  const renderMarkdown = (value: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2({ ...props }) {
          const text = getTextContent(props.children)
          const fallbackId = text.toLowerCase().replace(/\s+/g, '-')
          const heading = resolvedHeadings[headingIndex]
          if (heading?.level === 2) headingIndex += 1
          const id = heading?.level === 2 ? heading.id : fallbackId
          return <h2 id={id} {...props} />
        },
        h3({ ...props }) {
          const text = getTextContent(props.children)
          const fallbackId = text.toLowerCase().replace(/\s+/g, '-')
          const heading = resolvedHeadings[headingIndex]
          if (heading?.level === 3) headingIndex += 1
          const id = heading?.level === 3 ? heading.id : fallbackId
          return <h3 id={id} {...props} />
        },
        img({ ...props }) {
          return <img {...props} className="rounded-lg shadow-sm" loading="lazy" />
        },
        a({ ...props }) {
          const href = props.href ?? ''
          const isExternal = href.startsWith('http')
          return (
            <a
              {...props}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
            />
          )
        },
      }}
    >
      {value}
    </ReactMarkdown>
  )

  const widgetToken = '{{TurkeyPlansWidget}}'
  const parts = markdown.split(widgetToken)

  return (
    <div className={className}>
      {parts.map((part, index) => (
        <div key={`markdown-part-${index}`} className="space-y-6">
          {part.trim().length > 0 && renderMarkdown(part)}
          {index < parts.length - 1 && widgetMap?.TurkeyPlansWidget ? (
            <div className="not-prose">{widgetMap.TurkeyPlansWidget}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
