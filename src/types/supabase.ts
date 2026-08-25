// ⚠️ 本文件上半部分（Json / Database）由 Supabase 生成，
// 下半部分是手写的应用层类型（LocalizedProduct 等，被 10 处引用）。
// 改表后只能替换上半部分，不能整个文件覆盖。见根目录 CLAUDE.md「类型现状」。

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_program_id: number | null
          clicked_at: string
          id: number
          landing_page_slug: string | null
          locale: string | null
          product_id: number | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_program_id?: number | null
          clicked_at?: string
          id?: number
          landing_page_slug?: string | null
          locale?: string | null
          product_id?: number | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_program_id?: number | null
          clicked_at?: string
          id?: number
          landing_page_slug?: string | null
          locale?: string | null
          product_id?: number | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_program_id_fkey"
            columns: ["affiliate_program_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "esim_products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_programs: {
        Row: {
          base_tracking_url: string | null
          commission_note: string | null
          coupon_code: string | null
          created_at: string
          deep_link_template: string | null
          default_utm: Json
          id: number
          is_active: boolean
          name: string
          network_name: string | null
          provider_id: number | null
          signup_url: string | null
          updated_at: string
        }
        Insert: {
          base_tracking_url?: string | null
          commission_note?: string | null
          coupon_code?: string | null
          created_at?: string
          deep_link_template?: string | null
          default_utm?: Json
          id?: number
          is_active?: boolean
          name: string
          network_name?: string | null
          provider_id?: number | null
          signup_url?: string | null
          updated_at?: string
        }
        Update: {
          base_tracking_url?: string | null
          commission_note?: string | null
          coupon_code?: string | null
          created_at?: string
          deep_link_template?: string | null
          default_utm?: Json
          id?: number
          is_active?: boolean
          name?: string
          network_name?: string | null
          provider_id?: number | null
          signup_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_programs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: Json
          created_at: string | null
          excerpt: Json | null
          featured_image: string | null
          id: number
          meta_data: Json | null
          published_at: string | null
          published_content: Json
          slug: string
          source_content: Json
          status: string | null
          tags: Json | null
          title: Json
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: Json
          created_at?: string | null
          excerpt?: Json | null
          featured_image?: string | null
          id?: never
          meta_data?: Json | null
          published_at?: string | null
          published_content?: Json
          slug: string
          source_content?: Json
          status?: string | null
          tags?: Json | null
          title: Json
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: Json
          created_at?: string | null
          excerpt?: Json | null
          featured_image?: string | null
          id?: never
          meta_data?: Json | null
          published_at?: string | null
          published_content?: Json
          slug?: string
          source_content?: Json
          status?: string | null
          tags?: Json | null
          title?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      countries: {
        Row: {
          created_at: string
          id: number
          iso2: string
          name_de: string | null
          name_en: string
          name_zh: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          iso2: string
          name_de?: string | null
          name_en: string
          name_zh?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          iso2?: string
          name_de?: string | null
          name_en?: string
          name_zh?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      esim_products: {
        Row: {
          activation_starts: string | null
          activation_type: string | null
          affiliate_program_id: number | null
          affiliate_url: string | null
          availability_status: string
          country: string | null
          country_id: number | null
          created_at: string | null
          currency: string
          data_gb: number | null
          data_label: string | null
          description: Json | null
          external_product_id: string | null
          fair_use_note: string | null
          hotspot_supported: boolean | null
          id: number
          image_url: string | null
          is_featured: boolean
          last_synced_at: string | null
          name: string
          network_partner: string | null
          original_price: number | null
          plan_type: string
          price: number
          provider_id: number | null
          slug: string | null
          sort_order: number
          source_url: string | null
          stock: number | null
          topup_supported: boolean | null
          updated_at: string | null
          validity_days: number | null
        }
        Insert: {
          activation_starts?: string | null
          activation_type?: string | null
          affiliate_program_id?: number | null
          affiliate_url?: string | null
          availability_status?: string
          country?: string | null
          country_id?: number | null
          created_at?: string | null
          currency?: string
          data_gb?: number | null
          data_label?: string | null
          description?: Json | null
          external_product_id?: string | null
          fair_use_note?: string | null
          hotspot_supported?: boolean | null
          id?: never
          image_url?: string | null
          is_featured?: boolean
          last_synced_at?: string | null
          name: string
          network_partner?: string | null
          original_price?: number | null
          plan_type?: string
          price: number
          provider_id?: number | null
          slug?: string | null
          sort_order?: number
          source_url?: string | null
          stock?: number | null
          topup_supported?: boolean | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Update: {
          activation_starts?: string | null
          activation_type?: string | null
          affiliate_program_id?: number | null
          affiliate_url?: string | null
          availability_status?: string
          country?: string | null
          country_id?: number | null
          created_at?: string | null
          currency?: string
          data_gb?: number | null
          data_label?: string | null
          description?: Json | null
          external_product_id?: string | null
          fair_use_note?: string | null
          hotspot_supported?: boolean | null
          id?: never
          image_url?: string | null
          is_featured?: boolean
          last_synced_at?: string | null
          name?: string
          network_partner?: string | null
          original_price?: number | null
          plan_type?: string
          price?: number
          provider_id?: number | null
          slug?: string | null
          sort_order?: number
          source_url?: string | null
          stock?: number | null
          topup_supported?: boolean | null
          updated_at?: string | null
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "esim_products_affiliate_program_id_fkey"
            columns: ["affiliate_program_id"]
            isOneToOne: false
            referencedRelation: "affiliate_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esim_products_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "esim_products_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_page_products: {
        Row: {
          badge: string | null
          created_at: string
          id: number
          landing_page_id: number
          position: number
          product_id: number
          reason: string | null
        }
        Insert: {
          badge?: string | null
          created_at?: string
          id?: number
          landing_page_id: number
          position?: number
          product_id: number
          reason?: string | null
        }
        Update: {
          badge?: string | null
          created_at?: string
          id?: number
          landing_page_id?: number
          position?: number
          product_id?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_page_products_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_page_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "esim_products"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          canonical_url: string | null
          content: Json
          country_id: number | null
          created_at: string
          faq: Json
          h1: string
          id: number
          intro: string | null
          locale: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          content?: Json
          country_id?: number | null
          created_at?: string
          faq?: Json
          h1: string
          id?: number
          intro?: string | null
          locale: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          content?: Json
          country_id?: number | null
          created_at?: string
          faq?: Json
          h1?: string
          id?: number
          intro?: string | null
          locale?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "landing_pages_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          activation_code: string | null
          created_at: string
          id: number
          notes: string | null
          product_id: number | null
          quantity: number
          status: string
          total_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          activation_code?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          product_id?: number | null
          quantity?: number
          status?: string
          total_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          activation_code?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          product_id?: number | null
          quantity?: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "esim_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_localizations: {
        Row: {
          created_at: string
          id: number
          locale: string
          long_description: string | null
          name: string
          product_id: number
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          updated_at: string
          usp_bullets: Json
        }
        Insert: {
          created_at?: string
          id?: number
          locale: string
          long_description?: string | null
          name: string
          product_id: number
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          updated_at?: string
          usp_bullets?: Json
        }
        Update: {
          created_at?: string
          id?: number
          locale?: string
          long_description?: string | null
          name?: string
          product_id?: number
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          updated_at?: string
          usp_bullets?: Json
        }
        Relationships: [
          {
            foreignKeyName: "product_localizations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "esim_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_source_raw: {
        Row: {
          id: number
          normalized_product_id: number | null
          payload: Json
          provider_id: number | null
          pulled_at: string
          source_key: string | null
          source_type: string
        }
        Insert: {
          id?: number
          normalized_product_id?: number | null
          payload: Json
          provider_id?: number | null
          pulled_at?: string
          source_key?: string | null
          source_type: string
        }
        Update: {
          id?: number
          normalized_product_id?: number | null
          payload?: Json
          provider_id?: number | null
          pulled_at?: string
          source_key?: string | null
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_source_raw_normalized_product_id_fkey"
            columns: ["normalized_product_id"]
            isOneToOne: false
            referencedRelation: "esim_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_source_raw_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          role: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          role?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          role?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          affiliate_model: string
          created_at: string
          id: number
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          support_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          affiliate_model?: string
          created_at?: string
          id?: number
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          support_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          affiliate_model?: string
          created_at?: string
          id?: number
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          support_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// 应用层类型定义（带本地化）
export interface LocalizedProduct {
  id: number
  /** 本地化后的产品名；没有本地化时退回 esim_products.name（英文原名） */
  name: string
  description: string // 已提取的本地化描述
  /** product_localizations 里的一句话摘要，列表卡片用 */
  short_description: string | null
  /** 逐语种的 SEO 标题/描述，产品详情页 generateMetadata 优先用它 */
  seo_title: string | null
  seo_description: string | null
  /** 卖点列表，没有则为空数组 */
  usp_bullets: string[]
  /** 流量标签，如 "10 GB" */
  data_label: string | null
  price: number
  stock: number | null
  country: string | null
  validity_days: number | null
  image_url: string | null
  /** 联盟商落地页链接；为空表示不可跳转，前端应隐藏 CTA。出站一律走 /api/go/{id} */
  affiliate_url: string | null
  /** providers 表外键。展示名要 join providers.name，不要在这里存自由文本 */
  provider_id: number | null
  /** join providers 得到的展示名；realtime 推送时为 null */
  provider_name: string | null
  /** 库里既有的上下架字段，'active' 才对外展示（不是布尔 is_active） */
  availability_status: string
  /** 库里有真实货币字段，不要再把价格写死成 USD */
  currency: string
  created_at: string | null
  updated_at: string | null
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
  created_at: string | null
  updated_at: string | null
  seo_title: string | null
  seo_description: string | null
}

// 用户 Profile 类型
export type Profile = Database['public']['Tables']['profiles']['Row']
