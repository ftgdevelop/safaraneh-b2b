/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/hotel/undefined/hotel/:slug',
        destination: '/hotel/:slug',
        permanent: true,
      },
      {
        source: '/en/blog/:slug',
        destination: '/fa/blog/:slug',
        locale: false,
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/fa/blog/:slug',
        locale: false,
        permanent: true,
      },
    ]
  },
  images: {
    domains: [
      'cdn.safaraneh.com',
      'cdn2.safaraneh.com',
      'panel.safaraneh.com',
      'panel.safarlife.com',
      'blog.iranhotel.ir',
      'trustseal.enamad.ir',
      'logo.samandehi.ir',
      'strapi.safarlife.com',
      'strapi.safaraneh.com',
      'www.facebook.com',
      'cdn.mehrbooking.net',
      'cdn2.safarlife.com'
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: false,
  swcMinify: true,
  i18n,
  env: {
    PROJECT: "SAFARLIFE",
    SITE_NAME: 'https://www.safaraneh.com',
    THEME: "THEME2",
    LocaleInUrl: "off",
    HOTEL_LIST_LAZY_LOAD: "",
    SAFAR_MARKET_SITE_NAME: "",
    PROJECT_SERVER_TYPE: "https://",
    PROJECT_SERVER_USER: "",
    
    GOOGLE_ANALYTIC_ID: 'G-BT6EJ64D29',
    GOOGLE_TAG_MANAGER_ID: 'GTM-MJQWGBV',

    PROJECT_SERVER_APIKEY: 'e8fad1497a1244f29f15cde4a242baf0',
    PROJECT_PORTAL_APIKEY: 'b4fa99cc-3dfd-40a5-8bcf-53acdc2dbd84',
    
    PROJECT_SERVER_CMS:"cms2.safarlife.com",

    PROJECT_SERVER_HOTEL_WP:"performance.safarlife.com",
    PROJECT_SERVER_HOTEL_DATA: "hoteldomesticdata.safarlife.com",
    PROJECT_SERVER_HOTEL_AVAILABILITY: "hotelv4.safarlife.com",
    PROJECT_SERVER_COORDINATOR:"coordinator.safarlife.com",
    PROJECT_SERVER_BLOG :"panel.safarlife.com",
    PROJECT_SERVER_CRM:"crm.safarlife.com",
    PROJECT_SERVER_PAYMENT: "payline.safarlife.com",
    PROJECT_SERVER_IDENTITY:"identity.safarlife.com",
    PROJECT_SERVER_TRAVELER:"traveller.safarlife.com",
    PROJECT_SERVER_CIP:"cip.safarlife.com",
    PROJECT_SERVER_FLIGHT: "flightdomestic.safarlife.com",
    PROJECT_SERVER_STRAPI:"strapi.safarlife.com",
    PROJECT_SERVER_STRAPI_TOKEN : "8b8a913dce14acb4a1e98dc497ab2db4740d2953dd0301ffbbd7c40f60dd068eb8d2b7462b489fe8a720a649e7b7cfe63be6363634cab3a1c5112b4cdb6b6a6539bfd391fc022367b208c716ed2cb4ca6dc501adf340a3217939927700e53d7a6289b48e673680ff001a85a07730fadc68ace99d8f71eb2bc299935414accc2c",
    PROJECT_SERVER_NATIONALITY: "",
    PORT: '',
    //PROJECT_MODULES: "Flight Hotel CIP Blog ForeignFlight ForeignHotel",
    PROJECT_MODULES: "DomesticFlight DomesticHotel",
    // DEFAULT_lAN:"US",
    // LANGUAGES:["US","NO","FA"]

  }
}

module.exports = nextConfig;
