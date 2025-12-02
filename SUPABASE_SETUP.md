# Supabase 集成文档

## ✅ 完成的工作

项目已成功从 Strapi 迁移到 Supabase PostgreSQL 数据库。

### 已安装的依赖
- `@supabase/supabase-js` - Supabase JavaScript 客户端

### 创建的文件

#### 1. 环境变量配置
- `.env.local` - 包含 Supabase URL 和匿名密钥

#### 2. 核心文件
- `src/lib/supabase.ts` - Supabase 客户端配置和辅助函数
- `src/lib/supabase-services.ts` - 数据服务层（产品和博客）
- `src/types/supabase.ts` - Supabase 数据库类型定义

#### 3. 更新的页面
- `src/app/[lng]/products/page.tsx` - 产品列表页（支持 en, vi, de, zh）
- `src/app/[lng]/blog/page.tsx` - 博客列表页（支持 en, vi, de, zh）
- `src/app/[lng]/blog/[slug]/page.tsx` - 博客详情页（新建）

## 数据库结构

### esim_products 表
```sql
CREATE TABLE esim_products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description JSONB NOT NULL, -- {"en": "...", "vi": "...", "de": "..."}
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  country TEXT,
  validity_days INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### blog_posts 表
```sql
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title JSONB NOT NULL, -- {"en": "...", "vi": "...", "de": "..."}
  content JSONB NOT NULL, -- Markdown 多语言
  excerpt JSONB,
  tags JSONB DEFAULT '[]'::jsonb,
  author_id UUID,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  seo_meta JSONB DEFAULT '{}'::jsonb -- {"en": {"title": "...", "description": "..."}}
);
```

## 功能特性

### 1. 多语言支持
- 支持语言：en (英语), vi (越南语), de (德语), zh (中文)
- JSONB 字段自动提取对应语言内容
- 回退到英语如果当前语言不存在

### 2. API 服务层

#### 产品服务
- `getProducts()` - 获取产品列表（带分页、筛选）
- `getProductById()` - 获取单个产品
- `subscribeToProducts()` - 实时订阅产品更新

#### 博客服务
- `getBlogPosts()` - 获取博客列表（带分页、标签筛选）
- `getBlogPostBySlug()` - 根据 slug 获取文章
- `subscribeToBlogPosts()` - 实时订阅博客更新

### 3. 类型安全
- 完整的 TypeScript 类型定义
- 数据库 Row 类型映射
- 本地化数据类型（LocalizedProduct, LocalizedBlogPost）

### 4. 错误处理
- 统一的错误处理机制
- 友好的错误消息
- 加载状态组件

## 使用示例

### 获取产品列表
```typescript
import { getProducts } from '@/lib/supabase-services'

const { data: products, error, total } = await getProducts({
  locale: 'vi', // 语言
  page: 1,
  pageSize: 20,
  country: 'Vietnam' // 可选筛选
})
```

### 获取博客文章
```typescript
import { getBlogPosts } from '@/lib/supabase-services'

const { data: posts, error } = await getBlogPosts({
  locale: 'de',
  page: 1,
  pageSize: 10,
  tag: 'travel' // 可选标签筛选
})
```

### 实时订阅
```typescript
import { subscribeToProducts } from '@/lib/supabase-services'

const channel = subscribeToProducts(
  (product, locale) => {
    console.log('Product updated:', product)
  },
  'en'
)

// 取消订阅
channel.unsubscribe()
```

## 环境变量

确保 `.env.local` 文件包含以下变量：
```env
NEXT_PUBLIC_SUPABASE_URL=https://pcbkzqtgzxbhlkkdqxqj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 部署到 Vercel

1. 在 Vercel 项目设置中添加环境变量
2. 推送代码到 GitHub
3. Vercel 会自动构建和部署

## 下一步

### 需要在 Supabase 中完成的设置：

1. **创建数据库表**
   - 运行上面的 SQL 语句创建表结构

2. **插入测试数据**
```sql
-- 插入测试产品
INSERT INTO esim_products (name, description, price, stock, country, validity_days)
VALUES (
  'Vietnam eSIM 30GB',
  '{"en": "30GB high-speed data for Vietnam", "vi": "Gói 30GB tốc độ cao cho Việt Nam", "de": "30GB Hochgeschwindigkeitsdaten für Vietnam", "zh": "越南30GB高速流量"}',
  29.99,
  100,
  'Vietnam',
  30
);

-- 插入测试博客
INSERT INTO blog_posts (slug, title, content, excerpt, tags, status, published_at)
VALUES (
  'welcome-to-our-blog',
  '{"en": "Welcome to Our Blog", "vi": "Chào mừng đến Blog", "de": "Willkommen in unserem Blog", "zh": "欢迎来到我们的博客"}',
  '{"en": "# Welcome\n\nThis is our first post...", "vi": "# Chào mừng\n\nĐây là bài viết đầu tiên...", "de": "# Willkommen\n\nDies ist unser erster Beitrag...", "zh": "# 欢迎\n\n这是我们的第一篇文章..."}',
  '{"en": "Welcome to our new blog", "vi": "Chào mừng đến blog mới", "de": "Willkommen in unserem neuen Blog", "zh": "欢迎来到我们的新博客"}',
  '["news", "announcement"]'::jsonb,
  'published',
  NOW()
);
```

3. **配置 RLS (Row Level Security)**
   - 为公共读取启用 RLS
   - 设置适当的策略

4. **设置 Supabase Storage**（如果需要图片）
   - 创建 public bucket
   - 配置访问策略

## 构建状态

✅ 构建成功 - 所有类型检查通过
✅ 支持多语言 (en, vi, de, zh)
✅ 支持 SSR 和 SSG
✅ 准备部署到 Vercel
