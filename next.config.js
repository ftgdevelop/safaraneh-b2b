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
      'blog.iranhotel.ir',
      'trustseal.enamad.ir',
      'logo.samandehi.ir',
      'strapi.safarlife.com',
      'strapi.safaraneh.com',
      'www.facebook.com',
      'cdn.mehrbooking.net'
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: false,
  swcMinify: true,
  i18n,
  env: {
    PROJECT: "HOTELBAN",
    SITE_NAME: 'https://www.b2b.hotelban.com',
    THEME: "THEME1",
    LocaleInUrl: "off",
    HOTEL_LIST_LAZY_LOAD: "",
    SAFAR_MARKET_SITE_NAME: "",
    PROJECT_SERVER_TYPE: "https://",
    PROJECT_SERVER_USER: "",
    
    GOOGLE_ANALYTIC_ID: 'G-BT6EJ64D29',
    GOOGLE_TAG_MANAGER_ID: 'GTM-MJQWGBV',

    PROJECT_SERVER_APIKEY: 'e8fad1497a1244f29f15cde4a242baf0',
    PROJECT_PORTAL_APIKEY: 'b4fa99cc-3dfd-40a5-8bcf-53acdc2dbd84',
    
    PROJECT_SERVER_CMS:"cms2.safaraneh.com",
    
    PROJECT_SERVER_HOTEL_WP:"performance.safaraneh.com",
    PROJECT_SERVER_HOTEL_DATA: "hoteldomesticdata.safaraneh.com",
    PROJECT_SERVER_HOTEL_AVAILABILITY: "hotelv4.safaraneh.com",
    PROJECT_SERVER_COORDINATOR:"coordinator.safaraneh.com",
    PROJECT_SERVER_BLOG :"panel.safaraneh.com",
    PROJECT_SERVER_CRM:"crm.safaraneh.com",
    PROJECT_SERVER_PAYMENT: "payline.safaraneh.com",
    PROJECT_SERVER_IDENTITY:"identity.hotelban.com",
    PROJECT_SERVER_TRAVELER:"traveller.safaraneh.com",
    PROJECT_SERVER_CIP:"cip.safaraneh.com",
    PROJECT_SERVER_FLIGHT: "flightdomestic.hotelban.com",
    PROJECT_SERVER_STRAPI:"strapi.safaraneh.com",
    PROJECT_SERVER_STRAPI_TENANTID:"hotelban",
    PROJECT_SERVER_STRAPI_TOKEN : "de7c6a2c34c477963c83c51ad5b6b6be760002e52d53ba39ca05c20a68c8de23393c65ed1eab854d5f6e73af5e876bb4770ac7c402f92775b9dc6cffe464f98d7bf8e8a51e214d01632871b4e091ef309f986446893634e70f9a71602fa0a060c395084de4b4b9cde3b63d09738319235129170f1805a940a62716df7829d047",
    PROJECT_SERVER_NATIONALITY: "",
    PORT: '',
    //PROJECT_MODULES: "Flight Hotel CIP Blog ForeignFlight ForeignHotel",
    PROJECT_MODULES: "DomesticFlight DomesticHotel CIP",
    // DEFAULT_lAN:"US",
    // LANGUAGES:["US","NO","FA"]

  }
}

module.exports = nextConfig;
