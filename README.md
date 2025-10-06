# MyPet Skilltree Creator

A modern, browser‑based editor for building and maintaining MyPet skilltrees.

This app provides a visual UI for editing .st.json files used by the MyPet plugin, with live validation, autosave, and convenient import/export. It runs fully in your browser (no server required) and can be built and hosted as a static site.


## Highlights
- Visual editor for Skilltree JSON files with helpful defaults
- Import existing `<ID>.st.json` files and export all trees as a single ZIP
- Autosave to localStorage with an explicit Save action and unload protection
- Inline validation via zod schemas for each skill type
- Tabs for editing Properties, Appearance, Eligible Pets, Requirements, Notifications, and Skills
- Live Minecraft‑styled text preview for descriptions and notifications
- Mobs/effects discovery using PrismarineJS minecraft‑data (fetched at runtime)
- Icons via mcasset.cloud and optional tiny 3D block previews using MineRender
- Drag & drop ordering of trees in the sidebar


## Quick start
Prerequisites:
- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm/yarn equivalents

Install dependencies and start a dev server:

```bash
npm install
npm run dev
```

Build for production and preview the output:

```bash
npm run build
npm run preview
```

The app is a standard Vite + React + TypeScript project and produces a static bundle you can host on any static file host.


## How to use the editor
1. Start the app. On first load, it will present bundled example skilltrees unless a local draft already exists.
2. Use the left sidebar to select a tree. You can drag to reorder or create/delete trees.
3. Edit the selected tree using the tabs:
   - Properties: ID, inheritance, weight
   - Appearance: Name, Icon material (with preview), Description with live MC‑style preview
   - Eligible Pets: Choose which mobs are eligible; you can also include all current and future mobs
   - Requirements: Min/Max level and additional requirement lines (Skilltree/Permission/custom)
   - Notifications: Chat templates keyed by level specifications, with live preview
   - Skills: Add/remove skills from the registry and edit their upgrade payloads and levels
4. Import: Use the Topbar to import one or more `.st.json` files from disk.
5. Export: Use Export ZIP to download all current trees as `<ID>.st.json` files in a ZIP archive.
6. Autosave: Changes are autosaved to your browser’s localStorage; the pill on the right shows status. Use Save to stamp the time.


## Data model overview
Internally the app edits an array of SkilltreeFile objects (see src/lib/types.ts):
- ID: unique id (and export filename)
- Name: human label
- Order: sort order in the sidebar/export
- Icon: `{ Material: string; Glowing?: boolean }`
- Description: string[] (typically lines begin with `- ` in‑game)
- MobTypes: string[] of eligible mob ids, or `['*']` to include all (incl. future updates)
- Weight, RequiredLevel, MaxLevel: optional numeric fields
- Inheritance: `{ Skilltree: string }` to inherit from another tree in the workspace
- Requirements: string[] encoded lines (e.g., `Skilltree:Combat`, `Permission:mypet.use`, `NoSkilltree`, or custom `Key:Value`)
- Notifications: `{ [levelKey: string]: string }` chat templates
- Skills: `{ [skillId: string]: { Upgrades: { [levelKey: string]: Record<string, unknown> } } }`

Level keys can be:
- `"1"` — a single level
- `"1,3"` — a comma‑separated list of fixed levels
- `"%2>10<50"` — dynamic rule: every 2 levels, optionally with `>start` and/or `<until`

Each skill has a schema and an editor component registered in `src/skills/core/registry.ts`. Editors serialize numeric inputs as MyPet‑compatible signed strings like "+1" or "+1.5" and omit undefined fields.


## External data and assets
The app fetches a few lightweight resources at runtime:
- PrismarineJS minecraft‑data (effects, entities): https://github.com/PrismarineJS/minecraft-data (fetched from GitHub raw)
- Textures/models/icons: https://assets.mcasset.cloud/latest/ (images and JSON models)
- 3D block preview: MineRender via a small CDN script in index.html

## Project structure
- src/app — Application shell (App.tsx, main.tsx) and placeholder routes
- src/components — UI components for layout and editors
  - common — small reusable UI primitives (Notice, DropdownPicker)
  - editor — all sub‑editors (Properties, Appearance, Eligible Pets, Requirements, Notifications, Skills)
  - layout — Sidebar and Topbar
- src/lib — utilities and codecs
  - codec/json-io.ts — import/export helpers and example loader
  - mcAssets.ts — URLs and font/renderer helpers for Minecraft assets
  - mcIcons.tsx — runtime icon/3D rendering logic
  - mcUtil.ts, types.ts — shared helpers and domain types
- src/state — Zustand store and autosave lifecycle
- src/skills — skill definitions (schema + editor) and registry
- public/examples — bundled example `.st.json` files
- public/img — icons and skill images


## Development tips
- Validation: Skill payloads are validated with zod per skill definition. The sidebar shows a compact validation indicator, and SkillsPanel highlights invalid entries.
- Autosave: The store marks edits as `pending`, a debounced autosave writes to localStorage, and a ‘beforeunload’ handler warns if there are unsaved changes.
- Adding a new skill: Create `src/skills/MyNewSkill.tsx` exporting a `skillDef` (id, label, schema, Editor). The registry (import.meta.glob) will pick it up automatically.
- Effects and mobs are preloaded in the background on startup to keep the UI responsive.

## Scripts
- `npm run dev` — Start Vite dev server
- `npm run build` — Type‑check and build production bundle
- `npm run preview` — Preview the production build locally

## Acknowledgements
- MyPet plugin and community
- PrismarineJS minecraft‑data for up‑to‑date game data
- mcasset.cloud for asset hosting
- MineRender for in‑browser model previews

## License
This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.md for the full text. If you run or modify this software and make it available to users over a network, you must provide the complete corresponding source code to those users, per the AGPL.

For dependency attributions and licenses, see THIRD_PARTY_NOTICES.md.