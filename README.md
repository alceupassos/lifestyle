# 🌿 Life Style — E-commerce com Virtual Try-On por IA

> Loja de moda de alto padrão construída com **Next.js 14**, **Shopify Storefront API** e **fashn.ai** para virtual try-on com inteligência artificial.

---

## ✨ Funcionalidades

- **Virtual Try-On com IA** — usuário faz upload de uma foto e vê como a roupa fica nele em segundos (fashn.ai tryon-v1.6)
- **Catálogo completo Shopify** — produtos, variantes, coleções, preços, imagens via GraphQL Storefront API
- **Carrinho funcional** — adicionar, remover, atualizar quantidade, checkout nativo Shopify
- **Filtros e busca** — ordenação por preço, novidades, mais vendidos, por coleção e busca textual
- **Design editorial premium** — tipografia Playfair Display, paleta cream/charcoal/gold, animações fluidas
- **100% TypeScript** — tipos completos para Shopify e fashn.ai
- **Server Components (Next.js App Router)** — SSR para catálogo, Client Components apenas onde necessário

---

## 🏗️ Arquitetura

```
Next.js 14 (App Router)
├── Server Components → Shopify Storefront API (SSR, SEO)
├── Client Components → Interatividade (cart, try-on, filtros)
├── API Routes → fashn.ai + cart mutations (protege API keys)
└── Zustand → Estado global do carrinho (persistido em localStorage)
```

---

## 🚀 Instalação

### 1. Clone e instale

```bash
git clone <seu-repo>
cd lifestyle
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=shpat_xxx
SHOPIFY_ADMIN_API_TOKEN=shpat_xxx
SHOPIFY_API_VERSION=2025-04

# fashn.ai
FASHN_API_KEY=fa-xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 🛍️ Configuração Shopify

### Criar App Shopify

1. Acesse [partners.shopify.com](https://partners.shopify.com)
2. Crie uma conta de parceiro (grátis)
3. Crie uma **Development Store**
4. Em **Apps → Create App → Custom App**
5. Configure permissões do **Storefront API**:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
6. Copie o **Public Storefront API token**

### Permissões Admin API (opcional)

Se precisar de webhooks ou acesso admin:
- `read_products`, `read_inventory`, `read_orders`

---

## 🤖 Configuração fashn.ai

1. Crie conta em [fashn.ai](https://fashn.ai)
2. Compre créditos (a partir de **US$7,50**)
3. **Settings → API → + Create new API key**
4. Cole a key em `FASHN_API_KEY`

### Modelos disponíveis

| Modelo | Uso |
|--------|-----|
| `tryon-v1.6` | Virtual try-on (foto pessoa + roupa) |
| `product-to-model` | Flat-lay → foto com modelo |
| `background-remove` | Remove fundo do produto |
| `face-to-model` | Rosto → avatar para try-on |

### Fluxo do Try-On

```
1. Usuário seleciona produto (imagem da peça = garment_image)
2. Clica em "Experimentar virtualmente"
3. Faz upload de selfie/foto (model_image)
4. POST /api/tryon → fashn.ai (server-side, API key protegida)
5. Polling de status via GET /api/tryon/status?id=xxx
6. Exibe resultado quando status === "completed"
7. Usuário pode baixar a imagem
```

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Layout global
│   ├── shop/page.tsx               # Catálogo
│   ├── product/[handle]/page.tsx   # Produto detalhado
│   ├── search/page.tsx             # Busca
│   ├── setup/page.tsx              # Guia de setup
│   └── api/
│       ├── tryon/route.ts          # fashn.ai submit
│       ├── tryon/status/route.ts   # fashn.ai polling
│       └── shopify/cart/route.ts   # Cart CRUD
│
├── components/
│   ├── layout/Navbar.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductInfo.tsx         # Variantes + Add to Cart
│   │   ├── ShopFilters.tsx
│   │   └── CartDrawer.tsx
│   ├── tryon/
│   │   └── TryOnModal.tsx          # Modal completo try-on
│   └── ui/
│       ├── Toaster.tsx
│       └── Skeletons.tsx
│
├── hooks/
│   ├── useCart.ts                  # Zustand cart store
│   └── useTryOn.ts                 # Try-on hook (polling)
│
├── lib/
│   ├── shopify.ts                  # GraphQL queries + mutations
│   ├── fashn.ts                    # fashn.ai client
│   └── utils.ts
│
└── types/index.ts                  # Tipos completos
```

---

## 🎨 Design System

| Token | Valor |
|-------|-------|
| `font-display` | Playfair Display (serif) |
| `font-body` | DM Sans (sans-serif) |
| `font-mono` | DM Mono |
| `cream-50` | `#FDFAF5` (bg principal) |
| `charcoal-900` | `#0F0F0D` (texto) |
| `gold-400` | `#D4A843` (accent) |
| `sage-500` | `#6B8C65` (sucesso) |
| `terracotta-500` | `#A8613E` (erro/sale) |

---

## 🚢 Deploy (Vercel)

```bash
npx vercel deploy
```

Ou conecte o repositório em [vercel.com](https://vercel.com) e configure as variáveis de ambiente no painel.

---

## 📄 Licença

MIT — uso livre para projetos pessoais e comerciais.

---

**Life Style** — construído com ❤️ usando Next.js, Shopify e fashn.ai
