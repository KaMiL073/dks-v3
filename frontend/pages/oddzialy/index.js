import Layout from '../../components/layouts/layout';
import HeaderTop from '../../components/elements/headerTop';
import Breadcrumb from '../../components/elements/breadcrumb';
import DepartmentsList from '../../components/elements/departmentsList';

const TITLE = 'Oddziały - DKS';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function Oddzialy() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Oddziały" />
      <div className="w-full md:max-w-screen-xl pb-9">
        <div className="flex-col w-full">
          <Breadcrumb />
          <iframe title="Dks mapa" loading="lazy" src="static/map/index.html" width="100%" height="540px" />
          <DepartmentsList />
        </div>
      </div>
    </Layout>
  );
}
