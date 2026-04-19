// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Shopify Client & GraphQL Queries
// ─────────────────────────────────────────────────────────────

import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  SortOption,
} from '@/types';

// ── Client ────────────────────────────────────────────────────

function createClient() {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !token) {
    return null;
  }

  return createStorefrontApiClient({
    storeDomain: domain,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2025-07',
    publicAccessToken: token,
  });
}

let _client: ReturnType<typeof createStorefrontApiClient> | null = null;

function getClient() {
  if (!_client) {
    _client = createClient();
  }
  return _client;
}

// ── Fragments ─────────────────────────────────────────────────

const IMAGE_FRAGMENT = `
  fragment ImageFields on Image {
    id
    url
    altText
    width
    height
  }
`;

const PRICE_FRAGMENT = `
  fragment PriceFields on MoneyV2 {
    amount
    currencyCode
  }
`;

const PRODUCT_VARIANT_FRAGMENT = `
  ${PRICE_FRAGMENT}
  fragment VariantFields on ProductVariant {
    id
    title
    availableForSale
    price { ...PriceFields }
    compareAtPrice { ...PriceFields }
    selectedOptions { name value }
    image { url altText width height }
  }
`;

const PRODUCT_FRAGMENT = `
  ${IMAGE_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    vendor
    tags
    featuredImage { ...ImageFields }
    images(first: 6) { nodes { ...ImageFields } }
    priceRange {
      minVariantPrice { ...PriceFields }
      maxVariantPrice { ...PriceFields }
    }
    options { id name values }
    variants(first: 20) { nodes { ...VariantFields } }
  }
`;

// ── Queries ───────────────────────────────────────────────────

const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      nodes { ...ProductFields }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) { ...ProductFields }
  }
`;

const GET_COLLECTIONS_QUERY = `
  ${IMAGE_FRAGMENT}
  query GetCollections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image { ...ImageFields }
      }
    }
  }
`;

const GET_COLLECTION_WITH_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollection($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        nodes { ...ProductFields }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                selectedOptions { name value }
                price { amount currencyCode }
                image { url altText width height }
                product {
                  id
                  handle
                  title
                  featuredImage { url altText width height }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                selectedOptions { name value }
                price { amount currencyCode }
                image { url altText width height }
                product {
                  id
                  handle
                  title
                  featuredImage { url altText width height }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

const UPDATE_CART_MUTATION = `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                image { url altText width height }
                product { id handle title }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                image { url altText width height }
                product { id handle title }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
        totalTaxAmount { amount currencyCode }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions { name value }
              price { amount currencyCode }
              image { url altText width height }
              product {
                id
                handle
                title
                featuredImage { url altText width height }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Helper: Sort key mapping ──────────────────────────────────

function getSortKey(sortBy: SortOption) {
  const map: Record<SortOption, { sortKey: string; reverse: boolean }> = {
    RELEVANCE: { sortKey: 'RELEVANCE', reverse: false },
    PRICE_ASC: { sortKey: 'PRICE', reverse: false },
    PRICE_DESC: { sortKey: 'PRICE', reverse: true },
    CREATED_AT_DESC: { sortKey: 'CREATED_AT', reverse: true },
    BEST_SELLING: { sortKey: 'BEST_SELLING', reverse: false },
  };
  return map[sortBy];
}

// ── API Functions ─────────────────────────────────────────────

export async function getProducts(options: {
  first?: number;
  sortBy?: SortOption;
  query?: string;
}): Promise<ShopifyProduct[]> {
  const client = getClient();
  if (!client) return [];

  const { first = 24, sortBy = 'RELEVANCE', query } = options;
  const { sortKey, reverse } = getSortKey(sortBy);

  const { data, errors } = await client.request(GET_PRODUCTS_QUERY, {
    variables: { first, sortKey, reverse, query },
  });

  if (errors) throw new Error(errors.message);
  return data.products.nodes;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const client = getClient();
  if (!client) return null;

  const { data, errors } = await client.request(GET_PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle },
  });

  if (errors) throw new Error(errors.message);
  return data.productByHandle;
}

export async function getCollections(first = 10): Promise<ShopifyCollection[]> {
  const client = getClient();
  if (!client) return [];

  const { data, errors } = await client.request(GET_COLLECTIONS_QUERY, {
    variables: { first },
  });

  if (errors) throw new Error(errors.message);
  return data.collections.nodes;
}

export async function getCollectionWithProducts(
  handle: string,
  options: { first?: number; sortBy?: SortOption } = {}
): Promise<ShopifyCollection | null> {
  const client = getClient();
  if (!client) return null;

  const { first = 24, sortBy = 'BEST_SELLING' } = options;
  const { sortKey, reverse } = getSortKey(sortBy);

  const { data, errors } = await client.request(
    GET_COLLECTION_WITH_PRODUCTS_QUERY,
    { variables: { handle, first, sortKey, reverse } }
  );

  if (errors) throw new Error(errors.message);
  return data.collectionByHandle;
}

export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
  const client = getClient();
  if (!client) throw new Error('Shopify not configured');

  const { data, errors } = await client.request(CREATE_CART_MUTATION, {
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
  });

  if (errors) throw new Error(errors.message);
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<ShopifyCart> {
  const client = getClient();
  if (!client) throw new Error('Shopify not configured');

  const { data, errors } = await client.request(ADD_TO_CART_MUTATION, {
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  });

  if (errors) throw new Error(errors.message);
  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const client = getClient();
  if (!client) throw new Error('Shopify not configured');

  const { data, errors } = await client.request(UPDATE_CART_MUTATION, {
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });

  if (errors) throw new Error(errors.message);
  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const client = getClient();
  if (!client) throw new Error('Shopify not configured');

  const { data, errors } = await client.request(REMOVE_FROM_CART_MUTATION, {
    variables: { cartId, lineIds: [lineId] },
  });

  if (errors) throw new Error(errors.message);
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const client = getClient();
  if (!client) return null;

  const { data, errors } = await client.request(GET_CART_QUERY, {
    variables: { cartId },
  });

  if (errors) throw new Error(errors.message);
  return data.cart;
}

// ── Price Formatting ──────────────────────────────────────────

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
