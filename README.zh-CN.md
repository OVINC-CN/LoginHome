<div align="center">
  <img src="./public/favicon.png" alt="LoginHome Logo" width="60" height="60">
  
  # LoginHome
  
  ✨ **基于 React + Vite 构建的现代化、优雅的认证门户** ✨
  
  [English](./README.md) · [简体中文](./README.zh-CN.md)
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
  [![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)](https://vitejs.dev/)
  
</div>

---

## 📖 简介

**LoginHome** 是一个美观、简约的认证门户系统,采用 Apple 公司的美学设计理念。它为用户身份验证、注册和个人资料管理提供了完整的解决方案,并内置了完善的国际化支持。

### ✨ 核心特性

- 🎨 **极简设计** - 借鉴 Apple 设计语言的简洁优雅 UI
- 🌍 **国际化** - 内置英文和中文的 i18n 支持
- 🎯 **现代技术栈** - React 19、TypeScript、Vite、Tailwind CSS
- 📱 **响应式设计** - 在所有设备上都能提供流畅体验
- 🔒 **安全可靠** - 支持多种认证方式,包括微信登录
- 🎭 **主题支持** - 支持暗黑模式
- ♿ **无障碍访问** - 使用 Radix UI 构建,注重可访问性
- 🚀 **极速体验** - 由 Vite 提供支持,开发和构建速度极快

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- Yarn (推荐)

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/OVINC/LoginHome.git
cd LoginHome

# 安装依赖
yarn install

# 启动开发服务器
yarn dev
```

访问 `http://localhost:5173` 查看应用。

### 生产构建

```bash
# 构建项目
yarn build

# 预览生产构建
yarn preview
```

## 🛠️ 技术栈

- **框架:** React 19.2.0
- **构建工具:** Vite 7.2.4
- **开发语言:** TypeScript 5.9.3
- **样式方案:** Tailwind CSS 4.1.18
- **UI 组件:** Radix UI、shadcn/ui
- **表单管理:** React Hook Form + Zod
- **状态管理:** Zustand
- **路由:** React Router DOM 7.11.0
- **HTTP 客户端:** Axios
- **图标:** Lucide React
- **代码检查:** ESLint with Alloy Config

## 📁 项目结构

```
LoginHome/
├── public/              # 静态资源
│   ├── favicon.png      # 应用 Logo
│   └── config.js        # 运行时配置
├── src/
│   ├── api/             # API 服务层
│   ├── components/      # React 组件
│   │   ├── ui/          # 可复用的 UI 组件 (shadcn)
│   │   ├── layout/      # 布局组件
│   │   └── *.tsx        # 功能组件
│   ├── contexts/        # React 上下文
│   ├── i18n/            # 国际化
│   │   └── locales/     # 语言文件
│   ├── pages/           # 页面组件
│   ├── store/           # 全局状态管理
│   ├── styles/          # 全局样式
│   ├── lib/             # 工具函数
│   ├── App.tsx          # 根组件
│   └── main.tsx         # 入口文件
├── package.json         # 依赖和脚本
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── tailwind.config.js   # Tailwind CSS 配置
└── eslint.config.mjs    # ESLint 配置
```

## 🎯 可用脚本

```bash
# 开发
yarn dev              # 启动热重载开发服务器

# 构建
yarn build            # 生产环境构建

# 代码检查
yarn lint             # 运行 ESLint
yarn lint:fix         # 自动修复 ESLint 错误

# 预览
yarn preview          # 本地预览生产构建
```

## 🌐 国际化

LoginHome 开箱即用地支持多语言。语言文件位于 `src/i18n/locales/`:

- `en.json` - 英文翻译
- `zh.json` - 中文翻译

要添加新语言,请在 locales 目录中创建新的 JSON 文件,并更新 i18n 配置。

## 🎨 自定义配置

### 主题定制

应用使用 Tailwind CSS 进行样式设计。在 `tailwind.config.js` 中自定义主题:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // 你的自定义颜色
      },
    },
  },
};
```

### 运行时配置

可以在 `public/config.js` 中修改运行时配置,或通过环境变量进行配置。

## 📝 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献指南

欢迎贡献!请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 💬 获取帮助

如果你有任何问题或需要帮助,请:

- 提交 [Issue](https://github.com/OVINC/LoginHome/issues)
- 查看现有的 [Discussions](https://github.com/OVINC/LoginHome/discussions)

## 🙏 致谢

- [React](https://reactjs.org/) - 使用的 Web 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件
- [Radix UI](https://www.radix-ui.com/) - 无样式、可访问的组件

---

<div align="center">
  由 <a href="https://github.com/OVINC">OVINC</a> 用 ❤️ 制作
</div>
