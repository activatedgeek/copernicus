import { defineConfig } from "astro/config";
import { h } from "hastscript";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkEmoji from "remark-emoji";
import remarkHint from "remark-hint";
import remarkMath from "remark-math";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeFigure from "rehype-figure";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
// import rehypeToC from "rehype-toc";

import remarkReadingTime from "./src/lib/plugins/remark-reading-time";

export default defineConfig({
  vite: {
    resolve: {
      preserveSymlinks: true,
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
    ssr: {
      external: ["node:buffer", "astro/container"],
    },
  },
  markdown: {
    gfm: true,
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "vitesse-light",
    },
    remarkPlugins: [remarkEmoji, remarkHint, remarkMath, remarkReadingTime],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["nofollow", "noopener", "noreferrer"],
        },
      ],
      rehypeFigure,
      rehypeKatex,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          content: () => [
            h(
              "span",
              {
                style:
                  "display: inline-flex; vertical-align: middle; font-size: calc(0.4 * var(--pico-font-size));",
              },
              "🔗",
            ),
          ],
          properties: {
            style:
              "text-decoration: none; margin-left: calc(0.3 * var(--pico-spacing));",
          },
        },
      ],
      // [
      //   rehypeToC,
      //   {
      //     customizeTOC: (toc) => {
      //       if (toc.children[0].children.length === 0) {
      //         return false;
      //       }
      //       const __ol2ul = function (tree) {
      //         if (Array.isArray(tree)) {
      //           return tree.map((t) => __ol2ul(t));
      //         } else if (tree.tagName === "ol") {
      //           return {
      //             ...tree,
      //             tagName: "ul",
      //             children: __ol2ul(tree.children),
      //           };
      //         } else if (tree.tagName === "li") {
      //           return {
      //             ...tree,
      //             children: __ol2ul(tree.children),
      //           };
      //         }
      //         return tree;
      //       };
      //       toc.children = [
      //         {
      //           type: "element",
      //           tagName: "details",
      //           properties: {
      //             className: "toc-details",
      //           },
      //           children: [
      //             {
      //               type: "element",
      //               tagName: "summary",
      //               properties: {
      //                 className: "toc-summary",
      //               },
      //               children: [
      //                 {
      //                   type: "element",
      //                   tagName: "span",
      //                   properties: {
      //                     className: "toc-summary-text",
      //                     id: "table-of-contents",
      //                   },
      //                   children: [
      //                     {
      //                       type: "text",
      //                       value: "Table of Contents",
      //                     },
      //                   ],
      //                 },
      //               ],
      //             },
      //             ...__ol2ul(toc.children),
      //           ],
      //         },
      //       ];
      //       toc.tagName = "section";
      //       return toc;
      //     },
      //   },
      // ],
    ],
  },
  integrations: [react(), mdx(), sitemap()],
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  trailingSlash: "ignore",
  site: `https://${process.env.ASTRO_SITE || "copernicus.local"}`,
});
