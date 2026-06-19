# One Leadership Dashboard

A fully responsive Next.js + Tailwind CSS implementation of the People Experience Directorate Leadership Dashboard.

## 📁 Folder Structure

```
leadership-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind + Inter font
│   │   ├── layout.tsx           # Root layout + metadata
│   │   └── page.tsx             # Main page (SPA router)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Top sticky header
│   │   │   └── Sidebar.tsx      # Navigation sidebar
│   │   ├── sections/
│   │   │   ├── HomeSection.tsx       # Landing page
│   │   │   ├── ExecutiveSection.tsx  # Executive Snapshot
│   │   │   ├── EntrySection.tsx      # Hiring & Onboarding
│   │   │   ├── ExperienceSection.tsx # Team Condition
│   │   │   ├── DevelopmentSection.tsx# Talent Growth
│   │   │   ├── TurnoverSection.tsx   # Workforce Continuity
│   │   │   ├── ExitSection.tsx       # Exit Intelligence
│   │   │   ├── CostSection.tsx       # People Cost
│   │   │   └── LeadershipSection.tsx # Risk Heatmap + Action Box + Governance
│   │   └── ui/
│   │       └── index.tsx        # Shared UI components
│   └── data/
│       └── dashboardData.ts     # All dummy data
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Clone / unzip the project
cd leadership-dashboard

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## 🎨 Features

| Page | Description |
|------|-------------|
| **Home** | Navigation hub with all section cards |
| **Executive Snapshot** | 5 KPI cards + leadership insight |
| **Entry** | Joiners, critical roles, stability, onboarding metrics |
| **Experience** | Gender mix, employment status, level/tenure mix, attendance charts |
| **Development** | Promotion, internal mobility, learning participation with progress bars |
| **Turnover** | Rate metrics, trend line chart, by-manager bar charts |
| **Exit** | Resignation reasons, tenure donut chart, affected roles |
| **Cost** | Cost KPIs, trend charts, cost breakdown donut |
| **Leadership Action** | Risk heatmap table, action box, governance model (3 sub-tabs) |

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS 3**
- **Recharts** for line charts
- **Lucide React** for icons
- **TypeScript**

## 📊 Customizing Data

All data lives in `src/data/dashboardData.ts`. Replace the dummy values with real data or connect to an API.

## 📱 Responsive Breakpoints

- **Mobile** (<768px): Single column, hamburger menu
- **Tablet** (768–1024px): 2-3 column grids, collapsible sidebar
- **Desktop** (1024px+): Full sidebar + multi-column layouts
