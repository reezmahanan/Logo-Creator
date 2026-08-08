# Reezma Tech Logo Creator 

<p align="center">
  <img src="https://github.com/reezmahanan/Logo-Creator/blob/main/screenshot.png" alt="Logo Creator Dashboard" width="100%"/>
</p>

An interactive, responsive, and premium web application built with **React, TypeScript, and Vanilla CSS** to design, customize, and export professional developer and IT logos. This project enables users to create vector-perfect logos with custom styling, custom shapes, code-inspired decorations, animations, and icons.

---

## 🚀 Live Preview
The app runs locally on a fast Vite development server:
- URL: `http://localhost:5173/` or `http://localhost:5174/`
- Build script compiles clean, compressed, single-page client bundles.

---

## ✨ Features

- **🧙‍♂️ Logo Preference Wizard**: A step-by-step interactive questionnaire that gathers brand names, style personalities (Minimal, Cyberpunk, Eco, Corporate, Classic Developer), color palettes, and symbol preferences to instantly generate a custom logo configuration.
- **🌐 Viral URL Sharing Loop**: Instantly compress and share your custom logo designs with a unique URL hash. The app reads and deserializes the configuration token on page load, loading the custom canvas instantly.
- **📱 PWA Installability & Offline Cache**: Fully compliant Progressive Web App featuring a `/manifest.json` and active service worker (`/sw.js`) that dynamically caches script bundles, stylesheet assets, and Google Web Fonts for offline availability.
- **📤 Custom SVG Icon Uploader**: Tweak beyond preset icons. Upload any local `.svg` file to render it directly inside the logo canvas. Uploaded shapes dynamically inherit the rotation, sizing, animation (Spin, Pulse, Float), and stroke colors chosen in the editor.
- **🛠️ Split Brand Text Styling**: Style the first and second halves of your company name separately. Adjust individual font weights, families, solid fills, and linear text gradients to build modern contrasting logotypes (e.g. **REEZMA**labs).
- **📂 Preset Categories & Filtering**: Templates are organized under **Classic**, **Cyberpunk**, **Corporate**, and **Creative** filters to easily navigate standard tech presets.
- **Live Vector Canvas (SVG-based)**: Renders the logo dynamically in vector format, allowing lossless scalability and pixel-perfect previews.
- **FX, Shadows & Glows**: Control linear/radial background gradients, container geometries (Shield, Hexagon, Circle, Bookmark Badge), border radii, glowing pulse speeds, circuit overlays, and binary code decorations.
- **Export Center**:
  - **Download SVG**: High-fidelity, self-contained vector document (includes embedded Google Fonts stylesheets so fonts render correctly on any system).
  - **Download PNG**: Transparent, 2x scaled high-resolution raster image.
  - **Copy SVG Source**: One-click raw SVG markup copier.
  - **Copy HTML/CSS Components**: Export code as ready-made pure HTML/CSS component code snippets for direct integration in web codebases (automatically supports split text styling and custom SVGs).

---

## 🛠️ Technology Stack

- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **PWA/Offline**: Service Workers, Web App Manifest APIs
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, Grids, Keyframe Animations)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser to the local URL (e.g., `http://localhost:5173/`) to view the app.

3. Compile the production build:
   ```bash
   npm run build
   ```
   This generates compiled, production-ready static assets in the `dist/` directory.

---

## 📁 File Structure

```text
Logo-Creator/
├── public/
│   ├── favicon.svg        # Static app favicon
│   ├── manifest.json      # PWA application metadata config
│   └── sw.js              # Service Worker for offline asset caching
├── src/
│   ├── assets/            # Static assets
│   ├── components/
│   │   ├── LogoCanvas.tsx # SVG Logo generator & canvas renderer (supports split text & custom SVG)
│   │   ├── ControlPanel.tsx# Sidebar customizers, color pickers, tabs, & Stepper Wizard
│   │   └── Navbar.tsx     # Header actions, undo/redo, share design link, export modal
│   ├── utils/
│   │   └── serialization.ts# URL Base64 state compressors & decoders
│   ├── App.tsx            # Main state controller, history checkpoint buffer, URL hash listener
│   ├── presets.ts         # Pre-configured templates divided by style categories
│   ├── types.ts           # Logo config typescript interfaces
│   ├── index.css          # Global resets, variable definitions, font imports
│   └── App.css            # Dashboard styles & glassmorphic classes
├── index.html             # Entry HTML document (with SEO social meta tags and PWA hooks)
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configurations
```

---

## 📄 License
This project is open-source and for Educational Purposes.
