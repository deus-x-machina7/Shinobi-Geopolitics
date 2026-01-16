# Shinobi Geopolitics Dashboard

A premium data visualization dashboard simulating a 60-year economic and military history of fictional nations. This project visualizes the rise and fall of the Five Great Nations and the industrial anomaly of the Rain Country through interactive charts and narrative storytelling.

## 🌟 Features

- **Dual View Modes**:
  - **Narrative Mode**: Experience the history through scrollytelling and high-level trends.
  - **Analyst Mode**: Unlock detailed axes, grids, data tooltips, and raw numbers for deep analysis.
- **Interactive Visualizations**:
  - Dynamic Area and Line charts using Recharts.
  - animated "Bar Race" charts for comparing GDP and Population growth over time.
  - Currency toggles between Ryo (両) and USD ($).
- **Immersive UI**:
  - Glassmorphism design with Tailwind CSS.
  - Thematic entrance animations for each Hidden Village (Leaves, Sand, Mist, etc.).
  - Smooth page transitions and layout animations with Framer Motion.
- **Comprehensive Data**:
  - simulated 60-year datasets for GDP, Population, Military Strength, and more.
  - Specific "War Years" markers to analyze the impact of conflict on economy.

## 🚀 Technologies

- **Frontend**: React (v18), TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Visualization**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📂 Project Structure

```
/
├── index.html              # Entry HTML
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AnimatedChart.tsx   # Wrapper for Recharts
│   │   ├── DataLens.tsx        # Floating toggle for View Modes
│   │   ├── VillageEntrance.tsx # Thematic particle animations
│   │   └── ...
│   ├── context/            # React Context (ViewContext)
│   ├── data/               # Static simulation datasets
│   ├── pages/              # Main route views
│   │   ├── Landing.tsx             # Home / Hub
│   │   ├── NationDashboard.tsx     # Country-level stats
│   │   ├── VillageDashboard.tsx    # Hidden Village stats
│   │   ├── ComparisonDashboard.tsx # Cross-nation analysis
│   │   └── RainComparisonDashboard.tsx # Rain Country deep dive
│   ├── App.tsx             # Main Router configuration
│   └── index.tsx           # React entry point
└── metadata.json           # App metadata
```

## 🛠️ Setup & Running

This project uses ES modules and standard React tooling.

1.  **Install Dependencies** (if using a local environment with `package.json`):
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build**:
    ```bash
    npm run build
    ```

## 📖 How to Use

1.  **Landing Page**: Overview of the Five Great Nations and Minor Nations. Select "Great Nations" or "Hidden Villages" to toggle context.
2.  **Dashboards**: Click on a card to view detailed stats.
3.  **Data Lens**: Use the floating toggle at the bottom of the screen to switch between **Narrative** (clean visuals) and **Analyst** (data-heavy) modes.
4.  **Comparisons**: Use the "Global Intelligence" section on the landing page to access comparative race charts and the Rain Anomaly report.

## 🎨 Theme

The application uses a dark "Void" theme (`#0f172a`) inspired by high-tech shinobi intelligence interfaces, using specific colors for each nation:
- **Fire**: Red
- **Wind**: Sand/Orange
- **Water**: Blue
- **Earth**: Brown
- **Lightning**: Gold
- **Rain**: Slate/Grey

## 📄 License

Open source. Inspired by the geopolitical landscape of the Naruto universe.
