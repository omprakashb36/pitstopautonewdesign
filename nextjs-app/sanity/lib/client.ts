
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { createClient, QueryParams } from "next-sanity";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    studioUrl,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});

export async function sanityFetchCustom<const QueryString extends string>({
  query,
  params = {},
  tags = [],
}: {
  query: QueryString
  params?: QueryParams
  tags?: string[]
}) {
  
  return client.fetch(query, params, {
    cache : process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    next: {
      tags, // for tag-based revalidation
    },
  })
}
