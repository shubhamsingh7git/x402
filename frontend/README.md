# 💻 x402 Agentic Commerce — Management Console & Frontend

A high-performance Next.js 16 web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Three.js WebGL**, and **Zustand**.

---

## 🎨 UI/UX & Design System Features

- **Standardized Neobrutalist Theme**: Crisp box borders (`glass-card-static`, `glass-card`, `inner-box`) matching the Dashboard source of truth across all 105 pages.
- **Accessible Contrast System**: Preserved warm sand/cream Light Mode aesthetic with dark charcoal high-contrast text tokens (WCAG AA 4.5:1 compliant).
- **Smooth 60 FPS Visual Effects**: Three.js WebGL particle canvas animations with explicit unmount disposal hooks to eliminate GPU memory leaks.
- **Zero-Jank React Performance**: Atomic Zustand selectors (`useAppStore(state => state.property)`), component memoization, and passive event listeners.

---

## 🔒 Environment & Secrets Protection

`.env.local` and all secret environment files are explicitly ignored in `.gitignore`.

Example `.env.local`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=x402 Agentic Commerce
```

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 Full Project Documentation

For complete architecture details, API specs, and backend integration, see the root [README.md](../README.md).
