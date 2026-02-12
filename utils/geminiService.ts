
const GEMINI_API_KEY = "AIzaSyAGm4BMDgzI_Yu-oRLLbibGxfuK6dE7lA0";
const GEMINI_MODEL = "gemini-1.5-flash";

export const analyzeImageWithGemini = async (base64Image: string): Promise<string> => {
    try {
        // Remove metadata prefix (data:image/png;base64,)
        const base64Data = base64Image.split(',')[1];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: "Extract the text from this image. Focus on color codes or catalog labels. Only return the extracted text, nothing else." },
                            {
                                inline_data: {
                                    mime_type: "image/png",
                                    data: base64Data
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return text?.trim() || "No text detected";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error scanning";
    }
};
