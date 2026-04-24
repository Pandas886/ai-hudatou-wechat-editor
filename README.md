# AI 胡大头公众号排版编辑器

> 面向公众号长文的 Markdown 排版与发布 HTML 导出工具。

一个为 **AI 胡大头** 打造的公众号排版工具。左侧编辑 Markdown，右侧实时手机预览，并支持导出适合 `wechat-mp-draft` / 公众号发布的 HTML 文件。

![Brand Colors](https://img.shields.io/badge/brand-黄%20%23F4D758-F4D758) ![Brand Colors](https://img.shields.io/badge/accent-蓝%20%232B7FD8-2B7FD8)

## ✨ 现在能做什么

- 📝 **编辑器排版** — 左侧写 Markdown，右侧 375px 手机预览
- 🎨 **组件排版** — 支持对话卡、引用卡、终端金句、图片、CTA、贴纸
- ✋ **选区转组件** — 选中文字后点工具栏按钮，快速插入结构化块
- 🔤 **字体切换** — 标题/正文独立切换字体
- 🖼️ **图片插入** — 支持图片宽度控制（100% / 60% / 40% / 自定义像素）
- 📥 **发布版导出** — 直接导出 `.wechat-mp-draft.html`
- 🧩 **共享发布模块** — 网页按钮和 `bun` 脚本共用同一套发布 HTML 生成逻辑

## 当前项目的工作流

这个项目现在推荐的使用方式是：

1. 把普通文章整理成当前编辑器支持的 Markdown
2. 在编辑器里继续调整排版
3. 导出一份 **发布版 HTML**
4. 再交给 `wechat-mp-draft` 之类的流程发到公众号

## 编辑器支持的语法

| 类型 | 语法 | 说明 |
|------|------|------|
| 一级标题 | `# 标题` | 大字标题 |
| 二级标题 | `## 标题` | 分节标题 |
| 三级标题 | `### 标题` | 小节标题 |
| 副标题 / 引言 | `> 一句话` | 一级标题后的导语 |
| 对话卡 | <code>```chat</code> | 对话气泡 |
| 引用卡 | <code>```quote</code> | 蓝底引用 |
| 终端卡 | <code>```terminal</code> | 深色金句卡 |
| 分隔线 | `---` | 内容断点 |
| 图片 | `![图片|60%](url)` | 正文图片，可带宽度 |
| 贴纸 | `![sticker](url)` | 贴纸图 |
| CTA | `[CTA:文字](url){yellow}` | 黄色按钮 |

## 发布版 HTML 规则

当前仓库已经验证过这些发布规则：

- 首个一级标题在发布版 HTML 中会被自动跳过
- 首图保留
- 贴纸默认不导出
- CTA 在发布版 HTML 中会保留按钮样式，但转成 **非链接按钮**，避免 `wechat-mp-draft` API 拒稿
- 对话卡 / 引用卡 / 终端卡都可以正常用于发布

## 🚀 使用方式

### 1) 打开本地编辑器

```bash
open editor.html
```

或用本地服务打开：

```bash
python3 -m http.server 8080
# 然后访问 http://localhost:8080/editor.html
```

### 2) 在网页中导出发布 HTML

右上角按钮：

- `预览发布 HTML`
- `导出发布 HTML`

导出的文件名形如：

```text
标题.wechat-mp-draft.html
```

### 3) 用 Bun 直接生成发布 HTML

仓库内提供了共享导出脚本：

```bash
bun scripts/export-publishable.mjs /path/to/article.md
```

例如：

```bash
bun scripts/export-publishable.mjs /Users/huzekang/opensource/vibe-writing/output/2026-04-24-anthropic-product-speed-norush-final.md
```

输出文件会默认写回输入文件同目录。

## 发布导出模块

当前发布逻辑已经抽成共享模块：

- `publishable-export.mjs`
- `scripts/export-publishable.mjs`

这意味着：

- 网页按钮使用同一套导出逻辑
- Bun 脚本也使用同一套导出逻辑
- 不再需要分别维护两套发布版 HTML 规则

## 与 wechat-mp-draft 的关系

这个项目负责：

- 生成适合公众号发布的 HTML

`wechat-mp-draft` 负责：

- 上传内容图
- 上传封面图
- 创建公众号草稿

注意：

- 如果 HTML 中还是普通外链图片，真正走公众号 API 时仍需要先替换成微信素材 URL
- 本项目导出的 `.wechat-mp-draft.html` 是“结构正确的发布版 HTML”，不是“自动上传图片后的最终稿”

## 📁 文件结构

```text
norush-wechat-editor/
├── SKILL.md                     # 给 agent 用的工作流说明
├── README.md                    # 本文件
├── editor.html                  # 编辑器主页面
├── publishable-export.mjs       # 共享发布导出模块
├── scripts/
│   └── export-publishable.mjs   # Bun 导出脚本
├── themes.json                  # 品牌色系配置
└── assets/
    └── ip-avatar.jpg            # 默认贴纸
```

## 🎨 自定义

- 修改 `themes.json` 更换品牌色
- 修改 `editor.html` 里的 `STICKER_IMAGE` 更换默认贴纸
- 将自定义字体 `.ttf` 放在同目录，编辑器会自动加载

## 自定义字体

编辑器支持加载本地字体。将 `.ttf` 文件放在 `editor.html` 同目录即可：

- `HuiwenMincho.ttf` — 汇文明朝体（标题推荐）
- `Xiaolai.ttf` — 小赖字体

> 字体文件较大（各约 20MB），未包含在仓库中，请自行获取。

## License

MIT
