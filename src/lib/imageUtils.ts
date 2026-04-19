// ─────────────────────────────────────────────────────────────
// LIFE STYLE — Image Utilities
// ─────────────────────────────────────────────────────────────

/**
 * Comprime e redimensiona uma imagem usando Canvas no lado do cliente
 * Retorna uma string base64 super leve, evitando Payload Too Large e economizando API
 */
export function compressImageFile(file: File, maxWidth = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Manter proporção
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Falha ao obter contexto 2D do Canvas'));
          return;
        }

        // Desenhar a imagem redimensionada no canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Exportar. O ideal é image/jpeg com qualidade 0.8
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };

      img.onerror = (err) => {
        reject(new Error('Erro ao carregar a imagem para compressão'));
      };
    };

    reader.onerror = (err) => {
      reject(err);
    };
  });
}
