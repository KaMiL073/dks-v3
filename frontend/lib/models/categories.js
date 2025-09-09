// import backend from '../api/directus';

const categories = [
  'rozwiazania-dla-biura',
  'rozwiazania-dla-poligrafii',
  'rozwiazania-wielkoformatowe',
  'oprogramowanie-dla-biura',
  'oprogramowanie-dla-poligrafii-i-cad-gis',
  'materialy-eksploatacyjne',
  'kamery-termowizyjne',
  'laptopy',
  'tablice-interaktywne',
  'komputery'
];

export default function getCategories() {
  /*
  return backend.get('/collections')
    .then((resp) => resp.data.data.filter((item) => productsTypes.indexOf(item.collection) > -1));
  */
  return categories;
}

export function categorySlugToCollection(categoryName) {
  const map = {
    'rozwiazania-dla-biura': 'office_solutions',
    'rozwiazania-dla-poligrafii': 'printing_solutions',
    'rozwiazania-wielkoformatowe': 'large_format_solutions',
    'oprogramowanie-dla-biura': 'office_software',
    'oprogramowanie-dla-poligrafii-i-cad-gis': 'printing_software',
    'materialy-eksploatacyjne': 'consumables',
    'kamery-termowizyjne': 'thermal_imagers',
    'laptopy': 'laptops',
    'komputery': 'computers',
    'tablice-interaktywne': 'multiboards',
  };

  return map[categoryName];
}

export function categorySlugToCollectionPl(categoryName) {
  const map = {
    office_solutions: 'rozwiazania-dla-biura',
    printing_solutions: 'rozwiazania-dla-poligrafii',
    large_format_solutions: 'rozwiazania-wielkoformatowe',
    office_software: 'oprogramowanie-dla-biura',
    printing_software: 'oprogramowanie-dla-poligrafii-i-cad-gis',
    consumables: 'materialy-eksploatacyjne',
    thermal_imagers: 'kamery-termowizyjne',
    laptops: 'laptopy',
    computers: 'komputery',
    multiboards: 'tablice-interaktywne',
  };

  return map[categoryName];
}
