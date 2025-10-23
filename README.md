# Data Helper - AI-Powered Data Visualization Dashboard# React + TypeScript + Vite



A modern web application that uses AI to analyze data files and generate interactive visualizations automatically.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## FeaturesCurrently, two official plugins are available:



- 🤖 **AI-Powered Analysis**: Upload CSV/XLSX files and let AI suggest the best visualizations- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- 📊 **Multiple Chart Types**: Line, Bar, Area, Pie, Donut, Scatter, Histogram, and more- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 🎨 **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui design system

- 💾 **Persistent Workspaces**: Save your dashboards in localStorage## React Compiler

- 🎯 **Interactive Dashboards**: Editable titles, responsive charts with Recharts

- 🔄 **State Management**: Zustand for simple and efficient state managementThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



## Tech Stack## Expanding the ESLint configuration



- **Frontend**: React 19 + TypeScriptIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **Styling**: Tailwind CSS v4 + CSS Variables

- **Charts**: Recharts```js

- **State Management**: Zustand with persist middlewareexport default defineConfig([

- **Build Tool**: Vite  globalIgnores(['dist']),

- **Icons**: Lucide React  {

- **HTTP Client**: Axios    files: ['**/*.{ts,tsx}'],

    extends: [

## Quick Start      // Other configs...



### 1. Install Dependencies      // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

```bash      // Alternatively, use this for stricter rules

pnpm install      tseslint.configs.strictTypeChecked,

```      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

### 2. Configure Environment Variables

      // Other configs...

Copy `.env.example` to `.env` and add your AWS Bedrock Agent credentials:    ],

    languageOptions: {

```bash      parserOptions: {

cp .env.example .env        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```        tsconfigRootDir: import.meta.dirname,

      },

Edit `.env`:      // other options...

    },

```env  },

VITE_AGENT_ID=your_actual_agent_id])

VITE_AGENT_ALIAS_ID=your_actual_agent_alias_id```

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

**⚠️ Required**: Both credentials are mandatory for AI analysis.

```js

### 3. Run Development Server// eslint.config.js

import reactX from 'eslint-plugin-react-x'

```bashimport reactDom from 'eslint-plugin-react-dom'

pnpm dev

```export default defineConfig([

  globalIgnores(['dist']),

Open `http://localhost:5173` in your browser.  {

    files: ['**/*.{ts,tsx}'],

## User Workflow    extends: [

      // Other configs...

1. **Create Workspace**: Click "+ Agregar workspace"      // Enable lint rules for React

2. **Upload Data**: Describe your data and upload CSV/XLSX file      reactX.configs['recommended-typescript'],

3. **Select Charts**: Choose from AI-suggested visualizations      // Enable lint rules for React DOM

4. **View Dashboard**: Interactive charts with editable titles      reactDom.configs.recommended,

    ],

## Project Structure    languageOptions: {

      parserOptions: {

```        project: ['./tsconfig.node.json', './tsconfig.app.json'],

src/        tsconfigRootDir: import.meta.dirname,

├── features/      },

│   ├── charts/components/      # Chart components (Line, Bar, Pie, etc.)      // other options...

│   └── workspaces/    },

│       ├── components/         # UI views (Prompt, Selection, Dashboard)  },

│       └── stores/            # Zustand store])

├── services/api.ts            # API client```

├── types/index.ts             # TypeScript definitions
├── lib/
│   ├── env.ts                # Environment config
│   └── utils.ts              # Utilities (cn, generateId, etc.)
└── App.tsx                    # Main app
```

## Supported Chart Types

- ✅ Line, Bar, Area, Pie, Donut, Scatter, Histogram
- 🚧 Box plot, Heatmap, Treemap (coming soon)

## Best Practices

This project follows modern React development best practices:

- ✅ Functional components with hooks
- ✅ TypeScript strict mode
- ✅ Tailwind utility-first CSS
- ✅ Zustand state management with persistence
- ✅ Accessible UI with ARIA labels
- ✅ Responsive design

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for complete guidelines.

## License

MIT
