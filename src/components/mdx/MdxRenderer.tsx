import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { ReactNode, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Image from 'next/image'
import { Figure } from '@/components/Figure'
import { createSlugger } from '@/lib/markdown'

interface MdxRendererProps {
  source: string
  className?: string
  components?: {
    TurkeyPlansWidget?: ReactNode
  }
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }
type ImgProps = ImgHTMLAttributes<HTMLImageElement>
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>

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
    TurkeyPlansWidget: () => turkeyPlansWidget ?? null,
    h2: ({ children, ...props }: HeadingProps) => {
      const text = getTextContent(children)
      const id = slugger(text)
      return <h2 id={id} className="scroll-mt-24" {...props}>{children}</h2>
    },
    h3: ({ children, ...props }: HeadingProps) => {
      const text = getTextContent(children)
      const id = slugger(text)
      return <h3 id={id} className="scroll-mt-24" {...props}>{children}</h3>
    },
    img: ({ src, alt, ...props }: ImgProps) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ''} {...props} className="rounded-lg shadow-sm" loading="lazy" />
    ),
    a: ({ href, ...props }: AnchorProps) => {
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
    const mdxComponents = createMdxComponents(components?.TurkeyPlansWidget)

    return (
      <div className={className}>
        <MDXRemote
          source={source}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
          components={mdxComponents}
        />
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

