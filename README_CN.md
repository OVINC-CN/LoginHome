<div align="center">
  <img src="public/favicon.png" alt="logo" width="100" height="100" />
  <h1>LoginHome</h1>
  <p>OVINC 服务的统一单点登录（SSO）入口与会话管理中心</p>

  <p>
    <a href="./README.md">English</a> | <strong>简体中文</strong>
  </p>

  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/vue-3.5.22-brightgreen.svg" alt="Vue"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/vite-6.4.0-646cff.svg" alt="Vite"></a>
    <a href="https://arco.design/"><img src="https://img.shields.io/badge/Arco%20Design-2.57.0-165DFF.svg" alt="Arco Design"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  </p>
</div>

---

## 📖 简介

**LoginHome** 是 OVINC 生态系统的核心组件，提供统一的单点登录（SSO）服务。它负责用户的认证、授权以及全局会话管理，确保用户在访问 OVINC 内部服务和前端应用时拥有流畅、安全的体验。

## ✨ 特性

- 🔐 **单点登录 (SSO)** - 一次登录，全域通行，支持多子系统无缝跳转。
- 🛡️ **会话管理** - 集中式的用户会话控制与权限验证。
- 🤝 **标准协议兼容** - 兼容 OIDC / OAuth2 协议规范，易于集成。
- 🌍 **国际化支持** - 内置多语言支持 (i18n)，服务全球用户。
- 🎨 **现代化 UI** - 基于 Arco Design 构建，提供美观且一致的用户界面。

## 🛠️ 技术栈

- **核心框架:** [Vue 3](https://vuejs.org/)
- **构建工具:** [Vite](https://vitejs.dev/)
- **UI 组件库:** [Arco Design Vue](https://arco.design/vue)
- **状态管理:** [Vuex](https://vuex.vuejs.org/)
- **路由管理:** [Vue Router](https://router.vuejs.org/)
- **HTTP 请求:** [Axios](https://axios-http.com/)
- **监控:** Aegis Web SDK

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 16
- [pnpm](https://pnpm.io/) >= 8

### 安装

克隆项目到本地：

```bash
git clone <repository-url>
cd LoginHome
```

安装依赖：

```bash
pnpm install
```

### 开发

启动本地开发服务器：

```bash
pnpm run dev
```

### 构建

构建生产环境代码：

```bash
pnpm run build
```

### 预览

预览构建后的产物：

```bash
pnpm run serve
```

### 代码检查

运行 ESLint 检查：

```bash
pnpm run lint
```

## 📂 目录结构

```
src/
├── api/          # API 接口封装
├── components/   # 公共组件
├── context/      # 上下文管理
├── locale/       # 国际化语言包
├── router/       # 路由配置
├── store/        # Vuex 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
├── views/        # 页面视图
├── App.vue       # 根组件
└── main.js       # 入口文件
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进本项目。

## 📄 许可证

本项目采用 [MIT](./LICENSE) 许可证。
