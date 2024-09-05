import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkEmoji from "remark-emoji";
import remarkHint from "remark-hint";
import remarkMath from "remark-math";
import rehypeExternalLinks from "rehype-external-links";
import rehypeFigure from "rehype-figure";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeToC from "rehype-toc";

export default defineConfig({
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
    ssr: {
      external: ["node:buffer"],
    },
  },
  markdown: {
    gfm: true,
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "vitesse-light",
    },
    remarkPlugins: [remarkEmoji, remarkHint, remarkMath],
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
        rehypeToC,
        {
          customizeTOC: (toc) => {
            if (toc.children[0].children.length === 0) {
              return false;
            }
            const __ol2ul = function (tree) {
              if (Array.isArray(tree)) {
                return tree.map((t) => __ol2ul(t));
              } else if (tree.tagName === "ol") {
                return {
                  ...tree,
                  tagName: "ul",
                  children: __ol2ul(tree.children),
                };
              } else if (tree.tagName === "li") {
                return {
                  ...tree,
                  children: __ol2ul(tree.children),
                };
              }
              return tree;
            };
            toc.children = [
              {
                type: "element",
                tagName: "details",
                properties: {
                  className: "toc-details",
                },
                children: [
                  {
                    type: "element",
                    tagName: "summary",
                    properties: {
                      className: "toc-summary",
                    },
                    children: [
                      {
                        type: "element",
                        tagName: "span",
                        properties: {
                          className: "toc-summary-text",
                          id: "table-of-contents",
                        },
                        children: [
                          {
                            type: "text",
                            value: "Table of Contents",
                          },
                        ],
                      },
                    ],
                  },
                  ...__ol2ul(toc.children),
                ],
              },
            ];
            toc.tagName = "section";
            return toc;
          },
        },
      ],
    ],
  },
  integrations: [react(), mdx(), sitemap()],
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  site: `https://${process.env.ASTRO_SITE || "copernicus.local"}`,
});
