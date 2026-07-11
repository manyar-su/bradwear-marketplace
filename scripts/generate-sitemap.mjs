import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const siteUrl = 'https://bradwearindonesia.com';
const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const slugifyPathToken = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const addUrl = (urls, path, lastmod = today, changefreq = 'weekly', priority = '0.70') => {
  const normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');
  urls.set(normalizedPath, { path: normalizedPath, lastmod, changefreq, priority });
};

const siteConfigSource = readFileSync(resolve(root, 'lib/siteConfig.ts'), 'utf8');
const constantsSource = readFileSync(resolve(root, 'constants.tsx'), 'utf8');

const urls = new Map();

[
  ['/', '1.00', 'weekly'],
  ['/kemeja-dinas', '0.92', 'weekly'],
  ['/pdh-pdl', '0.92', 'weekly'],
  ['/wearpack', '0.92', 'weekly'],
  ['/polo-jaket', '0.92', 'weekly'],
  ['/celana-tactical', '0.92', 'weekly'],
  ['/katalog', '0.95', 'weekly'],
  ['/galeri-client', '0.88', 'weekly'],
  ['/tentang-kami', '0.82', 'monthly'],
  ['/faq', '0.78', 'weekly'],
  ['/kontak', '0.80', 'weekly'],
  ['/kebijakan-privasi', '0.60', 'monthly'],
  ['/syarat-ketentuan', '0.60', 'monthly'],
  ['/3d', '0.80', 'weekly'],
  ['/galeri-client', '0.84', 'weekly'],
  ['/testimoni', '0.84', 'weekly'],
  ['/visi-misi', '0.72', 'monthly'],
  ['/produk-dan-jasa', '0.80', 'weekly'],
  ['/keunggulan', '0.74', 'monthly'],
  ['/klien-dan-jangkauan', '0.74', 'monthly'],
  ['/legal-dan-lisensi', '0.65', 'monthly'],
  ['/download', '0.72', 'weekly'],
  ['/artikel', '0.88', 'weekly'],
  ['/cara-order', '0.85', 'weekly'],
  ['/lacak-pesanan', '0.72', 'weekly'],
  ['/brad-ai', '0.52', 'weekly'],
  ['/katalog/panduan-ukuran', '0.82', 'monthly'],
  ['/katalog/panduan-jenis-bahan', '0.82', 'monthly'],
].forEach(([path, priority, changefreq]) => addUrl(urls, path, today, changefreq, priority));

const articlesStart = siteConfigSource.indexOf('export const ARTICLES');
const articlesEnd = siteConfigSource.indexOf('export const HOW_TO_ORDER_STEPS');
const articlesSection = articlesStart >= 0 && articlesEnd > articlesStart
  ? siteConfigSource.slice(articlesStart, articlesEnd)
  : '';
const articleSlugMatches = Array.from(articlesSection.matchAll(/slug:\s*'([^']+)'/g));

for (let index = 0; index < articleSlugMatches.length; index += 1) {
  const match = articleSlugMatches[index];
  const nextMatch = articleSlugMatches[index + 1];
  const block = articlesSection.slice(match.index, nextMatch?.index ?? articlesSection.length);
  const slug = match[1];
  const publishedAt = block.match(/publishedAt:\s*'([^']+)'/)?.[1] ?? '';
  const updatedAt = block.match(/updatedAt:\s*'([^']+)'/)?.[1] ?? '';
  if (!slug || ['minimal-order', 'logo-custom', 'lead-time', 'tracking'].includes(slug)) continue;
  addUrl(urls, `/artikel/${slug}`, updatedAt || publishedAt || today, 'monthly', '0.82');
}

const productMatches = constantsSource.matchAll(
  /\{\s*id:\s*'[^']+'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?description:\s*'[^']+'[\s\S]*?\}/g,
);

for (const match of productMatches) {
  const [, name, category] = match;
  if (!name || !category) continue;
  addUrl(urls, `/katalog/model/${slugifyPathToken(category)}-${slugifyPathToken(name)}`, today, 'weekly', '0.78');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls.values())
  .map(
    ({ path, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(`${siteUrl}${path === '/' ? '/' : path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`Generated public/sitemap.xml with ${urls.size} URLs.`);
