import Link from 'next/link';
import SupportAgentSharpIcon from '@mui/icons-material/SupportAgentSharp';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
// import UnorderedList from '../components/elements/unorderedList';
import ServiceCallFormAlternative from '../components/elements/serviceCallFormAlternative';
import styles from '../styles/pages.module.scss';

const TITLE = 'Naprawa drukarek laserowych i kserokopiarek: zgłoszenia serwisowe';
const DESCRIPTION = 'Jeżeli twoja maszyna przestała działać, skorzystaj z elektronicznego formularza i zgłoś awarię. Naprawiamy drukarki laserowe i kserokopiarki wszystkich marek. ';

export default function ServiceCall() {


  return (
    <Layout title={TITLE} description={DESCRIPTION} useRecaptcha> 
      <HeaderTop title="Zgłoszenie serwisowe" imgSrc="/static/header_serwis.webp" />
      <div className="md:max-w-screen-xl sm:px-3">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8 px-4 xl:px-0">
          <div className="md:w-3/4 m-auto">

            <h4 className="font-bold text-2xl py-10">Formularz zgłoszeniowy</h4>
            <ServiceCallFormAlternative />
          </div>
        </div>
      </div>
    </Layout>
  );
}
