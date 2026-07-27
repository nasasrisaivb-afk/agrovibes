import { ImageQualityFlag } from "../backend";

export interface ProcessedImage {
  dataUrl: string;
  qualityFlag: ImageQualityFlag | undefined;
}

const MIN_DIMENSION = 480; // below this → LOW_RESOLUTION flag
const BLUR_VARIANCE_THRESHOLD = 55; // Laplacian variance heuristic
const MAX_OUTPUT_DIMENSION = 1024;
const JPEG_QUALITY = 0.72;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "This file could not be read as an image. Pick a JPG or PNG photo.",
        ),
      );
    };
    img.src = url;
  });
}

/** Variance of a 3x3 Laplacian over a grayscale downsample — a standard
 *  cheap blur heuristic. Low variance ⇒ few edges ⇒ likely blurry. */
function laplacianVariance(img: HTMLImageElement): number {
  const size = 160;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Number.POSITIVE_INFINITY;
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const gray = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) {
    gray[i] =
      0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const i = y * size + x;
      const lap =
        4 * gray[i] -
        gray[i - 1] -
        gray[i + 1] -
        gray[i - size] -
        gray[i + size];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }
  const mean = sum / count;
  return sumSq / count - mean * mean;
}

function compress(img: HTMLImageElement): string {
  const scale = Math.min(
    1,
    MAX_OUTPUT_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("Image processing is not supported in this browser.");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

/** Runs the async image-quality check (blur/resolution heuristic) and
 *  compresses the photo. Quality issues FLAG the image, never block it —
 *  the UI shows a "this photo looks blurry, replace it?" inline warning. */
export async function processListingImage(file: File): Promise<ProcessedImage> {
  const img = await loadImage(file);
  let qualityFlag: ImageQualityFlag | undefined;
  if (Math.min(img.naturalWidth, img.naturalHeight) < MIN_DIMENSION) {
    qualityFlag = ImageQualityFlag.LOW_RESOLUTION;
  } else if (laplacianVariance(img) < BLUR_VARIANCE_THRESHOLD) {
    qualityFlag = ImageQualityFlag.BLURRY;
  }
  return { dataUrl: compress(img), qualityFlag };
}

/** KYC documents/selfies reuse the same pipeline without flag semantics. */
export async function processKycImage(file: File): Promise<string> {
  const img = await loadImage(file);
  return compress(img);
}
