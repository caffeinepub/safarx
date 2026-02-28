# Specification

## Summary
**Goal:** Add an XML sitemap and robots.txt to improve SafarX's search engine indexing.

**Planned changes:**
- Create `frontend/public/sitemap.xml` listing all public pages (Home, Destinations, individual destination detail pages, Packages, Plan Trip, Contact, Community) with `<loc>`, `<lastmod>`, `<changefreq>`, and `<priority>` values using the canonical domain `https://safarx.in`
- Create `frontend/public/robots.txt` that allows all crawlers and includes a `Sitemap` directive pointing to `https://safarx.in/sitemap.xml`
- Add a `<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />` tag in `frontend/index.html`'s `<head>`

**User-visible outcome:** Search engines can discover and crawl all SafarX pages via the sitemap served at `/sitemap.xml`, and the robots.txt guides crawlers appropriately.
