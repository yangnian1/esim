# 项目组件文档

本文档列出了项目中所有可复用的组件及其功能。

## UI 组件

### LoadingOverlay
**位置**: `src/components/ui/LoadingOverlay.tsx`
**类型**: 客户端组件
**功能**: 全屏Loading蒙版组件

**Props**:
- `isVisible: boolean` - 是否显示Loading
- `message?: string` - 自定义加载信息
- `lng?: string` - 语言设置 ('zh' | 'en')
- `onCancel?: () => void` - 取消回调函数

**特性**:
- 🌐 全屏蒙版覆盖
- 📱 响应式设计（PC/移动端）
- 🎨 毛玻璃背景效果
- ⚡ 旋转动画加载器
- 🔒 阻止背景滚动
- ❌ 可选取消功能

**使用示例**:
```tsx
import { LoadingOverlay } from '@/components'

const [loading, setLoading] = useState(false)

<LoadingOverlay
  isVisible={loading}
  message="正在加载..."
  lng="zh"
  onCancel={() => setLoading(false)}
/>
```

## 业务组件

### BlogPreview
**位置**: `src/components/BlogPreview.tsx`
**类型**: 客户端组件
**功能**: 首页文章预览组件

**Props**:
- `articles: Article[]` - 文章数据数组
- `lng: string` - 语言设置

**特性**:
- 📱 网格布局响应式
- ⚡ 集成LoadingOverlay
- 🖼️ 文章特色图片
- 📅 统一日期格式
- 🔗 文章详情跳转

### ArticleList
**位置**: `src/components/ArticleList.tsx`
**类型**: 客户端组件
**功能**: 博客页面文章列表组件

**Props**:
- `articles: Article[]` - 文章数据数组
- `lng: string` - 语言设置

**特性**:
- 📝 文章卡片布局
- ⚡ 集成LoadingOverlay
- 🖼️ 文章特色图片
- 📅 统一日期格式
- 👤 作者信息显示

### CustomerReviews
**位置**: `src/components/CustomerReviews.tsx`
**类型**: 客户端组件
**功能**: 客户评价展示组件

**Props**:
- `lng: string` - 语言设置

**特性**:
- ⭐ 星级评分显示
- 🌐 多语言支持
- 📅 评价日期格式化

### ArticleShowcase
**位置**: `src/components/ArticleShowcase.tsx`
**类型**: 客户端组件
**功能**: 文章展示组件（带筛选功能）

**Props**:
- `articles: Article[]` - 文章数据
- `lng: string` - 语言设置
- `categories?: Category[]` - 分类数据
- `selectedCategoryId?: number | null` - 选中的分类ID

**特性**:
- 🏷️ 分类筛选
- 📱 响应式网格布局
- 📅 日期格式化
- 🔗 文章跳转

## 导入方式

### 单个组件导入
```tsx
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { BlogPreview } from '@/components/BlogPreview'
```

### 统一导入（推荐）
```tsx
import { LoadingOverlay, BlogPreview, ArticleList } from '@/components'
```

## 组件使用规范

1. **Loading组件**: 任何需要异步操作的地方都可以使用LoadingOverlay
2. **业务组件**: 已经集成了Loading状态，可以直接使用
3. **日期格式**: 统一使用`apiUtils.formatDate(article.createdAt, lng === 'zh' ? 'zh-CN' : 'en-US')`
4. **图片URL**: 统一使用`apiUtils.getImageUrl(imageUrl)`处理

## 如何告知AI现有组件

当你需要告诉AI已经存在哪些组件时，可以通过以下方式：

### 方法1: 引用此文档
```
根据COMPONENTS.md文档，我们已经有了以下组件：LoadingOverlay、BlogPreview、ArticleList等
```

### 方法2: 列出组件路径
```
现有组件：
- src/components/ui/LoadingOverlay.tsx (全屏Loading)
- src/components/BlogPreview.tsx (文章预览)
- src/components/ArticleList.tsx (文章列表)
```

### 方法3: 附加具体组件文件
在对话中直接附加相关组件文件，AI会自动识别现有功能。

### 方法4: 简单描述
```
我们已经有了一个全屏Loading组件(LoadingOverlay)和几个文章相关组件，请复用这些现有组件
``` 