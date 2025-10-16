# Host 配置转换工具

一个现代化的 Host 配置转换工具，支持将标准 host 配置转换为不同平台格式（Clash、Charles 等），提供直观的 Web 界面和强大的功能特性。

## ✨ 功能特性

-   🚀 **实时转换** - 输入内容变化时自动转换
-   🎯 **多平台支持** - 支持 Clash、Charles 和自定义格式
-   🔧 **灵活配置** - 可编辑转换规则，支持自定义格式
-   🗂️ **去重功能** - 基于 host+ip 组合自动去重
-   📋 **一键复制** - 转换结果一键复制到剪贴板
-   🎨 **现代 UI** - 基于 shadcn/ui 的美观界面
-   📱 **响应式设计** - 完美适配桌面和移动设备
-   ⚡ **高性能** - 使用 React 19 和 Next.js 15 的最新特性

## 🛠️ 技术栈

-   **框架**: Next.js 15.4.6
-   **UI 库**: React 19.1.0
-   **组件库**: shadcn/ui
-   **样式**: Tailwind CSS 3.4.0
-   **语言**: TypeScript
-   **状态管理**: useReducer + useCallback + useMemo
-   **部署**: Cloudflare Pages

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx          # 主页面
│   ├── layout.tsx        # 布局文件
│   └── globals.css       # 全局样式
├── components/
│   ├── PageHeader.tsx    # 页面头部组件
│   ├── PageFooter.tsx    # 页面底部组件
│   ├── InputArea.tsx     # 输入区域组件
│   ├── OutputArea.tsx    # 输出区域组件
│   └── ConfigDialog.tsx # 配置弹窗组件
├── hooks/
│   └── useHostConverter.ts # 核心业务逻辑hook
└── components/ui/        # shadcn/ui组件
```

## 🚀 快速开始

### 环境要求

-   Node.js 18.0 或更高版本
-   pnpm (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发环境

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 或
npm run build
# 或
yarn build
```

## 📖 使用说明

### 基本使用

1. **输入 Host 配置**

    - 在左侧输入框中输入 host 配置
    - 格式：`IP地址 域名`，每行一个
    - 示例：
        ```
        117.80.117.48 baidu.com
        192.168.1.1 example.com
        ```

2. **选择输出平台**

    - 点击"配置"按钮打开配置弹窗
    - 选择输出平台：Clash、Charles 或自定义
    - 配置转换规则（可选）

3. **查看转换结果**
    - 右侧自动显示转换结果
    - 点击"复制"按钮复制到剪贴板

### 支持的平台格式

#### Clash 格式

```
域名=IP地址
```

#### Charles 格式

```xml
<dnsSpoof>
  <name>域名</name>
  <address>IP地址</address>
  <enabled>true</enabled>
</dnsSpoof>
```

#### 自定义格式

-   使用 `${ip}` 和 `${host}` 作为占位符
-   支持任意自定义格式

### 高级功能

-   **去重设置**: 开启后，相同的 host 和 ip 组合只会保留一个
-   **规则编辑**: 可以编辑和自定义转换规则
-   **实时转换**: 输入内容变化时自动转换

## 🏗️ 架构设计

### 组件化设计

-   **单一职责**: 每个组件负责特定功能
-   **可复用性**: 组件可在其他项目中复用
-   **类型安全**: 完整的 TypeScript 类型定义

### 状态管理

-   **useReducer**: 统一管理复杂状态
-   **useCallback**: 优化函数性能
-   **useMemo**: 优化计算性能

### 性能优化

-   **避免重渲染**: 使用 React 最佳实践
-   **代码分割**: 按需加载组件
-   **缓存优化**: 智能缓存转换结果

## 🚀 部署

### Cloudflare Pages 部署

1. **连接 GitHub 仓库**

    ```bash
    # 推送代码到GitHub
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2. **配置 Cloudflare Pages**

    - 构建命令: `pnpm build`
    - 构建输出目录: `.next`
    - Node.js 版本: 18.x

3. **环境变量配置**
    - 无需特殊环境变量

### 其他部署方式

#### Vercel 部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 开发指南

### 代码规范

-   使用 TypeScript 严格模式
-   遵循 ESLint 规则
-   使用 Prettier 格式化代码

### 提交规范

```bash
# 功能开发
git commit -m "feat: 添加新功能"

# 修复bug
git commit -m "fix: 修复某个bug"

# 文档更新
git commit -m "docs: 更新文档"
```

### 测试

```bash
# 运行测试
pnpm test

# 运行类型检查
pnpm type-check

# 运行代码检查
pnpm lint
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

-   [Next.js](https://nextjs.org/) - React 框架
-   [shadcn/ui](https://ui.shadcn.com/) - 组件库
-   [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
-   [Cloudflare](https://cloudflare.com/) - 部署平台

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

-   提交 [Issue](https://github.com/your-username/host-config-convert/issues)
-   发送邮件至 your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

