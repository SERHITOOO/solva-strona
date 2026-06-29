export const faqItems = [
  {
    audience: ["all", "clients", "partners"],
    question: "Czy SOLVA jest osobną marką?",
    answer: "Tak. SOLVA to marka handlowa używana przez JTJ FUND sp. z o.o., która komunikuje partnerski zespół sprzedażowy współpracujący z Hydro Energy."
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

export function getFaqItemsForAudience(audience = "all") {
  return audience === "all" ? faqItems : faqItems.filter((item) => item.audience.includes(audience));
}

export function createFaqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
