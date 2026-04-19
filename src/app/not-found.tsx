import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-8xl font-medium text-cream-200 mb-6">404</p>
      <h1 className="font-display text-4xl text-charcoal-900 mb-4">
        Página não encontrada
      </h1>
      <p className="text-charcoal-600 text-sm mb-10 max-w-sm">
        A página que você procura não existe ou foi movida.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">
          Ir para início
          <ArrowRight size={16} />
        </Link>
        <Link href="/shop" className="btn-outline">
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
