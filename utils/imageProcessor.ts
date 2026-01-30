
/**
 * Removes the solid background color from an image (Auto-Cut).
 * Assumes the top-left pixel represents the background color.
 */
export const removeBackground = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(imageSrc);
                return;
            }

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Sample background color (Top-Left pixel)
            const bgR = data[0];
            const bgG = data[1];
            const bgB = data[2];

            const tolerance = 30; // 0-255 sensitivity

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Check difference
                if (
                    Math.abs(r - bgR) < tolerance &&
                    Math.abs(g - bgG) < tolerance &&
                    Math.abs(b - bgB) < tolerance
                ) {
                    data[i + 3] = 0; // Set Alpha to 0 (Transparent)
                }
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL());
        };

        img.onerror = (err) => {
            console.error("Auto-cut failed", err);
            resolve(imageSrc); // Fallback to original
        };
    });
};
