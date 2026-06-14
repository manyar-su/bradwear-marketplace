export const analyzeImageWithGemini = async (base64Image: string): Promise<string> => {
  try {
    const response = await fetch('/api/scan-color', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || 'OCR request failed');
    }

    return payload?.code?.trim() || 'No text detected';
  } catch (error) {
    console.error('Gemini Error:', error);
    return 'Error scanning';
  }
};
