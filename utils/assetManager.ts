import { supabase, SUPABASE_BUCKET } from '../lib/supabase';

/**
 * Mendapatkan Public URL dari Supabase Storage
 */
export const getSupabaseUrl = (path: string) => {
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
};

/**
 * Mengambil asset untuk web melalui Public URL Supabase.
 * Query param `version` dipakai sebagai cache-busting saat gambar diganti.
 */
export const fetchAsset = async (path: string, version: string = '1.0.0'): Promise<string> => {
    const supabaseUrl = getSupabaseUrl(path);
    return `${supabaseUrl}?v=${encodeURIComponent(version)}`;
};

/**
 * Placeholder untuk menjaga kompatibilitas API lama pada mode web-only.
 */
export const clearAssetCache = async () => {
    return Promise.resolve();
};
