'use client';

import { useState } from 'react';
import type { ShopifyProduct } from '@/types';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';

interface ProductViewProps {
  product: ShopifyProduct;
}

export function ProductView({ product }: ProductViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const images = product.images.nodes.length > 0
    ? product.images.nodes
    : product.featuredImage ? [product.featuredImage] : [];
    
  const activeImageUrl = images[activeIndex]?.url || '';

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Gallery */}
      <ProductGallery 
        product={product} 
        externalActiveIndex={activeIndex}
        onIndexChange={setActiveIndex}
      />

      {/* Product info + actions */}
      <ProductInfo 
        product={product} 
        customGarmentImageUrl={activeImageUrl}
      />
    </div>
  );
}
