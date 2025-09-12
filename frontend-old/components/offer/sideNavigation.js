import SideMenu from '../navigation/common/sideMenu';

export default function SideNavigation() {
  const elements = [
    { href: '/oferta/rozwiazania-dla-biura', text: 'Rozwiązania dla biura' },
    { href: '/oferta/rozwiazania-dla-poligrafii', text: 'Rozwiązania dla poligrafii' },
    { href: '/oferta/rozwiazania-wielkoformatowe', text: 'Rozwiązania wielkoformatowe' },
    { href: '/oferta/materialy-eksploatacyjne', text: 'Materiały eksploatacyjne' },
    { href: '/oferta/oprogramowanie-dla-biura', text: 'Oprogramowanie dla biura' },
    { href: '/oferta/oprogramowanie-dla-poligrafii-i-cad-gis', text: 'Oprogramowanie dla poligrafii i CAD/GIS' },
  ];

  return (
    <SideMenu
      elements={elements}
      title="OFERTA"
      template="bright"
    />
  );
}
