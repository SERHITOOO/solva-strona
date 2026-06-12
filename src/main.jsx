import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Camera,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Handshake,
  HelpCircle,
  Layers3,
  Mail,
  MapPin,
  Menu,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

const routes = ["/", "/klienci", "/handlowcy", "/prad-ktory-pracuje", "/energia-w-obiegu", "/prywatnosc"];
const appBasePath = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
const heroImages = {
  home: { "--hero-image": `url("${assetUrl("assets/realizations/hero-home.webp")}")` },
  clients: { "--hero-image": `url("${assetUrl("assets/realizations/home-aerial.webp")}")` },
  partners: { "--hero-image": `url("${assetUrl("assets/realizations/commercial-roof.webp")}")` },
  smartEnergy: { "--hero-image": `url("${assetUrl("assets/realizations/technical-room.webp")}")` },
  cooperative: { "--hero-image": `url("${assetUrl("assets/realizations/ground-mount.webp")}")` },
  privacy: { "--hero-image": `url("${assetUrl("assets/realizations/home-roof.webp")}")` }
};
const logoUrl = `${assetUrl("assets/solva-logo.svg")}?v=1`;
const contactEmail = "kontakt@solvaoze.pl";
const privacyEmail = contactEmail;
const staticFormEndpoint = import.meta.env.VITE_FORM_ENDPOINT || "";
const apiBaseUrl = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const legalEntityName = "JTJ FUND sp. z o.o.";
const legalEntity = {
  fullName: "JTJ FUND SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
  address: "ul. Komorska 55, 04-149 Warszawa",
  krs: "0000602719",
  nip: "5272760087",
  regon: "363751630"
};

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function stripBasePath(pathname) {
  if (appBasePath && pathname.startsWith(appBasePath)) {
    return pathname.slice(appBasePath.length) || "/";
  }

  return pathname;
}

function toPublicPath(path, hash = "") {
  return `${appBasePath}${path === "/" ? "/" : path}${hash}`;
}

function parseRouteHref(href) {
  if (href.startsWith("#")) {
    return { path: getInitialPath(), hash: href };
  }

  const url = new URL(href, window.location.href);
  const routePath = stripBasePath(url.pathname);
  const path = routes.includes(routePath) ? routePath : "/";

  return { path, hash: url.hash };
}

const leadDefaults = {
  fullName: "",
  phone: "",
  email: "",
  location: "",
  monthlyBill: "250-450 zł",
  solution: "Fotowoltaika z analizą rachunku",
  roofType: "Dach skośny",
  investmentTime: "Do 3 miesięcy",
  message: "",
  consent: false,
  companyWebsite: ""
};

const partnerDefaults = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  experience: "Mam doświadczenie w sprzedaży",
  leadSource: "Mam własne źródła kontaktów",
  preferredProducts: "Fotowoltaika i magazyny energii",
  availableFrom: "Od zaraz",
  hasTeam: false,
  message: "",
  consent: false,
  companyWebsite: ""
};

const realizations = [
  {
    title: "Dom jednorodzinny z PV",
    meta: "Fotowoltaika dopasowana do domu, dachu i codziennego zużycia energii. Przed ofertą sprawdzamy rachunek, potrzeby domowników i warunki montażu.",
    image: assetUrl("assets/realizations/residential-front.webp"),
    tag: "Klienci indywidualni"
  },
  {
    title: "Instalacja na dużym dachu",
    meta: "Duże dachy firmowe mogą realnie obniżać koszt energii w działalności. Analizujemy profil zużycia, miejsce montażu i sens połączenia PV z magazynem energii.",
    image: assetUrl("assets/realizations/commercial-roof.webp"),
    tag: "Firmy i obiekty"
  },
  {
    title: "Pompa ciepła przy budynku",
    meta: "Pompa ciepła może być częścią szerszej modernizacji domu. Przed rozmową o urządzeniu warto sprawdzić budynek, obecne ogrzewanie i planowane zużycie energii.",
    image: assetUrl("assets/realizations/heat-pump.webp"),
    tag: "Pompy ciepła"
  },
  {
    title: "Fotowoltaika na dachu skośnym",
    meta: "Układ paneli powinien wynikać z konstrukcji dachu, stron świata i możliwego zacienienia. Dlatego przed ofertą porządkujemy podstawowe informacje o budynku.",
    image: assetUrl("assets/realizations/home-aerial.webp"),
    tag: "Dachy skośne"
  },
  {
    title: "Instalacja gruntowa",
    meta: "Gdy dach nie jest najlepszym miejscem montażu albo zapotrzebowanie jest większe, warto sprawdzić instalację gruntową. To rozwiązanie wymaga dobrej oceny działki i skali zużycia.",
    image: assetUrl("assets/realizations/ground-mount.webp"),
    tag: "Grunt i skala"
  },
  {
    title: "Zaplecze techniczne",
    meta: "Dobra inwestycja OZE to nie tylko panele na dachu. Liczy się także sposób podłączenia, dobór urządzeń i uporządkowane wykonanie całego zaplecza technicznego.",
    image: assetUrl("assets/realizations/technical-room.webp"),
    tag: "Detale"
  }
];

const clientGallery = [
  realizations[0],
  realizations[3],
  realizations[2]
];

const partnerGallery = [
  realizations[1],
  realizations[4],
  realizations[5]
];

const recruitment = [
  { icon: CircleDollarSign, title: "Czytelny model prowizyjny", text: "Warunki rozliczeń są oparte o zaakceptowany proces, komplet dokumentów i status klienta. Szczegóły potwierdzamy przed startem współpracy." },
  { icon: ClipboardCheck, title: "Praca na zatwierdzonej ofercie", text: "Handlowiec prowadzi rozmowy w oparciu o aktualne procedury, cenniki i standardy obsługi, bez obietnic poza zaakceptowaną ofertą." },
  { icon: Users, title: "Miejsce dla liderów i zespołów", text: "Formularz obsługuje osoby samodzielne, liderów regionalnych oraz partnerów, którzy mają własną bazę kontaktów lub zespół." }
];

const proof = [
  { icon: SunMedium, value: "Zakres OZE", label: "PV, magazyny, pompy i termomodernizacja" },
  { icon: SearchCheck, value: "0 zł", label: "za wstępne sprawdzenie kierunku inwestycji" },
  { icon: BadgeCheck, value: "Bez presji", label: "najpierw dane i rozmowa, dopiero potem decyzja" }
];

const clientSegments = [
  { icon: SunMedium, title: "Domy jednorodzinne", text: "Sprawdzamy rachunek, dach, miejsce montażu i termin inwestycji, żeby rozmowa ofertowa była konkretna od pierwszego kontaktu." },
  { icon: Building2, title: "Firmy i obiekty usługowe", text: "Przy firmach liczy się profil zużycia, dostępna powierzchnia i to, czy PV warto połączyć z magazynem energii albo pompą ciepła." },
  { icon: BatteryCharging, title: "Większe inwestycje OZE", text: "Jeśli temat jest większy niż standardowa instalacja na domu, porządkujemy dane i wskazujemy, co warto zweryfikować w pierwszej kolejności." }
];

const solutionAreas = [
  { icon: SunMedium, title: "Fotowoltaika", text: "Dobór kierunku rozmowy na podstawie rachunku, typu dachu, miejsca montażu, działki i planowanego terminu decyzji." },
  { icon: BatteryCharging, title: "Magazyny energii", text: "Wstępna kwalifikacja klientów z większym zużyciem, autokonsumpcją lub potrzebą zabezpieczenia pracy instalacji." },
  { icon: Sparkles, title: "EMS", text: "Pomaga lepiej wykorzystać energię z instalacji i sprawdzić, czy magazyn energii ma sens w Twojej sytuacji." },
  { icon: Users, title: "Energia w obiegu", text: "Wstępne sprawdzenie, czy adres pozwala rozmawiać o korzystniejszym wykorzystaniu nadwyżek energii." },
  { icon: WalletCards, title: "Finansowanie i programy wsparcia", text: "Możemy omówić dostępne kierunki finansowania i sprawdzić, które z nich warto brać pod uwagę przy Twojej inwestycji." },
  { icon: FileCheck2, title: "Analiza przed ofertą", text: "Zbieramy podstawowe informacje, żeby szybciej ustalić, czy rozmawiamy o PV, magazynie energii, pompie ciepła czy szerszej modernizacji." }
];

const trustSignals = [
  { icon: SearchCheck, title: "Najpierw potrzeby", text: "Nie zaczynamy od oferty. Zbieramy rachunek, miejsce inwestycji, termin i oczekiwany zakres." },
  { icon: ShieldCheck, title: "Bez pustych obietnic", text: "Najpierw sprawdzamy dane, a dopiero potem rozmawiamy o rozwiązaniu i możliwych korzyściach." },
  { icon: FileCheck2, title: "Realizacje i potwierdzenia", text: "Zobaczysz przykłady wykonania, zakres rozmowy i jasne kroki przed ofertą. Szczegóły każdej inwestycji potwierdzamy indywidualnie." }
];

const energyRoutes = [
  {
    icon: Sparkles,
    title: "Prąd, który pracuje",
    label: "EMS / lepsze wykorzystanie energii",
    text: "Dla osób, które mają lub planują PV z magazynem i chcą sprawdzić, czy prąd z instalacji może pracować rozsądniej.",
    href: "/prad-ktory-pracuje"
  },
  {
    icon: Users,
    title: "Energia w obiegu",
    label: "nadwyżki energii / weryfikacja adresu",
    text: "Dla klientów, którzy chcą sprawdzić, czy nadwyżki energii można wykorzystać w lepszym modelu niż standardowe rozliczenie.",
    href: "/energia-w-obiegu"
  }
];

const smartEnergyCards = [
  { icon: Sparkles, title: "Więcej porządku w energii", text: "EMS pomaga sprawdzić, kiedy prąd z instalacji lepiej zużyć, zachować w magazynie albo oddać dalej." },
  { icon: BatteryCharging, title: "Magazyn z konkretnym celem", text: "Jeśli myślisz o magazynie energii, warto najpierw zobaczyć, czy pasuje do Twojego sposobu zużycia prądu." },
  { icon: TrendingUp, title: "Nadwyżka bez przypadkowości", text: "Zamiast zgadywać, można oprzeć rozmowę o rachunek, zużycie i to, kiedy dom naprawdę potrzebuje energii." },
  { icon: ShieldCheck, title: "Bez obietnic bez danych", text: "Najpierw krótka weryfikacja, dopiero potem rozmowa o rozwiązaniu, kosztach i możliwych efektach." }
];

const cooperativeCards = [
  { icon: Users, title: "Nadwyżki z większym sensem", text: "Jeśli instalacja produkuje więcej energii niż zużywasz na bieżąco, warto sprawdzić, czy istnieje korzystniejsza ścieżka rozliczenia." },
  { icon: SunMedium, title: "Adres ma znaczenie", text: "Nie każdy dom, firma czy gospodarstwo kwalifikuje się do tej rozmowy. Dlatego pierwszym krokiem jest sprawdzenie lokalizacji." },
  { icon: MapPin, title: "Prosty start", text: "Na początku wystarczy miejscowość, rachunek i informacja, czy instalacja już działa, czy dopiero jest planowana." },
  { icon: FileCheck2, title: "Szczegóły po weryfikacji", text: "Warunki, formalności i opłacalność warto omawiać dopiero wtedy, gdy wiemy, że temat pasuje do adresu." }
];

const cooperativeChecks = [
  "miejscowość i operator sieci",
  "obecne zużycie oraz rachunek za prąd",
  "czy energia powstaje w domu, firmie lub gospodarstwie",
  "czy instalacja już działa, czy dopiero jest planowana",
  "czy weryfikacja ma dotyczyć domu, firmy czy grupy kilku obiektów"
];

const clientProcess = [
  "Krótki formularz",
  "Kontakt i rachunek",
  "Wstępny zakres OZE",
  "Rozmowa z doradcą"
];

const partnerProcess = [
  { title: "Zgłoszenie", text: "Kandydat podaje region, doświadczenie, źródła klientów i preferowany zakres produktów." },
  { title: "Rozmowa i autoryzacja", text: "Potwierdzamy zasady współpracy, standard obsługi i dokumenty potrzebne do startu." },
  { title: "Onboarding", text: "Po akceptacji omawiamy proces, standard obsługi, produkty i materiały potrzebne do startu." },
  { title: "Praca z klientem", text: "Rozmowy, statusy i dokumenty prowadzimy w uporządkowany sposób, żeby klient od początku wiedział, co dzieje się dalej." }
];

const partnerTracks = [
  { icon: Sparkles, title: "Chcę zacząć w OZE", text: "Dobra ścieżka dla osób z energią do sprzedaży i gotowością do pracy na procesie oraz materiałach." },
  { icon: TrendingUp, title: "Mam doświadczenie w sprzedaży", text: "Dla handlowców, którzy potrafią prowadzić rozmowy, kwalifikować klientów i domykać kolejne kroki." },
  { icon: Users, title: "Mam własny zespół", text: "Dla liderów regionalnych i partnerów, którzy mogą rozwijać sprzedaż z większą liczbą doradców." },
  { icon: SearchCheck, title: "Mam bazę kontaktów", text: "Dla osób z lokalnymi poleceniami, kontaktami firmowymi, terenowymi lub branżowymi." }
];

const clientNextSteps = [
  { icon: Mail, title: "1. Zostawiasz kontakt", text: "W formularzu podajesz lokalizację, rachunek, zakres i termin decyzji." },
  { icon: SearchCheck, title: "2. Weryfikacja zgłoszenia", text: "Doprecyzowujemy potrzeby i prosimy o dane potrzebne do analizy, jeśli zgłoszenie wymaga uzupełnienia." },
  { icon: FileCheck2, title: "3. Jasny kierunek rozmowy", text: "Po weryfikacji wiadomo, czy rozmowa dotyczy PV, magazynu energii, pompy ciepła czy szerszej modernizacji." }
];

const partnerNextSteps = [
  { icon: Mail, title: "1. Wysyłasz zgłoszenie", text: "Podajesz region, doświadczenie, dostępność i źródła klientów." },
  { icon: SearchCheck, title: "2. Wstępna kwalifikacja", text: "Ustalamy, czy rozmawiamy o współpracy indywidualnej, liderze czy zespole." },
  { icon: ClipboardCheck, title: "3. Autoryzacja i start", text: "Szczegóły dokumentów, rozliczeń i materiałów potwierdzamy przed rozpoczęciem współpracy." }
];

const clientFormPrep = [
  { icon: FileText, title: "Rachunek lub kwota", text: "Wystarczy ostatnia kwota za prąd. Zdjęcie rachunku przyda się dopiero przy rozmowie." },
  { icon: MapPin, title: "Miejscowość i obiekt", text: "Dom, firma, gospodarstwo, dach albo grunt. To pomaga od razu wybrać dobry kierunek." },
  { icon: Target, title: "Cel inwestycji", text: "Niższy rachunek, magazyn, pompa, EMS albo nadwyżki energii. Nie musisz znać rozwiązania na starcie." }
];

const partnerFormPrep = [
  { icon: MapPin, title: "Region działania", text: "Wpisz miasto, województwo albo obszar, w którym realnie możesz obsługiwać klientów." },
  { icon: TrendingUp, title: "Doświadczenie", text: "Sprzedaż, OZE, praca terenowa, obsługa klienta lub prowadzenie własnego zespołu." },
  { icon: Users, title: "Źródła klientów", text: "Polecenia, baza kontaktów, działania lokalne albo zespół. To ustawia rozmowę startową." }
];

const materialSlots = [
  { icon: Camera, title: "Realne przykłady inwestycji", text: "Zdjęcia domów, firm, instalacji gruntowych i pomp ciepła pomagają łatwiej wyobrazić sobie, jaki zakres może pasować do Twojej sytuacji." },
  { icon: FileText, title: "Jasny zakres rozmowy", text: "Od początku ustalamy, czy chodzi o PV, magazyn energii, pompę ciepła, EMS czy temat nadwyżek energii." },
  { icon: ClipboardCheck, title: "Prosta ścieżka kontaktu", text: "Krótki formularz zbiera najważniejsze dane, a dalsza rozmowa opiera się na konkretach zamiast ogólnych obietnic." }
];

const faqItems = [
  {
    audience: ["all", "clients", "partners"],
    question: "Czy SOLVA jest osobną marką?",
    answer: `Tak. SOLVA to marka handlowa używana przez ${legalEntityName}, która komunikuje partnerski zespół sprzedażowy współpracujący z Hydro NRG.`
  },
  {
    audience: ["all", "clients"],
    question: "Jakie rozwiązania można zgłosić przez formularz?",
    answer: "Fotowoltaikę, magazyny energii, EMS, energię w obiegu, pompy ciepła, źródła ciepła oraz szerszą analizę OZE dla domu lub firmy."
  },
  {
    audience: ["all", "clients"],
    question: "Czy EMS oznacza gwarantowany zarobek na prądzie?",
    answer: "Nie obiecujemy wyniku bez danych. EMS ma pomóc lepiej wykorzystać energię z instalacji, ale sens rozwiązania trzeba sprawdzić na rachunku, instalacji i sposobie zużycia prądu."
  },
  {
    audience: ["all", "clients"],
    question: "Czy każdy może wejść do spółdzielni energetycznej?",
    answer: "Nie. Najpierw trzeba sprawdzić lokalizację, operatora sieci, warunki członkostwa i profil zużycia. Dlatego na stronie prowadzimy do rozmowy, a nie do obietnicy bez weryfikacji."
  },
  {
    audience: ["all", "partners"],
    question: "Czy handlowiec może mieć własny zespół?",
    answer: "Tak, formularz jest przygotowany także dla liderów i osób z własną bazą kontaktów. Szczegóły współpracy wymagają potwierdzenia przed startem."
  },
  {
    audience: ["all", "clients", "partners"],
    question: "Czy mogę zobaczyć przykłady realizacji?",
    answer: "Tak. Możesz zobaczyć przykładowe kadry wykonawstwa, a przy rozmowie dopasujemy zakres do podobnego typu inwestycji."
  },
  {
    audience: ["all", "clients"],
    question: "Co warto przygotować przed analizą?",
    answer: "Najbardziej pomaga aktualny rachunek za prąd, miejscowość, informacja o budynku oraz to, czy instalacja już istnieje, czy dopiero jest planowana."
  },
  {
    audience: ["all", "partners"],
    question: "Co warto przygotować przed zgłoszeniem handlowca?",
    answer: "Najlepiej określić region działania, doświadczenie sprzedażowe, dostępność, źródła klientów i informację, czy współpraca ma dotyczyć jednej osoby czy zespołu."
  }
];

const seoByPath = {
  "/": {
    title: "SOLVA | Partner Hydro NRG",
    description: "SOLVA pomaga klientom sprawdzić kierunek inwestycji OZE i rozwija partnerski zespół handlowy: fotowoltaika, magazyny energii, pompy ciepła i termomodernizacja."
  },
  "/klienci": {
    title: "SOLVA | Bezpłatna analiza OZE dla klientów",
    description: "Zgłoś rachunek za prąd i sprawdź kierunek inwestycji OZE: fotowoltaika, magazyn energii, pompa ciepła lub szersza modernizacja."
  },
  "/handlowcy": {
    title: "SOLVA | Współpraca dla handlowców OZE",
    description: "Dołącz do zespołu sprzedażowego SOLVA jako handlowiec OZE, lider regionu albo partner z własną bazą kontaktów."
  },
  "/prad-ktory-pracuje": {
    title: "SOLVA | Prąd, który pracuje",
    description: "EMS, lepsze wykorzystanie energii, magazyn energii i weryfikacja, czy instalacja może pracować rozsądniej."
  },
  "/energia-w-obiegu": {
    title: "SOLVA | Energia w obiegu",
    description: "Energia w obiegu, nadwyżki z fotowoltaiki i sprawdzenie, czy adres pasuje do dalszej rozmowy."
  },
  "/prywatnosc": {
    title: "SOLVA | Prywatność i zgody",
    description: "Informacje o kontakcie, danych z formularzy i zasadach przetwarzania danych przez SOLVA."
  }
};

function getTrackingData() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const tracking = {};

  keys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      tracking[key] = value;
    }
  });

  return {
    page: window.location.href,
    referrer: document.referrer,
    ...tracking
  };
}

function setMetaAttribute(selector, attribute, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.setAttribute(attribute, value);
  }
}

function updateSeo(path) {
  const seo = seoByPath[path] || seoByPath["/"];
  document.title = seo.title;
  setMetaAttribute('meta[name="description"]', "content", seo.description);
  setMetaAttribute('meta[property="og:title"]', "content", seo.title);
  setMetaAttribute('meta[property="og:description"]', "content", seo.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }

  canonical.setAttribute("href", new URL(toPublicPath(path), window.location.origin).href);
}

function isLocalHost() {
  if (typeof window === "undefined") {
    return false;
  }

  return ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
}

function shouldUseApiEndpoint() {
  return Boolean(apiBaseUrl) || isLocalHost();
}

function getApiUrl(endpoint) {
  return apiBaseUrl ? `${apiBaseUrl}${endpoint}` : endpoint;
}

function formatFieldValue(value) {
  if (typeof value === "boolean") {
    return value ? "tak" : "nie";
  }

  return value || "-";
}

function buildSubmissionPayload(kind, form) {
  const labels = {
    lead: "Zgłoszenie klienta",
    partner: "Zgłoszenie handlowca"
  };

  const payload = {
    typ: labels[kind],
    status: "nowe",
    zrodlo: "strona SOLVA",
    marka: "SOLVA",
    podmiot: legalEntityName,
    ...form,
    consent: form.consent ? "tak" : "nie",
    tracking: getTrackingData()
  };

  if (kind === "partner") {
    payload.hasTeam = form.hasTeam ? "tak" : "nie";
  }

  return payload;
}

function buildMailtoHref(kind, form) {
  const payload = buildSubmissionPayload(kind, form);
  const subject = kind === "lead" ? "SOLVA - zgłoszenie klienta" : "SOLVA - zgłoszenie handlowca";
  const body = Object.entries(payload)
    .filter(([key]) => !["companyWebsite", "tracking", "turnstileToken"].includes(key))
    .map(([key, value]) => `${key}: ${formatFieldValue(value)}`)
    .join("\n");
  const tracking = payload.tracking?.page ? `\n\nStrona zgłoszenia: ${payload.tracking.page}` : "";

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}${tracking}`)}`;
}

async function submitToStaticEndpoint(kind, form, turnstileToken) {
  const payload = {
    kind,
    ...buildSubmissionPayload(kind, form),
    turnstileToken
  };
  const response = await fetch(staticFormEndpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Nie udało się wysłać formularza. Spróbuj ponownie za chwilę albo napisz na kontakt@solvaoze.pl.");
  }
}

function getInitialPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const routePath = stripBasePath(window.location.pathname);

  return routes.includes(routePath) ? routePath : "/";
}

function App() {
  const [path, setPath] = useState(getInitialPath);

  function navigate(href) {
    const { path: nextPath, hash } = parseRouteHref(href);
    window.history.pushState({}, "", toPublicPath(nextPath, hash));
    setPath(nextPath);

    window.setTimeout(() => {
      if (hash) {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 60);
  }

  useEffect(() => {
    updateSeo(path);
  }, [path]);

  useEffect(() => {
    function handlePopState() {
      setPath(getInitialPath());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    window.setTimeout(() => {
      if (window.location.hash) {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);
  }, [path]);

  useRevealMotion(path);
  useScrollProgress(path);

  return (
    <>
      <a className="skip-link" href="#main-content">Przejdź do treści</a>
      <ScrollProgress />
      <Header currentPath={path} onNavigate={navigate} />
      <main id="main-content">
        {path === "/klienci" ? <ClientsPage onNavigate={navigate} /> : null}
        {path === "/handlowcy" ? <PartnersPage onNavigate={navigate} /> : null}
        {path === "/prad-ktory-pracuje" ? <SmartEnergyPage onNavigate={navigate} /> : null}
        {path === "/energia-w-obiegu" ? <EnergyCooperativePage onNavigate={navigate} /> : null}
        {path === "/prywatnosc" ? <PrivacyPage onNavigate={navigate} /> : null}
        {path === "/" ? <HomePage onNavigate={navigate} /> : null}
      </main>
      <Footer onNavigate={navigate} />
      <MobileActionBar currentPath={path} onNavigate={navigate} />
    </>
  );
}

function HomePage({ onNavigate }) {
  return (
    <>
      <section className="hero" id="start" style={heroImages.home}>
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow"><SunMedium size={18} /> Partner Hydro NRG</p>
          <h1>SOLVA</h1>
          <div className="partner-pill"><ShieldCheck size={18} /> <span>Fotowoltaika, pompy ciepła, magazyny energii</span></div>
          <p className="hero-copy">
            Kwalifikujemy inwestycje OZE dla klientów i rozwijamy partnerski zespół handlowy w modelu współpracy z Hydro NRG.
          </p>
          <div className="hero-actions" aria-label="Główne akcje">
            <SiteLink className="button primary" href="/klienci#formularz" onNavigate={onNavigate}>
              <Calculator size={19} /> Sprawdź inwestycję
            </SiteLink>
            <SiteLink className="button secondary" href="/handlowcy#formularz" onNavigate={onNavigate}>
              <BriefcaseBusiness size={19} /> Dołącz do zespołu
            </SiteLink>
          </div>
        </div>
      </section>

      <ProofStrip />
      <CompanySection />
      <EnergyRoutesSection onNavigate={onNavigate} />
      <MediaSection />
      <MaterialsSection />
      <AssetStageSection />
      <HomeCtaSection onNavigate={onNavigate} />
    </>
  );
}

function EnergyRoutesSection({ onNavigate }) {
  return (
    <section className="section energy-routes-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Zap size={18} /> Dwa tematy do sprawdzenia</p>
        <h2>Masz albo planujesz fotowoltaikę? Sprawdź, czy prąd może pracować rozsądniej.</h2>
        <p>
          Nie zaczynamy od kalkulatora bez danych. Najpierw wystarczy rachunek, lokalizacja i informacja, czy instalacja już działa.
        </p>
      </div>
      <div className="energy-route-grid">
        {energyRoutes.map((item) => {
          const Icon = item.icon;
          return (
            <article className="energy-route-card" key={item.title}>
              <Icon size={28} />
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <SiteLink className="text-link" href={item.href} onNavigate={onNavigate}>
                Sprawdź tę ścieżkę <ArrowRight size={17} />
              </SiteLink>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SmartEnergyPage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="EMS"
        icon={Sparkles}
        title="Prąd, który pracuje, kiedy Ty o nim nie myślisz."
        text="EMS pomaga lepiej wykorzystać energię z fotowoltaiki i sprawdzić, czy magazyn energii pasuje do Twojego domu albo firmy."
        primary={{ href: "/klienci#formularz", label: "Sprawdź swój dom", icon: Calculator }}
        secondary={{ href: "/energia-w-obiegu", label: "Zobacz drugi model", icon: Users }}
        imageStyle={heroImages.smartEnergy}
        onNavigate={onNavigate}
      />
      <section className="section offer-story-section reveal-zone">
        <div className="section-grid">
          <div className="section-copy">
            <p className="eyebrow dark"><BatteryCharging size={18} /> EMS w praktyce</p>
            <h2>PV produkuje prąd. Pytanie brzmi: czy robi z nim najlepszą możliwą rzecz?</h2>
            <p>
              Jeśli masz fotowoltaikę albo myślisz o magazynie energii, warto sprawdzić, czy dom nie oddaje prądu w złym momencie.
              EMS pomaga uporządkować pracę instalacji: kiedy korzystać z własnej energii, kiedy ją zostawić na później i kiedy nadwyżka może mieć większy sens.
            </p>
            <OfferCallPanel
              title="Wystarczy rachunek i kilka informacji o domu."
              text="Nie obiecujemy zysku bez danych. Najpierw sprawdzamy, czy EMS albo magazyn energii w ogóle pasują do Twojej sytuacji."
              onNavigate={onNavigate}
            />
          </div>
          <div className="energy-visual-panel">
            <div className="energy-orbit">
              <span>PV</span>
              <span>EMS</span>
              <span>Magazyn</span>
              <span>Rachunek</span>
            </div>
            <strong>Chodzi o lepszy porządek w energii, nie o zgadywanie.</strong>
            <p>Najpierw patrzymy na rachunek, zużycie i to, czy magazyn energii ma sens w konkretnym przypadku.</p>
          </div>
        </div>
      </section>

      <section className="section value-section reveal-zone">
        <div className="section-heading">
          <p className="eyebrow dark"><Sparkles size={18} /> Co można sprawdzić</p>
          <h2>Mniej zgadywania, więcej kontroli nad energią z własnej instalacji.</h2>
        </div>
        <div className="offer-grid four">
          {smartEnergyCards.map((item) => {
            const Icon = item.icon;
            return (
              <article className="offer-card accent-card" key={item.title}>
                <Icon size={25} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section split-cta-section reveal-zone">
        <div className="split-cta-grid">
          <article className="split-cta-card dark">
            <Zap size={28} />
            <h3>Nie musisz znać szczegółów działania.</h3>
            <p>Rachunek, obecne zużycie i informacja o instalacji wystarczą, żeby wstępnie ocenić kierunek.</p>
            <SiteLink className="button secondary" href="/klienci#formularz" onNavigate={onNavigate}>
              <FileText size={18} /> Zostaw dane do analizy
            </SiteLink>
          </article>
          <article className="split-cta-card">
            <FileCheck2 size={28} />
            <h3>Najpierw krótka weryfikacja.</h3>
            <p>Po zgłoszeniu sprawdzamy, czy rozmawiamy o samej PV, magazynie, EMS czy szerszym uporządkowaniu energii w domu.</p>
            <SiteLink className="button primary" href="/klienci#formularz" onNavigate={onNavigate}>
              Zostaw dane do sprawdzenia <ArrowRight size={18} />
            </SiteLink>
          </article>
        </div>
      </section>
    </>
  );
}

function EnergyCooperativePage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="Energia w obiegu"
        icon={Users}
        title="Energia w obiegu. Zamiast oddawać nadwyżki w ciemno."
        text="Model dla klientów, którzy chcą sprawdzić, czy ich prąd może być rozliczany we wspólnym bilansie i pracować w lokalnej grupie, a nie tylko w pojedynczym domu."
        primary={{ href: "/klienci#formularz", label: "Sprawdź lokalizację", icon: MapPin }}
        secondary={{ href: "/prad-ktory-pracuje", label: "Zobacz EMS", icon: Sparkles }}
        imageStyle={heroImages.cooperative}
        onNavigate={onNavigate}
      />

      <section className="section offer-story-section reveal-zone">
        <div className="section-grid reverse">
          <div className="energy-visual-panel cooperative">
            <div className="community-map">
              <span>Dom</span>
              <span>Firma</span>
              <span>Gospodarstwo</span>
              <span>Bilans</span>
            </div>
            <strong>Prąd zaczyna mieć kontekst: miejsce, grupę i zasady.</strong>
            <p>Rozmowa zaczyna się od lokalizacji, zużycia i tego, czy energia może działać w szerszym, lepiej poukładanym modelu.</p>
          </div>
          <div className="section-copy">
            <p className="eyebrow dark"><Handshake size={18} /> Lokalny obieg energii</p>
            <h2>Nie musisz znać ustawy o OZE. Wystarczy sprawdzić, czy Twój adres pasuje do takiego modelu.</h2>
            <p>
              Energia w obiegu to kierunek dla osób i firm, które chcą sprawdzić, czy nadwyżki z instalacji można wykorzystać rozsądniej.
              To nie jest rozwiązanie dla każdego adresu, dlatego pierwszym krokiem jest krótka weryfikacja lokalizacji i operatora.
            </p>
            <OfferCallPanel
              title="Najpierw sprawdzamy gminę, operatora i profil zużycia."
              text="Dopiero po tej weryfikacji ma sens rozmowa o opłacalności, formalnościach i kolejnych krokach."
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </section>

      <section className="section value-section reveal-zone">
        <div className="section-heading">
          <p className="eyebrow dark"><ShieldCheck size={18} /> Prościej niż brzmi</p>
          <h2>Najpierw sprawdzamy warunki, dopiero potem rozmawiamy o formalnościach.</h2>
        </div>
        <div className="offer-grid four">
          {cooperativeCards.map((item) => {
            const Icon = item.icon;
            return (
              <article className="offer-card accent-card" key={item.title}>
                <Icon size={25} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section checklist-section reveal-zone">
        <div className="section-grid">
          <div className="section-copy">
            <p className="eyebrow dark"><SearchCheck size={18} /> Weryfikacja przed rozmową ofertową</p>
            <h2>Zostawiasz podstawowe dane, a my sprawdzamy, czy temat ma sens.</h2>
            <p>
              Nie musisz od razu analizować przepisów, statutów i całej organizacji. Na początku wystarczy ustalić, czy lokalizacja, operator i profil zużycia pasują do dalszej rozmowy.
            </p>
          </div>
          <div className="checklist-panel">
            {cooperativeChecks.map((item, index) => (
              <div className="checklist-row" key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section split-cta-section reveal-zone">
        <div className="split-cta-grid">
          <article className="split-cta-card">
            <MapPin size={28} />
            <h3>Nie każda lokalizacja przejdzie.</h3>
            <p>Dlatego formularz zbiera miejscowość i podstawowe dane, zamiast obiecywać wynik bez sprawdzenia adresu.</p>
            <SiteLink className="button primary" href="/klienci#formularz" onNavigate={onNavigate}>
              Sprawdź mój adres <ArrowRight size={18} />
            </SiteLink>
          </article>
          <article className="split-cta-card dark">
            <MapPin size={28} />
            <h3>Najprościej: zostaw miejscowość i podstawowe dane.</h3>
            <p>Po lokalizacji zwykle szybciej wiadomo, czy rozmawiamy o realnym kierunku, czy lepiej wybrać inne rozwiązanie OZE.</p>
            <SiteLink className="button secondary" href="/klienci#formularz" onNavigate={onNavigate}>
              <FileText size={18} /> Zgłoś lokalizację
            </SiteLink>
          </article>
        </div>
      </section>
    </>
  );
}

function OfferCallPanel({ title, text, onNavigate }) {
  return (
    <div className="call-panel">
      <FileCheck2 size={22} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
        <SiteLink href="/klienci#formularz" onNavigate={onNavigate}>Przejdź do krótkiego formularza</SiteLink>
      </div>
    </div>
  );
}

function ClientsPage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="Dla klientów"
        icon={Calculator}
        title="Sprawdź, czy OZE ma sens dla Twojego domu albo firmy."
        text="Zostaw podstawowe dane, a my uporządkujemy pierwszą kwalifikację pod fotowoltaikę, magazyn energii, pompę ciepła lub szerszą modernizację."
        primary={{ href: "#formularz", label: "Przejdź do formularza", icon: Mail }}
        secondary={{ href: "/#realizacje", label: "Zobacz realizacje", icon: Camera }}
        imageStyle={heroImages.clients}
        onNavigate={onNavigate}
      />
      <ProofStrip />
      <ClientOfferSection />
      <GalleryPreviewSection
        eyebrow="Zdjęcia realizacji"
        icon={Camera}
        title="Zobacz przykłady wykonawstwa i zakresu prac."
        text="Zdjęcia pomagają szybko poczuć skalę prac, typ obiektu i standard wykonania przed rozmową o szczegółach."
        items={clientGallery}
      />

      <section className="section process-section reveal-zone">
        <div className="section-heading">
          <p className="eyebrow dark"><ShieldCheck size={18} /> Proces klienta</p>
          <h2>Od rachunku do rozmowy o konkretnym zakresie inwestycji.</h2>
        </div>
        <div className="process-line">
          {clientProcess.map((step, index) => (
            <div className="process-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              <ChevronRight aria-hidden="true" size={18} />
            </div>
          ))}
        </div>
      </section>

      <section className="section estimate-band reveal-zone" id="formularz">
        <div className="section-grid">
          <div className="section-copy">
            <p className="eyebrow dark"><Zap size={18} /> Kwalifikacja inwestycji OZE</p>
            <h2>Rachunek za prąd zamień w uporządkowane zgłoszenie.</h2>
            <p>
              Formularz zbiera dane potrzebne do pierwszego kontaktu: lokalizację, rachunek, zakres i temat, który warto sprawdzić przed ofertą.
            </p>
            <div className="signal-grid compact">
              <div className="signal-item">
                <FileCheck2 size={23} />
                <div>
                  <strong>Najpierw dane, potem oferta</strong>
                  <span>Rachunek, lokalizacja i typ obiektu powiedzą więcej niż przypadkowa kwota bez kontekstu.</span>
                </div>
              </div>
              <div className="signal-item">
                <SearchCheck size={23} />
                <div>
                  <strong>Krótka rozmowa filtruje sens inwestycji</strong>
                  <span>Sprawdzamy, czy rozmawiać o PV, magazynie, EMS, pompie ciepła albo energii w obiegu.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-shell">
            <div className="form-panel-head">
              <WalletCards size={22} />
              <div>
                <strong>Bezpłatna analiza</strong>
                <span>Dom, firma, gospodarstwo albo obiekt usługowy.</span>
              </div>
            </div>
            <FormPrepPanel title="Co przyspieszy rozmowę?" items={clientFormPrep} />
            <LeadForm />
          </div>
        </div>
      </section>

      <NextStepsSection
        eyebrow="Po wysłaniu formularza"
        icon={ClipboardCheck}
        title="Klient od razu wie, co wydarzy się dalej."
        items={clientNextSteps}
      />
      <ClientAudienceSection />
      <FaqSection audience="clients" />
    </>
  );
}

function PartnersPage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="Dla handlowców"
        icon={TrendingUp}
        title="Sprzedawaj OZE w uporządkowanym modelu partnerskim."
        text="SOLVA szuka handlowców, liderów regionalnych i osób z bazą kontaktów, które chcą pracować w uporządkowanym modelu współpracy OZE."
        primary={{ href: "#formularz", label: "Wyślij zgłoszenie", icon: BadgeCheck }}
        secondary={{ href: "/klienci", label: "Zobacz ofertę dla klientów", icon: Calculator }}
        imageStyle={heroImages.partners}
        onNavigate={onNavigate}
      />
      <PartnerTracksSection />
      <GalleryPreviewSection
        eyebrow="Skala rozwiązań OZE"
        icon={Camera}
        title="Handlowiec powinien sprzedawać konkretną wartość, nie same hasła."
        text="Większe instalacje, obiekty firmowe i detale wykonania pomagają prowadzić rozmowę z klientem spokojnie, rzeczowo i na faktach."
        items={partnerGallery}
      />

      <section className="section recruitment-section reveal-zone">
        <div className="section-grid reverse">
          <div className="recruitment-copy">
            <p className="eyebrow"><Handshake size={18} /> Współpraca handlowa</p>
            <h2>Dołącz do zespołu SOLVA.</h2>
            <p>
              Szukamy osób, które potrafią pozyskiwać klientów, prowadzić rozmowy sprzedażowe i pracować na uporządkowanym procesie.
              Szczegóły prawne i rozliczeniowe potwierdzamy przed rozpoczęciem współpracy.
            </p>
            <div className="recruitment-list">
              {recruitment.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="benefit" key={item.title}>
                    <Icon size={22} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="quote-panel" aria-label="Rozmowa startowa z kandydatem">
            <div className="quote-panel-marker">
              <ClipboardCheck size={30} />
              <span>Start współpracy</span>
            </div>
            <strong>Rozmowa startowa</strong>
            <span>Omówimy region, źródła klientów, doświadczenie i ścieżkę autoryzacji, zanim wejdziesz w pracę na procesie.</span>
            <div className="quote-panel-points" aria-label="Zakres rozmowy startowej">
              <span>Region działania</span>
              <span>Źródła klientów</span>
              <span>Model współpracy</span>
            </div>
          </div>
        </div>
        <div className="partner-timeline" aria-label="Proces startu handlowca">
          {partnerProcess.map((item, index) => (
            <article className="timeline-step" key={item.title}>
              <span>{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section estimate-band reveal-zone" id="formularz">
        <div className="section-grid">
          <div className="section-copy">
            <p className="eyebrow dark"><BriefcaseBusiness size={18} /> Formularz rekrutacyjny</p>
            <h2>Pokaż region, doświadczenie i źródła klientów.</h2>
            <p>
              Dzięki temu szybciej ocenimy, czy rozmawiać o współpracy indywidualnej, roli lidera albo modelu dla zespołu sprzedażowego.
            </p>
            <div className="signal-grid compact">
              <div className="signal-item">
                <SearchCheck size={23} />
                <div>
                  <strong>Doświadczenie</strong>
                  <span>Sprzedaż, OZE, usługi dla domu albo praca z klientem.</span>
                </div>
              </div>
              <div className="signal-item">
                <Users size={23} />
                <div>
                  <strong>Baza kontaktów</strong>
                  <span>Własne kontakty, polecenia, praca terenowa albo zespół sprzedażowy.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="form-shell">
            <div className="form-panel-head">
              <Handshake size={22} />
              <div>
                <strong>Zgłoszenie handlowca</strong>
                <span>Odezwiemy się w sprawie dalszych kroków i autoryzacji.</span>
              </div>
            </div>
            <FormPrepPanel title="Co warto wpisać konkretnie?" items={partnerFormPrep} />
            <PartnerForm />
          </div>
        </div>
      </section>

      <NextStepsSection
        eyebrow="Po zgłoszeniu"
        icon={ClipboardCheck}
        title="Proces dla handlowca jest prosty i nie miesza obietnic z formalnościami."
        items={partnerNextSteps}
      />
      <FaqSection audience="partners" />
    </>
  );
}

function ProofStrip() {
  return (
    <section className="lead-strip reveal-zone" aria-label="Najważniejsze informacje">
      {proof.map((item) => {
        const Icon = item.icon;
        return (
        <div className="proof-item" key={item.label}>
          <div className="proof-icon" aria-hidden="true">
            <Icon size={21} />
          </div>
          <div>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </div>
        );
      })}
    </section>
  );
}

function FormPrepPanel({ title, items }) {
  return (
    <div className="form-prep-panel" aria-label={title}>
      <div className="form-prep-head">
        <Sparkles size={18} />
        <strong>{title}</strong>
      </div>
      <div className="form-prep-grid">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div className="form-prep-item" key={item.title}>
              <Icon size={18} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompanySection() {
  return (
    <section className="section value-section reveal-zone" aria-label="Opis firmy SOLVA">
      <div className="section-heading">
        <p className="eyebrow dark"><Target size={18} /> O SOLVA</p>
        <h2>Łączymy potrzeby klientów z uporządkowaną sprzedażą OZE.</h2>
      </div>
      <ClientSegmentsSection />
      <div className="signal-grid">
        {trustSignals.map((item) => {
          const Icon = item.icon;
          return (
            <div className="signal-item" key={item.title}>
              <Icon size={23} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ClientOfferSection() {
  return (
    <section className="section offer-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Zap size={18} /> Zakres dla klientów</p>
        <h2>Rozmowa może objąć kilka kierunków inwestycji OZE.</h2>
        <p>Na początku zbieramy potrzeby i zakres, a szczegóły oferty potwierdzamy dopiero po weryfikacji.</p>
      </div>
      <div className="offer-grid">
        {solutionAreas.map((item) => {
          const Icon = item.icon;
          return (
            <article className="offer-card" key={item.title}>
              <Icon size={25} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ClientAudienceSection() {
  return (
    <section className="section value-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Target size={18} /> Dla kogo</p>
        <h2>Trzy grupy klientów, dla których przygotowujemy osobną kwalifikację.</h2>
      </div>
      <ClientSegmentsSection />
    </section>
  );
}

function ClientSegmentsSection() {
  return (
    <div className="insight-grid">
      {clientSegments.map((item) => {
        const Icon = item.icon;
        return (
          <article className="insight-card" key={item.title}>
            <Icon size={28} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        );
      })}
    </div>
  );
}

function PartnerTracksSection() {
  return (
    <section className="section partner-tracks-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Users size={18} /> Ścieżki współpracy</p>
        <h2>Nie każdy handlowiec startuje z tego samego miejsca.</h2>
        <p>Inaczej rozmawiamy z osobą początkującą, inaczej z liderem zespołu i inaczej z partnerem, który ma własne źródła klientów.</p>
      </div>
      <div className="track-grid">
        {partnerTracks.map((item) => {
          const Icon = item.icon;
          return (
            <article className="track-card" key={item.title}>
              <Icon size={25} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MediaSection() {
  return (
    <section className="section media-section reveal-zone" id="realizacje">
      <div className="section-heading">
        <p className="eyebrow dark"><Camera size={18} /> Realizacje i wykonawstwo</p>
        <h2>Zobacz, jak różne mogą być dobrze dobrane inwestycje OZE.</h2>
        <p>Dom jednorodzinny, większy obiekt, instalacja gruntowa czy pompa ciepła wymagają innej rozmowy i innych danych przed ofertą.</p>
      </div>
      <div className="media-grid">
        {realizations.map((item, index) => {
          return (
            <article className="media-card" key={item.title}>
              <div className="media-photo">
                <img src={item.image} alt={item.title} loading={index === 0 ? "eager" : "lazy"} />
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.meta}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function GalleryPreviewSection({ eyebrow, icon: Icon, title, text, items }) {
  return (
    <section className="section gallery-preview-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Icon size={18} /> {eyebrow}</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="media-grid compact-gallery">
        {items.map((item, index) => (
          <article className="media-card" key={item.title}>
            <div className="media-photo">
              <img src={item.image} alt={item.title} loading={index === 0 ? "eager" : "lazy"} />
              <span>{item.tag}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MaterialsSection() {
  return (
    <section className="section materials-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><FileText size={18} /> Zaufanie i konkrety</p>
        <h2>Dobra rozmowa o OZE zaczyna się od danych, nie od gotowej obietnicy.</h2>
      </div>
      <div className="materials-grid">
        {materialSlots.map((item) => {
          const Icon = item.icon;
          return (
            <article className="material-card" key={item.title}>
              <Icon size={26} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AssetStageSection() {
  return (
    <section className="section asset-stage-section reveal-zone">
      <div className="asset-stage">
        <div className="asset-stage-copy">
          <p className="eyebrow dark"><Layers3 size={18} /> Instalacja w centrum uwagi</p>
          <h2>Dobrze dobrana instalacja ma działać technicznie i wyglądać porządnie.</h2>
          <p>
            Dlatego przed rozmową ofertową zbieramy podstawowe informacje o budynku, rachunku i oczekiwanym zakresie inwestycji.
          </p>
        </div>
        <div className="featured-installation" aria-label="Przykładowa realizacja fotowoltaiczna">
          <img src={assetUrl("assets/realizations/hero-home.webp")} alt="Dom jednorodzinny z instalacją fotowoltaiczną" loading="lazy" />
          <div className="feature-badge">
            <SunMedium size={20} />
            <div>
              <strong>PV na domu</strong>
              <span>pierwszy krok do rozmowy o konkretnym zakresie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NextStepsSection({ eyebrow, icon: Icon, title, items }) {
  return (
    <section className="section next-steps-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Icon size={18} /> {eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="next-grid">
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <article className="next-card" key={item.title}>
              <ItemIcon size={24} />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function HomeCtaSection({ onNavigate }) {
  return (
    <section className="section split-cta-section reveal-zone">
      <div className="section-heading">
        <p className="eyebrow dark"><Zap size={18} /> Wybierz ścieżkę</p>
        <h2>Wybierz, czy chcesz porozmawiać jako klient, czy jako handlowiec.</h2>
      </div>
      <div className="split-cta-grid">
        <article className="split-cta-card">
          <Calculator size={28} />
          <h3>Dla klientów</h3>
          <p>Analiza rachunku, zakresu inwestycji, miejsca montażu i terminu decyzji.</p>
          <SiteLink className="button primary" href="/klienci#formularz" onNavigate={onNavigate}>
            Przejdź do formularza <ArrowRight size={18} />
          </SiteLink>
        </article>
        <article className="split-cta-card dark">
          <BriefcaseBusiness size={28} />
          <h3>Dla handlowców</h3>
          <p>Proces startu, benefity współpracy, zgłoszenie regionu i doświadczenia.</p>
          <SiteLink className="button secondary" href="/handlowcy" onNavigate={onNavigate}>
            Przejdź do handlowców <ArrowRight size={18} />
          </SiteLink>
        </article>
      </div>
    </section>
  );
}

function PrivacyPage({ onNavigate }) {
  return (
    <>
      <PageHero
        eyebrow="Prywatność"
        icon={ShieldCheck}
        title="Prywatność, RODO i dane spółki."
        text="Zbieramy tylko dane potrzebne do kontaktu, przygotowania rozmowy o OZE albo obsługi zgłoszenia handlowca. Bez publikowania danych osobowych na stronie."
        primary={{ href: "/klienci#formularz", label: "Formularz klienta", icon: Calculator }}
        secondary={{ href: "/handlowcy#formularz", label: "Formularz handlowca", icon: BriefcaseBusiness }}
        imageStyle={heroImages.privacy}
        compact
        onNavigate={onNavigate}
      />
      <section className="section privacy-section reveal-zone">
        <div className="privacy-grid">
          <article className="privacy-panel">
            <ShieldCheck size={28} />
            <h3>Administrator danych</h3>
            <p>Administratorem danych jest {legalEntity.fullName}, {legalEntity.address}, KRS {legalEntity.krs}, NIP {legalEntity.nip}, REGON {legalEntity.regon}. SOLVA jest marką handlową używaną przez spółkę.</p>
          </article>
          <article className="privacy-panel">
            <Mail size={28} />
            <h3>Kontakt w sprawach danych</h3>
            <p>W sprawach prywatności i danych osobowych można skontaktować się mailowo: <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>. Ten adres obsługuje także prośby o dostęp, poprawienie lub usunięcie danych.</p>
          </article>
          <article className="privacy-panel">
            <FileText size={28} />
            <h3>Co zbieramy</h3>
            <p>Formularze mogą zbierać imię i nazwisko, telefon, e-mail, miejscowość, zakres zainteresowania, rachunek miesięczny, typ obiektu, wiadomość, region pracy handlowca oraz podstawowe informacje o zgłoszeniu.</p>
          </article>
        </div>

        <div className="privacy-legal">
          <article>
            <h2>Informacja RODO</h2>
            <p>
              Dane z formularzy są przetwarzane po to, żeby odpowiedzieć na zapytanie, oddzwonić, przygotować wstępną kwalifikację inwestycji OZE, obsłużyć zgłoszenie handlowca albo zabezpieczyć ewentualne roszczenia.
              Podanie danych jest dobrowolne, ale bez numeru telefonu lub danych kontaktowych nie będziemy mogli obsłużyć zgłoszenia.
            </p>
          </article>

          <div className="privacy-table">
            <div>
              <strong>Podstawy prawne</strong>
              <span>art. 6 ust. 1 lit. b RODO - działania przed zawarciem umowy; art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes kontaktu i obsługi zgłoszeń; art. 6 ust. 1 lit. a RODO - zgoda, jeśli pojawi się marketing lub newsletter; art. 6 ust. 1 lit. c RODO - obowiązki prawne, jeśli będą miały zastosowanie.</span>
            </div>
            <div>
              <strong>Odbiorcy danych</strong>
              <span>Dane mogą trafić do dostawców hostingu, poczty, formularzy, narzędzi obsługi zgłoszeń, obsługi IT oraz partnerów potrzebnych do obsługi zapytania, w tym Hydro NRG, jeśli wymaga tego przygotowanie odpowiedzi lub oferty.</span>
            </div>
            <div>
              <strong>Czas przechowywania</strong>
              <span>Zgłoszenia bez dalszej współpracy mogą być przechowywane maksymalnie do 12 miesięcy, dane związane z umową lub roszczeniami zgodnie z przepisami i terminami przedawnienia, a dane marketingowe do wycofania zgody.</span>
            </div>
            <div>
              <strong>Prawa użytkownika</strong>
              <span>Masz prawo dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przeniesienia danych, sprzeciwu, cofnięcia zgody oraz skargi do Prezesa UODO.</span>
            </div>
            <div>
              <strong>Cookies i analityka</strong>
              <span>Strona może używać niezbędnych plików cookies potrzebnych do działania. Analitykę, piksele reklamowe lub remarketing należy uruchamiać dopiero z odpowiednią informacją i zgodą, jeśli będzie wymagana.</span>
            </div>
            <div>
              <strong>EMS i energia w obiegu</strong>
              <span>Treści o EMS, magazynach energii i energii w obiegu mają charakter informacyjny i sprzedażowy. Nie są poradą prawną, podatkową ani gwarancją oszczędności. Szczegóły wymagają analizy danych klienta i potwierdzenia warunków.</span>
            </div>
          </div>

          <div className="privacy-note">
            <FileCheck2 size={22} />
            <p>
              Dane z formularzy wykorzystujemy wyłącznie do obsługi zgłoszenia, kontaktu zwrotnego i przygotowania dalszej rozmowy. Jeśli zakres narzędzi lub partnerów technicznych zostanie rozszerzony, informacja o prywatności zostanie odpowiednio zaktualizowana.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function MobileActionBar({ currentPath, onNavigate }) {
  const primary = currentPath === "/handlowcy"
    ? { href: "/handlowcy#formularz", label: "Dołącz", icon: BriefcaseBusiness }
    : { href: "/klienci#formularz", label: "Wycena", icon: Calculator };
  const secondary = currentPath === "/"
    ? { href: "/handlowcy#formularz", label: "Dołącz", icon: BriefcaseBusiness }
    : currentPath === "/handlowcy"
      ? { href: "/klienci#formularz", label: "Klienci", icon: Calculator }
      : { href: "/handlowcy#formularz", label: "Zespół", icon: BriefcaseBusiness };
  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  return (
    <div className="mobile-action-bar" aria-label="Szybkie akcje mobilne">
      <SiteLink href={primary.href} onNavigate={onNavigate}>
        <PrimaryIcon size={18} />
        <span>{primary.label}</span>
      </SiteLink>
      <SiteLink href={secondary.href} onNavigate={onNavigate}>
        <SecondaryIcon size={18} />
        <span>{secondary.label}</span>
      </SiteLink>
    </div>
  );
}

function FaqSection({ audience = "all" } = {}) {
  const visibleItems = audience === "all"
    ? faqItems
    : faqItems.filter((item) => item.audience.includes(audience));
  const titleByAudience = {
    all: "Najważniejsze pytania zanim zostawisz kontakt.",
    clients: "Najważniejsze pytania przed zostawieniem zgłoszenia.",
    partners: "Najważniejsze pytania przed zgłoszeniem współpracy."
  };

  return (
    <section className="section faq-section reveal-zone" id="faq">
      <div className="section-heading">
        <p className="eyebrow dark"><HelpCircle size={18} /> FAQ</p>
        <h2>{titleByAudience[audience]}</h2>
      </div>
      <div className="faq-list">
        {visibleItems.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function PageHero({ eyebrow, icon: Icon, title, text, primary, secondary, imageStyle, compact = false, onNavigate }) {
  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  return (
    <section className={`page-hero${compact ? " compact-page-hero" : ""}`} style={imageStyle || heroImages.home}>
      <div className="page-hero-content">
        <p className="eyebrow"><Icon size={18} /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="hero-actions" aria-label="Akcje podstrony">
          <SiteLink className="button primary" href={primary.href} onNavigate={onNavigate}>
            <PrimaryIcon size={19} /> {primary.label}
          </SiteLink>
          <SiteLink className="button secondary" href={secondary.href} onNavigate={onNavigate}>
            <SecondaryIcon size={19} /> {secondary.label}
          </SiteLink>
        </div>
      </div>
    </section>
  );
}

function SiteLink({ href, onNavigate, children, ...props }) {
  const publicHref = typeof window === "undefined" ? href : toPublicPath(parseRouteHref(href).path, parseRouteHref(href).hash);

  return (
    <a
      href={publicHref}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}

function useRevealMotion(dependency) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-zone"));
    const root = document.documentElement;
    let lastScrollY = window.scrollY;
    let scrollFrame = 0;

    function updateDirection() {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) > 4) {
        root.dataset.scrollDirection = currentScrollY < lastScrollY ? "up" : "down";
        lastScrollY = currentScrollY;
      }

      scrollFrame = 0;
    }

    function handleScroll() {
      if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(updateDirection);
      }
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    root.dataset.scrollDirection = "down";
    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.14, rootMargin: "-7% 0px -9% 0px" }
    );

    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
      observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame) {
        window.cancelAnimationFrame(scrollFrame);
      }
      observer.disconnect();
    };
  }, [dependency]);
}

function useScrollProgress(dependency) {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    function updateProgress() {
      const scrollable = Math.max(1, root.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
      frame = 0;
    }

    function scheduleProgress() {
      if (!frame) {
        frame = window.requestAnimationFrame(updateProgress);
      }
    }

    updateProgress();
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);

    return () => {
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [dependency]);
}

function Header({ currentPath, onNavigate }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { href: "/", label: "Start", path: "/" },
    { href: "/klienci", label: "Klienci", path: "/klienci" },
    { href: "/prad-ktory-pracuje", label: "Prąd pracuje", path: "/prad-ktory-pracuje" },
    { href: "/energia-w-obiegu", label: "Energia w obiegu", path: "/energia-w-obiegu" },
    { href: "/handlowcy", label: "Handlowcy", path: "/handlowcy" },
    { href: "/prywatnosc", label: "Prywatność", path: "/prywatnosc", mobileOnly: true }
  ];
  const contactHref = currentPath === "/handlowcy" ? "/handlowcy#formularz" : "/klienci#formularz";

  function handleNavigate(href) {
    setMobileMenuOpen(false);
    onNavigate(href);
  }

  return (
    <header className="site-header">
      <SiteLink className="brand" href="/" onNavigate={handleNavigate} aria-label="SOLVA">
        <img src={logoUrl} alt="SOLVA" />
      </SiteLink>
      <nav aria-label="Nawigacja główna">
        {navItems.filter((item) => !item.mobileOnly).map((item) => (
          <SiteLink
            className={currentPath === item.path && !item.href.includes("#") ? "active" : undefined}
            href={item.href}
            key={item.label}
            onNavigate={handleNavigate}
          >
            {item.label}
          </SiteLink>
        ))}
      </nav>
      <SiteLink className="header-cta" href={contactHref} onNavigate={handleNavigate}>
        <Mail size={17} /> Formularz
      </SiteLink>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
        aria-controls="mobile-nav"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        <span className="mobile-menu-label">Menu</span>
      </button>
      <div className={`mobile-menu-panel${isMobileMenuOpen ? " open" : ""}`} id="mobile-nav">
        <span>Wybierz temat</span>
        {navItems.map((item) => (
          <SiteLink
            className={currentPath === item.path && !item.href.includes("#") ? "active" : undefined}
            href={item.href}
            key={item.label}
            onNavigate={handleNavigate}
          >
            {item.label}
          </SiteLink>
        ))}
        <SiteLink className="mobile-menu-cta" href={contactHref} onNavigate={handleNavigate}>
          <Mail size={17} /> Przejdź do formularza
        </SiteLink>
      </div>
    </header>
  );
}

let turnstileScriptPromise;

function loadTurnstileScript() {
  if (!turnstileSiteKey || typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector("script[data-solva-turnstile]");
      if (existingScript) {
        existingScript.addEventListener("load", resolve, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.solvaTurnstile = "true";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return turnstileScriptPromise;
}

function TurnstileWidget({ resetKey, onVerify }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!turnstileSiteKey) {
      onVerify("");
      return undefined;
    }

    let cancelled = false;
    let widgetId = null;

    onVerify("");
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        containerRef.current.innerHTML = "";
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: turnstileSiteKey,
          theme: "light",
          callback: (token) => onVerify(token),
          "expired-callback": () => onVerify(""),
          "error-callback": () => onVerify("")
        });
      })
      .catch(() => onVerify(""));

    return () => {
      cancelled = true;
      if (widgetId !== null && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onVerify, resetKey]);

  if (!turnstileSiteKey) {
    return null;
  }

  return (
    <div className="turnstile-box">
      <div ref={containerRef} />
    </div>
  );
}

function useSubmit(endpoint, defaults) {
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event, kind = "lead") {
    event.preventDefault();
    setStatus({ type: "loading", message: "Przygotowuję zgłoszenie..." });

    try {
      if (turnstileSiteKey && !turnstileToken) {
        throw new Error("Potwierdź zabezpieczenie formularza i spróbuj ponownie.");
      }

      if (staticFormEndpoint) {
        await submitToStaticEndpoint(kind, form, turnstileToken);
        setForm(defaults);
        setTurnstileToken("");
        setTurnstileResetKey((value) => value + 1);
        setStatus({ type: "success", message: kind === "lead" ? "Zgłoszenie wysłane. Do rozmowy przygotuj ostatni rachunek lub kwotę za prąd." : "Zgłoszenie wysłane. Do rozmowy przygotuj region, doświadczenie i źródła klientów." });
        return;
      }

      if (!shouldUseApiEndpoint()) {
        window.location.href = buildMailtoHref(kind, form);
        setForm(defaults);
        setStatus({ type: "success", message: "Otworzyliśmy gotową wiadomość e-mail. Wyślij ją, aby zgłoszenie trafiło do SOLVA." });
        return;
      }

      const response = await fetch(getApiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken, tracking: getTrackingData() })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Nie udało się wysłać formularza.");
      }

      setForm(defaults);
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setStatus({ type: "success", message: kind === "lead" ? "Zgłoszenie zapisane. Do rozmowy przygotuj ostatni rachunek lub kwotę za prąd." : "Zgłoszenie zapisane. Po wstępnej weryfikacji wrócimy z kolejnymi krokami autoryzacji." });
    } catch (error) {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setStatus({ type: "error", message: error.message });
    }
  }

  return { form, status, updateField, submit, setTurnstileToken, turnstileResetKey };
}

function LeadForm() {
  const { form, status, updateField, submit, setTurnstileToken, turnstileResetKey } = useSubmit("/api/leads", leadDefaults);

  return (
    <form className="lead-form" onSubmit={(event) => submit(event, "lead")}>
      <FormStatus status={status} />
      <input type="text" name="companyWebsite" className="hidden-field" tabIndex="-1" autoComplete="off" value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} />
      <div className="field-row">
        <label>
          <span>Imię i nazwisko</span>
          <input name="name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required autoComplete="name" maxLength="120" placeholder="Jan Kowalski" />
        </label>
        <label>
          <span>Telefon</span>
          <input name="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required type="tel" inputMode="tel" autoComplete="tel" maxLength="40" placeholder="+48 600 000 000" />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>E-mail</span>
          <input name="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" inputMode="email" autoComplete="email" maxLength="120" placeholder="kontakt@firma.pl" />
        </label>
        <label>
          <span>Miejscowość</span>
          <input name="address-level2" value={form.location} onChange={(event) => updateField("location", event.target.value)} required autoComplete="address-level2" maxLength="120" placeholder="np. Kraków" />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>Rachunek miesięczny</span>
          <select value={form.monthlyBill} onChange={(event) => updateField("monthlyBill", event.target.value)}>
            <option>do 250 zł</option>
            <option>250-450 zł</option>
            <option>450-800 zł</option>
            <option>powyżej 800 zł</option>
          </select>
        </label>
        <label>
          <span>Interesujące rozwiązanie</span>
          <select value={form.solution} onChange={(event) => updateField("solution", event.target.value)}>
            <option>Fotowoltaika z analizą rachunku</option>
            <option>PV z magazynem energii</option>
            <option>EMS - lepsze wykorzystanie energii</option>
            <option>Energia w obiegu</option>
            <option>Pompa ciepła lub źródło ciepła</option>
            <option>Kompleksowa modernizacja OZE</option>
          </select>
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>Termin inwestycji</span>
          <select value={form.investmentTime} onChange={(event) => updateField("investmentTime", event.target.value)}>
            <option>Do 3 miesięcy</option>
            <option>3-6 miesięcy</option>
            <option>Jeszcze sprawdzam</option>
          </select>
        </label>
        <label>
          <span>Typ dachu lub obiektu</span>
          <select value={form.roofType} onChange={(event) => updateField("roofType", event.target.value)}>
            <option>Dach skośny</option>
            <option>Dach płaski</option>
            <option>Grunt</option>
            <option>Firma lub gospodarstwo</option>
          </select>
        </label>
      </div>
      <label>
        <span>Wiadomość</span>
        <textarea name="message" value={form.message} onChange={(event) => updateField("message", event.target.value)} maxLength="800" placeholder="Np. interesuje mnie fotowoltaika z magazynem energii" />
      </label>
      <Consent checked={form.consent} onChange={(value) => updateField("consent", value)} />
      <TurnstileWidget resetKey={turnstileResetKey} onVerify={setTurnstileToken} />
      <button className="submit-button" type="submit" disabled={status.type === "loading"}>
        <Mail size={19} /> Wyślij zapytanie <ArrowRight size={19} />
      </button>
    </form>
  );
}

function PartnerForm() {
  const { form, status, updateField, submit, setTurnstileToken, turnstileResetKey } = useSubmit("/api/partners", partnerDefaults);

  return (
    <form className="lead-form" onSubmit={(event) => submit(event, "partner")}>
      <FormStatus status={status} />
      <input type="text" name="companyWebsite" className="hidden-field" tabIndex="-1" autoComplete="off" value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} />
      <div className="field-row">
        <label>
          <span>Imię i nazwisko</span>
          <input name="name" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required autoComplete="name" maxLength="120" placeholder="Anna Nowak" />
        </label>
        <label>
          <span>Telefon</span>
          <input name="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required type="tel" inputMode="tel" autoComplete="tel" maxLength="40" placeholder="+48 600 000 000" />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>E-mail</span>
          <input name="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" inputMode="email" autoComplete="email" maxLength="120" placeholder="kontakt@firma.pl" />
        </label>
        <label>
          <span>Miasto lub region</span>
          <input name="address-level2" value={form.city} onChange={(event) => updateField("city", event.target.value)} required autoComplete="address-level2" maxLength="120" placeholder="np. Śląsk" />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>Doświadczenie</span>
          <select value={form.experience} onChange={(event) => updateField("experience", event.target.value)}>
            <option>Mam doświadczenie w sprzedaży</option>
            <option>Sprzedawałem OZE</option>
            <option>Prowadzę własny zespół</option>
            <option>Chcę zacząć w branży</option>
          </select>
        </label>
        <label>
          <span>Dostępność</span>
          <select value={form.availableFrom} onChange={(event) => updateField("availableFrom", event.target.value)}>
            <option>Od zaraz</option>
            <option>W ciągu miesiąca</option>
            <option>Po rozmowie</option>
          </select>
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>Źródła klientów</span>
          <select value={form.leadSource} onChange={(event) => updateField("leadSource", event.target.value)}>
            <option>Mam własne źródła kontaktów</option>
            <option>Pracuję terenowo i pozyskuję polecenia</option>
            <option>Mam bazę firm lub klientów</option>
            <option>Chcę zacząć i potrzebuję procesu</option>
          </select>
        </label>
        <label>
          <span>Preferowany zakres</span>
          <select value={form.preferredProducts} onChange={(event) => updateField("preferredProducts", event.target.value)}>
            <option>Fotowoltaika i magazyny energii</option>
            <option>Pompy ciepła i źródła ciepła</option>
            <option>Termomodernizacja</option>
            <option>Szeroki zakres OZE</option>
          </select>
        </label>
      </div>
      <label className="checkline">
        <input type="checkbox" checked={form.hasTeam} onChange={(event) => updateField("hasTeam", event.target.checked)} />
        <span>Mam własny zespół lub bazę kontaktów</span>
      </label>
      <label>
        <span>Wiadomość</span>
        <textarea name="message" value={form.message} onChange={(event) => updateField("message", event.target.value)} maxLength="800" placeholder="Napisz krótko o regionie, doświadczeniu albo oczekiwaniach" />
      </label>
      <Consent checked={form.consent} onChange={(value) => updateField("consent", value)} />
      <TurnstileWidget resetKey={turnstileResetKey} onVerify={setTurnstileToken} />
      <button className="submit-button" type="submit" disabled={status.type === "loading"}>
        <BadgeCheck size={19} /> Wyślij zgłoszenie <ArrowRight size={19} />
      </button>
    </form>
  );
}

function Consent({ checked, onChange }) {
  return (
    <label className="checkline">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} required />
      <span>
        Zgadzam się na kontakt w sprawie mojego zgłoszenia i rozumiem, że dane zostaną użyte do obsługi zapytania.
        Szczegóły opisuje <a href={toPublicPath("/prywatnosc")}>informacja o prywatności</a>.
      </span>
    </label>
  );
}

function FormStatus({ status }) {
  if (status.type === "idle") {
    return null;
  }

  return (
    <div className={`form-status ${status.type}`} role="status" aria-live="polite">
      {status.type === "success" ? <Check size={18} /> : <Sparkles size={18} />}
      <span>{status.message}</span>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand-panel">
        <img src={logoUrl} alt="SOLVA" />
        <p>SOLVA - marka handlowa {legalEntityName}, partnerski zespół sprzedażowy współpracujący z Hydro NRG.</p>
        <span>KRS {legalEntity.krs} · NIP {legalEntity.nip} · REGON {legalEntity.regon}</span>
      </div>

      <div className="footer-contact-card">
        <strong>Kontakt przez formularz</strong>
        <a href={`mailto:${contactEmail}`}><Mail size={18} /> {contactEmail}</a>
        <span>Telefon nie jest jeszcze publikowany. Zgłoszenia klientów i handlowców obsługujemy przez formularze.</span>
      </div>

      <div className="footer-nav">
        <div>
          <strong>Oferta</strong>
          <SiteLink href="/klienci#formularz" onNavigate={onNavigate}>Bezpłatna wycena</SiteLink>
          <SiteLink href="/prad-ktory-pracuje" onNavigate={onNavigate}>Prąd, który pracuje</SiteLink>
          <SiteLink href="/energia-w-obiegu" onNavigate={onNavigate}>Energia w obiegu</SiteLink>
        </div>
        <div>
          <strong>Firma</strong>
          <SiteLink href="/" onNavigate={onNavigate}>Strona główna</SiteLink>
          <SiteLink href="/handlowcy#formularz" onNavigate={onNavigate}>Dla handlowców</SiteLink>
          <SiteLink href="/prywatnosc" onNavigate={onNavigate}>Prywatność i RODO</SiteLink>
        </div>
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);
