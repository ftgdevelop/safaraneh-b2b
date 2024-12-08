import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Hero from '@/modules/home/components/Hero';
import Partners from '@/modules/home/components/Partners';
import Features from '@/modules/home/components/Features';
import { getStrapiData } from '@/modules/shared/actions/strapiActions';
import { StrapiHomeSectionData } from '@/modules/shared/types/common';
import { ServerAddress } from '@/enum/url';

const Home: NextPage<{ sections?: StrapiHomeSectionData[] }> = ({ sections }) => {

  const heroData = sections?.find(item => item.Keyword === 'hero-text');
  const partnersData = sections?.find(item => item.Keyword === 'partners');
  const featuresData = sections?.find(item => item.Keyword === 'facilities');

  return (
    <>
      {<Hero
        description={heroData?.Description}
        subtitle={heroData?.Subtitle}
        title={heroData?.Title}
      />}

      <Partners
        title={partnersData?.Title}
        items={partnersData?.Items?.map(item => ({
          image: item.Image?.data?.attributes?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}${item.Image.data.attributes.url}` : "",
          title: item.Title || ""
        })) || []}
      />

      <Features
        title={featuresData?.Title}
        items={featuresData?.Items?.map(item => ({
          image: item.Image?.data?.attributes?.url ? `${ServerAddress.Type}${ServerAddress.Strapi}${item.Image.data.attributes.url}` : "",
          title: item.Title || ""
        })) || []}
      />
    </>
  )
}

export const getStaticProps = async (context: any) => {

  const itemsRes = await getStrapiData('populate[Sections][populate][Items][populate]=*')
  const sections = itemsRes?.data?.data?.[0]?.attributes?.Sections;

  return ({
    props: {
      ...await serverSideTranslations(context.locale, ['common', 'home', 'hotel']),
      context: context,
      sections: sections || null
    },
    revalidate: 3600
  })
};

export default Home;
