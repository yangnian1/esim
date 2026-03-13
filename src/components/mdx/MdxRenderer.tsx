import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { Figure } from '@/components/Figure'
import { createSlugger } from '@/lib/markdown'

interface MdxRendererProps {
  source: string
  className?: string
  components?: {
    TurkeyPlansWidget?: ReactNode
  }
}

// MDX 组件映射（服务端组件）
function createMdxComponents(turkeyPlansWidget?: ReactNode) {
  const slugger = createSlugger()
  
  const getTextContent = (node: unknown): string => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(getTextContent).join('')
    if (node && typeof node === 'object' && 'props' in node) {
      const props = (node as { props?: { children?: unknown } }).props
      return getTextContent(props?.children)
    }
    return ''
  }
  
  return {
    Figure,
    TurkeyPlansWidget: turkeyPlansWidget || (() => null),
    h2: ({ children, ...props }: any) => {
      const text = getTextContent(children)
      const id = slugger(text)
      return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>
    },
    h3: ({ children, ...props }: any) => {
      const text = getTextContent(children)
      const id = slugger(text)
      return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>
    },
    img: ({ ...props }: any) => (
      <img {...props} className="rounded-lg shadow-sm" loading="lazy" />
    ),
    a: ({ href, ...props }: any) => {
      const isExternal = href?.startsWith('http')
      return (
        <a
          {...props}
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        />
      )
    },
  }
}

export async function MdxRenderer({ source, className, components }: MdxRendererProps) {
  try {
    // 序列化 MDX
    const mdxSource = await serialize(source, {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    })

    const mdxComponents = createMdxComponents(components?.TurkeyPlansWidget)

    return (
      <div className={className}>
        <MDXRemote source={mdxSource} components={mdxComponents} />
      </div>
    )
  } catch (error) {
    console.error('MDX compilation error:', error)
    return (
      <div className={className}>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">MDX 渲染错误</p>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : '未知错误'}</p>
        </div>
      </div>
    )
  }
}

