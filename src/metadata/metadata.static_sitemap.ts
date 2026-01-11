import { SITE_INFO } from ".";

interface SitemapEntry {
  url: string;
  lastModified: Date | string;
}

const siteName = SITE_INFO.url?.replace(/\/+$/, "");

export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  {
    url: `${siteName}`,
    lastModified: new Date(),
  },
  {
    url: `${siteName}/about`,
    lastModified: new Date(),
  },
  {
    url: `${siteName}/contact`,
    lastModified: new Date(),
  },
  {
    url: `${siteName}/terms-and-services`,
    lastModified: new Date(),
  },
  {
    url: `${siteName}/search`,
    lastModified: new Date(),
  },
  {
    url: `${siteName}/explore`,
    lastModified: new Date(),
  },
];