import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import AboutSection from "@/components/sections/AboutSection";

export const metadata: Metadata = {
  title: "Our Story | Thread&Tales",
  description:
    "Thread&Tales began with a single notebook and a question: what if clothes were written, not just manufactured? Meet the printers and weavers behind every piece.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <AboutSection />
      <Footer />
    </>
  );
}
