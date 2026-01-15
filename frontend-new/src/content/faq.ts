// content/faq.ts

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  title: string;
  items: FaqItem[];
};

export const faqSections: FaqSection[] = [
  {
    title: "Windykacja",
    items: [
    { 
      question: 'Minął termin płatności za fakturę', 
      answer: `Prosimy w takiej sytuacji o kontakt z Działem Windykacji 
      pod adresem windykacja@dks.pl w celu ustalenia dalszych kroków oraz 
      zachowania ciągłości świadczenia usług.` },
    {
      question: 'Dostałem Wezwanie do Zapłaty', 
      answer: `Oznacza to, że Państwa zobowiązanie przekroczyło 30 dni zwłoki, 
      co spowodowało wygenerowanie dokumentu informującego o dalszych krokach 
      windykacyjnych przy utrzymującym się stanie zaległości. 
      Zachęcamy do skontaktowania się z Działem Windykacji pod adresem windykacja@dks.pl`},
    { 
      question: 'Dostałem MONIT', 
      answer: `Jest to automatyczna wiadomość mailowa wysyłana przez system w sytuacji 
      zarejestrowania przeterminowanego zobowiązania. Zachęcamy do przesłania w odpowiedzi 
      potwierdzenia wpłaty lub informacji co jest przyczyną zwłoki w płatności, 
      co wpłynie na ciągłość świadczenia usług.`
    },
    { 
      question: 'Nie dostałem faktury', 
      answer: `Jeżeli rozliczenia odbywają się na podstawie podpisanej umowy o świadczenie 
      usług, bardzo proszę o kontakt z Działem Rozliczeń pod adresem  serwis.rozliczenia@dks.pl, 
      który wystawia oraz dostarcza faktury. 
      <br /><br /> W sytuacji rozliczenia bez umowy bardzo proszę 
      o wiadomość na adres windykacja@dks.pl` 
    },
    { 
      question: 'Limit Kupiecki', 
      answer: `Jest to ubezpieczenie należności nadawane przez naszego ubezpieczyciela 
      dla działalności gospodarczych działających na rynku więcej niż 12 miesięcy. 
      Przyznanie limitu pozwala na prowadzenie transakcji w formie przelewu 
      z określonym terminem płatności. Każda firma jest indywidualnie weryfikowana.`},
    { 
      question: 'Numer NIP uległ zmianie', 
      answer: `Bardzo proszę o wiadomość na adres: windykacja@dks.pl z aktualnym numerem NIP. 
      Przekażemy dalsze kroki aktualizacji danych w systemie.`
    },
    { 
      question: 'Aktualizacja danych adresowych', 
      answer: `Bardzo proszę o nowe dane na 
      adres: windykacja@dks.pl. Zwrotnie przekażemy informację o zmianie w systemie. 
      <br /><br /> Bardzo ważne, aby zmiana danych była wprowadzona w dokumentach rejestrowych: KRS lub CEiDG. 
      Tylko wtedy będziemy mogli wprowadzić aktualizację po naszej stronie.`
    },
    ],
  },

  {
    title: "Biuro Obsługi Klienta",
    items: [
      {
        question: "Co zrobić ze zużytymi tonerami?",
        answer:
          "Zużyte tonery można oddać do Punktu Selektywnego Zbierania Odpadów Komunalnych (PSZOK).\n\n" +
          "Jeśli Twoje urządzenie jest objęte umową z DKS (z zapisem o bezpłatnej utylizacji), odbiór tonerów możesz zgłosić mailowo: serwis@dks.pl (podaj wagę i wymiary paczki).\n\n" +
          "Istnieje również możliwość odpłatnego odbioru.",
      },
      {
        question: "Chcę oddać urządzenie - co mam zrobić? Czy skupujecie maszyny?",
        answer:
          "Możliwość skupu zależy od modelu urządzenia. W tej sprawie napisz do nas: kontakt@dks.pl.",
      },
      {
        question: "Chcę przenieść maszynę - do kogo się zgłosić?",
        answer:
          "Skontaktuj się ze swoim opiekunem umowy (handlowcem).\n\n" +
          "Jeśli nie masz danych kontaktowych, napisz na serwis@dks.pl lub zadzwoń: 58 350 66 05. " +
          "Na podstawie numeru NIP lub numeru seryjnego pomożemy Ci znaleźć odpowiednią osobę.",
      },
      {
        question: "Czy przyjmujecie stare drukarki?",
        answer:
          "Możliwość przyjęcia drukarki zależy od modelu. Wyślij zapytanie na adres: kontakt@dks.pl.",
      },
      {
        question:
          "Jak sprawdzić poziom zużycia tonerów w urządzeniu Konica Minolta?",
        answer:
          "Instrukcję znajdziesz w naszym filmie instruktażowym na YouTube:\n" +
          "https://youtu.be/i6igSWhTBwY",
      },
      {
        question: "Jak sprawdzić numer seryjny urządzenia?",
        answer:
          "Zobacz film instruktażowy:\nhttps://youtu.be/8ReKira0HAM",
      },
      {
        question:
          "Chcę wydłużyć termin płatności faktury - z kim się skontaktować?",
        answer:
          "Napisz do Działu Rozliczeń i Faktur: serwis.rozliczenia@dks.pl.",
      },
      {
        question: "Otrzymałem uszkodzony toner - co zrobić?",
        answer:
          "Skontaktuj się z Biurem Obsługi Klienta (serwis.(oddział)@dks.pl) i prześlij zdjęcia uszkodzonego materiału " +
          "wraz z numerem dokumentu WZ.\n\n" +
          "Reklamowany toner zostanie odebrany w momencie dostawy nowego.",
      },
      {
        question: "Do kogo kierować zapytania o kontakt z Zarządem?",
        answer: "Napisz na adres: kontakt@dks.pl.",
      },
      {
        question: "Gdzie zgłosić serwis niszczarki HSM?",
        answer:
          "Jeśli urządzenie jest na gwarancji producenta HSM, zgłoszenie należy wysłać przez formularz serwisowy HSM.",
      },
      {
        question: "Gdzie wysłać potwierdzenie salda?",
        answer:
          "Potwierdzenie salda wyślij na adres Działu Księgowości: ksiegowosc@dks.pl.",
      },
      {
        question: "Gdzie mogę zgłosić skargę dotyczącą serwisu?",
        answer:
          "Napisz na adres: serwis.(oddział)@dks.pl lub serwis@dks.pl.",
      },
      {
        question: "Chcę kupić części do drukarki - do kogo się zwrócić?",
        answer:
          "Napisz na adres: serwis.(oddział)@dks.pl lub serwis@dks.pl.",
      },
      {
        question: "Chcę zgłosić zmianę danych do faktury - jak to zrobić?",
        answer:
          "Napisz do Działu Rozliczeń i Faktur: serwis.rozliczenia@dks.pl.",
      },
      {
        question: "Czy mogę u Was coś wydrukować lub zrobić ksero?",
        answer:
          "Nie, nie świadczymy takich usług.",
      },
      {
        question: "Potrzebuję karty charakterystyki toneru - gdzie ją uzyskam?",
        answer:
          "Napisz na adres: serwis@dks.pl.",
      },
      {
        question:
          "Potrzebuję instrukcji obsługi drukarki Konica Minolta - gdzie ją znajdę?",
        answer:
          "Instrukcje obsługi (User Guide) dostępne są na stronie producenta:\nhttps://manuals.konicaminolta.eu",
      },
      {
        question:
          "Czy mogę kupić bęben bez usługi serwisowej, do samodzielnej wymiany?",
        answer:
          "Tak, istnieje taka możliwość. Skontaktuj się z nami: serwis@dks.pl lub serwis.(oddział)@dks.pl.",
      },
      {
        question: "Mam cesję do umowy najmu – czy mogę przesłać ją mailem?",
        answer:
          "Tak, jeśli dokument posiada podpis kwalifikowany.\n\n" +
          "W przypadku odręcznego podpisu dokument należy wysłać pocztą tradycyjną.",
      },
      {
        question: "Skąd wziąć numer PKWiU drukarki?",
        answer:
          "Numer PKWiU znajdziesz w klasyfikacji PKWiU, sekcja C, dział 26.",
      },
      {
        question: "Czy mogę dostać raport zużycia papieru na drukarce?",
        answer:
          "Tak, raport znajdziesz w urządzeniu w zakładce „Licznik formatu papieru”.\n\n" +
          "Uwaga: w urządzeniach A4 wydruki w dupleksie należy podzielić na pół.",
      },
      {
        question: "Czy naprawiacie niszczarki?",
        answer:
          "Tak, w niektórych przypadkach. Napisz na serwis@dks.pl, a sprawdzimy, czy Twój model podlega naprawie.",
      },
      {
        question: "Posiadam nowe tonery po likwidacji firmy – czy je odkupicie?",
        answer:
          "Możliwość skupu zależy od rodzaju materiału. Wyślij zapytanie na adres: kontakt@dks.pl.",
      },
    ],
  },
];

export default faqSections;