# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Commands
```bash
npm run dev                # Standard development server
npm run build              # Production build
npm run start              # Start production server
npm run lint               # Run ESLint
```

### Testing
No specific test commands are configured in package.json.

### Deployment
After pushing to git, run `./deploy.sh` script on the server in the project directory for automatic deployment.

## Architecture

### Project Structure
This is a Next.js 15 application with internationalization (i18n) support using the App Router. Key technologies:
- **Next.js 15** with App Router
- **TypeScript**
- **Tailwind CSS 4**
- **React 19**
- **i18next** for internationalization
- **react-markdown** with remark-gfm for markdown rendering

### Internationalization
- Supported languages: English (en), Chinese (zh), French (fr), German (de), Spanish (es), Japanese (ja)
- Language detection via middleware using `accept-language` package
- Fallback language: English (en)
- Language cookie: `i18next`
- Route structure: `/{language}/{page}`
- Translation files located in: `public/locales/{language}/common.json`
- Configuration: [src/i18n/settings.ts](src/i18n/settings.ts) (languages array and fallback settings)
- Middleware automatically redirects requests without language prefix to `/{detected_language}{pathname}`
- Path alias `@/*` maps to `src/*` (configured in [tsconfig.json:22-24](tsconfig.json#L22-L24))

### Key Files and Directories
- [src/app/\[lng\]/](src/app/[lng]/) - App Router with language parameters
- [src/middleware.ts](src/middleware.ts) - Language detection and routing
- [src/i18n/](src/i18n/) - i18n configuration and settings
- [src/lib/mock-data.ts](src/lib/mock-data.ts) - Mock data and utility functions
- [src/types/index.ts](src/types/index.ts) - TypeScript type definitions
- [src/components/](src/components/) - React components
- [public/locales/](public/locales/) - Translation files (JSON format)

### Data Management
Currently, the application uses static content and mock data:
- Mock data defined in [src/lib/mock-data.ts](src/lib/mock-data.ts)
- Utility functions for formatting prices, dates, and image URLs
- No external API or CMS integration

### Development Environment
- **SSR Mode**: Server-side rendering enabled (static export disabled)
- **Image optimization**: Configured for external images (flagcdn.com)
- **Static translations**: Translations embedded directly in page components

### Pages Structure
All pages are under `src/app/[lng]/` with language parameter:
- `/{lng}/` - Homepage with hero section and navigation
- `/{lng}/products` - Product catalog placeholder page
- `/{lng}/blog` - Blog articles placeholder page
- `/{lng}/blog/[id]` - Individual blog post placeholder page
- `/{lng}/orders` - Order management page

### Type Definitions
All TypeScript types are defined in [src/types/index.ts](src/types/index.ts):
- `Product` - Product catalog items with pricing, SKU, countries, validity, images
- `Article` - Blog articles with localized titles/excerpts
- `Category` - Product categories with hierarchical structure
- `ApiResponse<T>` - Generic API response wrapper type

### Next Steps
The application is currently set up as a foundation for adding a backend data source. When implementing a new backend:
1. Create new API client in `src/lib/` directory
2. Update page components to fetch real data
3. Remove or replace mock data in `src/lib/mock-data.ts`
4. Update environment variables as needed
5. Configure image domains in [next.config.ts](next.config.ts) if using remote images
