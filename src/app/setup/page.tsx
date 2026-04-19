// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Setup Guide Page (/setup)
// ─────────────────────────────────────────────────────────────

import { CheckCircle2, ExternalLink, Code, Key, Store, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configuração',
  description: 'Guia de configuração do LIFE STYLE no BRÁS com Shopify e fashn.ai',
};

export default function SetupPage() {
  const steps = [
    {
      icon: Store,
      title: '1. Criar conta Shopify',
      color: 'var(--sage-400)',
      items: [
        'Acesse partners.shopify.com e crie uma conta de parceiro (grátis)',
        'Crie uma Development Store para testes',
        'No Partner Dashboard: Apps → Create App → Custom App',
        'Copie o Client ID e Client Secret',
        'Em Admin API Access: conceda leitura de Products, Inventory, Orders',
        'Em Storefront API: ative storefront:products:read e cart mutations',
      ],
      code: `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxx
SHOPIFY_ADMIN_API_TOKEN=shpat_xxx
SHOPIFY_API_VERSION=2026-04`,
    },
    {
      icon: Sparkles,
      title: '2. Configurar fashn.ai',
      color: 'var(--gold-400)',
      items: [
        'Crie conta em fashn.ai',
        'Acesse Settings → API → + Create new API key',
        'Compre créditos (a partir de US$7,50)',
        'Modelos disponíveis: tryon-v1.6, product-to-model, background-remove',
        'Cada try-on consome créditos conforme qualidade escolhida',
        'Dashboard de monitoramento em tempo real disponível',
      ],
      code: `FASHN_API_KEY=fa-xxxxxxxxxxxxxxxxxxxxxxxx`,
    },
    {
      icon: Code,
      title: '3. Instalação do projeto',
      color: 'var(--terracotta-400)',
      items: [
        'Clone ou baixe o projeto LIFE STYLE no BRÁS',
        'Copie .env.example para .env.local',
        'Preencha todas as variáveis de ambiente',
        'Execute npm install para instalar dependências',
        'Execute npm run dev para iniciar em desenvolvimento',
        'Acesse http://localhost:3000',
      ],
      code: `cp .env.example .env.local
# Edite .env.local com seus valores
npm install
npm run dev`,
    },
    {
      icon: Key,
      title: '4. Deploy (Vercel)',
      color: 'var(--charcoal-600)',
      items: [
        'Crie conta na Vercel (vercel.com)',
        'Conecte seu repositório GitHub',
        'Configure as variáveis de ambiente no painel da Vercel',
        'Deploy automático a cada push na branch main',
        'Configure domínio personalizado se necessário',
        'A Vercel detecta Next.js automaticamente, sem configuração extra',
      ],
      code: `npx vercel deploy
# ou conecte via GitHub no painel vercel.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-charcoal-900 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <p className="section-label text-gold-400 mb-4">Documentação</p>
          <h1 className="font-display text-5xl text-cream-50 mb-4">
            Configuração do LIFE STYLE no BRÁS
          </h1>
          <p className="text-charcoal-600 text-lg leading-relaxed max-w-2xl">
            Siga os passos abaixo para configurar completamente sua loja com
            virtual try-on por IA.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="https://shopify.dev/docs/api/storefront"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cream-50 hover:text-gold-400 transition-colors font-mono"
            >
              Shopify Docs <ExternalLink size={12} />
            </a>
            <span className="text-charcoal-600">·</span>
            <a
              href="https://docs.fashn.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cream-50 hover:text-gold-400 transition-colors font-mono"
            >
              fashn.ai Docs <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {steps.map(({ icon: Icon, title, color, items, code }) => (
          <div
            key={title}
            className="bg-cream-100 border border-black/8 overflow-hidden"
            style={{ borderRadius: '2px' }}
          >
            {/* Step header */}
            <div className="flex items-center gap-4 p-6 border-b border-black/8">
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ background: color + '22', borderRadius: '2px' }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h2 className="font-display text-2xl text-charcoal-900">{title}</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Checklist */}
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color }} />
                    <p className="font-body text-sm text-charcoal-700 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>

              {/* Code block */}
              <div
                className="bg-charcoal-900 p-5 overflow-x-auto"
                style={{ borderRadius: '2px' }}
              >
                <pre className="font-mono text-xs text-cream-200 leading-relaxed whitespace-pre-wrap">
                  {code}
                </pre>
              </div>
            </div>
          </div>
        ))}

        {/* Architecture overview */}
        <div className="bg-cream-100 border border-black/8 p-6" style={{ borderRadius: '2px' }}>
          <h2 className="font-display text-2xl text-charcoal-900 mb-6">
            Arquitetura do projeto
          </h2>
          <div
            className="bg-charcoal-900 p-5 overflow-x-auto"
            style={{ borderRadius: '2px' }}
          >
            <pre className="font-mono text-xs text-cream-200 leading-relaxed">{`
src/
├── app/
│   ├── page.tsx                  # Homepage editorial
│   ├── layout.tsx                # Layout global (Navbar, CartDrawer)
│   ├── shop/page.tsx             # Catálogo com filtros
│   ├── product/[handle]/         # Página de produto
│   ├── search/page.tsx           # Busca
│   ├── setup/page.tsx            # Esta página
│   └── api/
│       ├── tryon/route.ts        # POST → fashn.ai (protege API key)
│       ├── tryon/status/route.ts # GET polling de status
│       └── shopify/cart/route.ts # Operações de carrinho
│
├── components/
│   ├── layout/Navbar.tsx         # Navegação com carrinho
│   ├── shop/
│   │   ├── ProductCard.tsx       # Card de produto com hover
│   │   ├── ProductGallery.tsx    # Galeria com zoom e navegação
│   │   ├── ProductInfo.tsx       # Info + variantes + Add to Cart
│   │   ├── ShopFilters.tsx       # Sidebar de filtros
│   │   └── CartDrawer.tsx        # Drawer do carrinho
│   ├── tryon/
│   │   └── TryOnModal.tsx        # Modal completo de try-on
│   └── ui/
│       ├── Toaster.tsx           # Notificações
│       └── Skeletons.tsx         # Loading states
│
├── hooks/
│   ├── useCart.ts                # Zustand store do carrinho
│   └── useTryOn.ts               # Hook de virtual try-on
│
├── lib/
│   ├── shopify.ts                # Cliente Shopify + queries GraphQL
│   ├── fashn.ts                  # Cliente fashn.ai
│   └── utils.ts                  # Utilitários
│
└── types/index.ts                # Tipos TypeScript completos
            `}</pre>
          </div>
        </div>

        {/* Next steps */}
        <div
          className="p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, var(--gold-400), var(--gold-500))',
            borderRadius: '2px',
          }}
        >
          <h2 className="font-display text-2xl text-charcoal-900 mb-3">
            Pronto para começar?
          </h2>
          <p className="font-body text-sm text-charcoal-700 mb-6 max-w-md mx-auto">
            Configure as variáveis de ambiente e conecte sua loja Shopify para
            ter o LIFE STYLE no BRÁS funcionando em minutos.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="/" className="btn-primary text-sm py-2.5 px-6">
              Ver homepage
            </a>
            <a href="/shop" className="btn-outline text-sm py-2.5 px-6 bg-transparent border-charcoal-900">
              Ver catálogo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
