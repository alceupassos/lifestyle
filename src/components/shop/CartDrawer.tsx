'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/shopify';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isOpen, isLoading, closeCart, setCart, setLoading } = useCartStore();

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) return;
    setLoading(true);
    try {
      const res = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: quantity <= 0 ? 'remove' : 'update',
          cartId: cart.id,
          lineId,
          quantity,
        }),
      });
      const data = await res.json();
      if (data.cart) setCart(data.cart);
    } finally {
      setLoading(false);
    }
  };

  const lines = cart?.lines?.nodes || [];
  const isEmpty = lines.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-charcoal-900/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream-50 flex flex-col shadow-lg transition-transform duration-400',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ borderLeft: '1px solid rgba(15,15,13,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-charcoal-900" />
            <h2 className="font-display text-xl text-charcoal-900">Carrinho</h2>
            {!isEmpty && (
              <span className="font-mono text-xs text-charcoal-600 bg-cream-200 px-2 py-0.5 rounded-sm">
                {cart?.totalQuantity} {cart?.totalQuantity === 1 ? 'item' : 'itens'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 transition-all rounded-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
              <div
                className="w-20 h-20 flex items-center justify-center bg-cream-200"
                style={{ borderRadius: '2px' }}
              >
                <ShoppingBag size={32} className="text-charcoal-600 opacity-40" />
              </div>
              <div>
                <p className="font-display text-xl text-charcoal-900 mb-2">
                  Carrinho vazio
                </p>
                <p className="text-charcoal-600 text-sm">
                  Explore nosso catálogo e encontre peças incríveis.
                </p>
              </div>
              <button onClick={closeCart}>
                <Link href="/shop" className="btn-primary text-sm py-3 px-6">
                  Explorar catálogo
                  <ArrowRight size={14} />
                </Link>
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-black/6">
              {lines.map((line) => {
                const product = line.merchandise.product;
                const image = line.merchandise.image || product.featuredImage;
                const price = formatPrice(
                  line.merchandise.price.amount,
                  line.merchandise.price.currencyCode
                );

                return (
                  <li key={line.id} className={cn('p-6 flex gap-4 transition-opacity', isLoading && 'opacity-50')}>
                    {/* Image */}
                    <Link
                      href={`/product/${product.handle}`}
                      onClick={closeCart}
                      className="relative w-20 h-24 flex-shrink-0 bg-cream-200 overflow-hidden"
                      style={{ borderRadius: '2px' }}
                    >
                      {image && (
                        <Image
                          src={image.url}
                          alt={image.altText || product.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${product.handle}`}
                        onClick={closeCart}
                        className="font-body text-sm font-medium text-charcoal-900 hover:text-charcoal-600 transition-colors line-clamp-2"
                      >
                        {product.title}
                      </Link>

                      {line.merchandise.selectedOptions.map((opt) => (
                        <p key={opt.name} className="font-mono text-xs text-charcoal-600 mt-0.5">
                          {opt.name}: {opt.value}
                        </p>
                      ))}

                      <p className="font-body text-sm font-medium text-charcoal-900 mt-2">
                        {price}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-0 mt-3">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center bg-cream-200 hover:bg-cream-300 transition-colors text-charcoal-700"
                          style={{ borderRadius: '2px 0 0 2px' }}
                        >
                          {line.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center bg-cream-100 font-mono text-xs text-charcoal-900 border-x border-black/8">
                          {line.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center bg-cream-200 hover:bg-cream-300 transition-colors text-charcoal-700"
                          style={{ borderRadius: '0 2px 2px 0' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && cart && (
          <div className="border-t border-black/8 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-charcoal-600">Subtotal</span>
              <span className="font-display text-xl text-charcoal-900">
                {formatPrice(
                  cart.cost.subtotalAmount.amount,
                  cart.cost.subtotalAmount.currencyCode
                )}
              </span>
            </div>
            <p className="font-mono text-xs text-charcoal-600">
              Frete e impostos calculados no checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className="btn-primary w-full justify-center"
            >
              Finalizar compra
              <ArrowRight size={16} />
            </a>
            <button
              onClick={closeCart}
              className="w-full text-center font-mono text-xs text-charcoal-600 hover:text-charcoal-900 transition-colors py-1"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
