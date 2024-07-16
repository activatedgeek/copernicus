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

#### Analytics

- `GOATCOUNTER_SITE`: [GoatCounter](https://www.goatcounter.com) domain analytics. e.g. `<code>.goatcounter.com`

#### Comments

- `GISCUS_REPO`: [Giscus](https://giscus.app) public GitHub repository name.
- `GISCUS_REPO_ID`: [Giscus](https://giscus.app) repository ID.
- `GISCUS_CATEGORY`: [Giscus](https://giscus.app) discussion category name.
- `GISCUS_CATEGORY_ID`: [Giscus](https://giscus.app) discussion category ID.

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
