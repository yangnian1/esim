'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MouseEventHandler, ReactNode } from 'react'
import { useEffect } from 'react'
import { createSlugger, extractHeadings, type TocHeading } from '@/lib/markdown'

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
  // Create a mapping from heading text to id to ensure consistency between server and client
  const headingIdMap = new Map<string, string>()
  resolvedHeadings.forEach((heading) => {
    headingIdMap.set(heading.text, heading.id)
  })
  
  // Fallback slugger for headings not in the map (shouldn't happen if headings are provided)
  const slugger = createSlugger()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [markdown])

  const renderMarkdown = (value: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2({ ...props }) {
          const text = getTextContent(props.children)
          // Use the id from headings map if available, otherwise generate one
          const id = headingIdMap.get(text) ?? slugger(text)
          const className = [props.className, 'scroll-mt-24'].filter(Boolean).join(' ')
          return <h2 id={id} {...props} className={className} />
        },
        h3({ ...props }) {
          const text = getTextContent(props.children)
          // Use the id from headings map if available, otherwise generate one
          const id = headingIdMap.get(text) ?? slugger(text)
          const className = [props.className, 'scroll-mt-24'].filter(Boolean).join(' ')
          return <h3 id={id} {...props} className={className} />
        },
        img({ ...props }) {
          return <img {...props} className="rounded-lg shadow-sm" loading="lazy" />
        },
        a({ ...props }) {
          const href = props.href ?? ''
          if (href.startsWith('#')) {
            const targetId = href.replace(/^#/, '')
            const onClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
              event.preventDefault()
              const el = document.getElementById(targetId)
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `#${targetId}`)
              }
            }
            return <a {...props} onClick={onClick} />
          }
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
