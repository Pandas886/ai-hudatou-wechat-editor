# AI 胡大头公众号排版编辑器

> 面向公众号文章的 Markdown 排版工具。

一个为 **AI 胡大头** 打造的公众号排版工具。左侧 Markdown 编辑，右侧手机实时预览，一键导出微信兼容 HTML。

![Brand Colors](https://img.shields.io/badge/brand-黄%20%23F4D758-F4D758) ![Brand Colors](https://img.shields.io/badge/accent-蓝%20%232B7FD8-2B7FD8)

## ✨ 特性

- 📝 **Markdown 编辑** — 左侧写内容，右侧 375px 手机预览
- 🎨 **6 种自定义组件** — 对话气泡、引用卡、终端金句、IP贴纸、CTA按钮
- ✋ **选区转组件** — 选中文字 → 点按钮 → 自动格式化
- 🔤 **字体切换** — 标题/正文独立选字体（汇文明朝、小赖、Noto系列）
- 🖼️ **图片插入** — 支持宽度设置（100%/60%/40%/自定义像素）
- ↩️ **撤回** — Ctrl+Z，最多 50 步
- 📋 **一键导出** — 自动微信净化，复制到公众号编辑器即可

## 🚀 使用

```bash
# 直接打开
open editor.html

# 或者用 Python 起本地服务（支持自定义字体加载）
python3 -m http.server 8080
# 然后访问 http://localhost:8080/editor.html
```

## 📁 文件结构

```
wechat-editor/
├── SKILL.md          # Skill 描述文件
├── README.md         # 本文件
├── editor.html       # 编辑器（自包含 HTML）
├── themes.json       # 品牌色系配置
└── assets/
    └── ip-avatar.jpg # 默认贴纸
```

## 🎨 自定义字体

编辑器支持加载本地字体。将 `.ttf` 文件放在 `editor.html` 同目录即可：

- `HuiwenMincho.ttf` — 汇文明朝体（标题推荐）
- `Xiaolai.ttf` — 小赖字体

> 字体文件较大（各约 20MB），未包含在仓库中，请自行获取。

## License

MIT
