import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { BlogPage } from "components/BlogPage";
import { RelatedPages } from "components/PageHeader";

export default function Blog() {
  return (
    <>
      <Header />
      <BlogPage />
      <RelatedPages />
      <Footer />
    </>
  );
}
