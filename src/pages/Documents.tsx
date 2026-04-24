import { Helmet } from "react-helmet-async";
import { DocumentsPage } from "components/DocumentsPage";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { RelatedPages } from "components/PageHeader";

export default function Documents() {
  return (
    <>
      <Helmet>
        <title>Wzory DoP&C, CE, FPC, EPD i DPP — dokumenty CPR 2024/3110 | NowyCPR.pl</title>
        <meta
          name="description"
          content="Bezpłatne wzory dokumentów CPR 2024/3110: DoP&C, oznakowanie CE, FPC/ZKP, karta techniczna, EPD, DPP, AVS, importer i lista kontrolna producenta."
        />
        <meta name="keywords" content="wzór DoP&C, szablon DoP&C, deklaracja właściwości użytkowych i zgodności, oznakowanie CE wzór, FPC, ZKP, EPD, DPP, dokumenty CPR 2024/3110" />
        <link rel="canonical" href="https://www.nowycpr.pl/documents" />
        <meta property="og:title" content="Wzory DoP&C, CE, FPC, EPD i DPP — dokumenty CPR 2024/3110 | NowyCPR.pl" />
        <meta
          property="og:description"
          content="Bezpłatne wzory i listy kontrolne: DoP&C, CE, FPC/ZKP, karta techniczna, EPD, DPP, AVS i dokumenty importera."
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
