import { getEntry, getCollection } from "astro:content";
import rss from "@astrojs/rss";

import { processCollectionItem } from "@lib/collections";

const allPages = (
  await Promise.all((await getCollection("kb")).map(processCollectionItem))
)
  .map(
    ({
      params: { slug },
      props: {
        page: {
          data: { title, description, date, updated, unlisted },
        },
      },
    }) => ({
      title,
      description,
      link: `/kb/${slug}`,
      pubDate: updated || date,
      unlisted,
    }),
  )
  .filter(({ unlisted }) => !unlisted);

const {
  data: { name: siteAuthorName },
} = await getEntry("authors", "sk");

export const prerender = true;

export function GET(context) {
  return rss({
    title: `${siteAuthorName}'s Knowledge Base`,
    description: `${siteAuthorName}'s Knowledge Base`,
    site: context.site,
    items: allPages,
  });
}
