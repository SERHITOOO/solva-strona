export const siteUrl = "https://solvaoze.pl";
export const imageVersion = "20260608";
export const routeSeo = [
  {
    route: "/",
    title: "SOLVA | Partner Hydro NRG",
    description:
      "SOLVA pomaga klientom sprawdzić kierunek inwestycji OZE i rozwija partnerski zespół handlowy: fotowoltaika, magazyny energii, pompy ciepła i termomodernizacja.",
    image: "/assets/og/home.jpg",
    imageAlt: "Dom z panelami fotowoltaicznymi i branding SOLVA.",
    changefreq: "weekly",
    priority: "1.0"
  },
  {
    route: "/klienci",
    title: "SOLVA | Bezpłatna analiza OZE dla klientów",
    description:
      "Zgłoś rachunek za prąd i sprawdź kierunek inwestycji OZE: fotowoltaika, magazyn energii, pompa ciepła lub szersza modernizacja.",
    image: "/assets/og/klienci.jpg",
    imageAlt: "Dach domu z instalacją fotowoltaiczną i zaproszenie do analizy OZE.",
    changefreq: "weekly",
    priority: "0.9"
  },
  {
    route: "/handlowcy",
    title: "SOLVA | Współpraca dla handlowców OZE",
    description:
      "Dołącz do zespołu sprzedażowego SOLVA jako handlowiec OZE, lider regionu albo partner z własną bazą kontaktów.",
    image: "/assets/og/handlowcy.jpg",
    imageAlt: "Realizacja fotowoltaiczna i zaproszenie do zespołu handlowego SOLVA.",
    changefreq: "weekly",
    priority: "0.9"
  },
  {
    route: "/prad-ktory-pracuje",
    title: "SOLVA | EMS i prąd, który pracuje",
    description:
      "EMS, lepsze wykorzystanie energii, magazyn energii i weryfikacja, czy instalacja może pracować rozsądniej.",
    image: "/assets/og/prad-ktory-pracuje.jpg",
    imageAlt: "Zaplecze techniczne instalacji i opis EMS dla SOLVA.",
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    route: "/energia-w-obiegu",
    title: "SOLVA | Energia w obiegu",
    description:
      "Energia w obiegu, nadwyżki z fotowoltaiki i sprawdzenie, czy adres pasuje do dalszej rozmowy.",
    image: "/assets/og/energia-w-obiegu.jpg",
    imageAlt: "Instalacja fotowoltaiczna na gruncie i motyw energii w obiegu.",
    changefreq: "monthly",
    priority: "0.7"
  },
  {
    route: "/prywatnosc",
    title: "SOLVA | Prywatność i RODO",
    description:
      "Informacje o kontakcie, danych z formularzy i zasadach przetwarzania danych przez SOLVA.",
    image: "/assets/og/prywatnosc.jpg",
    imageAlt: "Dom z instalacją fotowoltaiczną i informacje o prywatności SOLVA.",
    changefreq: "yearly",
    priority: "0.3"
  }
];

export const routes = routeSeo.map((page) => page.route);
export const seoByPath = Object.fromEntries(routeSeo.map((page) => [page.route, page]));

export function getCanonicalUrl(route) {
  return route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
}

export function getOgImageUrl(page) {
  return `${siteUrl}${page.image}?v=${imageVersion}`;
}
