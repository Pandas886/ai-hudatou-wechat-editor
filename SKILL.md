---
name: norush-wechat-editor
description: >
  NORUSH 公众号排版网页编辑器。左侧 Markdown 编辑 + 右侧手机实时预览，支持对话气泡、引用卡、终端金句、
  IP贴纸、CTA按钮等 6 种自定义组件，选区转组件、字体切换、图片插入、撤回，一键导出微信兼容 HTML。
  Use when: 公众号排版、微信编辑器、wechat layout、文章排版、NORUSH editor。
---

# NORUSH 公众号排版编辑器

一个自包含的网页编辑器，用于创作和导出公众号文章。

## 使用方式

直接在浏览器中打开 `editor.html` 即可使用。

```bash
open editor.html
```

## 功能

### 编辑区（左）
- Markdown 编辑，支持粘贴
- 选中文字 → 点工具栏按钮 → 自动转换为对应组件
- 无选区时点按钮插入空模板
- Ctrl+Z / Cmd+Z 撤回（最多 50 步）

### 预览区（右）
- 375px 手机模拟，实时渲染
- 所有组件即时预览

### 6 个组件
| 组件 | Markdown 语法 | 说明 |
|------|-------------|------|
| 大字标题 | `# 标题` | 衬线字体 + 黄色高亮 |
| 二级标题 | `## 标题` | 衬线字体 + 黄色底线 |
| 三级标题 | `### 标题` | 蓝色左边框 |
| 对话气泡 | ` ```chat ``` ` | macOS 窗口 + 蓝黄气泡 |
| 引用卡 | ` ```quote ``` ` | 渐变蓝 + 虚线边框 |
| 终端金句 | ` ```terminal ``` ` | 深色底 + 闪烁光标 |
| IP 贴纸 | `![sticker](path)` | 居中图片 |
| CTA 按钮 | `[CTA:文字](url){yellow}` | 圆角按钮 |
| 图片 | `![图片\|60%](url)` | 支持宽度设置 |

### 字体选择
工具栏提供标题和正文的独立字体切换：
- 汇文明朝 / Noto Serif / 小赖 / Noto Sans
- 使用自定义字体时，将 `.ttf` 文件放在 `editor.html` 同目录下

### 导出
点击"复制到公众号"按钮，自动微信净化（去除 gradient/shadow/animation/flex）并复制到剪贴板。

## 品牌色
- 主色：#F4D758（黄）
- 强调：#2B7FD8（蓝）
- 辅助：#F7A946（橙）
- 底色：#fefcf6

## 文件结构
```
norush-wechat-editor/
├── SKILL.md          # 本文件
├── editor.html       # 编辑器主文件（自包含）
├── themes.json       # 品牌色系配置
└── assets/
    └── ip-avatar.jpg # 默认 IP 贴纸图片
```

## 自定义
- 修改 `themes.json` 更换品牌色
- 替换 `assets/ip-avatar.jpg` 更换默认贴纸
- 将自定义字体 `.ttf` 放在同目录，编辑器会自动加载
