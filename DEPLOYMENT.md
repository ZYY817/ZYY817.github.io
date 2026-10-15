# 宇奇引擎官网 · 生产部署与上线手册 (Go-Live Guide)

宇奇引擎官网采用 **Zero-Build（零构建）纯静态架构**。无 Webpack/Vite 编译步骤，页面天然具备毫秒级冷启动、极致 CDN 兼容性与高容灾能力。

---

## 1. 生产环境文件清单 (Production File Manifest)

部署至 GitHub Pages、Cloudflare Pages 或传统 Nginx/Caddy 服务器时，需确保以下文件就绪：

| 文件 / 目录 | 职责与生产要求 |
|---|---|
| `index.html` | 官网首页：Hero 交互式嵌入、工作流 Narrative、状态哲学、功能网格、适合谁/不适合谁、作者说明、下载转化入口 |
| `download.html` | 官方下载页：注入「安全退路」横幅、双版本心智分流、SHA-256 原生 PowerShell/certutil 双校验命令、安全提示与系统要求 |
| `guide.html` | 使用指南页：使用前四步原则、五大核心状态说明表（含已应用）、本地脱敏问题包声明、7 项硬核反营销 FAQ |
| `story.html` | 项目故事页：作者背景与 AI 责任边界声明、2026.8 误删事故复盘与工程敬畏、幸存源码与 MIT 开源声明 |
| `404.html` | 友好容错页（GitHub Pages 自动接管 404 请求并回跳首页/下载） |
| `sitemap.xml` | 搜索引擎 XML 站点地图（包含全站 4 个主页面，配置 lastmod、changefreq 与权重） |
| `robots.txt` | 爬虫抓取规则，置顶关联 `sitemap.xml`，屏蔽无意义 404 爬取 |
| `assets/css/style.css` | 全站唯一样式表：米白精密仪器风格、微动效高光、卡片光晕、响应式布局 |
| `assets/js/main.js` | 核心交互脚本：中英双语、状态演示工程原因胶囊联动、代码一键复制与弹性反馈、卡片高光追踪、离屏 iframe 休眠 |
| `assets/js/icons.js` | 24×24 极细线性 SVG 矢量图标库 |
| `assets/img/` | 生产静态图片（包含 `.webp` 现代格式与 `.png` 回退格式、logo 图标） |
| `app/` | Hero 首屏与推镜区加载的可交互 Web 版软件视觉稿（内置本地化 lucide.min.js 与各模块视图） |

---

## 2. GitHub Pages 部署发布三步法

### 步骤 1：确认代码已提交至 Git 仓库
在 `yuqi-site` 目录执行 Git 提交：
```powershell
git add .
git commit -m "feat: upgrade subpages trust chain, status demo micro-interactions, and sitemap"
git push origin main
```

### 步骤 2：在 GitHub 仓库开启 Pages 服务
1. 打开 GitHub 仓库页面（如 `https://github.com/ZYY817/YuqiEngine` 或专用站点仓库 `YuqiEngine-Site`）；
2. 点击顶部 **Settings** -> 左侧侧边栏 **Pages**；
3. 在 **Build and deployment** 区块：
   - **Source** 选择：`Deploy from a branch`；
   - **Branch** 选择：`main`（或 `master`），文件夹选择 `/ (root)`；
4. 点击 **Save** 按钮。
5. 等待 GitHub Actions 执行（通常 30~60 秒），即可通过 `https://<username>.github.io/<repo>/` 访问全站。

### 步骤 3：绑定自定义域名（可选）
若拥有独立域名（例如 `yuqiengine.com`）：
1. 在仓库根目录新建 `CNAME` 文件，内容仅填入主域名：`yuqiengine.com`；
2. 在域名 DNS 服务商（如 Cloudflare / 腾讯云 / 阿里云）添加 DNS 解析记录：
   - 类型：`CNAME`
   - 主机记录：`@` 或 `www`
   - 记录值：`<username>.github.io.`
3. 在 GitHub 仓库 Settings -> Pages 的 **Custom domain** 填入域名并勾选 **Enforce HTTPS**。

---

## 3. 发布前 QA 验收命令（必须验证项）

在正式推送到生产环境前，使用测试工具进行自动化全屏与无报错渲染测试：

```powershell
# 1. 在 yuqi-site 根目录启动临时测试服务器（端口 4000）
#    serve.py 与 GitHub Pages 行为一致：/download 这类无后缀地址也能打开
python serve.py 4000

# 2. 进入测试工具目录运行 shot.js 无报错截图验证
cd C:\Users\v_yuqqisun\yuqi-tools

# 桌面端各主页面全屏渲染与控制台报错检查
node shot.js "http://localhost:4000/" out\home-1440.png 1440 900 zh full 0 2000
node shot.js "http://localhost:4000/download.html" out\download-1440.png 1440 900 zh full 0 1500
node shot.js "http://localhost:4000/guide.html" out\guide-1440.png 1440 900 zh full 0 1500
node shot.js "http://localhost:4000/story.html" out\story-1440.png 1440 900 zh full 0 1500

# 移动端 390 宽度响应式检查
node shot.js "http://localhost:4000/" out\home-mobile.png 390 844 zh full 0 2000
node shot.js "http://localhost:4000/download.html" out\download-mobile.png 390 844 zh full 0 1500

# 英文模式语言切换检查
node shot.js "http://localhost:4000/" out\home-en.png 1440 900 en full 0 2000
```
**合格标准**：命令行输出 `no errors`，生成的截图无文字错位、无控制台报错、响应式折叠正常。

---

## 4. 后续发布新安装包（New Release）更新规范

当发布新的软件版本安装包（如 `v0.1.5`）时，需同步修改以下位置：

1. **GitHub Releases**：上传新编译出的 `.exe` 和 `.zip`，并生成 `.sha256` 校验文件；
2. **`index.html`**：
   - 更新 Hero 顶部版本药丸（`.pill`）；
   - 更新底部 `#download` 区块的版本号、日期、文件大小与下载直链。
3. **`download.html`**：
   - 更新 `#versions` 区块对应卡片信息与下载链接；
   - 更新 `#verify` 中的文件名示例；
   - 若系统运行库要求发生变化，同步更新系统要求表格。
4. **`guide.html`**：
   - 更新 FAQ 中「v0.1.x 选哪个？」的推荐说明。
5. **`story.html`**：
   - 在时间线追加新版本的节点记录。
6. **`sitemap.xml`**：
   - 将 `<lastmod>` 更新为最新发布日期。
