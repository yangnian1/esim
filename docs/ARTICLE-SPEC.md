# 文章格式规范

> **这份文档有两个用途,改的时候两边都要顾到:**
> 1. 你把它整份粘给 AI,作为写文章的指令
> 2. 后台导入时按它逐条校验,不合规就拒绝
>
> 所以**每一条规则都必须是机器能检查的**。写不进校验器的规则不要写进来,
> 那只是装饰。
>
> 内容策略(枢纽/辐条、关键词分配)见 `web/docs/SEO-STRUCTURE.md`,这里只讲格式。
>
> 最后更新:2026-08-26

---

## 交付形式

一篇文章 = 一个 `.md` 文件,文件名 = slug,例如 `esim-tuerkei-gesperrt.md`。

结构固定为两部分:

```
---
（frontmatter：元数据 + 制作说明）
---

（正文 Markdown）
```

---

## 一、Frontmatter

```yaml
---
slug: esim-tuerkei-gesperrt
locale: de
title: "eSIM Türkei gesperrt? Das solltest du vor der Reise wissen"
seo_title: "eSIM Türkei gesperrt? Ursachen & Lösungen 2026"
seo_description: "Warum manche Reise-eSIMs in der Türkei nicht funktionieren, wie du das vorher prüfst und was du tun kannst, wenn die Verbindung ausfällt."
excerpt: "Kurze Zusammenfassung in ein bis zwei Sätzen."
hub: /de/esim-tuerkei
template: pillar
toc: true
tags: [esim, tuerkei, troubleshooting]

# 制作说明——只给运营看，永远不会出现在页面上
images:
  - after: "Warum eSIMs gesperrt werden"
    alt: "Netzwerkeinstellungen auf dem iPhone mit aktiviertem Datenroaming"
    caption: "Datenroaming muss für die eSIM einzeln aktiviert werden"
  - after: "Was tun, wenn es nicht geht"
    alt: "Fehlermeldung Kein Netz auf einem Android-Gerät"

planned_links:
  - /de/blog/esim-tuerkei-funktioniert-nicht
---
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `slug` | ✅ | 小写字母、数字、连字符。**必须和目标关键词一致**,不要加年份 |
| `locale` | ✅ | `de` / `en` / `zh`。决定内容进哪个语种栏 |
| `title` | ✅ | 页面 H1。**正文里不要再写 `# 标题`** |
| `seo_title` | ✅ | 搜索结果里显示的那一行,**≤ 60 字符** |
| `seo_description` | ✅ | **120–160 字符**,要包含目标关键词 |
| `excerpt` | ✅ | 列表页摘要,1–2 句 |
| `hub` | ✅ | 本文所属枢纽页的路径。正文里必须有一个 `<HubCta>` 指向它 |
| `template` | | `pillar`(带目录侧栏)或 `blog`(普通)。默认 `blog` |
| `toc` | | `template: pillar` 时是否显示目录,默认 `true` |
| `tags` | | 数组 |
| `images` | | **图片待办清单**,见下 |
| `planned_links` | | 计划中但尚不存在的文章。**正文里绝不能链它们** |

### ⚠️ 制作说明只能放这里

`images`、`planned_links` 这类**写给运营看的东西,只能出现在 frontmatter**。

历史教训:曾经有文章把「> Interne Links (baue diese Guides als eigene Seiten/Posts):」
和 `{{internal:/de/blog/...}}` 写进正文,结果这些制作笔记被当成正文发布,
德语读者在线上直接看到了。**正文里的每一个字都是给读者的。**

---

## 二、正文

### 标题层级

```
不要写 # H1        ← 模板已经用 title 渲染了 H1，再写会变成两个
## 二级标题        ← 正文从这里开始
### 三级标题
```

`##` 和 `###` 会自动进目录并生成锚点,不用手写目录。

### 能用的组件(白名单)

**只有这三个。用了别的,导入会被拒绝。**

#### `<HubCta>` —— 指向枢纽页,每篇必须有且只有一个

```mdx
<HubCta href="/de/esim-tuerkei" label="eSIM Türkei Übersicht">
**Du suchst noch den passenden Tarif?** Alle Angebote mit aktuellen Preisen findest du in der Übersicht.
</HubCta>
```

- `href` 必须等于 frontmatter 里的 `hub`
- `label` 是链接文字,**必须用枢纽页的目标关键词**,不能写「点这里」「mehr erfahren」

#### `<TurkeyPlansWidget />` —— 土耳其产品对比表

```mdx
<TurkeyPlansWidget />
```

自渲染,不用传参。只在 `template: pillar` 下生效。

#### `<Figure />` —— 带说明的图片

```mdx
<Figure src="https://…/bild.png" alt="描述" caption="图注" width={1200} height={800} />
```

**AI 不要自己写这个标签** —— 你没有真实图片。把需要的图写进 frontmatter 的 `images`,
由运营截图上传后插入。

### 组件写法的硬规则

```
✅  <TurkeyPlansWidget />        标准 JSX
❌  {{TurkeyPlansWidget}}        MDX 会当成 JS 对象 → 抛错
❌  `{{TurkeyPlansWidget}}`      加反引号 → 变成字面量代码文字
```

历史上用的就是第三种,导致产品组件从未渲染过。

### 内链

```
✅  链到已存在的页面：[eSIM Türkei Übersicht](/de/esim-tuerkei)
❌  链到还没写的文章
❌  任何形式的占位符（{{internal:...}} 之类）
```

**要链的文章还没写,就不要链。** 把它写进 frontmatter 的 `planned_links`,
等文章上线后再回来补。

锚文本用目标关键词,不要用「hier」「点这里」。

### FAQ

放在正文最后,格式固定 —— 系统靠它生成 `FAQPage` 结构化数据:

```markdown
## FAQ

### Funktioniert eSIM in der Türkei?
回答段落。

### Kann ich die eSIM schon in Deutschland aktivieren?
回答段落。
```

- 标题必须正好是 `## FAQ`
- 每个问题用 `###`,问题要用**用户真实的搜索问法**
- 建议 5–8 条

---

## 三、内容禁令

这几条不只是风格问题,**主攻市场是德国,踩了有法律风险**。

| 禁止 | 原因 |
|------|------|
| 正文写具体价格 | 价格会变,没有同步机制。过时价格违反 Preisangabenverordnung。价格交给 `<TurkeyPlansWidget />` 实时渲染 |
| 「Nr. 1」「beste」这类无依据的最高级 | UWG 下的 Abmahnung 风险 |
| 编造用户评价、测评数据 | 同上,且违反 Google 垃圾内容政策 |
| 编造覆盖率、网速、国家数量 | 只能陈述数据库里有依据的事实 |
| 承诺 24/7 客服等不存在的服务 | 虚假宣传 |

正确写法示例:

```
❌  Der 7-Tage-Tarif mit 3 GB kostet 6 USD.
✅  Für eine Woche reichen den meisten Reisenden 3–5 GB.
    Die aktuellen Preise findest du in der Tarifübersicht.
```

---

## 四、写作要求

- **语言**:按 `locale` 写。德语用 du 称呼(与现有内容一致)
- **长度**:辐条文章 1200–2000 词
- **目标词**:出现在 `seo_title`、`title`、第一段、至少一个 `##` 里 —— 但不要堆砌
- **一篇只打一个词**:不要在同一篇里同时冲 `eSIM Türkei` 和 `eSIM Türkei aktivieren`,
  那是自相残杀(见 `web/docs/SEO-STRUCTURE.md` 第 5 节)
- **开头 100 词内**给出结论,不要铺垫

---

## 五、完整示例

```markdown
---
slug: esim-tuerkei-gesperrt
locale: de
title: "eSIM Türkei gesperrt? Das solltest du wissen"
seo_title: "eSIM Türkei gesperrt? Ursachen & Lösungen 2026"
seo_description: "Warum manche Reise-eSIMs in der Türkei nicht funktionieren, wie du das vorher prüfst und was du tun kannst, wenn die Verbindung ausfällt."
excerpt: "Was hinter gesperrten eSIMs in der Türkei steckt und wie du dich absicherst."
hub: /de/esim-tuerkei
template: pillar
toc: true
tags: [esim, tuerkei, troubleshooting]
images:
  - after: "Woran du es vorher erkennst"
    alt: "iPhone Einstellungen mit aktiviertem Datenroaming für die eSIM"
planned_links:
  - /de/blog/esim-tuerkei-funktioniert-nicht
---

Kurz vorweg: Reise-eSIMs funktionieren in der Türkei grundsätzlich …

<HubCta href="/de/esim-tuerkei" label="eSIM Türkei Übersicht">
**Du suchst noch den passenden Tarif?** Alle Angebote mit aktuellen Preisen findest du in der Übersicht.
</HubCta>

## Warum eSIMs in der Türkei gesperrt werden

Text …

## Woran du es vorher erkennst

Text …

## FAQ

### Ist eSIM in der Türkei verboten?
Antwort …

### Was tun, wenn die eSIM nicht funktioniert?
Antwort …
```

---

## 六、导入时会校验什么

后台「导入 Markdown」会逐条检查。**红色项会拒绝导入,黄色项只提示。**

| 级别 | 检查 |
|------|------|
| 🔴 | frontmatter 缺必填字段 |
| 🔴 | `locale` 不在 `en` / `zh` / `de` 里 |
| 🔴 | 正文含 `# H1` |
| 🔴 | 用了白名单外的组件标签 |
| 🔴 | 出现 `{{...}}` 写法 |
| 🔴 | 内链指向不存在的页面 |
| 🔴 | 没有 `<HubCta>`,或它的 `href` 和 `hub` 不一致 |
| 🟡 | `seo_title` > 60 字符 |
| 🟡 | `seo_description` 不在 120–160 字符之间 |
| 🟡 | 没有 `## FAQ` 小节 |
| 🟡 | `images` 里有未上传的图 |
| 🟡 | slug 已存在(会变成更新而不是新建) |
