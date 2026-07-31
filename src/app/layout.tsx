import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "F&D Ingenieros | Mantenimiento Predictivo, Confiabilidad y Capacitación Industrial",
  description: "Ingeniería en mantenimiento predictivo, confiabilidad y gestión de activos en Rancagua y todo Chile. Análisis de vibraciones, RCM, termografía y capacitaciones técnicas certificables.",
};

const schemaJSON = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "F&D Ingenieros — Ingeniería en Mantenimiento F&D SpA",
  "url": "https://fydingenieros.cl/",
  "telephone": "+56983894138",
  "email": "contacto@fydingenieros.cl",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rancagua",
    "addressRegion": "Región del Libertador General Bernardo O'Higgins",
    "addressCountry": "CL"
  },
  "areaServed": "CL",
  "sameAs": ["https://www.linkedin.com/company/f-d-ingenier%C3%ADa-en-mantenimiento/"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" translate="no" suppressHydrationWarning className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJSON) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
