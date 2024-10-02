import { i18n } from 'next-i18next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { Provider } from 'react-redux';
import Head from 'next/head';

import '../styles/carousel.scss';
import '../styles/mobiscroll.scss';
import '../styles/globals.scss';
import '../styles/leaflet.css';
// import '../styles/modernDatePicker.scss';

import { store } from '../modules/shared/store';
import { GetPageByUrlDataType, WebSiteDataType } from '@/modules/shared/types/common';
import Layout from '@/modules/shared/components/layout';
import { getPageByUrl } from '@/modules/shared/actions';

type TProps = Pick<AppProps, "Component" | "pageProps">;

function MyApp({ Component, pageProps }: TProps) {
  const router = useRouter();

  const { locale } = router;
  const dir = locale === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    i18n?.changeLanguage(locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(() => {
    const locale = localStorage.getItem("publicLocale");
    if (locale) {
      router.push(router.asPath, router.asPath, { locale: locale });
    }
  }, []);


  let canonicalUrl = "";
  let envSiteName = process.env.SITE_NAME;
  let urlLocalePart = i18n?.language ? `/${i18n?.language}` : "";

  if(process.env.LocaleInUrl === "off"){
    urlLocalePart = "";
  }

  if (process.env.SITE_NAME?.includes("iranhotel")){
    envSiteName = "https://www.iranhotel.app"
  }

  if(typeof router !== 'undefined'){
    if (router.route === '/hotels/[...hotelList]'){
      canonicalUrl = "";
    }else if (router.route === '/hotel/[...hotelDetail]'){
      canonicalUrl = envSiteName + urlLocalePart + (router.query.hotelDetail ? "/hotel/"+router.query.hotelDetail[0] : "");
    }else if (router.route === '/flights/[flights]'){
      canonicalUrl = envSiteName + urlLocalePart + (router.query.flights ? "/flights/"+router.query.flights : "");
    }else{

      let path = router.asPath;
      if (path[path.length-1] === "/"){
        path = path.substring(0, path.length - 1);
      }
      canonicalUrl = envSiteName + urlLocalePart + path
    }
  }
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />

        <meta name="copyright" content="safaraneh.com" />
        <meta name="cache-control" content="cache" />
        <meta name="content-language" content="fa" />
        <meta name="content-type" content="text/html;UTF-8" />
        <meta name="DC.Language" content="fa" />
        <meta name="DC.Type" content="Text,Image" />
        <meta name="DC.Creator" content="safaraneh.com" />
        <meta name="rating" content="General" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="#0a438b"
        />
        <meta
          httpEquiv="content-type"
          content="text/html; charset=UTF-8"
        />

        <link rel="shortcut icon" href="/favicon.ico" />

        <title> سفرانه </title>

      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>

    </Provider>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<any> => {
  const ctx = await App.getInitialProps(context);
  return {
    ...ctx
  };
};

export default appWithTranslation(MyApp);
