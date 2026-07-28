# Reezma Tech Logo Creator 

An interactive, responsive, and premium web application built with **React, TypeScript, and Vanilla CSS** to design, customize, and export professional developer and IT logos. This project enables users to create vector-perfect logos with custom styling, custom shapes, code-inspired decorations, animations, and icons.

## 🚀 Live Preview
The app runs locally on a fast Vite development server:
- URL: `http://localhost:5173/`
- Build script compiles clean, compressed, single-page client bundles.

---

## ✨ Features

- **Live Vector Canvas (SVG-based)**: Renders the logo dynamically in vector format, allowing lossless scalability and pixel-perfect previews.
- **5 Premium Style Presets**: 
  - ** Original**: A modern tech-logo layout mimicking the original HTML/CSS logo, featuring code brackets, binary grids, circuit overlays, and a blinking terminal cursor.
  - **Neon Cyberpunk**: Vibrant gradients, custom square brackets, and a floating CPU processor.
  - **Modern Corporate**: Trustworthy, minimal layout with a clean globe symbol.
  - **Sunset Glow**: Warm rose-to-gold gradients paired with custom tags.
  - **Eco Tech**: Balanced green layout highlighting leaf vectors and curly brackets.
- **Advanced Customizations**:
  - **Text**: Custom font size, weight, spacing, solid/gradient text colors, brackets color/types, and toggles for blinking terminal cursors.
  - **Taglines**: Add subtitle text with adjustable letter-spacing, sizing, and colors.
  - **Icon Hub**: Dynamic search engine with **30+ developer icons** (Lucide React) featuring placement selectors (Left, Right, Top, Bottom) and visual animations (Static, Spin, Pulse, Float).
  - **Background Shapes**: Adapt the logo box shape to multiple container geometries:
    - *Rounded Rectangle*
    - *Circle* (auto-squares to prevent long name overflows)
    - *Hexagon*
    - *Shield*
    - *Triangle*
    - *Bookmark Badge*
  - **FX & Shadows**: Control linear/radial gradients, solid fills, padding, borders, blur levels, offsets, and glowing pulse speeds.
  - **Decorations**: Adjustable circuit line overlays, dot matrices, grid patterns, custom binary numbers, and canvas grid guides.
- **Export Center**:
  - **Download SVG**: High-fidelity, self-contained vector document (includes embedded Google Fonts stylesheets so fonts render correctly on any system).
  - **Download PNG**: Transparent, 2x scaled high-resolution raster image.
  - **Copy SVG Source**: One-click raw SVG markup copier.
  - **Copy HTML/CSS Components**: Export code as ready-made pure HTML/CSS component code snippets for direct integration in web codebases.
- **Interactive UX**:
  - **Undo / Redo Buffer**: Tracks editing states and debounces rapid inputs (like range sliders) into clean checkpoints.
  - **Glassmorphic Theme**: Deep-blue sleek dark mode featuring visual depth, custom scrollbars, and responsiveness.

---

## 🛠️ Technology Stack

- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
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
   Open your browser to [http://localhost:5173/](http://localhost:5173/) to view the app.

3. Compile the production build:
   ```bash
   npm run build
   ```
   This generates compiled, production-ready static assets in the `dist/` directory.

---

## 📁 File Structure

```text
Reezma-logo/
├── src/
│   ├── assets/            # Static assets
│   ├── components/
│   │   ├── LogoCanvas.tsx # SVG Logo generator & canvas renderer
│   │   ├── ControlPanel.tsx# Sidebar customizers, color pickers, tabs
│   │   └── Navbar.tsx     # Header actions, undo/redo, export modal
│   ├── App.tsx            # Main state controller & history checkpoint buffer
│   ├── presets.ts         # Pre-configured templates (Reezma Hanan Original, etc.)
│   ├── types.ts           # Logo config typescript interfaces
│   ├── index.css          # Global resets, variable definitions, font imports
│   └── App.css            # Dashboard styles & glassmorphic classes
├── index.html             # Entry HTML document (with meta SEO optimized tags)
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configurations
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
