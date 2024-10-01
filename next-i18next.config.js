const path = require('path')

module.exports = {
  i18n: {
    locales: ['default', 'fa','en'],
    defaultLocale: 'default',
    localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/public/locales',
    localeDetection: false
  },
}