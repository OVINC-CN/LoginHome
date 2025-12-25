<div align="center">
  <img src="./public/favicon.png" alt="LoginHome Logo" width="60" height="60">
  
  # LoginHome
  
  ✨ **A modern, elegant authentication portal built with React + Vite** ✨
  
  [English](./README.md) · [简体中文](./README.zh-CN.md)
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
  [![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)](https://vitejs.dev/)
  
</div>

---

## 📖 Introduction

**LoginHome** is a beautiful, minimalist authentication portal designed with Apple Inc.'s aesthetic philosophy. It provides a comprehensive solution for user authentication, registration, and profile management with full internationalization support.

### ✨ Key Features

- 🎨 **Minimalist Design** - Clean, elegant UI inspired by Apple's design language
- 🌍 **Internationalization** - Built-in i18n support for English and Chinese
- 🎯 **Modern Stack** - React 19, TypeScript, Vite, Tailwind CSS
- 📱 **Responsive** - Seamless experience across all devices
- 🔒 **Secure** - Multiple authentication methods including WeChat login
- 🎭 **Theme Support** - Dark mode ready
- ♿ **Accessible** - Built with accessibility in mind using Radix UI
- 🚀 **Fast** - Powered by Vite for lightning-fast development and builds

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- Yarn (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/OVINC/LoginHome.git
cd LoginHome

# Install dependencies
yarn install

# Start development server
yarn dev
```

Visit `http://localhost:5173` to see your application.

### Build for Production

```bash
# Build the project
yarn build

# Preview production build
yarn preview
```

## 🛠️ Tech Stack

- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.1.18
- **UI Components:** Radix UI, shadcn/ui
- **Form Management:** React Hook Form + Zod
- **State Management:** Zustand
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Linting:** ESLint with Alloy Config

## 📁 Project Structure

```
LoginHome/
├── public/              # Static assets
│   ├── favicon.png      # Application logo
│   └── config.js        # Runtime configuration
├── src/
│   ├── api/             # API service layer
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components (shadcn)
│   │   ├── layout/      # Layout components
│   │   └── *.tsx        # Feature components
│   ├── contexts/        # React contexts
│   ├── i18n/            # Internationalization
│   │   └── locales/     # Language files
│   ├── pages/           # Page components
│   ├── store/           # Global state management
│   ├── styles/          # Global styles
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── eslint.config.mjs    # ESLint configuration
```

## 🎯 Available Scripts

```bash
# Development
yarn dev              # Start dev server with hot reload

# Build
yarn build            # Build for production

# Lint
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint errors automatically

# Preview
yarn preview          # Preview production build locally
```

## 🌐 Internationalization

LoginHome supports multiple languages out of the box. Language files are located in `src/i18n/locales/`:

- `en.json` - English translations
- `zh.json` - Chinese translations

To add a new language, create a new JSON file in the locales directory and update the i18n configuration.

## 🎨 Customization

### Theming

The application uses Tailwind CSS for styling. Customize the theme in `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
};
```

### Configuration

Runtime configuration can be modified in `public/config.js` or through environment variables.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support

If you have any questions or need help, please:

- Open an [Issue](https://github.com/OVINC/LoginHome/issues)
- Check existing [Discussions](https://github.com/OVINC/LoginHome/discussions)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/OVINC">OVINC</a>
</div>
