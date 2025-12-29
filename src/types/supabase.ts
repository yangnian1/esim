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
          content: Json // JSONB: Markdown 多语言
          excerpt: Json | null
          tags: Json // JSONB array
          author_id: string | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          created_at: string
          updated_at: string
          seo_meta: Json // JSONB: {"en": {"title": "...", "description": "..."}}
        }
        Insert: {
          id?: number
          slug: string
          title: Json
          content: Json
          excerpt?: Json | null
          tags?: Json
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          created_at?: string
          updated_at?: string
          seo_meta?: Json
        }
        Update: {
          id?: number
          slug?: string
          title?: Json
          content?: Json
          excerpt?: Json | null
          tags?: Json
          author_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
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

export interface LocalizedBlogPost {
  id: number
  slug: string
  title: string // 已提取的本地化标题
  content: string // 已提取的本地化内容
  excerpt: string | null
  tags: string[]
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  seo_title: string | null
  seo_description: string | null
}

// 用户 Profile 类型
export type Profile = Database['public']['Tables']['profiles']['Row']
