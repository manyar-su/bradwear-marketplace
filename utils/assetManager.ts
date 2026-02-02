import { supabase, SUPABASE_BUCKET } from '../lib/supabase';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// Path folder cache di device
const CACHE_DIR = 'asset_cache';

/**
 * Mendapatkan Public URL dari Supabase Storage
 */
export const getSupabaseUrl = (path: string) => {
    const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
};

/**
 * Mengambil asset dengan sistem caching di device (Mobile/Native)
 * Jika di Web, akan langsung mengembalikan URL Supabase (mengandalkan browser cache)
 */
export const fetchAsset = async (path: string, version: string = '1.0.0'): Promise<string> => {
    const isNative = Capacitor.isNativePlatform();
    const supabaseUrl = getSupabaseUrl(path);

    if (!isNative) {
        // Di Web/Browser, tambahkan query param version untuk cache busting jika diperlukan
        return `${supabaseUrl}?v=${version}`;
    }

    try {
        const fileName = path.split('/').join('_'); // Buat nama file unik berdasarkan path
        const localPath = `${CACHE_DIR}/${version}_${fileName}`;

        // 1. Cek apakah folder cache sudah ada
        try {
            await Filesystem.mkdir({
                path: CACHE_DIR,
                directory: Directory.Data,
                recursive: true,
            });
        } catch (e) {
            // Folder mungkin sudah ada
        }

        // 2. Cek apakah file sudah ada di cache
        try {
            const file = await Filesystem.stat({
                path: localPath,
                directory: Directory.Data,
            });

            return Capacitor.convertFileSrc(file.uri);
        } catch (e) {
            // File tidak ada, lanjut download
            console.log(`Downloading asset to cache: ${path}`);
        }

        // 3. Download dr Supabase dan simpan ke Filesystem
        const response = await fetch(supabaseUrl);
        const blob = await response.blob();

        // Convert blob ke base64 untuk disimpan
        const base64Data = await blobToBase64(blob);

        await Filesystem.writeFile({
            path: localPath,
            data: base64Data,
            directory: Directory.Data,
        });

        const finalFile = await Filesystem.getUri({
            path: localPath,
            directory: Directory.Data,
        });

        return Capacitor.convertFileSrc(finalFile.uri);
    } catch (error) {
        console.error('Error fetching/caching asset:', error);
        return supabaseUrl; // Fallback ke URL langsung jika gagal
    }
};

/**
 * Helper untuk konversi Blob ke Base64 (dibutuhkan oleh Filesystem.writeFile)
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Ambil data setelah koma (menghapus prefix data:image/...;base64,)
            const base64Data = base64String.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Fungsi untuk membersihkan cache jika sudah terlalu penuh
 */
export const clearAssetCache = async () => {
    try {
        await Filesystem.rmdir({
            path: CACHE_DIR,
            directory: Directory.Data,
            recursive: true,
        });
        console.log('Asset cache cleared');
    } catch (error) {
        console.error('Failed to clear cache:', error);
    }
};
