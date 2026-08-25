import { redirect } from 'next/navigation'

/**
 * 公开注册已关闭。
 *
 * 本站是联盟内容站，访客不需要账号（不下单、不发卡）。
 * 账号只服务于运营：后台登录、草稿预览、/api/revalidate 白名单。
 * 这些账号统一由 admin 的「用户管理」创建（走 create-user 接口，要 admin 身份）。
 *
 * ⚠️ 删掉这个页面并不能真正关闭注册 —— anon key 是公开的，
 * 任何人都能直接 POST /auth/v1/signup。真正的开关在
 * Supabase 控制台 → Authentication → Sign In / Providers → Email → 关闭 "Allow new users to sign up"。
 * 2026-08-24 实测该开关仍是打开的，务必去关掉。
 *
 * 原页面保留在同目录的 page.tsx.disabled，以后要恢复自助注册可以取回。
 */
export default async function RegisterDisabledPage({
  params,
}: {
  params: Promise<{ lng: string }>
}) {
  const { lng } = await params
  redirect(`/${lng}/auth/login`)
}
