<div align="center">
  <img src="public/favicon.png" alt="logo" width="100" height="100" />
  <h1>LoginHome</h1>
  <p>Unified Single Sign-On (SSO) Portal and Session Management Center for OVINC Services</p>

  <p>
    <strong>English</strong> | <a href="./README_CN.md">简体中文</a>
  </p>

  <p>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/vue-3.5.22-brightgreen.svg" alt="Vue"></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/vite-6.4.0-646cff.svg" alt="Vite"></a>
    <a href="https://arco.design/"><img src="https://img.shields.io/badge/Arco%20Design-2.57.0-165DFF.svg" alt="Arco Design"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
  </p>
</div>

---

## 📖 Introduction

**LoginHome** is the core component of the OVINC ecosystem, providing unified Single Sign-On (SSO) services. It handles user authentication, authorization, and global session management, ensuring a seamless and secure experience for users accessing OVINC internal services and frontend applications.

## ✨ Features

- 🔐 **Single Sign-On (SSO)** - One login, global access, seamless navigation across multiple subsystems.
- 🛡️ **Session Management** - Centralized user session control and permission verification.
- 🤝 **Standard Protocol Compatibility** - Compatible with OIDC / OAuth2 protocols, easy to integrate.
- 🌍 **Internationalization** - Built-in multi-language support (i18n) to serve global users.
- 🎨 **Modern UI** - Built with Arco Design, providing a beautiful and consistent user interface.

## 🛠️ Tech Stack

- **Core Framework:** [Vue 3](https://vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Library:** [Arco Design Vue](https://arco.design/vue)
- **State Management:** [Vuex](https://vuex.vuejs.org/)
- **Router:** [Vue Router](https://router.vuejs.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Monitoring:** Aegis Web SDK

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 16
- [pnpm](https://pnpm.io/) >= 8

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd LoginHome
```

Install dependencies:

```bash
pnpm install
```

### Development

Start the local development server:

```bash
pnpm run dev
```

### Build

Build for production:

```bash
pnpm run build
```

### Preview

Preview the build:

```bash
pnpm run serve
```

### Linting

Run ESLint:

```bash
pnpm run lint
```

## 📂 Directory Structure

```
src/
├── api/          # API encapsulation
├── components/   # Shared components
├── context/      # Context management
├── locale/       # Internationalization resources
├── router/       # Router configuration
├── store/        # Vuex state management
├── styles/       # Global styles
├── utils/        # Utility functions
├── views/        # Page views
├── App.vue       # Root component
└── main.js       # Entry file
```

## 🤝 Contribution

Issues and Pull Requests are welcome to improve this project.

## 📄 License

This project is licensed under the [MIT](./LICENSE) License.
