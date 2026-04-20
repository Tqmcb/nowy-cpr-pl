import { ProductSearchTool } from "components/ProductSearchTool";
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { RelatedPages } from "components/PageHeader";

export default function ProductSearch() {
  return (
    <>
      <Header />
      <ProductSearchTool />
      <RelatedPages />
      <Footer />
    </>
  );
}
