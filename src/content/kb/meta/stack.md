---
title: The Stack
description: Tools powering this website.
date: Jun 19 2020, 14:32 -0700
updated: Sep 16 2024, 9:05 -0400
area: meta
---

This page details the tools powering this website.

The pages are statically rendered to HTML by [Astro](https://astro.build/).
All the page layouts are built in vanilla HTML, minimal [React](https://react.dev),[^react] and styled by [Pico CSS](https://picocss.com/).
All pages use the variable sans-serif font [Assistant](https://fonts.google.com/specimen/Assistant).

[^react]: I would like to use React as less as possible, except for parts that require interactivity and state management.

All content is written in extended markdown via [MDX](https://mdxjs.com), with various lifestyle extensions from [Remark](https://remark.js.org) and [Rehype](https://unifiedjs.com/).
Math is rendered via [KaTeX](https://github.com/KaTeX/KaTeX).
Code highlighting is done using [Shiki](https://shiki.matsu.io/).
Images are hosted on [Imgur](https://imgur.com).

Continuous integration is supported by [Github Actions](https://github.com/features/actions).
Website is deployed on [Cloudflare Pages](https://pages.cloudflare.com/).
Uptime is monitored via [Upptime](https://upptime.js.org).
Domain registrar is [Namecheap](https://namecheap.com).
Nameservers are hosted on [Cloudflare](https://www.cloudflare.com).

Search is powered by [Pagefind](https://pagefind.app/). Minimal analytics are powered by [GoatCounter](https://www.goatcounter.com). Comments are powered by [Gisqus](https://giscus.app).

Code is open-sourced at [activatedgeek/copernicus](https://github.com/activatedgeek/copernicus).
