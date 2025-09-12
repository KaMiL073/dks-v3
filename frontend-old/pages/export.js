import Image from 'next/image';
import PeopleIcon from '@mui/icons-material/PeopleOutline';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import styles from '../styles/pages.module.scss';

const TITLE = 'Eksport używanych drukarek i kserokopiarek klasy biznesowej';
const DESCRIPTION = 'Jesteśmy wiodącym eksporterem kserokopiarek używanych Konica Minolta, Ricoh, Canon, Xerox, Kyocera Mita, Sharp, HP, Brother i Lexmark. Szczegóły na stronie. ';
const flexWrap = 'flex sm:flex-wrap xl:px-0';
const flexColHalfWidth = 'flex-col w-1/2 sm:w-full md:max-w-screen-xl md:pb-10 pt-10';
// const textGreyBase = 'text-dks-gray text-base';

export default function Export() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Export" headingType="h2" imgSrc="/static/header_kopiowanko.webp" />
      <div className={`md:max-w-screen-xl mx-auto px-8 md:px-0 ${styles.htmlContent}`}>
        <div className={flexWrap}>
          <div className="flex-col sm:w-full md:max-w-screen-xl md:pb-10">
            <h1>Eksport używanych drukarek i kserokopiarek</h1>
            <p>
              <strong>
                Jednym z filarów naszej działalności
                jest eksport kserokopiarek
              </strong>
              . Przedmiotem
              naszej działalności są urządzenia nowe i używane.
              Istniejemy i rozwijamy się dynamicznie od 1993 r.
              Obecnie mamy pozycję Top Leader na Europę Wschodnią jako Autoryzowany
              Dystrybutor Konica Minolta. Zbudowaliśmy silną sieć z naszymi dostawcami,
              Klientami i dealerami w Polsce, Europie, na Bliskim Wschodzie,
              na Dalekim Wschodzie i w Afryce.
            </p>
            <h2>Tysiące markowych kserokopiarek przygotowanych do szybkiej wysyłki</h2>
            <p className="pb-10">
              Przeważającą częścią naszej działalności eksportowej
              jest
              {' '}
              <strong>
                {' '}
                handel używanymi
                kserokopiarkami renomowanych marek
              </strong>
              : Konica Minolta,
              Ricoh, Canon, Xerox, Kyocera, Sharp, HP, Brother i Lexmark.
              Ponadto oferujemy oryginalne materiały eksploatacyjne
              i części zamienne do
              {' '}
              <a
                title="urządzeń wielofunkcyjnych do biura"
                href="https://www.dks.pl/oferta/rozwiazania-dla-biura/"
                target="_self"
              >
                urządzeń wielofunkcyjnych do biura
              </a>
              , do systemów druku
              produkcyjnego i maszyn wielkoformatowych.
            </p>
            <p>
              Nasz
              {' '}
              <strong>
                magazyn kserokopiarek
                znajduje się w Gdańsku
                {' '}
              </strong>
              . Na powierzchni
              3,5 tys. m2 możemy przechowywać
              w komfortowych warunkach kilka tysięcy maszyn drukujących.
              Dogodna lokalizacja sprawia,
              że jesteśmy w stanie dostarczać kontenery
              do portu w Gdańsku lub Gdyni w niespełna pół godziny.
              Z Portu Lotniczego Gdańsk do naszego magazynu można dojechać w zaledwie 10 min.
              W zależności od miejsca przeznaczenia
              i liczby potrzebnych maszyn możemy wysyłać pojedyncze palety
              lub kontenery dwudziesto- lub czterdziestostopowe.
            </p>
            <h2>Używane kopiarki w doskonałym stanie technicznym</h2>
            <p className="pb-10">
              Każda
              {' '}
              <strong>
                {' '}
                używana kopiarka jest starannie sprawdzana
                i testowana
                {' '}
              </strong>
              {' '}
              przez doświadczony zespół serwisantów.
              Szczegółowo sprawdzamy wszystkie podzespoły,
              aby rzeczowo ocenić stan techniczny i dokonać niezbędnych napraw.
              Po przeglądzie każda kserokopiarka i drukarka otrzymuje swój indywidualny paszport,
              w którym można sprawdzić stan licznika kopii, opis wykonanych napraw
              i charakterystykę stanu technicznego poszczególnych podzespołów.
              Nabywając u nas używane
              {' '}
              <a
                title="kserokopiarki poleasingowe"
                href="https://www.dks.pl/oferta"
                target="_self"
              >
                kserokopiarki poleasingowe
              </a>
              , otrzymujesz sprzęt wysokiej jakości, mającej potwierdzony stan techniczny
              i atrakcyjną cenę. Zapraszamy do współpracy!
            </p>
          </div>
        </div>
        <div className={flexWrap}>
          <div className={`${flexColHalfWidth} md:pr-10`}>
            <Image src="/static/export_1.webp" layout="responsive" alt="" width={540} height={338} />
          </div>
          <div className={flexColHalfWidth}>
            <p className="pb-10">
              DKS Ltd. is the leading supplier, exporter and buyer of used and new copiers in
              Poland - located in Gdansk ( Kowale ). Established in 1993 by 3 partners with an
              experience of over 30 years - Top Leader in Eastern Europe as Autorished
              Konica Minolta Distributor. With a total Team of over 180 Employees located
              in 12 largest Cities in Poland, we are proud to be the biggest private
              company in the used copier &amp; copier equipment Buisness.
            </p>
            <p>
              With over 30 years experience we were able to establish on trust and high service a
              strong network with our suppliers/ customers / dealers which are located in Poland,
              Europe, Middle East, Far East and Africa.
            </p>
          </div>
        </div>
        <div className="flex sm:flex-wrap-reverse sm:w-full md:max-w-screen-xl md:pb-10 pt-10">
          <div className={`${flexColHalfWidth} md:pr-10`}>
            <p className="pb-10">
              Our main export activity is trading used photocopiers of top major brands
              such as Konica Minolta, Ricoh, Canon, Xerox, Kyocera Mita, Sharp, HP,
              Brother &amp; Lexmark. Also we can offer a wide range of original supplies
              and spare parts for regular copiers, production and printing systems, faxes,
              printers and wide format machines.
            </p>
            <p>
              All our used copiers are stored in one central warehouse located in North Poland
              - Gdansk with an capacity of 3500m2 were we storage arround 4500 used copiers &amp;
              printers. This great location allows us to deliver sea containers in just 20 minutes
              to the port of Gdansk or Gdynia and arrive our warehouse in just 10 minutes from
              Gdansk Airport.
            </p>
          </div>
          <div className={`${flexColHalfWidth} md:pr-10`}>
            <Image src="/static/export_2.webp" layout="responsive" alt="" width={540} height={338} />
          </div>
        </div>
        <div className={flexWrap}>
          <div className={`${flexColHalfWidth}`}>
            <Image src="/static/export_3.webp" layout="responsive" alt="" width={540} height={338} />
          </div>
          <div className={`md:pl-10 ${flexColHalfWidth}`}>
            <p className="pb-10">
              On arrival each copier &amp; printer is tested by our high qualified technicians to
              check and provide best possible quality and to eliminate technicial problems.
              Each copier &amp; printer get it&#39;s own individual passport with data as copy
              counter, equipment, accessories and condition. Machines which leave our warehouse
              to their destination always contain any kind of possible test page / counter list.
            </p>
            <p>
              We can ship single pallets up to full truck loads and twenty or forty foot containers
              depending on the destination and number of machines you require.
            </p>
          </div>
        </div>
        <div className={flexWrap}>
          <div className="flex-col sm:w-full md:max-w-screen-xl md:pb-10">
            <p className="font-semibold">For spanish visitors</p>
            <p className="pb-10">
              DKS SL es el proveedor, exportador y comprador líder de copiadoras usadas y
              nuevas en Polonia, ubicado en Gdańsk (Kowale). Fundado en 1993 por 3 socios
              con una experiencia de más de 30 años - Líder superior en Europa del Este como
              Distribuidor Autorizado de Konica Minolta. Con un equipo total de más de 180
              empleados ubicados en las 12 ciudades más grandes de Polonia, estamos orgullosos
              de ser la compañía privada más grande en el equipo usado de copiadoras y
              copiadoras Buisness. Con más de 30 años de experiencia, pudimos establecer un
              alto servicio de confianza&nbsp; de una red sólida con nuestros proveedores
              / clientes / distribuidores ubicados en Polonia, Europa, Oriente Medio,
              Lejano Oriente y África.
            </p>
            <p>
              Nuestra principal actividad de exportación es el comercio de fotocopiadoras
              usadas de las principales marcas como Konica Minolta, Ricoh, Canon, Xerox,
              Kyocera Mita, Sharp, HP, Brother y Lexmark. También podemos ofrecer una amplia
              gama de suministros originales y piezas de recambio&nbsp; para las copiadoras
              regulares, los sistemas de producción e impresión, faxes, impresoras y máquinas
              de gran formato. Todas nuestras copiadoras usadas se encuentran en un almacén
              central ubicado en el norte de Polonia, en Gdańsk, con una capacidad de 3500 m2,
              donde&nbsp; hay cerca de 4500 copiadoras e impresoras de segunda mano.
              Esta excelente ubicación nos permite entregar los contenedores marítimos en
              solo 20 minutos al puerto de Gdańsk o Gdynia y llegar a nuestro almacén en solo
              10 minutos del aeropuerto de Gdańsk.A su llegada, nuestros técnicos altamente
              cualificados comprueban cada copiadora e impresora para verificar y proporcionar
              la mejor calidad posible y para eliminar eventuales problemas técnicos. Cada
              copiadora e impresora obtiene su propio pasaporte individual con datos como
              contador de copias, equipo, accesorios y condiciones. Las máquinas que salen de
              nuestro almacén a su destino siempre contienen una página de prueba /una&nbsp;
              lista de contador.Podemos enviar paletas individuales para cargas de camiones
              completos y contenedores de veinte o cuarenta pies,
              según el destino y la cantidad de máquinas que necesite.
            </p>
            <p className="font-semibold">For french visitors</p>
            <p className="pb-10">
              DKS SARL est le premier fournisseur, exportateur et acheteur de photocopieurs
              et imprimantes neufs et d&#39;occasion en Pologne, situé à Gdansk (Kowale). Fondé
              en 2005 par 3 associés avec plus de 30 ans d&#39;expérience, DKS occupe une position
              de leader en Europe de l&#39;Est en tant que Distributeur Agréé Konica Minolta, avec
              un effectif de plus 180 employés répartis dans les 12 &nbsp;principales villes en
              Pologne. Nous sommes très fiers d&#39;être la plus grande entreprise privée dans le
              secteur d&#39;activité des équipements, des photocopieurs
              et imprimantes d&#39;occasion.
              Avec plus de 25 ans d&#39;expérience et un niveau de qualité élevé des services, nous
              avons pu établir des relations fondées sur la confiance avec nos fournisseurs,
              clients et distributeurs en Pologne, Europe, Moyen-Orient et Extrême-Orient et en
              Afrique.
            </p>
            <p>
              Notre principale activité dans l&#39;export consiste
              à négocier des photocopieurs
              &nbsp;d&#39;occasion de plus grandes marques comme
              Konica Minolta, Ricoh, Canon, Xerox,
              Kyocera Mita, Sharp, HP, Brother et Lexmark.
              Nous sommes aussi capables de proposer
              une large gamme des fournitures originales,
              pièces de rechange authentiques conçues
              pour les imprimantes et photocopieurs,
              systèmes de production et &nbsp;d&#39;impression,
              des télécopieurs , des imprimantes et des imprimantes grand format.
              Tous les photocopieurs &nbsp;d&#39;occasion
              sont stockés dans notre entrepôt situé au nord
              de la Pologne – Gdansk avec une capacité
              de stockage &nbsp;de 3500m2, où nous stockons
              plus de 4500 photocopieurs et imprimantes d&#39;occasion.Notre
              localisation pratique nous
              permet d&#39;expédier des conteneurs maritimes &nbsp;en 20 minutes seulement
              jusqu&#39;au port à Gdansk ou Gdynia,et d&#39;arriver à notre entrepôt &nbsp;en
              seulement 10 minutes depuis l&#39;aéroport &nbsp;de Gdansk.A l&#39;arrivée,
              chaque &nbsp;photocopieur et imprimante est testé par un technicien qualifié afin
              d&#39;offrir de la meilleure qualité qui soit et d’éliminer des problèmes
              d&#39;ordre technique.&nbsp; Chaque photocopieur et imprimante obtient son propre
              passeport avec les données comme le nombre de copies au compteur,
              l&#39;équipement, les accessoires et la condition.&nbsp; Les machines q
              ui quittent notre
              entrepôt, sont toujours dotées de la liste des compteurs et des pages de test.
              Nous sommes en mesure d&#39;assurer la livraison,de quelques palettes jusqu&#39;à
              un camion plein, ou de conteneurs universels de 20 et 40 pieds, en fonction de la
              destination &nbsp;et du nombre de machines souhaitées.
            </p>
          </div>
        </div>
      </div>

      <section className="w-full bg-dks-light-gray px-4 xl:px-0">
        <div className="flex flex-col max-w-screen-xl md:mx-auto py-20">
          <div className="w-full sm:px-4">
            <span className="font-bold text-4xl block pb-16">{TITLE}</span>
            <div className="flex">
              <div className="flex-col md:w-1/12">
                <PeopleIcon className="text-7xl sm:text-5xl sm:pr-2 text-dks-red" />
              </div>
              <div className="flex-col md:w-11/12">
                <h2 className="font-bold text-xl pb-3">Contact with Export Department for foreign companies:</h2>
                <strong>Telephone:</strong>
                <a href="tel:+48 58 309 03 07 ext. 7" className="pl-2 text-dks-sea-blue hover:text-dks-red">
                  +48 58 309 03 07 ext. 7
                </a>
                <br />
                <div className="flex sm:flex-wrap">
                  <strong>E-mail:</strong>
                  <a href="mailto:office@dks.pl" className="px-2 text-dks-red hover:text-dks-sea-blue">office@dks.pl</a>
                  <a href="mailto:export.copiers@dks.pl" className="text-dks-red hover:text-dks-sea-blue">export.copiers@dks.pl</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
