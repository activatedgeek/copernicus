import { z, defineCollection, reference } from "astro:content";

const areas = defineCollection({
  type: "data",
  schema: z.object({
    label: z.string(),
    emoji: z.string(),
    backgroundColor: z.string(),
    borderColor: z.string(),
  }),
});

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
});

const kb = defineCollection({
  type: "content",
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
  }),
});

const social = defineCollection({
  type: "data",
  schema: z.object({
    url: z.string().url(),
  }),
});

export const collections = {
  areas,
  authors,
  kb,
  notes: kb,
  overview: kb,
  social,
};
