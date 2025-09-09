import backend from '../api/directus';

export default async function getProducts(collectionName) {
  const params = {
    fields: [
      '*',
      'type.collection',
      'type.item.*',
    ],
    filter: {
      status: {
        _in: ['published'],
      },
    },
  };

  if (collectionName) {
    params.filter.type = {
      collection: {
        _eq: collectionName,
      },
    };
  }
  
  return backend.get('/items/products', { params }).then((resp) => resp.data.data);
}

export async function getProduct(slug) {
  return backend.get('/items/products', {
    params: {
      fields: [
        '*',
        'type.item.*',
        'specifications.specifications_id.*',
        'images.*',
        'main_image.*',
        'brand.name',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
        slug: {
          _eq: slug,
        },
      },
    },
  }).then((resp) => resp.data.data[0]);
}

export async function getProductsWithMainImage({ brand, filters, collectionName }) {
  const params = {
    fields: [
      '*',
      'type.collection',
      'type.item.*',
      'main_image.id',
      'brand.id',
      'brand.logo',
      'brand.name',
    ],
    filter: {
      status: {
        _in: ['published'],
      },
    },
    sort: 'weight',
    limit: -1,
  };

  if (brand) {
    params.filter.brand = {
      name: {
        _eq: brand,
      },
    };
  }

  if (collectionName) {
    params.filter.type = {
      collection: {
        _eq: collectionName,
      },
    };
  }

  if (filters) {
    // eslint-disable-next-line no-underscore-dangle
    params.filter._and = filters.map((filter) => ({
      type: {
        [`item:${collectionName}`]: filter,
      },
    }));
  }

  return backend.get('/items/products', { params }).then((resp) => resp.data.data);
}

export async function getFiltersOfProductsType(collectionName) {
  return backend.get(`/fields/${collectionName}`)
    .then((resp) => resp.data.data.filter((item) => item.field !== 'id').map((field) => ({
      name: field.field,
      displayName: field.meta.translations?.[0].translation || null,
      interface: field.meta.interface,
      options: field.meta.options.choices || [],
    }))).catch(() => []);
}

export async function getProductsSiteMap() {
  return backend.get('/items/products', {
    params: {
      fields: [
        '*',
        'type.collection',
        'type.item.*',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
      },
    },
  }).then((resp) => resp.data.data);
}
