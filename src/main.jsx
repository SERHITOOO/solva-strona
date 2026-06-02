import React, { useEffect, useMemo, useState } from "react";
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
  Phone,
  Play,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  Zap
} from "lucide-react";
import "./styles.css";

const routes = ["/", "/klienci", "/handlowcy", "/prywatnosc"];
const appBasePath = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
const heroImages = {
  home: { "--hero-image": `url("${assetUrl("assets/realizations/hero-home.webp")}")` },
  clients: { "--hero-image": `url("${assetUrl("assets/realizations/home-aerial.webp")}")` },
  partners: { "--hero-image": `url("${assetUrl("assets/realizations/commercial-roof.webp")}")` },
  privacy: { "--hero-image": `url("${assetUrl("assets/realizations/home-roof.webp")}")` }
};
const logoUrl = `${assetUrl("assets/solva-logo.svg")}?v=1`;
const contactEmail = "m.pokora@hydro-energy.pl";
const contactPhone = "+48796054985";
const contactPhoneDisplay = "+48 796 054 985";
const staticFormEndpoint = import.meta.env.VITE_FORM_ENDPOINT || "";
const apiBaseUrl = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const legalEntityName = "JTJ FUND sp. z o.o.";

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
    meta: "Gotowa instalacja na dachu skośnym. Dobry materiał na stronę główną i komunikację dla klientów indywidualnych.",
    image: assetUrl("assets/realizations/residential-front.webp"),
    tag: "Klienci indywidualni"
  },
  {
    title: "Instalacja na dużym dachu",
    meta: "Realizacja na obiekcie firmowym pokazuje skalę wykonawstwa i potencjał dla przedsiębiorców.",
    image: assetUrl("assets/realizations/commercial-roof.webp"),
    tag: "Firmy i obiekty"
  },
  {
    title: "Pompa ciepła przy budynku",
    meta: "Materiał pod ofertę pomp ciepła i modernizacji źródeł ogrzewania.",
    image: assetUrl("assets/realizations/heat-pump.webp"),
    tag: "Pompy ciepła"
  },
  {
    title: "Fotowoltaika z lotu ptaka",
    meta: "Kadr techniczny pokazujący ułożenie paneli i miejsce montażu na dachu.",
    image: assetUrl("assets/realizations/home-aerial.webp"),
    tag: "Dachy skośne"
  },
  {
    title: "Instalacja gruntowa",
    meta: "Dobry przykład dla klientów z większą działką, firm i obiektów o większym zużyciu energii.",
    image: assetUrl("assets/realizations/ground-mount.webp"),
    tag: "Grunt i skala"
  },
  {
    title: "Zaplecze techniczne",
    meta: "Zdjęcie pod sekcję pomp, źródeł ciepła i kompleksowej modernizacji energetycznej.",
    image: assetUrl("assets/realizations/technical-room.webp"),
    tag: "Technika"
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
  { value: "OZE", label: "PV, magazyny, pompy i termomodernizacja" },
  { value: "0 zł", label: "za wstępną analizę inwestycji" },
  { value: "CRM", label: "porządek w leadach i statusach klientów" }
];

const clientSegments = [
  { icon: SunMedium, title: "Domy jednorodzinne", text: "Analiza rachunku, dachu, miejsca montażu i terminu inwestycji, zanim klient trafi do rozmowy ofertowej." },
  { icon: Building2, title: "Firmy i obiekty usługowe", text: "Kwalifikacja dachu płaskiego lub skośnego, profilu zużycia oraz potencjału pod PV, magazyn energii lub pompę ciepła." },
  { icon: BatteryCharging, title: "Większe inwestycje OZE", text: "Wstępna rozmowa o instalacjach gruntowych, źródłach ciepła i szerszej modernizacji energetycznej." }
];

const solutionAreas = [
  { icon: SunMedium, title: "Fotowoltaika", text: "Dobór kierunku rozmowy na podstawie rachunku, typu dachu, miejsca montażu, działki i planowanego terminu decyzji." },
  { icon: BatteryCharging, title: "Magazyny energii", text: "Wstępna kwalifikacja klientów z większym zużyciem, autokonsumpcją lub potrzebą zabezpieczenia pracy instalacji." },
  { icon: Zap, title: "Pompy ciepła i źródła ciepła", text: "Zebranie danych o budynku, obecnym źródle ciepła i oczekiwanym zakresie modernizacji." },
  { icon: Building2, title: "Termomodernizacja", text: "Miejsce na szerszy zakres usług po potwierdzeniu finalnych opisów produktowych i materiałów Hydro NRG." },
  { icon: WalletCards, title: "Finansowanie i programy wsparcia", text: "Możemy porozmawiać o dostępnych kierunkach finansowania, a szczegóły wymagają potwierdzenia przed ofertą." },
  { icon: FileCheck2, title: "Analiza pod ofertę", text: "Porządkujemy zgłoszenie tak, aby doradca szybciej wiedział, z jakim klientem i zakresem prac rozmawia." }
];

const trustSignals = [
  { icon: SearchCheck, title: "Najpierw potrzeby", text: "Nie zaczynamy od oferty. Zbieramy rachunek, miejsce inwestycji, termin i oczekiwany zakres." },
  { icon: ShieldCheck, title: "Bez pustych obietnic", text: "Komunikacja opiera się na zatwierdzonych materiałach, procedurach i informacjach technicznych." },
  { icon: FileCheck2, title: "Dowody do uzupełnienia", text: "Po otrzymaniu materiałów dodamy realizacje, certyfikaty, logotypy i opisy potwierdzone przez Hydro NRG." }
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
  { title: "Onboarding", text: "Po akceptacji można przygotować dostęp do procesu, materiałów, CRM i szkolenia produktowego." },
  { title: "Praca na klientach", text: "Leady, statusy, notatki i dokumenty powinny być prowadzone w uzgodnionym systemie." }
];

const partnerTracks = [
  { icon: Sparkles, title: "Chcę zacząć w OZE", text: "Dobra ścieżka dla osób z energią do sprzedaży i gotowością do pracy na procesie oraz materiałach." },
  { icon: TrendingUp, title: "Mam doświadczenie w sprzedaży", text: "Dla handlowców, którzy potrafią prowadzić rozmowy, kwalifikować klientów i domykać kolejne kroki." },
  { icon: Users, title: "Mam własny zespół", text: "Dla liderów regionalnych i partnerów, którzy mogą rozwijać sprzedaż z większą liczbą doradców." },
  { icon: SearchCheck, title: "Mam bazę kontaktów", text: "Dla osób z lokalnymi poleceniami, kontaktami firmowymi, terenowymi lub branżowymi." }
];

const clientNextSteps = [
  { icon: Mail, title: "1. Zostawiasz kontakt", text: "W formularzu podajesz lokalizację, rachunek, zakres i termin decyzji." },
  { icon: Phone, title: "2. Krótka rozmowa", text: "Oddzwaniamy, doprecyzowujemy potrzeby i prosimy o dane potrzebne do analizy." },
  { icon: FileCheck2, title: "3. Porządek przed ofertą", text: "Zgłoszenie trafia dalej z jasnym zakresem: PV, magazyn, pompa ciepła lub modernizacja." }
];

const partnerNextSteps = [
  { icon: Mail, title: "1. Wysyłasz zgłoszenie", text: "Podajesz region, doświadczenie, dostępność i źródła klientów." },
  { icon: Phone, title: "2. Rozmowa o modelu", text: "Ustalamy, czy rozmawiamy o współpracy indywidualnej, liderze czy zespole." },
  { icon: ClipboardCheck, title: "3. Autoryzacja i start", text: "Szczegóły dokumentów, rozliczeń i materiałów potwierdzamy przed rozpoczęciem współpracy." }
];

const materialSlots = [
  { icon: Camera, title: "Zdjęcia realizacji", text: "Mamy bazę pod domy, obiekty firmowe, instalacje gruntowe i pompy ciepła. Finalnie warto dodać krótkie podpisy z lokalizacją i zakresem." },
  { icon: FileText, title: "Materiały produktowe", text: "Do podmiany po stronie marketingu: opisy usług, certyfikaty, logotypy, karty katalogowe i potwierdzone nazwy rozwiązań." },
  { icon: Play, title: "Wideo i ruch", text: "Najlepszy kolejny krok to krótki film z realizacji lub animacja procesu: zgłoszenie, analiza, oferta, montaż." }
];

const faqItems = [
  {
    question: "Czy SOLVA jest osobną marką?",
    answer: `Tak. SOLVA to marka handlowa używana przez ${legalEntityName}, która komunikuje partnerski zespół sprzedażowy współpracujący z Hydro NRG.`
  },
  {
    question: "Jakie rozwiązania można zgłosić przez formularz?",
    answer: "Fotowoltaikę, magazyny energii, pompy ciepła, źródła ciepła, termomodernizację oraz szerszą analizę OZE dla domu lub firmy."
  },
  {
    question: "Czy handlowiec może mieć własny zespół?",
    answer: "Tak, formularz jest przygotowany także dla liderów i osób z własną bazą kontaktów. Szczegóły współpracy wymagają potwierdzenia przed startem."
  },
  {
    question: "Czy na stronie są już finalne materiały Hydro NRG?",
    answer: "Mamy pierwszą bazę zdjęć realizacji. Certyfikaty, filmy, logotypy i opisy produktowe warto jeszcze potwierdzić z osobą odpowiedzialną za marketing."
  },
  {
    question: "Co warto przygotować przed rozmową?",
    answer: "Klient powinien mieć pod ręką rachunek za prąd i podstawowe informacje o budynku. Handlowiec powinien określić region, doświadczenie i źródła pozyskiwania klientów."
  }
];

const seoByPath = {
  "/": {
    title: "SOLVA | Partner Hydro NRG",
    description: "SOLVA pozyskuje leady OZE i rozwija partnerski zespół handlowy: fotowoltaika, magazyny energii, pompy ciepła i termomodernizacja."
  },
  "/klienci": {
    title: "SOLVA | Bezpłatna analiza OZE dla klientów",
    description: "Zgłoś rachunek za prąd i sprawdź kierunek inwestycji OZE: fotowoltaika, magazyn energii, pompa ciepła lub szersza modernizacja."
  },
  "/handlowcy": {
    title: "SOLVA | Współpraca dla handlowców OZE",
    description: "Dołącz do zespołu sprzedażowego SOLVA jako handlowiec OZE, lider regionu albo partner z własną bazą kontaktów."
  },
  "/prywatnosc": {
    title: "SOLVA | Prywatność i zgody",
    description: "Informacje o kontakcie, danych z formularzy i zasadach publikacji materiałów na stronie SOLVA."
  }
};

function formatCurrency(value) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(value);
}

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
    .filter(([key]) => !["companyWebsite", "tracking"].includes(key))
    .map(([key, value]) => `${key}: ${formatFieldValue(value)}`)
    .join("\n");
  const tracking = payload.tracking?.page ? `\n\nStrona zgłoszenia: ${payload.tracking.page}` : "";

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}${tracking}`)}`;
}

async function submitToStaticEndpoint(kind, form) {
  const payload = buildSubmissionPayload(kind, form);
  const response = await fetch(staticFormEndpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Nie udało się wysłać formularza przez zewnętrzny endpoint.");
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

  return (
    <>
      <Header currentPath={path} onNavigate={navigate} />
      <main>
        {path === "/klienci" ? <ClientsPage onNavigate={navigate} /> : null}
        {path === "/handlowcy" ? <PartnersPage onNavigate={navigate} /> : null}
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
          <div className="partner-pill"><ShieldCheck size={18} /> Fotowoltaika, pompy ciepła, magazyny energii</div>
          <p className="hero-copy">
            Kwalifikujemy klientów, porządkujemy proces sprzedaży i rozwijamy zespół handlowy OZE w modelu partnerskim z Hydro NRG.
          </p>
          <div className="hero-actions" aria-label="Główne akcje">
            <SiteLink className="button primary" href="/klienci#formularz" onNavigate={onNavigate}>
              <Calculator size={19} /> Bezpłatna wycena
            </SiteLink>
            <SiteLink className="button secondary" href="/handlowcy#formularz" onNavigate={onNavigate}>
              <BriefcaseBusiness size={19} /> Dołącz do zespołu
            </SiteLink>
          </div>
        </div>
      </section>

      <ProofStrip />
      <CompanySection />
      <MediaSection />
      <MaterialsSection />
      <AssetStageSection />
      <HomeCtaSection onNavigate={onNavigate} />
      <FaqSection />
    </>
  );
}

function ClientsPage({ onNavigate }) {
  const [monthlyBill, setMonthlyBill] = useState(360);
  const yearlyCost = monthlyBill * 12;
  const estimate = useMemo(() => Math.round(yearlyCost * 0.58), [yearlyCost]);

  return (
    <>
      <PageHero
        eyebrow="Dla klientów"
        icon={Calculator}
        title="Sprawdź, czy OZE ma sens dla Twojego domu albo firmy."
        text="Zostaw podstawowe dane, a my uporządkujemy pierwszą kwalifikację pod fotowoltaikę, magazyn energii, pompę ciepła lub szerszą modernizację."
        primary={{ href: "#formularz", label: "Przejdź do formularza", icon: Mail }}
        secondary={{ href: "/#realizacje", label: "Zobacz miejsce na realizacje", icon: Camera }}
        imageStyle={heroImages.clients}
        onNavigate={onNavigate}
      />
      <ProofStrip />
      <ClientOfferSection />
      <GalleryPreviewSection
        eyebrow="Zdjęcia realizacji"
        icon={Camera}
        title="Klient powinien od razu zobaczyć prawdziwe wykonawstwo."
        text="Te kadry są bazą pod finalne podpisy, lokalizacje i parametry realizacji po potwierdzeniu materiałów marketingowych."
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
              Formularz zbiera dane potrzebne do pierwszego kontaktu, a prosty estymator pomaga zobaczyć skalę decyzji jeszcze przed rozmową.
            </p>
            <div className="calculator-box" aria-label="Estymator oszczędności">
              <div className="range-head">
                <span>Miesięczny rachunek</span>
                <strong>{formatCurrency(monthlyBill)}</strong>
              </div>
              <input
                aria-label="Miesięczny rachunek za prąd"
                type="range"
                min="150"
                max="1200"
                step="10"
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(Number(event.target.value))}
              />
              <div className="estimate-result">
                <BatteryCharging size={22} />
                <span>Orientacyjny potencjał roczny</span>
                <strong>{formatCurrency(estimate)}</strong>
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
      <FaqSection />
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
        text="SOLVA szuka handlowców, liderów regionalnych i osób z bazą kontaktów, które chcą pracować na zatwierdzonych ofertach, procesie i materiałach Hydro NRG."
        primary={{ href: "#formularz", label: "Wyślij zgłoszenie", icon: BadgeCheck }}
        secondary={{ href: "/klienci", label: "Zobacz ofertę dla klientów", icon: Calculator }}
        imageStyle={heroImages.partners}
        onNavigate={onNavigate}
      />
      <PartnerTracksSection />
      <GalleryPreviewSection
        eyebrow="Materiały sprzedażowe"
        icon={Camera}
        title="Handlowiec musi widzieć, na czym będzie pracować."
        text="Na stronie rekrutacyjnej pokazujemy większe instalacje, skalę wykonawstwa i zaplecze techniczne jako materiał do rozmów z kandydatami."
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
          <div className="quote-panel" aria-label="Miejsce na film rekrutacyjny">
            <div className="play-orb"><Play size={30} fill="currentColor" /></div>
            <strong>Film o współpracy</strong>
            <span>Tu można osadzić wideo o modelu pracy, autoryzacji handlowca, CRM i produktach OZE po otrzymaniu materiałów.</span>
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
                  <span>Sprzedaż, OZE, usługi techniczne albo praca z klientem.</span>
                </div>
              </div>
              <div className="signal-item">
                <Users size={23} />
                <div>
                  <strong>Baza kontaktów</strong>
                  <span>Własne źródła leadów, polecenia, teren albo zespół.</span>
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
      <FaqSection />
    </>
  );
}

function ProofStrip() {
  return (
    <section className="lead-strip reveal-zone" aria-label="Najważniejsze informacje">
      {proof.map((item) => (
        <div className="proof-item" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  );
}

function CompanySection() {
  return (
    <section className="section value-section reveal-zone" aria-label="Opis firmy SOLVA">
      <div className="section-heading">
        <p className="eyebrow dark"><Target size={18} /> O SOLVA</p>
        <h2>Budujemy markę, która łączy leady klientów z uporządkowaną sprzedażą OZE.</h2>
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
        <p>Na tym etapie zbieramy potrzeby i zakres, a szczegóły techniczne lub finansowe potwierdzamy przed ofertą.</p>
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
        <h2>Trzy najważniejsze grupy klientów, które warto prowadzić osobnym językiem.</h2>
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
        <h2>Realne zdjęcia realizacji od razu podnoszą wiarygodność strony.</h2>
        <p>Wybrane kadry pokazują domy jednorodzinne, większe obiekty, instalacje gruntowe oraz zaplecze pomp ciepła.</p>
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
        <p className="eyebrow dark"><FileText size={18} /> Materiały do uzupełnienia</p>
        <h2>Mamy bazę zdjęć. Teraz warto dołożyć opisy, certyfikaty i krótkie filmy.</h2>
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
          <p className="eyebrow dark"><Layers3 size={18} /> Interaktywny motyw instalacji</p>
          <h2>Najmocniejsze zdjęcie może pracować jak wizytówka marki.</h2>
          <p>
            W kolejnym kroku z tego typu zdjęć można przygotować wycięty dom z panelami, subtelny efekt 3D albo krótką animację pod kampanie leadowe.
          </p>
        </div>
        <div className="featured-installation" aria-label="Przykładowa realizacja fotowoltaiczna">
          <img src={assetUrl("assets/realizations/hero-home.webp")} alt="Dom jednorodzinny z instalacją fotowoltaiczną" loading="lazy" />
          <div className="feature-badge">
            <SunMedium size={20} />
            <div>
              <strong>PV na domu</strong>
              <span>kadr do hero, kampanii i sekcji realizacji</span>
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
          <SiteLink className="button primary" href="/klienci" onNavigate={onNavigate}>
            Przejdź do klientów <ArrowRight size={18} />
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
        title="Zgody i dane z formularzy mają być proste, czytelne i bezpieczne."
        text="To robocza wersja informacji dla strony SOLVA. Przed finalną publikacją warto ją potwierdzić z osobą odpowiedzialną za dokumenty i RODO."
        primary={{ href: "/klienci#formularz", label: "Formularz klienta", icon: Calculator }}
        secondary={{ href: "/handlowcy#formularz", label: "Formularz handlowca", icon: BriefcaseBusiness }}
        imageStyle={heroImages.privacy}
        onNavigate={onNavigate}
      />
      <section className="section privacy-section reveal-zone">
        <div className="privacy-grid">
          <article className="privacy-panel">
            <ShieldCheck size={28} />
            <h3>Co zbieramy</h3>
            <p>Formularze zbierają dane kontaktowe oraz informacje potrzebne do pierwszej rozmowy: lokalizację, typ inwestycji, rachunek, doświadczenie handlowca lub region działania.</p>
          </article>
          <article className="privacy-panel">
            <Phone size={28} />
            <h3>Po co</h3>
            <p>Dane służą do kontaktu w sprawie zapytania, kwalifikacji inwestycji OZE albo rozmowy o współpracy handlowej. Nie publikujemy danych osobowych na stronie.</p>
          </article>
          <article className="privacy-panel">
            <FileText size={28} />
            <h3>Marka i podmiot</h3>
            <p>SOLVA jest marką handlową używaną przez {legalEntityName}. Finalna polityka prywatności powinna zostać uzupełniona o pełne dane rejestrowe, podstawę prawną i ewentualnych dostawców narzędzi formularzowych.</p>
          </article>
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
    : { href: `tel:${contactPhone}`, label: "Zadzwoń", icon: Phone, external: true };
  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  return (
    <div className="mobile-action-bar" aria-label="Szybkie akcje mobilne">
      <SiteLink href={primary.href} onNavigate={onNavigate}>
        <PrimaryIcon size={18} />
        <span>{primary.label}</span>
      </SiteLink>
      {secondary.external ? (
        <a href={secondary.href}>
          <SecondaryIcon size={18} />
          <span>{secondary.label}</span>
        </a>
      ) : (
        <SiteLink href={secondary.href} onNavigate={onNavigate}>
          <SecondaryIcon size={18} />
          <span>{secondary.label}</span>
        </SiteLink>
      )}
    </div>
  );
}

function FaqSection() {
  return (
    <section className="section faq-section reveal-zone" id="faq">
      <div className="section-heading">
        <p className="eyebrow dark"><HelpCircle size={18} /> FAQ</p>
        <h2>Najważniejsze pytania zanim klient lub handlowiec zostawi kontakt.</h2>
      </div>
      <div className="faq-list">
        {faqItems.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function PageHero({ eyebrow, icon: Icon, title, text, primary, secondary, imageStyle, onNavigate }) {
  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  return (
    <section className="page-hero" style={imageStyle || heroImages.home}>
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

function useRevealMotion(dependency) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-zone"));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [dependency]);
}

function Header({ currentPath, onNavigate }) {
  const navItems = [
    { href: "/", label: "Główna", path: "/" },
    { href: "/klienci", label: "Dla klientów", path: "/klienci" },
    { href: "/handlowcy", label: "Dla handlowców", path: "/handlowcy" },
    { href: "/#realizacje", label: "Realizacje", path: "/" }
  ];
  const contactHref = currentPath === "/handlowcy" ? "/handlowcy#formularz" : "/klienci#formularz";

  return (
    <header className="site-header">
      <SiteLink className="brand" href="/" onNavigate={onNavigate} aria-label="SOLVA">
        <img src={logoUrl} alt="SOLVA" />
      </SiteLink>
      <nav aria-label="Nawigacja główna">
        {navItems.map((item) => (
          <SiteLink
            className={currentPath === item.path && !item.href.includes("#") ? "active" : undefined}
            href={item.href}
            key={item.label}
            onNavigate={onNavigate}
          >
            {item.label}
          </SiteLink>
        ))}
      </nav>
      <SiteLink className="header-cta" href={contactHref} onNavigate={onNavigate}>
        <Phone size={17} /> Kontakt
      </SiteLink>
    </header>
  );
}

function useSubmit(endpoint, defaults) {
  const [form, setForm] = useState(defaults);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event, kind = "lead") {
    event.preventDefault();
    setStatus({ type: "loading", message: "Przygotowuję zgłoszenie..." });

    try {
      if (staticFormEndpoint) {
        await submitToStaticEndpoint(kind, form);
        setForm(defaults);
        setStatus({ type: "success", message: kind === "lead" ? "Zgłoszenie wysłane. Przygotuj rachunek za prąd, żeby rozmowa była konkretna." : "Zgłoszenie wysłane. Przygotuj region, doświadczenie i źródła klientów do rozmowy." });
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
        body: JSON.stringify({ ...form, tracking: getTrackingData() })
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Nie udało się wysłać formularza.");
      }

      setForm(defaults);
      setStatus({ type: "success", message: kind === "lead" ? "Zgłoszenie zapisane. Przygotuj ostatni rachunek za prąd do krótkiej rozmowy." : "Zgłoszenie zapisane. Skontaktujemy się w sprawie dalszych kroków i autoryzacji." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  return { form, status, updateField, submit };
}

function LeadForm() {
  const { form, status, updateField, submit } = useSubmit("/api/leads", leadDefaults);

  return (
    <form className="lead-form" onSubmit={(event) => submit(event, "lead")}>
      <FormStatus status={status} />
      <input type="text" className="hidden-field" tabIndex="-1" autoComplete="off" value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} />
      <div className="field-row">
        <label>
          <span>Imię i nazwisko</span>
          <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required placeholder="Jan Kowalski" />
        </label>
        <label>
          <span>Telefon</span>
          <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required inputMode="tel" placeholder="+48 600 000 000" />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>E-mail</span>
          <input value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" placeholder="kontakt@firma.pl" />
        </label>
        <label>
          <span>Miejscowość</span>
          <input value={form.location} onChange={(event) => updateField("location", event.target.value)} required placeholder="np. Kraków" />
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
        <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Np. interesuje mnie fotowoltaika z magazynem energii" />
      </label>
      <Consent checked={form.consent} onChange={(value) => updateField("consent", value)} />
      <button className="submit-button" type="submit" disabled={status.type === "loading"}>
        <Mail size={19} /> Wyślij zapytanie <ArrowRight size={19} />
      </button>
    </form>
  );
}

function PartnerForm() {
  const { form, status, updateField, submit } = useSubmit("/api/partners", partnerDefaults);

  return (
    <form className="lead-form" onSubmit={(event) => submit(event, "partner")}>
      <FormStatus status={status} />
      <input type="text" className="hidden-field" tabIndex="-1" autoComplete="off" value={form.companyWebsite} onChange={(event) => updateField("companyWebsite", event.target.value)} />
      <div className="field-row">
        <label>
          <span>Imię i nazwisko</span>
          <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required placeholder="Anna Nowak" />
        </label>
        <label>
          <span>Telefon</span>
          <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required inputMode="tel" placeholder="+48 600 000 000" />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>E-mail</span>
          <input value={form.email} onChange={(event) => updateField("email", event.target.value)} type="email" placeholder="kontakt@firma.pl" />
        </label>
        <label>
          <span>Miasto lub region</span>
          <input value={form.city} onChange={(event) => updateField("city", event.target.value)} required placeholder="np. Śląsk" />
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
        <textarea value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Napisz krótko o regionie, doświadczeniu albo oczekiwaniach" />
      </label>
      <Consent checked={form.consent} onChange={(value) => updateField("consent", value)} />
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
    <div className={`form-status ${status.type}`} role="status">
      {status.type === "success" ? <Check size={18} /> : <Sparkles size={18} />}
      <span>{status.message}</span>
    </div>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div>
        <img src={logoUrl} alt="SOLVA" />
        <p>SOLVA - marka handlowa {legalEntityName}, partnerski zespół sprzedażowy współpracujący z Hydro NRG.</p>
      </div>
      <div className="footer-links">
        <a href={`tel:${contactPhone}`}><Phone size={17} /> {contactPhoneDisplay}</a>
        <a href={`mailto:${contactEmail}`}><Mail size={17} /> {contactEmail}</a>
        <SiteLink href="/" onNavigate={onNavigate}><MapPin size={17} /> Strona główna</SiteLink>
        <SiteLink href="/klienci#formularz" onNavigate={onNavigate}><Calculator size={17} /> Dla klientów</SiteLink>
        <SiteLink href="/handlowcy#formularz" onNavigate={onNavigate}><BriefcaseBusiness size={17} /> Dla handlowców</SiteLink>
        <SiteLink href="/prywatnosc" onNavigate={onNavigate}><ShieldCheck size={17} /> Prywatność</SiteLink>
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);
