import { render } from "astro:content";
import { experimental_AstroContainer } from "astro/container";
import { getEntry, getCollection } from "astro:content";
import rss from "@astrojs/rss";

import { processCollectionItem } from "@lib/collections";

const {
  data: { name: siteAuthorName },
} = await getEntry("authors", "sk");

export const prerender = true;

export async function offline_render({ params: { slug }, props: { page } }) {
  const {
    data: { title, description, date, updated },
  } = page;

  const { Content } = await render(page);
  const container = await experimental_AstroContainer.create();
  const content = await container.renderToString(Content);

  return {
    title,
    description,
    link: `/kb/${slug}`,
    pubDate: updated || date,
    content,
  };
}

const allPages = (
  await Promise.all((await getCollection("kb")).map(processCollectionItem))
).filter(
  ({
    props: {
      page: {
        data: { unlisted },
      },
    },
  }) => !unlisted,
);

const rssItems = await Promise.all(allPages.map(offline_render));

export async function GET({ site }) {
  return rss({
    title: `${siteAuthorName}'s Knowledge Base`,
    description: `${siteAuthorName}'s Knowledge Base`,
    site,
    trailingSlash: false,
    items: rssItems,
  });
}
