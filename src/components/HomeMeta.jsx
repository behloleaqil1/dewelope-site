import { Helmet } from 'react-helmet-async';

export default function HomeMeta() {
  return (
    <Helmet>
      <title>Dewelope — Modern Software House</title>
      <meta name="description" content="Dewelope is a focused software house building enterprise platforms, financial systems and branchless-banking infrastructure. Angular, React, Next.js, Spring Boot, microservices — shipped at banking scale." />
      <meta property="og:title" content="Dewelope — Modern Software House" />
      <meta property="og:description" content="We ship modern platforms at banking scale — full-stack, microservices, fintech, AI integration. Trusted by teams behind EasyPaisa, JazzCash, FoodPanda, ZTBL." />
      <meta property="og:url" content="https://dewelope.com/" />
      <meta property="og:image" content="https://dewelope.com/og-image.png" />
      <meta name="twitter:title" content="Dewelope — Modern Software House" />
      <meta name="twitter:description" content="We ship modern platforms at banking scale — full-stack, microservices, fintech, AI integration." />
      <meta name="twitter:image" content="https://dewelope.com/og-image.png" />
    </Helmet>
  );
}
