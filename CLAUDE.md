# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` or `pnpm dev` (opens at http://localhost:3000)
- **Build**: `npm run build` or `pnpm build`
- **Production**: `npm run start` or `pnpm start`
- **Linting**: `npm run lint` or `pnpm lint`
- **Code formatting**: `npm run prettier` or `pnpm prettier`

**Package Manager**: This project uses `pnpm` (>=8.0.0) as specified in engines. Use `pnpm` commands when possible.

## Architecture Overview

This is a Next.js 15 application using the App Router architecture with TypeScript and SCSS modules for styling.

### Core Technologies

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- **SCSS** with CSS modules for component styles
- **GSAP** for animations with React integration
- **Lenis** for smooth scrolling
- **Strapi CMS** backend integration

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components organized by feature, each with `.module.scss` files
- `lib/` - Utility functions including Strapi API integration (`fechData.ts`)
- `styles/` - Global styles, mixins (`_mixins.scss`), design tokens (`_design_tokens.scss`)
- `public/fonts/` - Custom Termina font files

### Key Features

- **Smooth scrolling** with Lenis throughout the application
- **Animation-heavy UI** using GSAP for stacking cards, text reveals, parallax effects
- **Component-scoped styling** using SCSS modules
- **Custom font loading** with Termina font family
- **Image optimization** configured for multiple external domains
- **CMS integration** with Strapi backend

### Styling Approach

- Global mixins available via `@use './styles/_mixins.scss' as *;` (auto-imported via Next.js config)
- Component styles use `.module.scss` files
- Design tokens centralized in `styles/_design_tokens.scss`

### Animation Architecture

- GSAP for complex animations (stacking cards, text reveals)
- Lenis for smooth page scrolling
- React integration with `@gsap/react`
- Optimized bundle splitting for animation libraries

### Data Fetching

- Custom Strapi API wrapper in `lib/fechData.ts`
- Supports both server and client-side data fetching
- Environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRAPI_SILENT`
- Built-in error handling with silent mode option

### Code Quality

- ESLint with Next.js and TypeScript rules
- Prettier for code formatting
- Husky pre-commit hooks with lint-staged
- Auto-formatting on commit for JS/TS/CSS/MD files

### Testing & Reliability

- **Always do eslint tests after any code changes**

### 📚 Documentation & Explainability

- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.
- Prefer arrow functions
- Annotate return types
- Always destructure props
- Avoid any type, use unknown or strict generics
- Group imports: react → next → libraries → local

### 🧠 AI Behavior Rules

- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified javascript packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- Use the context7 MCP to fetch up to date documentation that is not available in hex docs, like Next.js, MUI
- always use MUI components for new stuff
- walk me through your thought process step by step
- before you get started, ask me for any information you need to do a good job
- in git commit, never mention AI or Claude
- Don't remove comments and console.logs that I already had in the script
