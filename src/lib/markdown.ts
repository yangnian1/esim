export type TocHeading = {
  id: string
  text: string
  level: 2 | 3
}

export type FaqItem = {
  question: string
  answer: string
}

const slugify = (value: string): string => {
  const withoutDiacritics = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
  const normalized = withoutDiacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return normalized.replace(/^-|-$/g, '')
}

export const createSlugger = () => {
  const seen: Record<string, number> = {}
  return (value: string) => {
    const base = slugify(value) || 'section'
    const count = seen[base] ?? 0
    seen[base] = count + 1
    return count === 0 ? base : `${base}-${count}`
  }
}

const stripTrailingHashes = (value: string) => value.replace(/\s#+\s*$/, '').trim()

export function extractHeadings(markdown: string): TocHeading[] {
  const lines = markdown.split(/\r?\n/)
  const slugger = createSlugger()
  const headings: TocHeading[] = []
  let inCodeBlock = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = /^(#{2,3})\s+(.+)$/.exec(trimmed)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = stripTrailingHashes(match[2])
    const id = slugger(text)
    headings.push({ id, text, level })
  }

  return headings
}

export function extractFaqSection(markdown: string): { content: string; faqs: FaqItem[] } {
  const lines = markdown.split(/\r?\n/)
  let faqStart = -1
  let faqEnd = lines.length
  let inCodeBlock = false

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    if (/^##\s+faq\b/i.test(trimmed)) {
      faqStart = i
      break
    }
  }

  if (faqStart === -1) {
    return { content: markdown, faqs: [] }
  }

  inCodeBlock = false
  for (let i = faqStart + 1; i < lines.length; i += 1) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    if (/^##\s+/.test(trimmed)) {
      faqEnd = i
      break
    }
  }

  const faqLines = lines.slice(faqStart + 1, faqEnd)
  const contentLines = [...lines.slice(0, faqStart), ...lines.slice(faqEnd)]

  const faqs: FaqItem[] = []
  let currentQuestion: string | null = null
  let currentAnswer: string[] = []

  for (const line of faqLines) {
    const trimmed = line.trim()
    const match = /^###\s+(.+)$/.exec(trimmed)
    if (match) {
      if (currentQuestion) {
        faqs.push({
          question: stripTrailingHashes(currentQuestion),
          answer: currentAnswer.join('\n').trim(),
        })
      }
      currentQuestion = match[1]
      currentAnswer = []
      continue
    }
    if (currentQuestion) {
      currentAnswer.push(line)
    }
  }

  if (currentQuestion) {
    faqs.push({
      question: stripTrailingHashes(currentQuestion),
      answer: currentAnswer.join('\n').trim(),
    })
  }

  return { content: contentLines.join('\n').trim(), faqs }
}

/**
 * 取正文里第一张 <Figure> 的 src，作为头图的兜底。
 *
 * 三处共用同一个实现，规则必须一致：博客列表的卡片、详情页的 og:image、
 * Article 结构化数据的 image。以前列表页没有兜底、另外两处各写各的，
 * 其中一处还漏了 http 检查，导致 Article.image 可能拿到相对路径。
 *
 * 只认 http(s) 开头的绝对地址：结构化数据和图片站点地图都要求绝对 URL，
 * 相对路径进去只会变成抓不到的链接。
 */
export function firstBodyImage(body: string | null | undefined): string | null {
  const m = /<Figure\b[^>]*?src=["']([^"']+)["']/.exec(body ?? '')
  return m?.[1]?.startsWith('http') ? m[1] : null
}
