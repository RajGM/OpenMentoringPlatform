import Head from 'next/head';

export default function Metatags({
  title = 'FOSS Mentoring',
  description = 'A Free and Open Study Abroad Mentoring Platform'
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@rajgm_hacks" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
