import Head from 'next/head';

import { MetatagsProps } from '@lib/types';

const Metatags: React.FC<MetatagsProps> = ({
  title = 'SOL Mentoring',
  description = 'A Free and Open Mentoring Platform'
}) => {
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

export default Metatags;
