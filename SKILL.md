---
name: ai-hudatou-wechat-editor
description: >
  AI 胡大头公众号排版 skill。把普通文章、纯文本或标准 Markdown，改写成当前编辑器支持的排版 Markdown，必要时注入对话卡、引用卡、终端金句、CTA 等组件，再导出为适合 wechat-mp-draft / 公众号发布的 HTML。
  Use when: 公众号排版、文章转微信长文、普通文本转排版 Markdown、AI 胡大头 editor、wechat-mp-draft HTML。
---

# AI 胡大头公众号排版 Skill

这个 skill 不是单纯介绍 `editor.html` 是什么，而是告诉 agent：

1. 如何接收一篇普通文章（纯文本 / 普通 Markdown）
2. 如何把它整理成当前编辑器支持的 Markdown 语法
3. 如何在合适的地方使用组件强化排版
4. 如何导出为适合公众号发布的 HTML

## 目标

把一篇普通内容转成两份产物：

- 一份 **适合本项目编辑器继续编辑** 的 Markdown
- 一份 **适合公众号发布** 的 HTML

优先保证：

- 风格接近当前编辑器预览效果
- 导出的 HTML 满足当前项目已经验证过的发布要求
- 生成结果可直接继续接 `wechat-mp-draft` 工作流

## 当前项目真实能力边界

### 编辑器支持的 Markdown / 组件语法

| 类型 | 语法 | 用途 |
|------|------|------|
| 一级标题 | `# 标题` | 大字标题 |
| 二级标题 | `## 标题` | 分节标题 |
| 三级标题 | `### 标题` | 小节标题 |
| 副标题 / 引言 | `> 一句话` | 一级标题后的引导语 |
| 对话卡 | <code>```chat</code> | 对话气泡 |
| 引用卡 | <code>```quote</code> | 蓝底引用 |
| 终端卡 | <code>```terminal</code> | 深色金句卡 |
| 分隔线 | `---` | 内容断点 |
| 图片 | `![图片|60%](url)` | 正文图片，可带宽度 |
| 贴纸 | `![sticker](url)` | 贴纸图 |
| CTA | `[CTA:文字](url){yellow}` | 黄色按钮 |

### 当前项目已有的发布导出能力

当前仓库已经实现了共享发布模块：

- `publishable-export.mjs`
- `scripts/export-publishable.mjs`

网页按钮和 Bun 都共用它：

```bash
bun scripts/export-publishable.mjs article.md
```

### 当前已验证过的发布规则

这些规则已经在真实 `wechat-mp-draft` 发布链路里验证过：

- 首个一级标题在发布版 HTML 里会被自动跳过
- 首图可以保留
- 贴纸默认不导出
- CTA 在发布版 HTML 里会保留视觉样式，但会转成 **非链接按钮**，避免 API 拒稿
- 对话卡 / 引用卡 / 终端卡都可以发布

## agent 应该怎么用这个 skill

### 输入可以是什么

以下输入都可以：

- 一篇普通文本文章
- 一篇标准 Markdown
- 一个大纲 + 一组段落
- 已经写好的公众号文案

### 输出应该是什么

agent 应该产出：

1. `*.md`：符合当前编辑器语法的排版 Markdown
2. `*.wechat-mp-draft.html`：可用于公众号发布的 HTML

如果用户没有指定输出路径，默认输出到：

```text
/Users/huzekang/opensource/vibe-writing/output/
```

Markdown 文件名建议沿用内容主题 + 日期，例如：

```text
2026-04-24-anthropic-product-speed-norush-final.md
```

## 固定模板要求

### 固定开头格式

生成的 Markdown，开头必须固定为：

```md
# Anthropic 为什么能把产品迭代速度拉到这么离谱
> AI 时代，PM 最重要的能力不再是规划，而是缩短距离。



---
```

注意：

- 上面这段在当前 skill 下视为固定模板
- 保持标题、副标题和分隔线结构一致
- 空行也尽量保持一致，避免 agent 随意压缩

### 固定结尾格式

生成的 Markdown，结尾必须固定为：

```md
---

[CTA:关注AI 胡大头](https://mp.weixin.qq.com){yellow}
```

注意：

- 这是 **Markdown 层** 的固定结尾
- 发布版 HTML 中，CTA 会自动转成非链接按钮，这是正常行为

## 组件使用策略

不要为了“花哨”硬塞组件；组件应该服务内容。

### 什么时候适合加组件

#### `quote`
适合：
- 观点总结
- 节奏强的判断句
- 引用访谈 / 播客 / 人物原话

推荐结构：

~~~md
```quote
label: 产品节奏
text: 从 6 个月，到 1 个月，甚至 1 天。AI 产品迭代速度被拉到离谱之后，PM 的工作也跟着变了。
source: Cat Wu / Lenny's Podcast
```
~~~

#### `terminal`
适合：
- 金句
- 结论
- 带技术感、命令感的总结句

推荐结构：

~~~md
```terminal
prompt: pm --think
text: 不是管理流程，而是设计速度系统。
footer: AI 胡大头 · 不赶时间
```
~~~

#### `chat`
适合：
- 把抽象观点写得更有代入感
- 用自问自答解释概念
- 把复杂论点压成几轮对话

推荐结构：

~~~md
```chat
我：PM 的价值，是不是就是把大家协调好？
sootie：不只是协调。
我：那是什么？
sootie：是消灭阻力，让系统默认跑得更快。
```
~~~

#### 图片
适合：
- 强化段落切换
- 给长文节奏留呼吸感
- 视觉化一个抽象判断

用法：

```md
![插图：缩短想法和用户之间的距离|100%](https://example.com/image.webp)
```

#### 贴纸
默认 **不建议主动加**。

原因：
- 当前项目发布版导出默认不导出贴纸
- 除非用户明确要求保留贴纸氛围，否则 agent 不应主动依赖贴纸表达关键信息

## agent 的标准工作流

### 步骤 1：整理原始内容

如果输入是普通文本 / 普通 Markdown：

- 保留原观点和段落顺序
- 去掉不必要的口头冗余
- 按公众号长文节奏分段
- 在适合的位置插入组件

### 步骤 2：生成编辑器可用 Markdown

要求：

- 开头使用固定模板
- 结尾使用固定 CTA 模板
- 中间内容尽量使用本项目支持的语法
- 不支持的复杂 Markdown 语法要主动降级为普通段落或组件块

### 步骤 3：导出发布 HTML

优先使用共享导出模块：

```bash
bun scripts/export-publishable.mjs /path/to/article.md
```

这会生成一份 `.wechat-mp-draft.html` 文件。

### 步骤 4：需要时交给 wechat-mp-draft

如果用户要求进一步发草稿：

- 上传内容图
- 替换图片 URL
- 上传封面图
- 用 `wechat-mp-draft` 创建草稿

## 推荐命令

### 本地导出发布 HTML

```bash
bun scripts/export-publishable.mjs /Users/huzekang/opensource/vibe-writing/output/2026-04-24-anthropic-product-speed-norush-final.md
```

### 浏览器中打开编辑器

```bash
open editor.html
```

## agent 行为要求

### 应该做

- 优先把普通文章改成当前编辑器支持的 Markdown
- 在合适位置使用组件，但克制使用
- 保持固定开头和固定结尾
- 导出为 `.wechat-mp-draft.html`
- 当用户要求发草稿时，再走 `wechat-mp-draft`

### 不应该做

- 不要跳过固定开头 / 固定结尾
- 不要随意把 CTA 改成别的形式
- 不要把贴纸当作核心内容组件
- 不要为了追求“像网页”而引入当前编辑器不支持的复杂 Markdown 语法
- 不要假设所有外链图片都能直接用于公众号 API

## 产物检查清单

在交付 Markdown 或 HTML 前，agent 应检查：

- 是否包含固定开头
- 是否包含固定结尾 CTA
- 是否只有支持的组件语法
- 是否导出了 `.wechat-mp-draft.html`
- 是否误带了贴纸
- 是否保留了正文首图
- 是否 CTA 在发布版中已转为非链接按钮

## 一句话总结

这个 skill 的作用不是“打开一个编辑器”，而是：

> 把普通文章转成 AI 胡大头编辑器可编辑的 Markdown，并进一步导出成适合公众号发布的 HTML。
