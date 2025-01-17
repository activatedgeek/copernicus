import { z, defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";

const areas = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/areas" }),
  schema: z.object({
    label: z.string(),
    emoji: z.string(),
    backgroundColor: z.string(),
    borderColor: z.string(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/authors" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
});

const social = defineCollection({
  loader: glob({ pattern: "**/[^_]*.json", base: "./src/data/social" }),
  schema: z.object({
    url: z.string().url(),
  }),
});

const kb = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/kb" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional().default(""),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    area: reference("areas"),
    redirectsFrom: z.array(z.string()).optional().default([]),
    urn: z.string().optional(),
    keywords: z.array(z.string()).optional().default([]),
    authors: z.array(reference("authors")).optional().default(["sk"]),
    unlisted: z.boolean().default(false),
    comments: z.boolean().default(true),
    hideMetadata: z.boolean().default(false),
  }),
});

const overview = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/overview" }),
  schema: kb.schema,
});

const thoughts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/thoughts" }),
  schema: z.object({
    date: z.coerce.date(),
    authors: z.array(reference("authors")).optional().default(["sk"]),
  }),
});

export const collections = {
  areas,
  authors,
  social,
  kb,
  overview,
  thoughts,
};
