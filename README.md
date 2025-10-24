# Data Helper - AI-Powered Data Visualization Dashboard# Data Helper - AI-Powered Data Visualization Dashboard# React + TypeScript + Vite



A modern web application that uses AI to analyze data files and generate interactive visualizations automatically.



## FeaturesA modern web application that uses AI to analyze data files and generate interactive visualizations automatically.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



- 🤖 **AI-Powered Analysis**: Upload CSV/XLSX files and let AI suggest the best visualizations

- 📊 **Multiple Chart Types**: Line, Bar, Area, Pie, Donut, Scatter, Radar, and Radial charts

- 🎨 **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui design system## FeaturesCurrently, two official plugins are available:

- 💾 **Persistent Workspaces**: Save your dashboards in localStorage

- 🎯 **Interactive Dashboards**: Editable titles, responsive charts with Recharts

- 🔄 **State Management**: Zustand for simple and efficient state management

- 🤖 **AI-Powered Analysis**: Upload CSV/XLSX files and let AI suggest the best visualizations- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

## Tech Stack

- 📊 **Multiple Chart Types**: Line, Bar, Area, Pie, Donut, Scatter, Histogram, and more- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **Frontend**: React 19 + TypeScript

- **Styling**: Tailwind CSS v4 + CSS Variables- 🎨 **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui design system

- **Charts**: Recharts

- **State Management**: Zustand with persist middleware- 💾 **Persistent Workspaces**: Save your dashboards in localStorage## React Compiler

- **Build Tool**: Vite

- **Icons**: Lucide React- 🎯 **Interactive Dashboards**: Editable titles, responsive charts with Recharts

- **HTTP Client**: Axios

- **AI Model**: AWS Bedrock - Amazon Nova Lite v1.0- 🔄 **State Management**: Zustand for simple and efficient state managementThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



## AI Agent Configuration



### Model: Amazon Nova Lite v1.0## Tech Stack## Expanding the ESLint configuration



This project uses **Amazon Nova Lite v1.0** through AWS Bedrock Agent Runtime with the following configuration:



**Model Parameters:**- **Frontend**: React 19 + TypeScriptIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```json

{- **Styling**: Tailwind CSS v4 + CSS Variables

  "temperature": 0.7,

  "topP": 0.9,- **Charts**: Recharts```js

  "maxTokens": 4096

}- **State Management**: Zustand with persist middlewareexport default defineConfig([

```

- **Build Tool**: Vite  globalIgnores(['dist']),

### Technical Decisions & Design Principles

- **Icons**: Lucide React  {

A continuación, se explica punto por punto por qué las instrucciones del agente quedaron así y qué problema concreto resuelven en el stack con **Nova Lite 1.0** y el backend.

- **HTTP Client**: Axios    files: ['**/*.{ts,tsx}'],

#### 1. **"Solo texto ⇒ solo JSON" y sin texto fuera del JSON**

    extends: [

* **Por qué**: El backend parsea la respuesta como **un único objeto JSON**. Cualquier prólogo/epílogo (Markdown, frases) rompe el parseo.

* **Qué evita**: Respuestas con "explicaciones" antes o después del JSON, errores de deserialización y ramas de control extra.## Quick Start      // Other configs...



#### 2. **Exactamente 3 gráficos (regla dura)**



* **Por qué**:### 1. Install Dependencies      // Remove tseslint.configs.recommended and replace with this

  * Con **Nova Lite** la longitud de salida es más limitada; 3 gráficos + layout + insights es un "sweet spot" que evita **truncado** y mantiene valor analítico.

  * Las pantallas iniciales (MVP) necesitan **pocas decisiones pero buenas** para construir un dashboard rápido.      tseslint.configs.recommendedTypeChecked,

* **Qué evita**: Respuestas con 1–2 gráficos (poco valor) o más de 5 (truncado, inconsistencia).

```bash      // Alternatively, use this for stricter rules

#### 3. **Lista cerrada de tipos permitidos**

pnpm install      tseslint.configs.strictTypeChecked,

`line | bar | area | pie | donut | scatter | radar | radial`

```      // Optionally, add this for stylistic rules

* **Por qué**: Esta lista está **alineada** con lo que soporta el front (**shadcn/Recharts**) y con el DSL de parámetros.

* **Qué evita**: Pedir `histogram`, `box` u otros que no están implementados nativamente. Cuando el modelo "quiera" histogram/box, se redirige a **equivalentes** (`bar` con bins, etc.) mediante los *fallbacks*.      tseslint.configs.stylisticTypeChecked,



#### 4. **Diversidad mínima y heurística analítica**### 2. Configure Environment Variables



* **Por qué**: Con solo 3 gráficos se necesita **cobertura de casos de uso**:      // Other configs...

  * **Temporal** (si hay `datetime`): `line`/`area` para tendencia.

  * **Categórico**: `bar`/`pie`/`donut` para composición o ranking.Copy `.env.example` to `.env` and add your AWS Bedrock Agent credentials:    ],

  * **Relación o resumen**: `scatter`, `radar` o `radial` para correlaciones, comparativas multivariable o KPI.

* **Qué evita**: Tres barras iguales (redundancia) que aporten poca señal.    languageOptions: {



#### 5. **No hacer preguntas; usar `quality_notes`/`errors`**```bash      parserOptions: {



* **Por qué**: El agente **no ve datos crudos**, solo **esquema + stats**. No se quiere fricción de "¿me confirmas…?".cp .env.example .env        project: ['./tsconfig.node.json', './tsconfig.app.json'],

* **Qué hace**: Si hay ambigüedad, el agente **declara supuestos** (en `quality_notes`) y **sigue**, garantizando respuesta accionable.

```        tsconfigRootDir: import.meta.dirname,

#### 6. **Fallbacks obligatorios**

      },

* **Por qué**: Aseguran que **siempre** hay 3 gráficos aunque falten ciertos tipos de columnas.

  * Sin `datetime` → sustituye el temporal por `bar` (top-k) o `scatter` si hay otra numérica.Edit `.env`:      // other options...

  * Sin numéricas → `bar` (conteos) + `pie/donut` (proporción) + `radar` (comparativa normalizada).

  * Una sola numérica → `bar` con bins preagregados + `pie/donut`; si hay segunda numérica, `scatter`.    },

* **Qué evita**: Respuestas cortas o vacías cuando el esquema es pobre.

```env  },

#### 7. **Checklist de verificación + pausa breve antes de responder**

VITE_AGENT_ID=your_actual_agent_id])

* **Por qué**: Los modelos ligeros a veces "se adelantan" y envían una respuesta **incompleta** (solo 1–2 gráficos).

* **Qué hace**: Fuerza una **verificación silenciosa** (interna del modelo) para cumplir:VITE_AGENT_ALIAS_ID=your_actual_agent_alias_id```

  * 3 gráficos exactos.

  * Tipos dentro de la lista permitida.```

  * Parámetros coherentes con las columnas.

  * Diversidad mínima.You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

  * `next_actions` cuando haya agregaciones.

* **Qué evita**: Cortes a mitad de layout o listas de gráficos incompletas.**⚠️ Required**: Both credentials are mandatory for AI analysis.



#### 8. **Parámetros estandarizados en cada gráfico**```js



* **Por qué**: El backend expone un endpoint que **arma el dataset agregado** a partir de `parameters` (x/y/group_by/filters/aggregations/sort).### 3. Run Development Server// eslint.config.js

* **Qué evita**: Tener que "interpretar" respuestas libres. Queda 100% **parse-friendly** y directo para el `/get-chart-data`.

import reactX from 'eslint-plugin-react-x'

#### 9. **Español en todos los campos de texto**

```bashimport reactDom from 'eslint-plugin-react-dom'

* **Por qué**: Uniformidad de UX y copy para el público objetivo (títulos de tarjetas, descripciones cortas, insights).

* **Qué evita**: Mezcla de idiomas en títulos/etiquetas del dashboard.pnpm dev



#### 10. **"Orquestación (opcional)" con `next_actions`**```export default defineConfig([



* **Por qué**: Cuando un gráfico **requiere agregación**, se marca `data_request_required: true` y se añade la llamada con los **mismos parámetros**.  globalIgnores(['dist']),

* **Qué evita**: Tener que reenviar prompt; la app puede invocar directamente el endpoint y renderizar.

Open `http://localhost:5173` in your browser.  {

#### 11. **Por qué Nova Lite 1.0 influye en el diseño**

    files: ['**/*.{ts,tsx}'],

* **Menor contexto y cuota de salida** que modelos más grandes → **limitar a 3** reduce riesgo de truncado.

* La **pausa/chequeo** compensa la tendencia a "acabar antes" cuando la salida estructurada es larga.## User Workflow    extends: [

* Las reglas duras (exactamente 3, lista de tipos) sirven de **barandillas** para mantener consistencia en un modelo compacto.

      // Other configs...

#### 12. **Resultado práctico**

1. **Create Workspace**: Click "+ Agregar workspace"      // Enable lint rules for React

* El agente **siempre** devuelve un JSON **parseable**, con **3** visualizaciones útiles y diversas, **sin preguntas**, **en español**, y listo para que el backend haga la agregación y el front (Recharts) lo pinte.

2. **Upload Data**: Describe your data and upload CSV/XLSX file      reactX.configs['recommended-typescript'],

## Quick Start

3. **Select Charts**: Choose from AI-suggested visualizations      // Enable lint rules for React DOM

### 1. Install Dependencies

4. **View Dashboard**: Interactive charts with editable titles      reactDom.configs.recommended,

```bash

pnpm install    ],

```

## Project Structure    languageOptions: {

### 2. Configure Environment Variables

      parserOptions: {

Copy `.env.example` to `.env` and add your AWS Bedrock Agent credentials:

```        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```bash

cp .env.example .envsrc/        tsconfigRootDir: import.meta.dirname,

```

├── features/      },

Edit `.env`:

│   ├── charts/components/      # Chart components (Line, Bar, Pie, etc.)      // other options...

```env

VITE_AGENT_ID=your_actual_agent_id│   └── workspaces/    },

VITE_AGENT_ALIAS_ID=your_actual_agent_alias_id

```│       ├── components/         # UI views (Prompt, Selection, Dashboard)  },



**⚠️ Required**: Both credentials are mandatory for AI analysis.│       └── stores/            # Zustand store])



### 3. Run Development Server├── services/api.ts            # API client```



```bash├── types/index.ts             # TypeScript definitions

pnpm dev├── lib/

```│   ├── env.ts                # Environment config

│   └── utils.ts              # Utilities (cn, generateId, etc.)

Open `http://localhost:5173` in your browser.└── App.tsx                    # Main app

```

### 4. Build for Production

## Supported Chart Types

```bash

pnpm build- ✅ Line, Bar, Area, Pie, Donut, Scatter, Histogram

```- 🚧 Box plot, Heatmap, Treemap (coming soon)



The build generates optimized static files in the `dist` folder, ready for deployment.## Best Practices



## User WorkflowThis project follows modern React development best practices:



1. **Create Workspace**: Click "Crear Dashboard" on the welcome screen- ✅ Functional components with hooks

2. **Upload Data**: Describe your data and upload CSV/XLSX file (drag & drop supported)- ✅ TypeScript strict mode

3. **AI Analysis**: The AI agent analyzes your data and suggests 3 optimized visualizations- ✅ Tailwind utility-first CSS

4. **Select Charts**: Choose from AI-suggested visualizations- ✅ Zustand state management with persistence

5. **View Dashboard**: Interactive charts with editable titles and real-time data- ✅ Accessible UI with ARIA labels

- ✅ Responsive design

## Project Structure

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for complete guidelines.

```

src/## License

├── features/

│   ├── charts/components/      # Chart components (Line, Bar, Pie, Scatter, etc.)MIT

│   └── workspaces/
│       ├── components/         # UI views (Prompt, Selection, Dashboard)
│       └── stores/            # Zustand store with localStorage persistence
├── services/api.ts            # API client (Axios)
├── types/index.ts             # TypeScript definitions
├── lib/
│   ├── env.ts                # Environment config
│   └── utils.ts              # Utilities (cn, generateId, etc.)
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── app-sidebar.tsx       # Application sidebar
│   ├── nav-workspaces.tsx    # Workspace navigation
│   └── stats-cards.tsx       # Dashboard statistics cards
└── App.tsx                    # Main app with Suspense and lazy loading
```

## Supported Chart Types

- ✅ **Line Chart**: Temporal trends and time series
- ✅ **Bar Chart**: Categorical comparisons and rankings
- ✅ **Area Chart**: Cumulative trends and volume over time
- ✅ **Pie Chart**: Part-to-whole relationships
- ✅ **Donut Chart**: Part-to-whole with central space
- ✅ **Scatter Chart**: Correlations and relationships between variables
- ✅ **Radar Chart**: Multivariate comparisons
- ✅ **Radial Chart**: Circular data representation

## Key Features Implemented

### Frontend Features
- ✅ Suspense with loading fallback for better UX
- ✅ Lazy loading for optimized bundle size
- ✅ Drag & drop file upload
- ✅ Error handling with visual alerts (red styling)
- ✅ Hover effects with shadows and animations
- ✅ Workspace persistence in localStorage
- ✅ Multiple chart transformations (3 separate API calls per selection)
- ✅ Real-time chart title editing
- ✅ Responsive design for all screen sizes

### AI Integration
- ✅ AWS Bedrock Agent Runtime integration
- ✅ Automatic data schema analysis
- ✅ Smart chart type selection based on data types
- ✅ Fallback strategies for limited data
- ✅ JSON-only responses for reliable parsing
- ✅ Spanish language output for consistency

## Best Practices

This project follows modern React development best practices:

- ✅ **Functional components with hooks** (no class components)
- ✅ **TypeScript strict mode** for type safety
- ✅ **Tailwind utility-first CSS** with CSS variables theming
- ✅ **Zustand state management** with localStorage persistence
- ✅ **Accessible UI** with ARIA labels and keyboard navigation
- ✅ **Responsive design** with mobile-first approach
- ✅ **Code splitting** with React.lazy and Suspense
- ✅ **Error boundaries** and comprehensive error handling

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for complete development guidelines.

## Deployment

### AWS Amplify (Recommended)

This project is optimized for deployment on AWS Amplify with automatic CI/CD:

1. **Push to Git repository** (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
2. **Connect to AWS Amplify Console**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your Git provider
   - Select repository and branch
3. **Configure build settings** (automatically detected from `amplify.yml`)
4. **Deploy** - Amplify handles:
   - Automatic builds on every push
   - SSL certificates
   - CDN distribution
   - Environment variables management
   - Preview URLs for pull requests

### Build Configuration

The `dist` folder structure is optimized for static hosting:
```
dist/
├── index.html          # Entry point
├── assets/
│   ├── *.js           # JavaScript bundles (code-split)
│   └── *.css          # Stylesheets (optimized)
└── (other assets)
```

**Bundle Sizes:**
- Uncompressed: ~816 kB total JavaScript
- Gzipped: ~242 kB (what users download)
- Build time: ~15 seconds

## Environment Variables

Required environment variables for production:

```env
VITE_AGENT_ID=your_aws_bedrock_agent_id
VITE_AGENT_ALIAS_ID=your_aws_bedrock_agent_alias_id
```

Configure these in your deployment platform (AWS Amplify, Vercel, Netlify, etc.)

## License

MIT
