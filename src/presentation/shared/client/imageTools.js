export function imageToolsModule() {
  return `
const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  if (!file) {
    resolve('');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ''));
  reader.onerror = () => reject(new Error('Unable to read file'));
  reader.readAsDataURL(file);
});

const dataUrlSizeBytes = (dataUrl) => {
  const value = String(dataUrl || '');
  const comma = value.indexOf(',');
  if (comma < 0) return 0;
  const base64 = value.slice(comma + 1);
  return Math.floor((base64.length * 3) / 4);
};

const loadImageFromFile = (file) => new Promise((resolve, reject) => {
  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(objectUrl);
    resolve(image);
  };
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    reject(new Error('Unable to process image'));
  };
  image.src = objectUrl;
});

const resolveOutputType = (file, options = {}) => {
  const requested = String(options.outputType || '').toLowerCase();
  if (requested === 'image/jpeg' || requested === 'image/webp' || requested === 'image/png') return requested;
  const sourceType = String(file?.type || '').toLowerCase();
  if (sourceType === 'image/webp') return 'image/webp';
  return 'image/webp';
};

const compressFileToDataUrl = async (file, options = {}) => {
  if (!file) return '';

  const type = String(file.type || '').toLowerCase();
  if (!type.startsWith('image/')) return readFileAsDataUrl(file);

  const maxWidth = Math.max(64, Number(options.maxWidth || 1600));
  const maxHeight = Math.max(64, Number(options.maxHeight || maxWidth));
  const targetBytes = Math.max(8 * 1024, Number(options.targetBytes || (900 * 1024)));
  const minQuality = Math.max(0.35, Math.min(0.95, Number(options.minQuality || 0.5)));
  const qualityStep = Math.max(0.01, Math.min(0.25, Number(options.qualityStep || 0.08)));
  const maxPasses = Math.max(1, Math.min(24, Number(options.maxPasses || 12)));
  const scaleDecay = Math.max(0.6, Math.min(0.98, Number(options.scaleDecay || 0.9)));
  const outputType = resolveOutputType(file, options);
  const preserveAlpha = options.preserveAlpha !== false && outputType !== 'image/jpeg';
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
  const throwIfTooLarge = Boolean(options.throwIfTooLarge);
  const tooLargeMessage = String(options.tooLargeMessage || 'Unable to prepare image');
  let quality = Math.max(minQuality, Math.min(0.98, Number(options.quality || 0.84)));

  try {
    const image = await loadImageFromFile(file);
    const sourceWidth = Number(image.naturalWidth || image.width || 0);
    const sourceHeight = Number(image.naturalHeight || image.height || 0);
    if (!sourceWidth || !sourceHeight) return readFileAsDataUrl(file);

    let scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: preserveAlpha });
    if (!ctx) return readFileAsDataUrl(file);

    const render = () => {
      canvas.width = Math.max(1, Math.round(sourceWidth * scale));
      canvas.height = Math.max(1, Math.round(sourceHeight * scale));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    render();
    let compressed = canvas.toDataURL(outputType, quality);
    let pass = 0;
    while (dataUrlSizeBytes(compressed) > targetBytes && pass < maxPasses) {
      if (quality > minQuality + 0.01) {
        quality = Math.max(minQuality, quality - qualityStep);
      } else {
        scale *= scaleDecay;
        render();
      }
      compressed = canvas.toDataURL(outputType, quality);
      pass += 1;
      if (onProgress) {
        const progress = Math.max(0, Math.min(100, Math.round(((pass + 1) / (maxPasses + 1)) * 100)));
        onProgress(progress);
      }
    }
    if (throwIfTooLarge && dataUrlSizeBytes(compressed) > targetBytes) {
      const error = new Error(tooLargeMessage);
      error.name = 'ImageCompressionTooLargeError';
      throw error;
    }
    if (onProgress) onProgress(100);
    return compressed;
  } catch (error) {
    if (error?.name === 'ImageCompressionTooLargeError') throw error;
    const fallback = await readFileAsDataUrl(file);
    if (throwIfTooLarge && dataUrlSizeBytes(fallback) > targetBytes) {
      const fallbackError = new Error(tooLargeMessage);
      fallbackError.name = 'ImageCompressionTooLargeError';
      throw fallbackError;
    }
    return fallback;
  }
};
`;
}
