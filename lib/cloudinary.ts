import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

let configured = false;

function ensureCloudinary() {
  if (configured) return;
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new Error("Cloudinary env belum lengkap.");
  }
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
  configured = true;
}

export async function uploadDataUrl(dataUrl: string, folder: string) {
  ensureCloudinary();
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder,
    resource_type: "image",
  });
  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
}

