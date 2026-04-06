import { supabase, SUPABASE_BUCKET } from '../lib/supabase';

/**
 * Upload Image to Supabase Storage
 * @param dataUrl - Base64 Image Data
 * @param path - Target path in bucket
 * @returns Public URL of uploaded image
 */
export const uploadImageToSupabase = async (dataUrl: string, path: string): Promise<string | null> => {
    try {
        // Convert base64 to File object
        let blob;
        try {
            const response = await fetch(dataUrl);
            blob = await response.blob();
        } catch (fetchErr) {
            console.error('Base64 fetch failed, using manual conversion');
            blob = dataURItoBlob(dataUrl);
        }
        const file = new File([blob], 'upload.png', { type: 'image/png' });

        // Upload to Supabase
        console.log(`Uploading to: ${path} in bucket: ${SUPABASE_BUCKET}`);

        const { data, error } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('SUPABASE UPLOAD ERROR:', error);

            // Check for RLS Policy violation
            if (error.message.includes('row-level security') || error.message.includes('permission denied') || (error as any).statusCode === '403') {
                alert('GAGAL UPLOAD: Izin ditolak oleh Supabase. Pastikan Anda telah mengatur "Storage Policies" untuk bucket "assets" agar mengizinkan SELECT, INSERT, dan UPDATE untuk role public/anon.');
                console.warn('HINT: Go to Supabase > Storage > Policies > New Policy. Allow "anon" key to perform INSERT/SELECT on "assets" bucket.');
            }

            // Check if it's a network error
            if (error.message === 'Failed to fetch') {
                console.warn('Network error detected. Possible causes: CORS, AdBlocker, or invalid Supabase URL.');
                console.log('Client Config:', {
                    url: (supabase as any).supabaseUrl,
                    hasKey: !!(supabase as any).supabaseKey
                });
            }
            return null;
        }

        // Get Public URL
        const { data: urlData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(data.path);
        console.log('Upload success:', urlData.publicUrl);
        return urlData.publicUrl;
    } catch (error: any) {
        console.error('CRITICAL Error in uploadImageToSupabase:', error);
        return null;
    }
};

/**
 * Helper to convert Data URI to Blob manually if fetch failing
 */
function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

/**
 * Delete Image from Supabase Storage
 */
export const deleteImageFromSupabase = async (path: string) => {
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([path]);
    if (error) console.error('Supabase delete error:', error);
};

/**
 * List all images in a folder and return their public URLs
 */
export const listImagesInFolder = async (folderPath: string): Promise<string[]> => {
    try {
        const { data, error } = await supabase.storage
            .from(SUPABASE_BUCKET)
            .list(folderPath, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            // Check for network errors specially
            if (error.message === 'Failed to fetch') {
                console.warn(`[Supabase Storage] Network error while listing ${folderPath}. This is likely a CORS or AdBlocker issue.`);
            } else {
                console.error('Error listing images in folder:', folderPath, error);
            }
            return [];
        }

        if (!data || data.length === 0) return [];

        // Return public URLs for all files found with manual encoding for safety
        return data.map(file => {
            // Encode path segments individually to handle spaces and special chars (e.g. parentheses)
            const encodedFolder = folderPath.split('/').map(s => encodeURIComponent(s)).join('/');
            const encodedFile = encodeURIComponent(file.name);
            const supabaseUrl = (supabase as any).supabaseUrl;

            // Manual construction is safer than getPublicUrl which might not encode strict chars
            return `${supabaseUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${encodedFolder}/${encodedFile}`;
        });
    } catch (err) {
        console.error('Critical error in listImagesInFolder:', err);
        return [];
    }
};
