# 宇奇引擎官网 · 维护手册

纯静态站点，无构建步骤，无框架依赖。本文件是后续扩展页面、更新版本、加组件时必须遵守的规范。

## 文件结构

```
yuqi-site/
├─ index.html          首页（功能总览、状态演示、推镜展示）
├─ download.html       下载页（安全横幅、版本、校验、安全提示、要求）
├─ guide.html          使用指南（须知原则、状态哲学表、问题包、FAQ）
├─ story.html          项目故事（时间线、事故反思、源码范围、许可）
├─ 404.html            404 页（GitHub Pages 自动生效）
├─ sitemap.xml         站点地图（SEO 索引规范）
├─ robots.txt          爬虫规则（已关联 sitemap）
├─ DEPLOYMENT.md       生产部署与上线手册（GitHub Pages 发布流程与检查单）
├─ app/                新版界面 Web 视觉稿（来自仓库 visual-design，可交互）
│  ├─ index.html       预览入口；lucide 已本地化为 scripts/lucide.min.js
│  ├─ views/           各模块视图 HTML 片段
│  ├─ scripts/         view-loader 路由 + 组件 + lucide.min.js
│  └─ styles/          外壳与各视图样式
├─ assets/
│  ├─ css/style.css    全站唯一样式表，按区块注释分节
│  ├─ js/icons.js      SVG 图标库，注入 <symbol> 供 <use> 引用
│  ├─ js/main.js       交互：双语、reveal、live 缩放、复制、Star、scrollspy
│  └─ img/             图片：.png 为源文件/回退，.webp 为实际加载
└─ ref/                设计参考素材，不部署
```

## 双语机制（所有页面必须遵守）

- `<html data-lang="zh">` 为默认语言；`main.js` 切换 `data-lang`，CSS 控制 `.zh` / `.en` 的显隐。
- 每段文案成对写：`<span class="zh">中文</span><span class="en">English</span>`。
- `<html data-title-zh / data-title-en>` 提供双语标题；`<title>` 写中文即可。
- head 中的语言探测脚本必须保留在 `<link>` 之前，避免闪烁。
- 新增页面直接从现有页面复制 head 段、导航、页脚。

## 共享组件（四份副本，改动要同步）

导航 `<header class="nav">` 和 `<footer class="footer">` 在四个页面中是**手工同步的副本**。
改导航项或页脚链接时，必须改全部页面（index / download / guide / story / 404），并：

- 在 `nav-links` 和 `mobile-menu` 两处都加链接；
- 当前页链接加 `class="active" aria-current="page"`；
- 站内锚点从子页链接时写成 `index.html#features` 形式。

## 组件类清单（新页面优先复用，不要新造样式）

| 类 | 用途 |
|---|---|
| `.page-hero` + `.h1` + `.lead` | 子页页头 |
| `.block` + `.block-title`(`.n`+`h2`) | 子页内容区块（自动编号样式） |
| `.card` / `.ver` / `.file-btn` | 版本与下载按钮卡片 |
| `.steps`(`.three`) + `.step-card` | 编号步骤卡（自动计数） |
| `.table` | 表格（状态表、要求表） |
| `.st` + `.st-ok/.st-warn/.st-bad/.st-na/.st-read` | 状态标签，颜色与软件一致 |
| `.faq` + `<details>` | 手风琴问答（`.pm` 是右侧 + 号） |
| `.timeline` + `.tl-item`(`.ok`/`.bad`) | 时间线（绿=发布，红=事故） |
| `.two-col` + `.list-card`(`.no`) | 包含/不包含对照卡 |
| `.quote` | 引述块 |
| `.code` + `.copy`(`data-copy="#id"`) | 代码块 + 一键复制（自动 toast） |
| `.app-embed` | 可交互 Web UI 嵌入（iframe 1280×860 设计坐标按容器等比缩放，≤760px 自动降级为截图）。首屏 hero 与 `#interface` 界面预览区均直接嵌入交互原型，可自由点击交互；IntersectionObserver 对离屏 embed 自动注入 `animation-play-state:paused` + `visibility:hidden` 休眠节约资源；`.live-frame` 只做外框 |
| `.flow-pin` > `.flow-sticky` + `.fstep`(`.lit`/`.on`) + `.fvis` | 固定叙事流程：桌面 440vh pin + scrub，JS 驱动 `.on` 切换左步骤与右面板；≤760px 与 reduced-motion 自动降级为纵向列表 |
| `.term`(`[data-term]`) + `.t-d.ok/.warn/.na` + `.t-caret` | 终端检测日志（JS 逐行打字循环，仅在视口内运行） |
| `.pick`(`.on`/`.locked`) + `.seq` | 步骤面板小 UI：勾选项列表 / 提交-复核序列 |
| `.beam`（放在 `.ver.primary` 内） | 边框流光，仅用于主推版本卡 |
| `.fit-card`(`.fit-yes`/`.fit-no`) | 适用性对照卡（左侧青色/琥珀色指示线，用于主动劝退反选） |
| `.safe-banner` | 安全保障横幅（青色微光背景，置顶提示「先留退路与还原点」） |
| `.reason-chip` | 状态演示区工程级原因胶囊（hover 时浮现底层接口状态依据） |
| 卡片悬停质感 | `.card/.step-card/.list-card/.ver/.fit-card` 自动获得顶部高光线 + 光标跟随高光（`--mx/--my` 由 JS 写入） |
| hero 视差 | `.hero .grid-bg/.hero-glow/.hero-window/.float-chip` 的 `--py` 由 JS 按滚动写入 |
| `.ticker` + `.ticker-set` ×2 | 模块名无缝滚动带（两组相同内容，translateX(-50%)） |
| `.section.flush-top` | 区块去掉上留白（用在滚动带/演示之后，不要写 inline style） |
| `.kicker` + `.ymark` | 区块眉标 |
| `.reveal`(`--d:延时ms`) | 滚动进入动画 |
| `.btn-primary/.btn-ghost/.btn-sm` | 按钮 |

图标：在 `icons.js` 的 `s` 对象加一条 `name: '<path …>'`，然后 `<svg class="icon"><use href="#i-name"/></svg>`。24×24 viewBox，1.6px 描边风格。

## 版本更新清单

### 自动更新（发布 GitHub Release 后无需改代码）

`main.js` 加载时调用 `api.github.com/repos/ZYY817/YuqiEngine/releases?per_page=5`，取第一条非 draft 的 Release（**含 prerelease**，所以 `v0.1.5-preview` 这类预览版也能正确命中；不要用 `/releases/latest`，它会跳过预览版）。结果缓存 sessionStorage 30 分钟，API 失败或被限流时静默保留 HTML 里写死的兜底值。

带钩子的元素会被自动重写，发版即生效：

| 钩子 | 作用 | 出现位置 |
|---|---|---|
| `data-rel-tag` | 文本替换为最新 tag（如 `v0.1.5`） | index `.pill` 公告、两页 `.dl-pick` 推荐语、`.ver.primary h3`、guide FAQ、download 校验命令注释 |
| `data-rel-date` | 替换为 `published_at` 日期 | `.ver.primary .ver-date` |
| `data-rel-setup` / `data-rel-zip` | `href` 替换为资产直链（按 `setup*.exe` → `*.exe` → `*.zip` 匹配） | `.ver.primary .file-btn` |
| `data-rel-setup-name` | 替换为安装包真实文件名 | download 校验命令 `<pre>` 内 |
| `data-rel-setup-size` / `data-rel-zip-size` | 替换为资产体积（MB） | `.ver.primary .size` |

**注意**：Release 资产命名请保持 `*-setup.exe` / `*.zip` 约定，否则会匹配不到、回退到写死的旧链接。

### 仍需手动改的位置

1. `.ver.primary` 卡片描述与特性列表（写了当版本具体修复内容，无法自动生成）
2. `dl-pick` 推荐语中除版本号外的描述（如「自带 .NET 8 运行库」若变化）
3. 夸克网盘镜像：Release 发布后需手动把新安装包传进分享链接（页面只挂链接，无法自动同步）
4. `story.html`：`.timeline` 追加一条 `.tl-item.ok`（叙事文案）
5. `index.html` 作者区/概览统计等涉及功能面变化的叙述
6. 新截图放入 `assets/img/` 时同时生成 `.webp`（见下）

下载直链格式（兜底）：`https://github.com/ZYY817/YuqiEngine/releases/download/<tag>/<file>`

## 图片规范

- 截图源文件保留 `.png`，实际页面用 `.webp`（`<picture>` 双源）。
- 生成 webp（在 `yuqi-tools` 目录，已装 sharp）：
  `node -e "require('sharp')('<png>').webp({quality:88}).toFile('<webp>')"`
- `og:image` 仍指向 `.png`（社交抓取对 webp 支持不稳）。
- 首屏图不加 `loading="lazy"`，其余都加。

## QA 流程（改完必须跑）

```bash
cd yuqi-tools
# 语法：node shot.js <url> <输出> <宽> <高> <zh|en> <full|view> <滚动目标> <等待ms>
node shot.js http://localhost:4000/ out/x.png 1440 900 zh full 0 2500
node shot.js http://localhost:4000/ out/x.png 390 844 zh full 0 2500
```

- 桌面 1440、手机 390、中/英，改动涉及的所有页都截
- 控制台输出 `no errors` 为通过；GitHub API 403 是已知限流，可忽略
- 本地服务：`python -m http.server 4000`（在 yuqi-site 目录）

## app/ 预览（重要）

- `app/` 是仓库 `assets/visual-design` 里的 Web 版界面视觉稿，通过 `#interface` 区块的 iframe 嵌入首页。
- iframe 以 1280×860 渲染后用 `transform: scale()` 缩放进容器；修改窗口尺寸 token（`app/styles/shell.css` 的 `--window-width/--window-height`）后必须同步 `main.js` 里的 `DESIGN_W` 和 CSS 里的 `aspect-ratio`。
- `app/` 内部与主站完全隔离（独立 CSS/JS/字体），只读不改也能安全更新——从仓库重新复制整个目录即可，注意保留 `scripts/lucide.min.js` 的本地化引用和 `<link rel="icon">`。
- 文案必须保持「视觉稿预览」的诚实标注，不要写成当前发布版界面。

## 部署前 checklist

- [ ] `og:image` 与 `canonical` 改成正式域名的绝对地址
- [ ] `robots.txt` 补上 `Sitemap:` 行，生成 `sitemap.xml`
- [ ] GitHub Pages 部署无需任何构建，整个目录直接上传
