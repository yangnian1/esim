# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development Commands
```bash
# Development with different API endpoints
npm run dev:local          # Connect to local API (localhost:1337)
npm run dev:server         # Connect to server API (admin.esimconnects.com)
npm run dev:debug          # Enable debug mode with verbose logging
npm run dev:local-debug    # Local API + debug mode
npm run dev:server-debug   # Server API + debug mode

# Environment switching
npm run env:local          # Switch to local environment
npm run env:server         # Switch to server environment
npm run debug:enable       # Enable debug logging
npm run debug:disable      # Disable debug logging

# Build commands
npm run build              # Standard build
npm run build:local        # Build for local environment
npm run build:server       # Build for server environment

# Other commands
npm run dev                # Standard development (no API override)
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
- **Strapi CMS** as backend (configurable endpoint)

### Internationalization
- Supported languages: English (en), Chinese (zh), French (fr), German (de), Spanish (es), Japanese (ja)
- Language detection via middleware using `accept-language`
- Fallback language: English (en)
- Language cookie: `i18next`
- Route structure: `/{language}/{page}`

### API Configuration
- **Backend**: Strapi CMS
- **Local API**: `http://localhost:1337`
- **Production API**: `http://admin.esimconnects.com`
- **Environment switching**: Use `NEXT_PUBLIC_STRAPI_URL` environment variable
- **Debug logging**: Controlled by `NEXT_PUBLIC_NETWORK_LOGS` and `NEXT_PUBLIC_VERBOSE_LOGS`

### Key Files and Directories
- `src/app/[lng]/` - App Router with language parameters
- `src/middleware.ts` - Language detection and routing
- `src/i18n/` - i18n configuration and settings
- `src/lib/api.ts` - Strapi API client with products and articles endpoints
- `src/lib/config.ts` - API configuration and debug logging
- `src/types/index.ts` - TypeScript type definitions
- `src/components/` - React components
- `public/locales/` - Translation files (JSON format)

### API Integration
The application connects to a Strapi CMS backend with these main endpoints:
- **Products API**: `/api/products` - Product catalog with featured items
- **Articles API**: `/api/articles/language/{locale}` - Localized blog articles
- **Article Detail API**: `/api/articles/group/{article_group_id}/language/{locale}` - Individual article by group ID and language
- **Image handling**: Support for Strapi uploads and external images (flagcdn.com)

### Article System
- Articles use `article_group_id` for routing instead of numeric IDs
- Article detail URLs: `/{language}/blog/{article_group_id}`
- New API endpoint: `GET /api/articles/group/{article_group_id}/language/{locale}?populate=*`

### Development Environment
- **SSR Mode**: Server-side rendering enabled (static export disabled)
- **Image optimization**: Configured for multiple domains including Strapi uploads
- **Environment variables**: Used for API URL switching and debug settings
- **Debugging**: Comprehensive logging system with Network panel simulation

### Pages Structure
- `/` - Homepage with featured products and latest articles
- `/products` - Product catalog
- `/blog` - Blog articles
- `/blog/[id]` - Individual blog post
- `/orders` - Order management

The app uses server-side rendering with fallback data for offline/error scenarios.