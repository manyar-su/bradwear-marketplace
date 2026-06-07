import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { BradAiWidget } from "@/components/brad-ai-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, serviceKeywords, websiteSchema } from "@/lib/seo";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    "Bradflow membantu pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam dengan alur konsultasi yang mudah.",
  applicationName: SITE_NAME,
  keywords: serviceKeywords(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Pemesanan kemeja custom, seragam kantor, seragam dinas, seragam komunitas, polo custom, jaket custom, dan celana seragam dalam satu website yang SEO friendly.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      "Website pemesanan kemeja custom dan seragam untuk kantor, dinas, serta komunitas dengan CTA konsultasi yang jelas dan Brad AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#f7f7f4] text-neutral-900">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Suspense fallback={<div className="h-[116px] border-b border-neutral-200 bg-white" />}>
          <SiteHeader />
        </Suspense>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
        <SiteFooter />
        <BradAiWidget />
      </body>
    </html>
  );
}
