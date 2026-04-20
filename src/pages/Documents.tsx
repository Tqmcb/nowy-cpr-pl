import { Helmet } from "react-helmet-async";
import { DocumentsPage } from "components/DocumentsPage";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { RelatedPages } from "components/PageHeader";

export default function Documents() {
  return (
    <>
      <Helmet>
        <title>Szablony Dokumentów CPR 2024/3110 — bezpłatne wzory | NowyCPR.pl</title>
        <meta
          name="description"
          content="13 bezpłatnych szablonów dokumentów CPR 2024/3110: DoP&C, karta techniczna, FPC, oznakowanie CE, EPD, DPP, paszport produktu. Zgodne z Rozporządzeniem (UE) 2024/3110."
        />
        <link rel="canonical" href="https://www.nowycpr.pl/documents" />
        <meta property="og:title" content="Szablony Dokumentów CPR 2024/3110 — bezpłatne wzory | NowyCPR.pl" />
        <meta
          property="og:description"
          content="13 bezpłatnych szablonów dokumentów CPR 2024/3110: DoP&C, karta techniczna, FPC, oznakowanie CE, EPD, DPP, paszport produktu."
        />
        <meta property="og:url" content="https://www.nowycpr.pl/documents" />
      </Helmet>
      <Header />
      <DocumentsPage />
      <RelatedPages />
      <Footer />
    </>
  );
}