import requests
from bs4 import BeautifulSoup
import csv
import re
from urllib.parse import urljoin

# ------------ CONFIGURAÇÃO ------------
CATALOG_URL = "https://catalogoapp.mobi/d89f0d39-89f7-412c-b9e6-0fa0886805f2"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

OUTPUT_CSV = "shopify_catalog.csv"

# ------------ EXTRAÇÃO DOS PRODUTOS ------------
def scrape_products(url):
    print("Acessando URL:", url)
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    print("Status:", response.status_code)
    print("Tamanho da página:", len(response.text))

    soup = BeautifulSoup(response.text, "html.parser")

    # Mostra o início do HTML para você ver o layout
    print("Primeiros 1000 caracteres do HTML:")
    print(soup.prettify()[:1000])

    products = []

    # Busca por blocos que parecem ser produtos (testando vários padrões)
    possible_classes = [
        re.compile("produto", re.I),
        re.compile("product", re.I),
        re.compile("item", re.I),
        re.compile("card", re.I),
        re.compile("produto-card", re.I),
        re.compile("produto-item", re.I),
        re.compile("card-produto", re.I),
        re.compile("cards-produtos", re.I),
    ]

    for regex in possible_classes:
        for item in soup.find_all("div", class_=regex):
            name_elem = item.find(["h2", "h3", "p"], class_=re.compile("nome|name|title|titulo", re.I))
            price_elem = item.find("span", class_=re.compile("price|preco|valor|valor-produto", re.I))
            img_elem = item.find("img")

            if not name_elem:
                continue

            name = name_elem.get_text(strip=True)
            price = price_elem.get_text(strip=True).replace("R$", "").replace(",", ".").strip() if price_elem else ""
            if img_elem:
                img_url = img_elem.get("data-src") or img_elem.get("src")
                img_url = urljoin(url, img_url) if img_url else ""
            else:
                img_url = ""

            sku = re.sub(r"\W+", "_", name).lower()[:30]

            products.append({
                "Title": name,
                "Body (HTML)": f"<p>{name} disponível no catálogo.</p>",
                "Vendor": "Life Style",
                "Type": "Produto",
                "Tags": "catalogoapp",
                "SKU": sku,
                "Price": price,
                "Compare at price": "",
                "Image Src": img_url,
                "Option1 Name": "Title",
                "Option1 Value": "Default Title",
            })

    return products

# ------------ EXPORTAÇÃO PARA CSV (COMPATÍVEL COM SHOPIFY) ------------
def export_to_shopify_csv(products, filename):
    fieldnames = [
        "Title", "Body (HTML)", "Vendor", "Type", "Tags", "SKU",
        "Price", "Compare at price", "Image Src",
        "Option1 Name", "Option1 Value",
    ]

    with open(filename, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(products)

    print(f"✅ CSV exportado para: {filename} ({len(products)} produtos)")

# ------------ EXECUÇÃO PRINCIPAL ------------
if __name__ == "__main__":
    print("➡️  Iniciando extração do catálogo...")
    try:
        products = scrape_products(CATALOG_URL)

        if not products:
            print("⚠️  Nenhum produto encontrado. Verifique: URL do catálogo e seletores de HTML (classe de produto, nome, preço, imagem)")

        export_to_shopify_csv(products, OUTPUT_CSV)

    except Exception as e:
        print(f"❌ Erro geral: {e}")
        raise
