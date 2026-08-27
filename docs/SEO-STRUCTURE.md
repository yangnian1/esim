# 网站的 SEO 结构

> 这份文档讲**网站应该长成什么样**、内容怎么组织、页面之间怎么连。
> 代码怎么写在 `CLAUDE.md`，这里不重复。
>
> 最后更新：2026-08-25

---

## 1. 核心模型：枢纽 + 辐条

一个主题不是「一堆相关文章」，而是：

> **一个商业枢纽页 + 一圈信息型文章，靠内链把权重汇聚到枢纽。**

```
                    ┌─────────────────────────┐
                    │  枢纽 (Hub)              │
     辐条 ──────────▶│  /de/esim-tuerkei       │──────▶ 产品页
     辐条 ──────────▶│  打头部词「eSIM Türkei」  │──────▶ 出站赚钱
     辐条 ──────────▶│  产品对比表 + 出站按钮    │
                    └─────────────────────────┘
                              ▲
                              │
                            首页
```

- **枢纽**：你真正想冲排名、也真正赚钱的那一个页面。**一个主题只有一个。**
- **辐条**：打长尾词的教程/攻略。它们的任务是把流量和权重送进枢纽。

辐条自己也能带来流量，但**不要指望辐条转化**。用户搜「怎么激活」时不是来买的，
他看完教程顺着内链进枢纽，才是转化的时机。

---

## 2. 目标结构

```
/de                                         首页
│   └─ 「热门目的地」区块 → 列出全部枢纽（数据驱动，自动出现）
│
├── /de/esim-tuerkei              ★ 枢纽：土耳其
│   ├── /de/blog/esim-tuerkei-aktivieren      激活教程
│   ├── /de/blog/esim-tuerkei-iphone          iPhone 专门
│   ├── /de/blog/esim-tuerkei-android         Android 专门
│   ├── /de/blog/esim-tuerkei-gesperrt        「被封锁了?」
│   ├── /de/blog/esim-istanbul                伊斯坦布尔
│   └── /de/blog/tuerkei-datenverbrauch       该买多少流量
│
├── /de/esim-japan               ★ 枢纽：日本（同样结构）
│   └── ...
│
└── /de/products/{id}             产品页：转化终点
```

对应到代码：

| 角色 | 数据来源 | 路由 | 加新的要不要改代码 |
|------|---------|------|-----------------|
| 枢纽 | `landing_pages` | `/{lng}/{slug}` | **不用**，后台新建一行 |
| 辐条 | `blog_posts` | `/{lng}/blog/{slug}` | **不用**，后台写文章 |
| 产品页 | `esim_products` | `/{lng}/products/{id}` | **不用** |
| 首页入口 | `landing_pages` | `/{lng}` | **不用**，自动列出 |

---

## 3. 三种页面各自的职责

### 枢纽页（landing_pages）

**目标**：头部商业词，如 `eSIM Türkei`、`eSIM Japan`

必须有：
- 产品对比表（实时从 `esim_products` 按国家取）
- 「买多少流量合适」这类**决策辅助**内容
- FAQ（会自动输出 `FAQPage` 结构化数据）
- 指向全部辐条的「延伸阅读」

**不要**写成长篇教程。教程放辐条，枢纽保持「能快速做决定」。

### 辐条文章（blog_posts）

**目标**：长尾词，一篇打一个，**不能和枢纽抢词**

必须有：
- 正文前段一次、结尾一次链回枢纽，锚文本用枢纽的目标词
- 真正解决那个具体问题（教程就把步骤写全）

### 产品页（esim_products）

**目标**：不主动做排名，是转化终点

它们由 `product_localizations` 提供各语种文案，自动带 `Product` 结构化数据、
联盟披露和出站按钮。枢纽页的对比表链到这里。

---

## 4. 内链规则

```
辐条  →  枢纽      每篇 2 次（前段 + 结尾），锚文本 = 枢纽目标词
枢纽  →  辐条      枢纽页要有「延伸阅读」列出全部辐条
辐条 ↔ 辐条       只在真的相关时链（iPhone 教程 ↔ Android 教程）
首页  →  枢纽      ✅ 已实现（热门目的地区块）
枢纽  →  产品页    ✅ 已实现（对比表）
```

### 锚文本

```
✅  在我们的 <a>eSIM Türkei Übersicht</a> 里可以比较全部 Tarife
❌  更多信息请 <a>点这里</a>
```

链到枢纽时用目标词，这是告诉 Google「那个页面是讲这个的」。

### 一条硬规则

**每篇新文章发布前，先问：它链回枢纽了吗？**

没有内链的文章 = 孤儿页。搜索引擎靠 sitemap 能发现它，但不会认为它重要。

---

## 5. 关键词分配：避免自相残杀

**一个词只能有一个页面去打。** 两个页面抢同一个词，Google 不知道给谁排名，
内链和外链被劈成两半，通常两个都排不上去。

### 现有的冲突（待解决）

```
/de/esim-tuerkei         eSIM Türkei 2026: Die besten Tarife für Urlaub und Istanbul
/de/blog/esim-tuerkei    eSIM Türkei (esim türkei) 2026: Tarife vergleichen, aktivieren...
                         ↑ 两个都在打「eSIM Türkei」
```

**处理方式**：落地页当枢纽保留；那篇博客改打 `eSIM Türkei aktivieren`
（改 slug 为 `esim-tuerkei-aktivieren`，标题和 SEO 字段同步改）。

### 关键词分配表（2026-08-25 调研）

数据来源：Google 德语搜索建议接口（`hl=de&gl=de`），52 个前缀扫描，去重 298 个真实搜索词。
这是**当期真实数据**，不是工具的历史数据库。

#### 枢纽：`/de/esim-tuerkei`

所有**商业意图**的词都归它，**不要为它们单独写文章** —— 那是自相残杀的头号来源：

```
核心词      esim türkei · esim karte türkei · esim für die türkei · türkei esim
对比选型    beste esim türkei · esim türkei vergleich · esim türkei anbieter
            bester anbieter · esim türkei test · erfahrungen · bewertung
价格        esim türkei kosten · preise · günstig · billig · günstigste
购买        esim türkei kaufen · wo kaufen · online kaufen · bestellen
套餐时长    esim türkei 7 / 10 / 14 / 30 tage · 1 woche · 2 wochen
不限量      esim türkei unbegrenzt · unlimited · flat
```

⚠️ `esim karte türkei` 和 `esim für die türkei` 只是主词的说法变体，**不是独立目标**。

#### 辐条（按建议顺序）

| # | 目标词 | 意图 | slug | 状态 | 为什么这个顺序 |
|---|--------|------|------|------|--------------|
| 1 | esim türkei gesperrt | 信息/排障 | `esim-tuerkei-gesperrt` | 待写 | **最该先写**。9 个相关词（gesperrt / verbot / verboten / erlaubt / nicht gesperrt / was tun）说明这是真实且强烈的顾虑，而大品牌官网不会主动写「我们可能被封」，竞争最弱 |
| 2 | esim türkei aktivieren | 信息/教程 | `esim-tuerkei-aktivieren` | **改造现有文章** | 14 个相关词。现有那篇正文里已有激活步骤，改 slug + 标题即可，顺便解决关键词冲突 |
| 3 | esim türkei telefonieren | 信息 | `esim-tuerkei-telefonieren` | 待写 | 27 个相关词（telefonieren / eigene nummer / mit rufnummer / hotspot / whatsapp）。旅行 eSIM 多为纯流量卡，「能不能打电话」是普遍困惑 |
| 4 | wie viel datenvolumen türkei | 信息→商业 | `tuerkei-datenvolumen` | 待写 | 直接支撑购买决策，是导向枢纽最自然的一篇 |
| 5 | esim türkei iphone / samsung | 信息/设备 | 并入 #2 或拆分 | 待定 | 量不大，先并进激活教程；如果那篇太长再拆 |
| 6 | esim türkei istanbul / antalya | 信息/地点 | `esim-istanbul` 等 | 以后 | 城市页在有 3~4 篇基础内容后再做 |

#### 暂时不做

| 类型 | 例子 | 原因 |
|------|------|------|
| 品牌词 | `esim türkei airalo` `holafly` `saily` | 44 个词，但要和品牌官网抢自己的名字，新站打不过。等有权重再说 |
| 德国运营商 | `vodafone` `telekom` `congstar` `ayyildiz` | 用户在找传统运营商的漫游方案，不是你的产品 |

#### 调研中发现的两个信号

- **`ayyildiz` / `türk telekom` 出现在建议里** —— 说明受众里有**在德土耳其裔**，不只是游客。
  这类用户的需求（长期、通话、本地号码）和游客不同，值得后续单独考虑。
- **`esim türkei unbegrenzt` 有相当热度** —— 但 Airalo 的 Merhaba 是限量套餐。
  想覆盖这个词，产品库里得有不限量产品（Holafly 主打这个）。**这会影响你申请哪家联盟。**

---

## 6. 结构化数据清单

### 现状（2026-08-25 线上实测）

| 页面 | 现有 | 缺 |
|------|------|-----|
| `/de` 首页 | 无 | `WebSite`、`Organization` |
| `/de/esim-tuerkei` 枢纽 | **无** | `FAQPage`、`BreadcrumbList` |
| `/de/blog/...` | `FAQPage` | `Article`、`BreadcrumbList` |
| `/de/products/{id}` | `Product`、`Offer` | `BreadcrumbList` |

⚠️ **枢纽页一个结构化数据都没有**，而它是最重要的页面。
FAQ 内容在数据库里是有的（`landing_pages.faq`），只是没输出。

`BreadcrumbList` 全站都没有——页面上有视觉面包屑，但没告诉搜索引擎，
搜索结果里就不会显示路径层级。

---

## 7. 扩展到新主题的清单

想做「日本」这个主题时，按顺序：

```
□ 1. 产品先行
     esim_products 里要有该国家的产品，否则枢纽页的对比表是空的
     → 空对比表 = 低质量页面，新站对这个很敏感

□ 2. 建枢纽页
     后台「落地页」新建一行，locale=de，slug=esim-japan
     content 里放 cards / products / richtext / steps / callout / cta

□ 3. 写 3~5 篇辐条
     每篇打一个不冲突的长尾词，全部内链回枢纽

□ 4. 在枢纽页加「延伸阅读」链到全部辐条

□ 5. 首页会自动出现入口（无需操作）
```

**第 1 步是硬前提。** 目前只有土耳其的产品，所以现在只能做土耳其这一个簇。

---

## 8. 用 Google Search Console 找机会

GSC 是**你自己站点的真实数据**，比任何第三方工具都准，而且免费。
它和 Google Analytics 管的不是一回事：

| | 管什么 |
|---|---|
| **GSC** | 用户**到达之前**：搜了什么词、你排第几、展示多少次、被点几次 |
| GA | 用户**到达之后**：看了哪些页、停留多久 |

**做 SEO 主要看 GSC。**

### 先建起来，越早越好

数据是从验证那天开始累积的，**建晚了就永远缺那一段**。

```
1. search.google.com/search-console → 添加资源
2. 选「网域」类型（覆盖 www 和非 www），用 DNS TXT 记录验证
3. 左侧 Sitemaps → 提交 sitemap.xml
4. 对重点页面用「网址检查」→「请求编入索引」
```

### 分三个阶段看

#### 阶段 0：还没有数据（现在）

这时 GSC 的价值不是看流量，是**诊断**：

- **索引编制 → 网页**：有多少被收录、多少被排除、排除原因是什么
- **网址检查**：单独查一个 URL，看 Google 抓到的内容和你以为的是否一致
- **Sitemap 状态**：49 条 URL 里有几条被读取、有没有报错

⚠️ 重点确认 canonical 和 hreflang 有没有被正确理解——那是这个站
最容易出问题的地方（见第 6 节）。

#### 阶段 1：开始有展示量

**「效果」报告里最值钱的是「查询」标签页**——它告诉你
**你实际被搜到的词**，而不是你以为的词。

这里经常有意外：某个你没刻意优化的长尾词带来了展示，
那说明真实需求在那儿。把它加进 `SEO-STRUCTURE.md` 第 5 节的分配表。

也要看**「网页」标签页**：哪些页面在被搜到。如果某篇文章零展示，
通常是没有内链（孤儿页）或者标题没打中任何词。

#### 阶段 2：有排名之后 —— striking distance

**排名 5-20 位的词投入产出比最高。** 它们已经有一定权重，
推一把就可能进前 3，而前 3 和第 10 的点击率差好几倍。

从零开始做一个新词，远比把第 12 名推到第 5 名费劲。

**不用买工具也能做**：

```
GSC → 效果 → 查询 → 打开「平均排名」列 → 导出 CSV
筛选：平均排名 5–20  且  展示量 > 某个阈值
```

筛出来的每一行都是一个具体的优化机会。拿到之后逐个判断：

| 情况 | 怎么办 |
|------|--------|
| 这个词已经有对应文章 | 补充内容深度、加内链、优化标题 |
| 只是某篇文章顺带排上的 | 考虑给它单独写一篇 |
| 意图和现有文章不符 | 新开一篇，注意别和现有的抢词 |

⚠️ **别在没有数据时提前买 Semrush 这类工具。** 它们的价值在于
竞品分析和难度评分，那要等你有排名之后才用得上。
现阶段免费的 Google 搜索建议已经够用——
`keyword-research-esim-tuerkei.txt`（同目录）那 297 个词就是这么来的。

### 提交 sitemap 前必须确认

- [ ] `NEXT_PUBLIC_SITE_URL` 已配置（否则 sitemap 里是占位域名）
- [ ] 随便打开一条 sitemap 里的 URL，确认返回 200 而不是 404
- [ ] 页面的 canonical 指向真实域名

---

## 9. 常见错误

| 错误 | 后果 |
|------|------|
| 两个页面打同一个词 | 自相残杀，两个都排不好 |
| 文章不链回枢纽 | 孤儿页，权重不汇聚 |
| 锚文本写「点这里」 | 浪费了最重要的排名信号 |
| 产品还没有就先建枢纽页 | 空对比表，低质量页面 |
| 一个主题建多个枢纽 | 权重分散 |
| 只靠 sitemap 让页面被发现 | 能被收录，但不会被认为重要 |
| 铺 20 个国家的空壳页 | 新站最容易因此被判定为薄内容 |

---

## 10. 现在的优先级（2026-08-27）

已完成：关键词冲突已解决（那篇支柱文改成了 `esim-tuerkei-aktivieren`），
`Article` 结构化数据和图片站点地图已补。

```
1. 提交 sitemap 到 GSC              ← 十分钟，数据从验证那天才开始累积
2. 围绕土耳其继续写辐条              ← 真正的瓶颈
3. 补枢纽页的 FAQPage               ← 落地页的 faq 字段有数据但没输出
4. 给枢纽页加「延伸阅读」版块        ← 让枢纽能链回辐条，目前只有单向
5. 全站 BreadcrumbList              ← 有视觉面包屑但没告诉搜索引擎
```

**第 2 条是瓶颈,不是第 3、4、5 条。** 管道已经通了,缺的是内容。

下一篇建议按第 5 节的辐条表:`esim-tuerkei-telefonieren`
（27 个相关词，「旅行 eSIM 能不能打电话」是普遍困惑）。

### 内容之外还欠着的

- 12 个产品的 `affiliate_url` 全是空的 —— 出站按钮至今不显示
- 联盟账号还没申请（有审核周期，且审核更看内容量而不是流量）
- 几个页面有不实表述（`Nr. 1 Anbieter`、`24/7 Support`、`over 200 countries`），
  德国 UWG 风险，和收不收录无关，该改
- 德语内容还没有母语视角通读过
