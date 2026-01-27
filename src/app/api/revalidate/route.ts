import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/types/supabase'
import { createServerClient } from '@/lib/supabase-server'
import { languages } from '@/i18n/settings'

const parseAllowedUserIds = () =>
  (process.env.REVALIDATE_USER_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)

export async function POST() {
  const allowedUserIds = parseAllowedUserIds()
  const serverClient = await createServerClient()
  const {
    data: { user },
    error: authError,
  } = await serverClient.auth.getUser()

  if (authError || !user || !allowedUserIds.includes(user.id)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const nowIso = new Date().toISOString()
  const { data: rows, error } = await serverClient
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', nowIso)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const slugs = ((rows || []) as Pick<Database['public']['Tables']['blog_posts']['Row'], 'slug'>[])
    .map((row) => row.slug.replace(/^\/+/, ''))
    .filter((slug) => slug.length > 0)

  for (const lng of languages) {
    revalidatePath(`/${lng}/blog`)
    for (const slug of slugs) {
      revalidatePath(`/${lng}/blog/${slug}`)
    }
  }

  return NextResponse.json({
    ok: true,
    revalidated: {
      locales: languages.length,
      posts: slugs.length,
    },
    at: new Date().toISOString(),
  })
}

