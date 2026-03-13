// Supabase 数据库类型定义
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      esim_products: {
        Row: {
          id: number
          name: string
          description: Json // JSONB: {"en": "...", "vi": "...", "de": "..."}
          price: number
          stock: number
          country: string | null
          validity_days: number | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description: Json
          price: number
          stock?: number
          country?: string | null
          validity_days?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: Json
          price?: number
          stock?: number
          country?: string | null
          validity_days?: number | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: number
          slug: string
          title: Json // JSONB: {"en": "...", "vi": "...", "de": "..."}
          excerpt: Json | null // JSONB: {"en": "...", "vi": "...", "de": "..."}
          source_content: Json | null // JSONB: {"en": "mdx string", "vi": "mdx string", "de": "mdx string"}
          published_content: Json | null // JSONB: {"en": "mdx string", "vi": "mdx string", "de": "mdx string"}
          tags: Json // JSONB array
          author_id: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          featured_image: string | null
          meta_data: Json | null
          created_at: string
          updated_at: string
          seo_meta: Json // JSONB: {"en": {"title": "...", "description": "..."}}
        }
        Insert: {
          id?: number
          slug: string
          title: Json
          excerpt?: Json | null
          source_content?: Json | null
          published_content?: Json | null
          tags?: Json
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          featured_image?: string | null
          meta_data?: Json | null
          created_at?: string
          updated_at?: string
          seo_meta?: Json
        }
        Update: {
          id?: number
          slug?: string
          title?: Json
          excerpt?: Json | null
          source_content?: Json | null
          published_content?: Json | null
          tags?: Json
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          featured_image?: string | null
          meta_data?: Json | null
          created_at?: string
          updated_at?: string
          seo_meta?: Json
        }
      }
      profiles: {
        Row: {
          id: string // UUID
          username: string
          role: 'user' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          role?: 'user' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          role?: 'user' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 应用层类型定义（带本地化）
export interface LocalizedProduct {
  id: number
  name: string
  description: string // 已提取的本地化描述
  price: number
  stock: number
  country: string | null
  validity_days: number | null
  image_url: string | null
  created_at: string
  updated_at: string
}

// 文章元数据
export type BlogPostMeta = {
  reading_time?: number
  author_name?: string
  author_avatar?: string
  category?: string
  template?: 'pillar' | 'blog'
  seo?: {
    title?: string
    description?: string
    canonical?: string
  }
  [key: string]: unknown
}

export interface LocalizedBlogPost {
  id: number
  slug: string
  title: string // 已提取的本地化标题
  body: string // MDX 字符串内容
  excerpt: string | null
  tags: string[]
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  featured_image: string | null
  meta_data: BlogPostMeta | null
  created_at: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
}

// 用户 Profile 类型
export type Profile = Database['public']['Tables']['profiles']['Row']
