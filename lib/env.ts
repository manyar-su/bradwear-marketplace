export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  sessionSecret: process.env.MARKETPLACE_SESSION_SECRET || "",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  ocrApiKey: process.env.OCR_API_KEY || process.env.SUMOPOD_API_KEY || "",
  ocrEndpoint:
    process.env.OCR_API_ENDPOINT ||
    (process.env.SUMOPOD_BASE_URL
      ? `${process.env.SUMOPOD_BASE_URL.replace(/\/$/, "")}/v1/chat/completions`
      : ""),
  ocrModel:
    process.env.OCR_MODEL || process.env.SUMOPOD_MODEL || "gemini/gemini-2.5-flash-lite",
};

export function assertServerEnv() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("Supabase env belum lengkap.");
  }
}
