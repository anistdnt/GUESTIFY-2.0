import { MetadataRoute } from "next";
import { STATIC_SITEMAP_ENTRIES } from "@/metadata/metadata.static_sitemap";

interface EntryType {
  _id: string;
  pg_name: string;
  createdAt: string;
  updatedAt: string;
  targetUrl: string;
}

interface ResponseType {
  total_pages?: number;
  current_page?: number;
  per_page?: number;
  count: number;
  pgList: EntryType[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic PG entries from your data source
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/enlisted-pg/all`,
    {
      method: "GET",
    }
  );
  const data: ResponseType = await response.json();
  const pgs = data.pgList || [];

  const pgUrls = pgs.map((pg) => ({
    url: pg.targetUrl,
    lastModified: pg.updatedAt,
  }));

  return [...STATIC_SITEMAP_ENTRIES, ...pgUrls];
}
