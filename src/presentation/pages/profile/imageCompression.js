import { imageToolsModule } from "../../shared/client/imageTools.js";

export function imageCompressionModule() {
  return `
${imageToolsModule()}
const compressImageFile = async (file, maxWidth, quality) => (
  compressFileToDataUrl(file, {
    maxWidth,
    maxHeight: maxWidth,
    quality,
    minQuality: 0.5,
    targetBytes: 1_200_000,
    outputType: 'image/jpeg',
    preserveAlpha: false,
  })
);`;
}
