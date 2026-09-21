# The Portfolio

Gustavo Henrique's interactive portfolio, designed as a clean vintage newspaper. Built with React and JavaScript, with English, Portuguese and Spanish content, light/dark themes, responsive layouts and accessible interactive sections.

## Run locally 

```bash
npm install
npm run dev
```

## Validate a production build

```bash
npm run build
node --test tests/*.test.mjs
```

The portfolio's nested preview is intentionally static. The JobHunter funnel, stack word search and trajectory use short GSAP ScrollTrigger scenes that wait until they enter the viewport.
