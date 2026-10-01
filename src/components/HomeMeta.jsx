import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../utils/useSiteContent.js';

export default function HomeMeta() {
  const { seo } = useSiteContent();
  const title = seo.home?.title || seo.siteTitle;
  const description = seo.home?.description || seo.defaultDescription;
  const base = seo.canonicalBase || 'https://dewelope.com';
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="robots" content={seo.robots || 'index,follow'} />
      <link rel="canonical" href={`${base}/`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${base}/`} />
      <meta property="og:image" content={seo.ogImage} />
      <meta name="twitter:card" content={seo.twitterCard || 'summary_large_image'} />
      {seo.twitterSite ? <meta name="twitter:site" content={seo.twitterSite} /> : null}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seo.ogImage} />
    </Helmet>
  );
}
