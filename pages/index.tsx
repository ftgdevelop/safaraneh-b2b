import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Hero from '@/modules/home/components/Hero';
import Partners from '@/modules/home/components/Partners';
import Features from '@/modules/home/components/Features';

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Partners />
      <Features />
    </>
  )
}

export const getStaticProps = async (context: any) => {

  return ({
    props: {
      ...await serverSideTranslations(context.locale, ['common', 'home', 'hotel']),
      context: context
    },
    revalidate: 3600
  })
};

export default Home;
