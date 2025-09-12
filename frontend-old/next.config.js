// module.exports = (phase, { defaultConfig }) => ({
module.exports = () => ({
  compress: true,
  // images: {
  //   domains: ['directus'],
  //   loader: 'imgix',
  //   path: '/'
  // },
  images: {
    loader: 'akamai',
    path: '',
  },
  env: {
    basePath: 'https://www.dks.pl/',
    assetsPath: 'https://www.dks.pl/backend/assets/',
    RECAPTCHA_SITE: process.env.RECAPTCHA_SITE,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: 'UA-52740839-1',
  },
});
