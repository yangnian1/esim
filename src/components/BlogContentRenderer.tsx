'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ContentBlock } from '@/types/supabase'
import { BlogImage } from './BlogImage'

interface BlogContentRendererProps {
  blocks: ContentBlock[]
}

export function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </div>
  )
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <div className="mb-6 prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.content}
          </ReactMarkdown>
        </div>
      )

    case 'image':
      return <BlogImage src={block.url} alt={block.alt} caption={block.caption} />

    case 'heading':
      const headingClasses = {
        1: 'text-4xl font-bold mt-12 mb-6',
        2: 'text-3xl font-bold mt-10 mb-5',
        3: 'text-2xl font-bold mt-8 mb-4',
        4: 'text-xl font-bold mt-6 mb-3',
        5: 'text-lg font-bold mt-5 mb-3',
        6: 'text-base font-bold mt-4 mb-2',
      }
      const className = headingClasses[block.level] || headingClasses[2]
      
      switch (block.level) {
        case 1:
          return <h1 className={className}>{block.content}</h1>
        case 2:
          return <h2 className={className}>{block.content}</h2>
        case 3:
          return <h3 className={className}>{block.content}</h3>
        case 4:
          return <h4 className={className}>{block.content}</h4>
        case 5:
          return <h5 className={className}>{block.content}</h5>
        case 6:
          return <h6 className={className}>{block.content}</h6>
        default:
          return <h2 className={className}>{block.content}</h2>
      }

    case 'table':
      return (
        <div className="overflow-x-auto my-8">
          <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-300 px-4 py-3 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      const listClasses = block.ordered
        ? 'list-decimal list-inside my-6 space-y-2 ml-4'
        : 'list-disc list-inside my-6 space-y-2 ml-4'
      return (
        <ListTag className={listClasses}>
          {block.items.map((item, i) => (
            <li key={i} className="text-gray-700">
              <div className="inline-block">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item}
                </ReactMarkdown>
              </div>
            </li>
          ))}
        </ListTag>
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-purple-500 pl-6 py-4 my-8 bg-purple-50 rounded-r-lg italic text-gray-700">
          <p className="mb-2">{block.content}</p>
          {block.author && (
            <footer className="text-sm text-gray-500 mt-2 not-italic">
              — {block.author}
            </footer>
          )}
        </blockquote>
      )

    case 'code':
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg my-6 overflow-x-auto">
          <code className={block.language ? `language-${block.language}` : ''}>
            {block.content}
          </code>
        </pre>
      )

    case 'divider':
      return <hr className="my-8 border-gray-300" />

    default:
      return null
  }
}

