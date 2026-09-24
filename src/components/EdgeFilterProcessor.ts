/**
 * Real-time image filter processor
 * Extracts clean line art outlines from photos using Sobel edge detection
 */

export async function processEdgeOutline(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        // Downscale to reasonable size for fast processing and crisp lines
        const maxDim = 1200;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // 1. Grayscale
        const gray = new Uint8Array(w * h);
        for (let i = 0; i < data.length; i += 4) {
          // Luminance formula
          gray[i / 4] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }

        // 2. Sobel Edge Detection
        const output = ctx.createImageData(w, h);
        const outData = output.data;

        // Sobel kernels
        // Gx: [-1 0 1, -2 0 2, -1 0 1]
        // Gy: [-1 -2 -1, 0 0 0, 1 2 1]

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = y * w + x;

            const p00 = gray[(y - 1) * w + (x - 1)];
            const p01 = gray[(y - 1) * w + x];
            const p02 = gray[(y - 1) * w + (x + 1)];

            const p10 = gray[y * w + (x - 1)];
            const p12 = gray[y * w + (x + 1)];

            const p20 = gray[(y + 1) * w + (x - 1)];
            const p21 = gray[(y + 1) * w + x];
            const p22 = gray[(y + 1) * w + (x + 1)];

            const gx = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;
            const gy = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;

            const mag = Math.min(255, Math.sqrt(gx * gx + gy * gy) * 1.5);
            const outIdx = (y * w + x) * 4;

            // Invert magnitude so edges are dark lines on white background
            // or high contrast lines
            const val = 255 - mag;

            outData[outIdx] = val; // R
            outData[outIdx + 1] = val; // G
            outData[outIdx + 2] = val; // B
            outData[outIdx + 3] = 255; // Alpha
          }
        }

        ctx.putImageData(output, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Edge processing failed:', err);
        resolve(imageSrc);
      }
    };
    img.onerror = (err) => {
      console.error('Image load error for edge outline:', err);
      reject(err);
    };
    img.src = imageSrc;
  });
}
