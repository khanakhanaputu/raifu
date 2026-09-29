/**
 * Kompres data URL gambar di sisi klien sebelum dikirim ke server — menekan
 * ukuran payload & biaya/latensi panggilan vision AI. Hanya jalan di
 * browser (butuh Image/canvas); pemanggil harus berada di komponen client.
 */
export function compressDataUrl(
  dataUrl: string,
  maxDimension = 1024,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const width = Math.round(img.width * scale);
      const height = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Gagal memuat gambar."));
    img.src = dataUrl;
  });
}
