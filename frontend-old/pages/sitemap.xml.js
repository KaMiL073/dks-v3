import getNews from '../lib/models/news';
import { categorySlugToCollectionPl } from '../lib/models/categories';
import { getProductsSiteMap } from '../lib/models/products';

function generateSiteMap({ posts, products }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.dks.pl/</loc>
     </url>
     <url>
       <loc>https://www.dks.pl/o-firmie</loc>
     </url>
     <url>
       <loc>https://www.dks.pl/oddzialy</loc>
     </url>
     <url>
       <loc>https://www.dks.pl/oddzialy/gdansk</loc>
     </url>
     <url>
       <loc>https://www.dks.pl/oddzialy/warszawa</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/katowice</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/poznan</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/lodz</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/krakow</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/szczecin</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/bydgoszcz</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/olsztyn</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/rzeszow</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/bialystok</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/oddzialy/wroclaw</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/certyfikaty</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/baza-wiedzy</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/serwis-urzadzen-wielofunkcyjnych</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/serwis-urzadzen-produkcyjnych</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/serwis-urzadzen-wielkoformatowych</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/kontrakt-obslugi-serwisowej</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/zgloszenie-serwisowe</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/export</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/kontakt</loc>
     </url>
     <url>
      <loc>https://www.dks.pl/strefa-klienta</loc>
     </url>
     
     ${posts
    .map((post) => `
         <url>
         <loc>https://www.dks.pl/blog/${`${post.category.slug}`}/${`${post.slug}`}</loc>
         </url>
         `)
    .join('')}
        
        ${products
    .map((product) => `
             <url>
              <loc>https://www.dks.pl/oferta/${`${categorySlugToCollectionPl(product.type[0].collection)}`}/${`${product.slug}`}</loc>
             </url>
          `)
    .join('')}
       
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site

  const posts = await getNews() || [];
  const products = await getProductsSiteMap() || [];
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap({ posts, products });

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
