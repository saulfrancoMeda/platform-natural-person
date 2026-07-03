# MEDA Frontend — chosen setup

- Project type: **full-app**
- Folder architecture: **by-feature**
- State management: **zustand**
- Data fetching: **tanstack**
- MEDA UI base components: **y**
- Authentication: **y**
- Connect to MEDA Java APIs: **n**
- Package manager: **pnpm** · Framework: **Next.js 16 (App Router)** · Language: **TypeScript**

## Folder architecture chosen: by-feature
Organize by feature: src/features/<name>/ (each with components, hooks, api, types) + shared in src/components, src/lib. Balanced default.
