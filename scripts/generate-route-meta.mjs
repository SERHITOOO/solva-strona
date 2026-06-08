import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://solvaoze.pl";
const imageVersion = "20260608";

const pages = [
  {
    route: "/",
    title: "SOLVA | Partner Hydro NRG",
    description:
      "SOLVA pomaga klientom sprawdzić sens inwestycji OZE i rozwija partnerski zespół handlowy we współpracy z Hydro NRG.",
    image: "/assets/og/home.jpg",
    imageAlt: "Dom z panelami fotowoltaicznymi i branding SOLVA."
  },
  {
    route: "/klienci",
    title: "SOLVA | Bezpłatna analiza OZE",
    description:
      "Fotowoltaika, magazyny energii, pompy ciepła i termomodernizacja. Zostaw zgłoszenie i sprawdź, czy inwestycja ma sens.",
    image: "/assets/og/klienci.jpg",
    imageAlt: "Dach domu z instalacją fotowoltaiczną i zaproszenie do analizy OZE."
  },
  {
    route: "/handlowcy",
    title: "SOLVA | Współpraca dla handlowców OZE",
    description:
      "Dołącz do zespołu SOLVA jako handlowiec OZE, lider regionu albo partner z własną bazą kontaktów.",
    image: "/assets/og/handlowcy.jpg",
    imageAlt: "Realizacja fotowoltaiczna i zaproszenie do zespołu handlowego SOLVA."
  },
  {
    route: "/prad-ktory-pracuje",
    title: "SOLVA | EMS i prąd, który pracuje",
    description:
      "EMS, magazynowanie energii i lepsze wykorzystanie prądu tam, gdzie powstaje. Sprawdź, czy adres pasuje do rozmowy.",
    image: "/assets/og/prad-ktory-pracuje.jpg",
    imageAlt: "Zaplecze techniczne instalacji i opis EMS dla SOLVA."
  },
  {
    route: "/energia-w-obiegu",
    title: "SOLVA | Energia w obiegu",
    description:
      "Spółdzielnia energetyczna, lokalny obieg energii i rozmowa o tym, jak sensownie wykorzystać nadwyżki z OZE.",
    image: "/assets/og/energia-w-obiegu.jpg",
    imageAlt: "Instalacja fotowoltaiczna na gruncie i motyw energii w obiegu."
  },
  {
    route: "/prywatnosc",
    title: "SOLVA | Prywatność i RODO",
    description:
      "Informacje o danych z formularzy, zasadach kontaktu, zgodach i przetwarzaniu danych przez SOLVA.",
    image: "/assets/og/prywatnosc.jpg",
    imageAlt: "Dom z instalacją fotowoltaiczną i informacje o prywatności SOLVA."
  }
];

const distDir = path.resolve("dist");
const templatePath = path.join(distDir, "index.html");
const template = await readFile(templatePath, "utf8");

function absoluteUrl(route) {
  return route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
}

function imageUrl(image) {
  return `${siteUrl}${image}?v=${imageVersion}`;
}

function replaceTag(html, matcher, replacement) {
  if (!matcher.test(html)) {
    throw new Error(`Missing SEO tag matching ${matcher}`);
  }

  return html.replace(matcher, replacement);
}

function renderPage(page) {
  const url = absoluteUrl(page.route);
  const image = imageUrl(page.image);
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

  return html;
}

for (const page of pages) {
  const html = renderPage(page);
  const filePath =
    page.route === "/"
      ? templatePath
      : path.join(distDir, page.route.replace(/^\//, ""), "index.html");

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html);
}

await writeFile(path.join(distDir, "404.html"), renderPage(pages[0]));
