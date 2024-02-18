import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { processCollectionItem } from "@lib/collections";

const allRedirects = (
  await Promise.all((await getCollection("kb")).map(processCollectionItem))
)
  .map(
    ({
      params: { slug },
      props: {
        page: {
          data: { redirectsFrom },
        },
      },
    }) => ({
      slug,
      redirectsFrom,
    }),
  )
  .filter(({ redirectsFrom }) => redirectsFrom.length)
  .map(({ slug, redirectsFrom }) =>
    redirectsFrom.map((src) => [src, `/kb/${slug}`]),
  )
  .flat();

const redirectsTxt = allRedirects
  .map((r) => [...r, "301"].join(" "))
  .join("\n");

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(redirectsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
