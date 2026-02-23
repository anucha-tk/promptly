# Promptly

A Nuxt 4 app with Vue 3, Tailwind CSS, and a full lint/format and git-hooks setup.

## Stack

- **[Nuxt 4](https://nuxt.com)** – Vue framework (SSR, routing, build)
- **[Vue 3](https://vuejs.org)** – UI (Composition API, `<script setup>`)
- **[Tailwind CSS v4](https://tailwindcss.com)** – Styling (via `@tailwindcss/vite`)
- **[ESLint](https://eslint.org)** – Linting (`@nuxt/eslint-config` flat config)
- **[Prettier](https://prettier.io)** – Formatting
- **[Lefthook](https://github.com/evilmartians/lefthook)** – Git hooks (pre-commit: lint-staged)
- **[Commitlint](https://commitlint.io)** + **Commitizen** – Conventional commits

## Setup

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# bun
bun install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# bun
bun dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# bun
bun build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# bun
bun preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
