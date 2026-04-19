import { Suspense } from 'react';
import { CatalogContent } from './CatalogContent';

export const metadata = {
  title: 'Catálogo | Life Style — Moda Masculina & Feminina',
  description:
    'Explore nossa coleção completa de moda com filtros por categoria. Bermuda, Blazer, Camisa, Calça, Jaqueta e muito mais. Atacado e varejo no Brás, São Paulo.',
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogSkeleton() {
  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh' }}>
      <div style={{ background: '#1A1A18', height: '36px' }} />
      <div style={{ background: '#FAFAF8', borderBottom: '1px solid #E8E4DC', height: '64px' }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ height: '36px', width: '200px', background: '#F0EDE6', marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '3/4', background: '#F0EDE6' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
