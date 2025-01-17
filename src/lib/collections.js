import { getEntry } from "astro:content";
import GithubSlugger from "github-slugger";

export async function processCollectionItem(item) {
  const slugger = new GithubSlugger();

  const {
    data: { urn, title, keywords, area },
  } = item;

  const slug = urn || slugger.slug(title);

  const {
    data: { label },
  } = await getEntry(area.collection, area.id);

  item.data = {
    ...item.data,
    keywords: [...keywords, label],
  };

  return {
    params: { slug, id: slug },
    props: { page: { ...item, slug } },
  };
}

export async function getSocialItem(item) {
  const { data } = await getEntry("social", item);

  return data;
}
