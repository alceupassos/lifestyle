# 🛍️ LIFE STYLE — Plano Unificado de Implementação & Deploy
> Criado: 2026-04-19 | VPS: 62.171.181.241 | Domínio: lifestyle.angra.io

---

## ✅ O QUE JÁ ESTÁ PRONTO

| Componente | Status |
|---|---|
| Design System (Syne + Manrope, CSS vars) | ✅ |
| FloatingNavbar glassmorphism | ✅ |
| Catálogo `/catalogo` com grid + search + sort | ✅ |
| FilterPanel (categorias, tamanhos, cores, preço) | ✅ |
| ProductCard com hover, wishlist, quick-add | ✅ |
| Admin `/admin` com tabela de produtos + stats | ✅ |
| ProductFormModal (upload/câmera/variantes/tamanhos) | ✅ |
| Try-On `/tryon` (base) | ✅ |
| deploy.sh para VPS | ✅ |

---

## 📋 TAREFAS A EXECUTAR (SESSÃO ATUAL)

### 🔧 Fase 1 — Correções Técnicas
- [x] Corrigir TS2345 em admin/page.tsx (AdminProduct.inventory)
- [ ] Corrigir todos warnings ESLint (img, any, unused vars)
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` limpo

### 🎨 Fase 2 — Try-On Layout (referência da imagem)

Layout two-column conforme imagem de referência:
```
┌─────────────────────────┬──────────────────────────────────────┐
│                         │  Selecione uma peça para experimentar│
│   [SILHUETA CINZA]      │  ┌──────┐ ┌──────┐ ┌──────┐        │
│                         │  │ img  │ │ img  │ │ img  │        │
│  [UPLOAD SUA FOTO    ]  │  └──────┘ └──────┘ └──────┘        │
│  [USE SUA CÂMERA     ]  │   Nome     Nome      Nome           │
│                         │   R$ XX    R$ XX     R$ XX          │
│  Experimente nossas     │  [EXPERIMENTE] [EXPERIMENTE]...     │
│  peças virtualmente.    │                                      │
│  Faça o upload de uma   │  (scroll vertical com mais peças)   │
│  foto ou use sua câmera.│                                      │
└─────────────────────────┴──────────────────────────────────────┘
```

- Fundo bege/earthy (var(--ls-bg-cream))  
- Botão "UPLOAD SUA FOTO" — verde escuro (#2D5016)  
- Botão "USE SUA CÂMERA" — terracota (#C4622D)  
- Grid de produtos com botão "EXPERIMENTE AGORA" em cada card  
- Quando produto selecionado → destaque + composição na foto do usuário  

### 🔘 Fase 3 — Botão Flutuante Try-On (sempre visível)

Componente `TryOnFAB` fixo em todas as páginas exceto `/tryon`:
```
Posição: bottom-right fixo (bottom-6 right-6)
Ícone: ✨ + "Experimentar"
Cor: gradient var(--primary)
Aparece com delay 1s após carregar página
```

Adicionar ao FloatingNavbar como item de menu E como FAB flutuante.

### 🔐 Fase 4 — Auth Admin Hardcoded

Credenciais fixas (sem backend, sem Shopify OAuth):
- **Email**: `adm@angra.io`  
- **Senha**: `Angra123#`  

Implementação:
- Página `/admin/login` com form simples  
- Verificação client-side + `localStorage` token simulado  
- Middleware Next.js protege `/admin/**`  
- Redireciona para `/admin/login` se não autenticado  

### 📄 Fase 5 — Página Produto `/catalogo/[slug]`

```
Layout:
├── Galeria de imagens (carrossel)
├── Nome, preço, badge de desconto
├── Seletor de tamanho (PP/P/M/G/GG/XGG)
├── Seletor de cor (swatches)
├── Botão "Adicionar ao Carrinho"
├── Botão "✨ Experimentar com IA" → /tryon?produto=slug
└── Descrição + tabs (detalhes, medidas, avaliações)
```

### 🏗️ Fase 6 — Build & Lint Limpo
```bash
npm run lint -- --fix        # auto-corrige
npm run lint                 # verifica zero erros
npx tsc --noEmit             # zero erros TypeScript
npm run build                # build de produção
```

### 🚀 Fase 7 — Deploy VPS (SEM TOCAR NGINX)
```bash
# Nginx já gerenciado — NÃO ALTERAR
# Porta: 3000 (PM2)
# Config: /etc/nginx/sites-available/lifestyle (existente)

rsync -avz --exclude 'node_modules' --exclude '.git' \
  --exclude '.next/cache' --exclude '.env*' \
  ./ root@62.171.181.241:/root/lifestyle/

ssh root@62.171.181.241 "cd /root/lifestyle && npm install --production && pm2 restart lifestyle || pm2 start ecosystem.config.js && pm2 save"
```

---

## 🎨 Design System — Variáveis CSS Usadas

| Variável | Valor | Uso |
|---|---|---|
| `--primary` | #6B21A8 | Botões principais, destaques |
| `--accent-orange` | #F97316 | CTAs secundários, câmera btn |
| `--ls-bg` | #F8F5F1 | Background bege earthy |
| `--font-syne` | Syne | Títulos, headings |
| `--font-manrope` | Manrope | Corpo, labels, botões |
| `--shadow-card` | 0 2px 16px rgba(...) | Cards e modais |

---

## 🔧 Componentes a Criar/Atualizar

| Componente | Arquivo | Status |
|---|---|---|
| TryOnStudio | `components/tryon/TryOnStudio.tsx` | 🔄 Reimplementar |
| TryOnFAB | `components/ui/TryOnFAB.tsx` | 🆕 Criar |
| AdminLoginPage | `app/admin/login/page.tsx` | 🆕 Criar |
| AdminMiddleware | `middleware.ts` | 🆕 Criar |
| CatalogSlugPage | `app/catalogo/[slug]/page.tsx` | 🆕 Criar |

---

## 🔗 Integração Shopify

### Storefront API (catálogo público)
- Hook `useFilters` com URL params → query Shopify
- Filter: categorias, tamanhos, cores, preço, novidades, promoção
- Variantes: PP/P/M/G/GG/XGG + tamanho numérico

### Admin API (gerenciamento)
- Criar produto → `POST /admin/api/products.json`
- Upload imagem → Shopify CDN via Admin API
- Sync estoque → `POST /admin/api/inventory_levels/set.json`

### Shopify Webhook (futuro)
- `product/updated` → atualiza cache local

---

## 🗓️ Ordem de Execução (sessão atual)

```
[1] Fix TS + lint erros críticos
[2] Criar TryOnStudio novo layout (referência imagem)
[3] Criar TryOnFAB flutuante 
[4] Criar Admin Login + Middleware
[5] Criar /catalogo/[slug] page
[6] npm run build limpo
[7] rsync + pm2 restart no VPS
```

---

## 🔐 Credenciais & Acessos

| Serviço | Credencial |
|---|---|
| Admin App | adm@angra.io / Angra123# |
| VPS SSH | root@62.171.181.241 |
| Domínio | lifestyle.angra.io |
| PM2 app name | lifestyle |
| Porta | 3000 |

---

## ❓ Decisões Tomadas

- **Auth Admin**: client-side simples (sem backend OAuth)
- **Câmera**: `input capture="environment"` (mobile) + file picker (desktop)  
- **Try-On FAB**: sempre visível em todas as páginas exceto /tryon
- **Nginx**: NÃO ALTERADO — proxy já configurado
- **Build**: produção local → rsync → pm2 restart
