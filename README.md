# Pokémon Analytics Dashboard

> Interactive data visualization platform for analyzing Pokémon performance metrics and statistics using the PokéAPI.

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)

## Features

### Core Features

- **Interactive Data Visualization**: 3 chart types with real-time filtering
- **Advanced Filtering**: Filter by type, search by name, and minimum stats
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Performance Optimized**: Efficient API calls with batch processing
- **Modern UI/UX**: Clean, professional interface with smooth animations

### Advanced Features

- **Dark/Light Mode**: Complete theme system with persistent preferences
- **Data Export**: Export filtered data as CSV or JSON
- **Skeleton Loading**: Professional loading states with react-loading-skeleton
- **Smooth Animations**: Framer Motion integration for polished transitions
- **Type-Based Colors**: Pokemon type colors throughout charts and UI

### Key Visualizations

- **Type Distribution**: Bar/Pie chart showing most common Pokémon types
- **Stat Analysis**: HP vs Attack scatter plot with type-based coloring
- **Height/Weight Correlation**: Physical characteristics analysis (0.567 correlation)

## Quick Start

### Prerequisites

- Node.js `v20.19.x` or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pokemon-analytics-dashboard.git
cd pokemon-analytics-dashboard

# development or main?
checkout to branch development
if https://github.com/Muhammadqasimdev/poke-web-take-home/pull/1 is still live else stay on main

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run lint`  | Run ESLint               |

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks and Suspense
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### Visualization & UI

- **Recharts** - Composable charting library for React
- **Framer Motion** - Production-ready motion library
- **react-loading-skeleton** - Skeleton loading states

### State Management

- **React Context** - Theme management and global state
- **React Hooks** - Local state management

### Data & API

- **PokéAPI** - RESTful Pokémon API
- **Custom Data Transformers** - Efficient data processing utilities

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── TypeDistributionChart.jsx
│   │   ├── StatAnalysisChart.jsx
│   │   └── HeightWeightChart.jsx
│   ├── Dashboard.jsx
│   ├── Filters.jsx
│   ├── ExportButton.jsx
│   ├── ThemeToggle.jsx
│   └── SkeletonLoaders.jsx
├── contexts/
│   └── ThemeContext.jsx
├── services/
│   └── pokemonApi.js
├── utils/
│   ├── dataTransformers.js
│   └── exportUtils.js
├── App.jsx
└── main.jsx
```

## API Integration

### PokéAPI Endpoints Used

- **Pokémon List**: `/pokemon?limit=151` - Fetch first 151 Pokémon
- **Pokémon Details**: `/pokemon/{id}` - Individual Pokémon data
- **Batch Processing**: Custom utility for efficient API calls

### Data Processing

```javascript
// Example data transformation
const transformedData = transformPokemonData(rawPokemonData);
const filteredData = filterPokemonData(transformedData, filters);
```

### Rate Limiting & Performance

- Batch API requests to minimize calls
- Efficient data caching and transformation
- Optimized re-renders with React.memo and useMemo

## Charts & Visualizations

### Type Distribution Chart

- **Types**: Bar chart and Pie chart toggle
- **Features**: Interactive legend, hover tooltips
- **Data**: Pokémon count by type with percentages

### Stat Analysis Chart

- **Type**: Scatter plot (HP vs Attack)
- **Features**: Type-based coloring, correlation analysis
- **Insights**: Relationship between offensive and defensive stats

### Height vs Weight Chart

- **Type**: Scatter plot with grouping
- **Features**: Size-based grouping, correlation coefficient
- **Analysis**: Physical characteristic relationships (0.567 correlation)

## Theme System

### Dark/Light Mode

- Persistent theme preferences (localStorage)
- Seamless theme switching
- Theme-aware skeleton loaders
- Type-based colors for both themes

### Color Palette

```css
/* Light Mode */
--bg-primary: #ffffff;
--text-primary: #1f2937;

/* Dark Mode */
--bg-primary: #1f2937;
--text-primary: #f9fafb;
```

## Data Export

### Supported Formats

- **CSV**: Structured data export for spreadsheet analysis
- **JSON**: Raw data export for programmatic use

### Export Options

- Filtered Pokémon dataset
- Chart-specific data
- Summary statistics

### Development Guidelines

## Performance Considerations

- **API Optimization**: Batch requests to reduce API calls
- **Data Caching**: Efficient state management with minimal re-renders
- **Code Splitting**: Lazy loading for optimal bundle size
- **Responsive Images**: Optimized assets for different screen sizes
