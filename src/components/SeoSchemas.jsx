import { Helmet } from 'react-helmet-async';

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Dewelope",
  "url": "https://dewelope.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://dewelope.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Dewelope",
  "url": "https://dewelope.com",
  "description": "A focused software house building enterprise platforms, financial systems and branchless-banking infrastructure.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rawalpindi",
    "addressCountry": "PK"
  },
  "email": "hello@dewelope.com",
  "priceRange": "$$"
};

export default function SeoSchemas() {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(professionalServiceSchema)}
      </script>
    </Helmet>
  );
}
