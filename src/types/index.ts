// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Type Definitions
// ─────────────────────────────────────────────────────────────

// ── Shopify Types ─────────────────────────────────────────────

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyPrice;
  maxVariantPrice: ShopifyPrice;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  priceRange: ShopifyPriceRange;
  options: ShopifyProductOption[];
  variants: { nodes: ShopifyProductVariant[] };
  tags: string[];
  productType: string;
  vendor: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: { nodes: ShopifyProduct[] };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: {
    nodes: ShopifyCartLine[];
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: ShopifyProduct;
    image: ShopifyImage | null;
    price: ShopifyPrice;
  };
  cost: {
    totalAmount: ShopifyPrice;
  };
}

// ── fashn.ai Types ────────────────────────────────────────────

export type FashnModelName =
  | 'tryon-v1.6'
  | 'tryon-max'
  | 'product-to-model'
  | 'face-to-model'
  | 'model-create'
  | 'model-swap'
  | 'background-remove';

export type FashnGarmentCategory = 'auto' | 'tops' | 'bottoms' | 'one-pieces';
export type FashnModerationLevel = 'conservative' | 'permissive' | 'none';
export type FashnQuality = 'speed' | 'balanced' | 'quality';

export interface FashnTryOnInput {
  model_image: string;       // URL or base64
  garment_image: string;     // URL or base64
  category?: FashnGarmentCategory;
  moderation_level?: FashnModerationLevel;
  quality?: FashnQuality;
  num_samples?: number;      // 1-4
  return_base64?: boolean;
}

export interface FashnRunRequest {
  model_name: FashnModelName;
  inputs: FashnTryOnInput;
}

export interface FashnRunResponse {
  id: string;
  status: 'starting' | 'processing' | 'completed' | 'failed';
  output?: string[];
  error?: string;
}

export interface FashnStatusResponse {
  id: string;
  status: 'starting' | 'processing' | 'completed' | 'failed';
  output?: string[];
  error?: string | null;
}

// ── App State Types ───────────────────────────────────────────

export type TryOnStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export interface TryOnState {
  status: TryOnStatus;
  predictionId: string | null;
  modelImageUrl: string | null;
  garmentImageUrl: string | null;
  resultImageUrl: string | null;
  error: string | null;
}

export interface CartState {
  cartId: string | null;
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
}

export interface FilterState {
  collections: string[];
  priceRange: [number, number];
  sortBy: SortOption;
  searchQuery: string;
}

export type SortOption =
  | 'RELEVANCE'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'CREATED_AT_DESC'
  | 'BEST_SELLING';

// ── UI Types ──────────────────────────────────────────────────

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
