export function imageCompressionModule() {
  return `
const compressImageFile = async (file, maxWidth, quality) => {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxWidth / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
};`;
}
