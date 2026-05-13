---
title: "QR kod i unikalny kod identyfikacyjny wyrobu w CPR 2024 — jak się przygotować"
reviewed: "2026-05-13"
date: "2025-09-19"
author: "dr inż. Robert Dynarowski | Redakcja NowyCPR.pl | Multicert Sp. z o.o."
category: "Cyfryzacja"
tags: ["QR kod", "kod wyrobu", "CPR 2024", "oznakowanie", "identyfikacja cyfrowa"]
excerpt: "CPR 2024/3110 wprowadza wymóg cyfrowej dostępności DoP&C (od 8.01.2026 wystarczy link/URL na stronie producenta) oraz unikalny kod identyfikacyjny wyrobu. Sam kod QR nie jest jeszcze obowiązkowy — stanie się nim po aktach delegowanych KE. Dowiedz się jak wdrożyć te wymogi krok po kroku."
image_url: /images/blog/qr-kod-unikalny-kod-produktu-c.jpg
template: "przewodnik"
sources:
  - Rozporządzenie (UE) 2024/3110 — pełny tekst|https://eur-lex.europa.eu/eli/reg/2024/3110/oj
  - Rozporządzenie ESPR (UE) 2024/1781 — EUR-Lex|https://eur-lex.europa.eu/eli/reg/2024/1781/oj
---

## Nowy wymiar oznakowania — cyfryzacja w CPR 2024

> **Stan prawny — marzec 2026:**
> - ✅ **Dostęp online do DoP&C obowiązkowy od 8.01.2026** — producent wystawiający DoP&C musi udostępnić ją bezpłatnie w internecie (link/URL na stronie producenta, PDF do pobrania). Spełnienie tego wymogu nie wymaga kodu QR — wystarczy adres URL w dokumentacji. *Uwaga: producenci posiadający stary DoP (ważny na mocy przepisów przejściowych do 8.01.2040) nie są zobowiązani do natychmiastowego przejścia na DoP&C.*
> - ⚠️ **Kod QR na wyrobie/opakowaniu — jeszcze nie obowiązkowy.** QR kod to najwygodniejszy sposób na spełnienie wymogu cyfrowej dostępności, ale obowiązkowy będzie dopiero po opublikowaniu przez KE aktów delegowanych (oczekiwanych nie wcześniej niż 2027).
> - ⚠️ **Unikalny kod identyfikacyjny wyrobu (UPC)** — wymóg wynika z CPR 2024/3110, jednak realne ryzyko kar jest niskie, gdyż polska Nowa Ustawa o Wyrobach Budowlanych (NUWB) nie została jeszcze uchwalona.
> - ❌ **Cyfrowy Paszport Produktu (DPP) — nie obowiązuje** do czasu opublikowania nowych norm zharmonizowanych (hTS) i aktów wykonawczych KE.

Rozporządzenie CPR 2024/3110 wprowadza nowe wymagania dotyczące cyfrowej dostępności dokumentacji wyrobów budowlanych. Od 8 stycznia 2026 roku DoP&C (Deklaracja Właściwości Użytkowych i Zgodności) musi być dostępna online — producent musi zapewnić bezpłatny dostęp do aktualnego dokumentu przez minimum 10 lat. Celem tej zmiany jest umożliwienie wszystkim uczestnikom łańcucha dostaw natychmiastowego dostępu do aktualnej dokumentacji wyrobu. Poniżej opisujemy jak technicznie wdrożyć te wymogi — od najprostszego (link/URL) po najbardziej zaawansowane (QR kod, GS1 Digital Link).

## Czym jest unikalny kod identyfikacyjny wyrobu?

Zgodnie z art. 22 ust. 5 CPR 2024, każdy wyrób budowlany objęty obowiązkiem oznakowania CE musi posiadać unikalny kod identyfikacyjny wyrobu (ang. unique product identifier). Kod ten musi umożliwiać jednoznaczną identyfikację wyrobu i powiązanie go z jego dokumentacją techniczną, w szczególności z DoP&C.

Rozporządzenie nie narzuca jednego konkretnego standardu, jednak w praktyce rynkowej dominuje standard GS1, a w jego ramach globalny numer jednostki handlowej GTIN (ang. Global Trade Item Number). GTIN jest 14-cyfrowym numerem, który identyfikuje wyroby handlowe na całym świecie. Składa się z:

- prefiksu firmy GS1 nadawanego przez krajową organizację GS1 (w Polsce: GS1 Polska),
- referencji wyrobu nadawanej przez producenta,
- cyfry kontrolnej.

Korzystanie z systemu GTIN jest szczególnie rekomendowane, gdy wyrób jest dystrybuowany przez sieci handlowe lub platformy e-commerce, które już działają w oparciu o ten standard. Dla wyrobów sprzedawanych wyłącznie w kanałach B2B, producent może zastosować własny system identyfikacji, pod warunkiem że zapewnia on unikalność i jednoznaczność identyfikacji.

## Kod QR jako nośnik identyfikatora i link do DoP&C

CPR 2024 wymaga, aby unikalny kod identyfikacyjny wyrobu był umieszczony na wyrobie, jego opakowaniu lub w towarzyszącej dokumentacji w formie umożliwiającej maszynowy odczyt. W praktyce najwygodniejszą formą jest kod QR (Quick Response), który:

- może zawierać zarówno sam identyfikator wyrobu, jak i bezpośredni URL do strony z DoP&C,
- jest czytelny dla każdego smartfona wyposażonego w aparat,
- nie wymaga instalacji specjalnej aplikacji przez użytkownika końcowego,
- jest tani w generowaniu i nanoszeniu (nadruk, etykieta, grawerowanie laserowe).

Kod QR może kierować użytkownika bezpośrednio do strony internetowej zawierającej DoP&C lub do systemu zarządzania danymi produktowymi producenta. Ważne jest, aby URL zawarty w kodzie QR był trwały — tzn. nie zmieniał się w czasie i nie prowadził do stron, które mogą zostać usunięte lub zrestrukturyzowane.

## Co powinien zawierać URL docelowy?

Strona internetowa, do której prowadzi kod QR, musi spełniać określone wymagania. Przede wszystkim musi umożliwiać nieodpłatne i bezpośrednie pobranie lub przeglądanie aktualnej DoP&C w formacie czytelnym dla człowieka (np. PDF). Ponadto powinna zawierać lub linkować do:

- pełnej nazwy i adresu producenta,
- daty sporządzenia lub ostatniej aktualizacji DoP&C,
- nazwy i numeru referencyjnego wyrobu,
- numeru normy zharmonizowanej lub europejskiej oceny technicznej (ETA), na podstawie której sporządzono DoP&C,
- zadeklarowanych właściwości użytkowych w odniesieniu do zasadniczych charakterystyk.

Strona powinna działać w co najmniej jednym z języków urzędowych UE i być dostępna bez konieczności zakładania konta lub podawania danych osobowych przez użytkownika.

## Jak wygenerować kod QR — praktyczny przewodnik krok po kroku

**Krok 1: Ustal strukturę URL**

Zanim wygenerujesz kod QR, musisz mieć gotowy stały adres URL, pod którym dostępna będzie DoP&C. Zalecana struktura to np.:
`https://www.twojafirma.pl/dopc/{numer-referencyjny-wyrobu}`

Unikaj dynamicznych parametrów sesji i tokenów w URL-u, które mogą się zmieniać.

**Krok 2: Wybierz standard kodu**

Dla wyrobów budowlanych zalecane jest użycie formatu GS1 Digital Link (standardu łączącego GTIN z URL-em) lub zwykłego URL-a QR. GS1 Digital Link pozwala na zakodowanie jednocześnie GTIN-u i linku do DoP&C w jednym kodzie.

**Krok 3: Wygeneruj kod QR**

Do generowania kodów QR możesz użyć:
- narzędzi GS1 Polska (dla kodów opartych na GTIN),
- oprogramowania ERP z modułem generowania etykiet (np. SAP, Sage),
- narzędzi open-source (biblioteka `qrcode` w Pythonie, biblioteka ZXing),
- usług SaaS do zarządzania kodem QR (np. Beaconstac, QR Tiger) — przydatnych gdy chcesz móc zmieniać URL bez przepakowania wyrobu (dynamiczne kody QR).

**Krok 4: Przetestuj kod**

Przed naniesieniem na wyrób lub opakowanie przetestuj kod QR przy różnych poziomach oświetlenia i pod różnymi kątami, używając kilku różnych modeli smartfonów.

**Krok 5: Nanieś kod na wyrób lub opakowanie**

Kod QR powinien być nadrukowany lub naniesiony w sposób trwały. Minimalna zalecana wielkość kodu QR do poprawnego odczytu to 2×2 cm dla kodu zawierającego URL o długości do ok. 60 znaków.

## Wyjątki dla małych wyrobów i wyrobów luzem

CPR 2024 uwzględnia sytuacje, w których naniesienie kodu QR bezpośrednio na wyrób jest niemożliwe lub niepraktyczne. Dotyczy to w szczególności:

- wyrobów o zbyt małych wymiarach (np. kotwy, wkręty, małe złącza),
- wyrobów sprzedawanych luzem (np. kruszywa, zaprawy workowane),
- wyrobów, których charakter fizyczny uniemożliwia trwałe oznakowanie (np. materiały cięte na wymiar).

W takich przypadkach CPR 2024 dopuszcza umieszczenie kodu QR na opakowaniu zbiorczym, na etykiecie przymocowanej do wyrobu lub w dokumentacji towarzyszącej. Ważne jest, aby link do DoP&C był dostępny i możliwy do skojarzenia z danym wyrobem przez każdego uczestnika łańcucha dostaw.

## Integracja z systemami ERP i PIM

Dla producentów posiadających szerokie portfolio wyrobów, ręczne zarządzanie kodami QR i URL-ami do DoP&C jest nieefektywne. Zalecane jest wdrożenie lub rozbudowanie systemu zarządzania danymi o produktach (PIM — Product Information Management) zintegrowanego z systemem ERP.

Taki system powinien automatycznie:
- generować unikalny identyfikator dla każdego nowego wyrobu,
- tworzyć i aktualizować stronę z DoP&C,
- generować kod QR i przekazywać go do systemu etykietowania,
- archiwizować poprzednie wersje DoP&C z datą obowiązywania.

## Terminy i harmonogram wdrożenia

| Data | Wymóg | Status |
|------|-------|--------|
| **8 stycznia 2026** | Cyfrowy dostęp do DoP&C (link/URL na stronie producenta) | ✅ Obowiązuje — URL wystarczy |
| **8 stycznia 2026** | Unikalny kod identyfikacyjny wyrobu (UPC) | ✅ Obowiązuje — ryzyko kar niskie (NUWB w trakcie uchwalania) |
| **po aktach delegowanych KE (ok. 2027)** | Obowiązkowy QR kod na etykiecie / wyrobie | ⏳ Wymaga aktów delegowanych KE |
| **po publikacji nowej hTS + zakończeniu koegzystencji** | Deklarowanie GWP i wskaźników środowiskowych | ⏳ Żadna nowa hTS jeszcze nie opublikowana |
| **po hTS + aktach KE (ok. 2028–2029)** | Cyfrowy Paszport Produktu (DPP) | ⏳ Nie obowiązuje |

**Co warto zrobić już teraz:** Niezależnie od terminu obowiązkowego kodu QR, wdrożenie QR kodów prowadzących do DoP&C to dobra praktyka — ułatwia pracę inspektorom, dystrybutorów i wykonawcom, a jednocześnie buduje infrastrukturę techniczną pod przyszłe wymagania (DPP).

## Podsumowanie

Obowiązek unikalnego kodu identyfikacyjnego i cyfrowej dostępności DoP&C to nie jednorazowe działanie, ale zmiana o charakterze systemowym. Wymaga inwestycji w infrastrukturę IT, procesów zarządzania danymi i przeszkolenia pracowników. Firmy, które zaczną przygotowania już teraz, unikną kosztownego pośpiechu w ostatniej chwili i zyskają przewagę konkurencyjną na rynku europejskim.
