import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createFaqJsonLd, getFaqItemsForAudience } from "../src/content/faq.js";
import { getCanonicalUrl, getOgImageUrl, routeSeo } from "../src/content/seo.js";

const distDir = path.resolve("dist");
const templatePath = path.join(distDir, "index.html");
const template = await readFile(templatePath, "utf8");

function replaceTag(html, matcher, replacement) {
  if (!matcher.test(html)) {
    throw new Error(`Missing SEO tag matching ${matcher}`);
  }

  return html.replace(matcher, replacement);
}

async function assertPageImageExists(page) {
  const imagePath = path.join(distDir, page.image.replace(/^\//, ""));
  await access(imagePath);
}

function getPageAudience(route) {
  if (route === "/klienci") {
    return "clients";
  }

  if (route === "/handlowcy") {
    return "partners";
  }

  return "";
}

function renderPage(page) {
  const url = getCanonicalUrl(page.route);
  const image = getOgImageUrl(page);
  let html = template;

  html = replaceTag(html, /<title>.*?<\/title>/, `<title>${page.title}</title>`);
  html = replaceTag(
    html,
    /<meta\s+[^>]*name="description"[^>]*\/>/s,
    `<meta name="description" content="${page.description}" />`
  );
  html = replaceTag(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:url"[^>]*\/>/s,
    `<meta property="og:url" content="${url}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:title"[^>]*\/>/s,
    `<meta property="og:title" content="${page.title}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:description"[^>]*\/>/s,
    `<meta property="og:description" content="${page.description}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:image"[^>]*\/>/s,
    `<meta property="og:image" content="${image}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:image:secure_url"[^>]*\/>/s,
    `<meta property="og:image:secure_url" content="${image}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:image:type"[^>]*\/>/s,
    '<meta property="og:image:type" content="image/jpeg" />'
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:image:width"[^>]*\/>/s,
    '<meta property="og:image:width" content="1200" />'
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:image:height"[^>]*\/>/s,
    '<meta property="og:image:height" content="630" />'
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*property="og:image:alt"[^>]*\/>/s,
    `<meta property="og:image:alt" content="${page.imageAlt}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*name="twitter:title"[^>]*\/>/s,
    `<meta name="twitter:title" content="${page.title}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*name="twitter:description"[^>]*\/>/s,
    `<meta name="twitter:description" content="${page.description}" />`
  );
  html = replaceTag(
    html,
    /<meta\s+[^>]*name="twitter:image"[^>]*\/>/s,
    `<meta name="twitter:image" content="${image}" />`
  );

  const audience = getPageAudience(page.route);
  if (audience) {
    const faqJsonLd = JSON.stringify(createFaqJsonLd(getFaqItemsForAudience(audience)));
    html = replaceTag(
      html,
      /<\/head>/,
      `    <script type="application/ld+json">${faqJsonLd}</script>\n  </head>`
    );
  }

  return html;
}

for (const page of routeSeo) {
  await assertPageImageExists(page);

  const html = renderPage(page);
  const filePath =
    page.route === "/"
      ? templatePath
      : path.join(distDir, page.route.replace(/^\//, ""), "index.html");

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html);
}

await writeFile(path.join(distDir, "404.html"), renderPage(routeSeo[0]));
