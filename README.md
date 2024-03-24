# Copernicus

[![Deploy](https://github.com/activatedgeek/copernicus/actions/workflows/pages.yml/badge.svg)](https://github.com/activatedgeek/copernicus/actions/workflows/pages.yml) [![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/13rvh.svg)](https://status.sanyamkapoor.com/?utm_source=status_badge)

Base framework to generate my website based on [Astro](https://astro.build).
Website & knowledge base hosted at [sanyamkapoor.com](https://sanyamkapoor.com).
See details on the stack [here](https://sanyamkapoor.com/kb/the-stack).

## Setup

Install all dependencies.

```shell
npm install
```

### Environment Variables

- `ASTRO_SITE`: Full base domain, e.g. `sanyamkapoor.com`

Optional:

- `GOATCOUNTER_SITE`: [GoatCounter](https://www.goatcounter.com) domain analytics. e.g. `<code>.goatcounter.com`

### Content

All Markdown content must be placed in [`src/content`](./src/content/) under folders. The frontmatter schema is in [`src/content/config.ts`](./src/content/config.ts).

## Build

### Development

```shell
npm run dev
```

### Production

```
npm run build
```

## License

Apache 2.0
