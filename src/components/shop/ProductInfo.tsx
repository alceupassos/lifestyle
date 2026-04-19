'use client';

import { useState } from 'react';
import { ShoppingBag, Camera, Sparkles, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';
import { useCartStore } from '@/hooks/useCart';
import { TryOnModal } from '@/components/tryon/TryOnModal';
import { cn } from '@/lib/utils';
import type { ShopifyProduct, ShopifyProductVariant } from '@/types';

export function ProductInfo({ product }: { product: ShopifyProduct }) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]))
  );
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const { cart, cartId, setCart, setCartId, openCart, setLoading } = useCartStore();

  // Find selected variant
  const selectedVariant = product.variants.nodes.find((v) =>
    v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
  ) || product.variants.nodes[0];

  const price = formatPrice(
    selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
    selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode
  );

  const compareAtPrice = selectedVariant?.compareAtPrice;
  const isOnSale = compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(selectedVariant.price.amount);

  const isAvailable = selectedVariant?.availableForSale ?? false;

  const garmentImageUrl = product.featuredImage?.url || product.images.nodes[0]?.url || '';

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return;
    setAddingToCart(true);
    setLoading(true);

    try {
      let currentCartId = cartId;
      let updatedCart;

      if (!currentCartId) {
        const res = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            variantId: selectedVariant.id,
            quantity: 1,
          }),
        });
        const data = await res.json();
        updatedCart = data.cart;
        setCartId(updatedCart.id);
      } else {
        const res = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add',
            cartId: currentCartId,
            variantId: selectedVariant.id,
            quantity: 1,
          }),
        });
        const data = await res.json();
        updatedCart = data.cart;
      }

      setCart(updatedCart);
      setAddedToCart(true);
      openCart();
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAddingToCart(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Vendor / type */}
      <div>
        <p className="section-label">
          {product.vendor || product.productType}
        </p>
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl lg:text-5xl text-charcoal-900 leading-tight">
        {product.title}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="font-display text-3xl text-charcoal-900">{price}</span>
        {isOnSale && compareAtPrice && (
          <>
            <span className="font-body text-lg text-charcoal-600 line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
            <span className="badge badge-sale text-xs">Sale</span>
          </>
        )}
      </div>

      <div className="divider-gold" />

      {/* Variant options */}
      {product.options.map((option) => (
        <div key={option.id}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-sm font-medium text-charcoal-900">{option.name}</p>
            <p className="font-mono text-xs text-charcoal-600">{selectedOptions[option.name]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isColor = option.name.toLowerCase() === 'cor' || option.name.toLowerCase() === 'color';

              if (isColor) {
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                    title={value}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all duration-200',
                      isSelected ? 'border-charcoal-900 scale-110' : 'border-transparent hover:border-charcoal-600'
                    )}
                    style={{ background: colorToHex(value) }}
                  />
                );
              }

              return (
                <button
                  key={value}
                  onClick={() => setSelectedOptions((prev) => ({ ...prev, [option.name]: value }))}
                  className={cn(
                    'px-4 py-2 font-body text-sm border transition-all duration-200',
                    isSelected
                      ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                      : 'bg-cream-50 text-charcoal-700 border-black/15 hover:border-charcoal-900'
                  )}
                  style={{ borderRadius: '2px' }}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock status */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            isAvailable ? 'bg-sage-500' : 'bg-terracotta-500'
          )}
        />
        <p className="font-mono text-xs text-charcoal-600">
          {isAvailable ? 'Em estoque' : 'Esgotado'}
        </p>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || addingToCart}
          className={cn(
            'btn-primary w-full justify-center py-4',
            (!isAvailable || addingToCart) && 'opacity-50 cursor-not-allowed pointer-events-none',
            addedToCart && 'bg-sage-500'
          )}
        >
          {addedToCart ? (
            <>
              <Check size={18} />
              Adicionado ao carrinho!
            </>
          ) : addingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-cream-50/40 border-t-cream-50 rounded-full animate-spin" />
              Adicionando...
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              {isAvailable ? 'Adicionar ao carrinho' : 'Indisponível'}
            </>
          )}
        </button>

        {/* Try-on button */}
        {garmentImageUrl && (
          <button
            onClick={() => setTryOnOpen(true)}
            className="btn-gold w-full justify-center py-4"
          >
            <Camera size={18} />
            Experimentar virtualmente
            <Sparkles size={14} className="ml-auto" />
          </button>
        )}
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Frete grátis', sub: 'Acima de R$299' },
          { label: 'Troca fácil', sub: '30 dias' },
          { label: 'Pagamento', sub: 'Seguro SSL' },
        ].map(({ label, sub }) => (
          <div
            key={label}
            className="text-center p-3 bg-cream-100"
            style={{ borderRadius: '2px' }}
          >
            <p className="font-body text-xs font-medium text-charcoal-900">{label}</p>
            <p className="font-mono text-xs text-charcoal-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {product.description && (
        <div className="border-t border-black/8 pt-6">
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <p className="font-body text-sm font-medium text-charcoal-900">Descrição</p>
            {descExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {descExpanded && (
            <div
              className="mt-4 font-body text-sm text-charcoal-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          )}
        </div>
      )}

      {/* Tags */}
      {product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs text-charcoal-600 bg-cream-200 px-2 py-1"
              style={{ borderRadius: '2px' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Try-on Modal */}
      {garmentImageUrl && (
        <TryOnModal
          isOpen={tryOnOpen}
          onClose={() => setTryOnOpen(false)}
          garmentImageUrl={garmentImageUrl}
          garmentName={product.title}
        />
      )}
    </div>
  );
}

function colorToHex(colorName: string): string {
  const map: Record<string, string> = {
    preto: '#0F0F0D', negro: '#0F0F0D', black: '#0F0F0D',
    branco: '#FAFAFA', white: '#FAFAFA',
    azul: '#3B6EA5', blue: '#3B6EA5',
    vermelho: '#C0392B', red: '#C0392B',
    verde: '#27AE60', green: '#27AE60',
    amarelo: '#F1C40F', yellow: '#F1C40F',
    rosa: '#E91E8C', pink: '#E91E8C',
    cinza: '#95A5A6', gray: '#95A5A6', grey: '#95A5A6',
    bege: '#D4B896', beige: '#D4B896',
    marrom: '#8B6347', brown: '#8B6347',
    caramelo: '#C17B5C',
  };
  return map[colorName.toLowerCase()] || '#C2B5A5';
}
