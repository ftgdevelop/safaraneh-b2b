const path = require('path')

module.exports = {
  i18n: {
    locales: ['fa'],
    defaultLocale: 'fa',
    localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/public',
    localeDetection: false
  },
}