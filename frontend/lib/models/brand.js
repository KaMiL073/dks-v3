import backend from '../api/directus';

export default async function getBrandInfo(brand) {
  return backend.get('/items/brands', {
    params: {
      fields: [
        '*',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
        name: {
          _eq: brand,
        },
      },
    },
  }).then((resp) => resp.data.data[0] || null);
}

export async function getBrandsAsFilter(brandsUuidsArray) {
  return backend.get('/items/brands', {
    params: {
      fields: [
        '*',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
        id: {
          _in: brandsUuidsArray,
        },
      },
    },
  }).then((resp) => {
    const options = resp.data.data.map((brand) => ({ text: brand.name, value: brand.name }));
    return {
      name: 'brand',
      displayName: 'Producent',
      interface: 'select-dropdown',
      options,
    };
  });
}
