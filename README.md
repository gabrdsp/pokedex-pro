# 🎮 Pokédex Pro

A modern and interactive web application to explore Pokémon data across multiple generations with region-based routing. Built as an academic project for the **Database** course at **UFERSA**.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC.svg)
![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)

</div>

---

## ✨ Features

### 🌍 Generation/Region Selection
- Browse Pokémon by **Generation/Region** (Kanto, Johto, Hoenn, and more)
- Beautiful landing page with region-specific themes
- Quick access to each region's Pokédex
- Distinct visual branding per generation

### 🔍 Smart Search & Filtering
- Search Pokémon by **name** or **Pokédex number**
- Real-time search with instant results
- Sticky search bar with backdrop blur
- Case-insensitive matching

### 🏷️ Type System & Browser
- **All 18 elemental types** with PT-BR localization
- Type-based filtering across all regions
- Large, interactive type badges with type images (not icons)
- Detailed type descriptions and habitat information
- Visual type indicator with colors and badges

### 📋 Detailed Information
- **Interactive modal** with complete Pokémon details
- Height and weight information
- Type weaknesses display
- **Complete evolution chains** with navigation
- High-quality Serebii images with fallback generation

### 🎨 Responsive Design
- Modern and intuitive interface
- Fully responsive (mobile-first approach)
- Smooth animations and transitions
- Theme per region with distinct gradients
- Always-visible scrollbars

### 📱 Multi-page Navigation
- **Inicio (Home)**: Region-scoped Pokédex browsing
- **Tipos (Types)**: Browse all Pokémon by elemental type
- **Sobre (About)**: Project information

---

## 🚀 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with hooks |
| **TypeScript** | Full type-safety |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Modern build tool |
| **Lucide React** | Icon components |
| **gh-pages** | GitHub Pages deployment |

---

## 🏗️ Architecture

### Core Components

- **Header**: Sticky navigation with page routing
- **RegionSelect**: Generation/Region landing screen
- **Home**: Region-scoped Pokémon grid display
- **TypesPage**: Global type-based filtering
- **PokemonModal**: Detailed modal with evolution chains
- **TypeBadge**: Interactive type display with images
- **FilterDock**: Sticky search and filter bar
- **AboutPage**: Project information
- **Footer**: Footer with credits

### State Management

```typescript
- view: 'region' | 'home' | 'types' | 'about'
- region: RegionKey (kanto, johto, hoenn, etc.)
- searchTerm: string
- selectedPokemon: Pokemon | null
- filteredPokemon: Pokemon[]
- allPokemon: Pokemon[] (all regions)
- evoCache: Evolution data cache
```

### Data Flow

```
RegionSelect
    ↓
Home (Region-scoped)
PokemonModal ← TypesPage (Global)
```

---

## 💡 Key Features Explained

### 1️⃣ Region Routing
- Select generation at start
- Each region has distinct visual theme
- Pokédex scoped to selected region
- Easy navigation back to region select

### 2️⃣ Type System
- 18 elemental types with PT-BR labels
- Type images instead of icons
- Type-based global filtering
- Habitat descriptions per type

### 3️⃣ Evolution Chains
- Complete evolution path display
- Click to navigate between evolutions
- Handles both linear and branching evolutions
- PokeAPI integration for non-Kanto regions

### 4️⃣ Data Management
- Local dataset for Kanto (fast loading)
- PokeAPI fallback for other regions
- Efficient caching of evolution data
- Image fallback to generated Serebii URLs

---

## 📦 Data Structure

### Pokémon Model

```typescript
interface Pokemon {
  id: number;                    // Unique ID
  num: string;                   // Pokédex number (001-151, etc.)
  name: string;                  // Display name
  img: string;                   // Image URL
  type: string[];                // 1-2 elemental types
  height: string;                // Height (e.g., "0.7 m")
  weight: string;                // Weight (e.g., "6 kg")
  weaknesses: string[];          // Type weaknesses
  prev_evolution?: EvolutionRef[];
  next_evolution?: EvolutionRef[];
}
```

### Regions Supported

🌿 **Kanto** (Gen I) | 🔵 **Johto** (Gen II) | 🌊 **Hoenn** (Gen III) | ⚪ **Sinnoh** (Gen IV) | 🎯 **Unova** (Gen V) | 💫 **Kalos** (Gen VI) | 🌴 **Alola** (Gen VII) | ⚔️ **Galar** (Gen VIII) | 🌄 **Paldea** (Gen IX)

### Type System (18 Total)

🍃 Grass | 💀 Poison | 🔥 Fire | ☁️ Flying | 💧 Water | 🐛 Bug | ⚪ Normal | ⚡ Electric | ⛰️ Ground | 🪨 Rock | 🧠 Psychic | 🥊 Fighting | ❄️ Ice | 👻 Ghost | 🐉 Dragon | ⚙️ Steel | 🦋 Fairy | 🌙 Dark

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Getting Started

```bash
# Clone repository
git clone https://github.com/gabrdsp/pokedex-pro.git
cd pokedex-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Available Scripts

```bash
npm run dev      # Vite dev server on localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
npm run deploy   # Build + Deploy to GitHub Pages
npm run lint     # Run ESLint
```

---

## 🌍 Live Demo

Hosted on GitHub Pages:
```
https://gabrdsp.github.io/pokedex-pro
```

---

## 🎓 Academic Context

Built for the **Database** course at **UFERSA** (Universidade Federal Rural do Semi-Árido).

### Learning Objectives
- ✅ Multi-region data architecture
- ✅ Efficient filtering and search across datasets
- ✅ Responsive and modern UI design
- ✅ API integration and data fetching
- ✅ Error handling and fallbacks
- ✅ Production deployment

---

## 📄 License

Fan-made, non-profit project. Pokémon is a property of The Pokémon Company, Nintendo, and Game Freak.

Source code licensed under MIT.

---

## 🙏 Credits

- **Serebii** for image resources
- **PokeAPI** for generation data
- **UFERSA** for the learning opportunity
- **Lucide React** for icon components
- **Tailwind CSS** for styling framework

---

## 🔗 Links

- [GitHub Repository](https://github.com/gabrdsp/pokedex-pro)
- [Live Application](https://gabrdsp.github.io/pokedex-pro)
- [Serebii Pokédex](https://www.serebii.net)
- [PokéAPI](https://pokeapi.co)

---

<div align="center">

**Built with dedication and passion 💙**

*A Pokédex to explore, learn, and have fun!* 🎮✨

</div>
