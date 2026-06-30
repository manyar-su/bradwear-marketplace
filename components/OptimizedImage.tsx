import React, { useState, useEffect } from 'react';
import { fetchAsset } from '../utils/assetManager';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    supabasePath: string; // Path file di Supabase Storage (e.g. 'Model Kemeja/brad-v3/depan.png')
    version?: string; // Digunakan untuk cache busting jika ada update gambar
    fallback?: string; // Gambar cadangan jika gagal load
}

/**
 * Komponen Image yang mendukung caching otomatis di device (Native)
 * dan loading langsung dari Supabase Storage.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    supabasePath,
    version = '1.0.0',
    fallback,
    className,
    style,
    ...props
}) => {
    const [src, setSrc] = useState<string>(fallback || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            setLoading(true);
            try {
                const assetUrl = await fetchAsset(supabasePath, version);
                if (isMounted) {
                    setSrc(assetUrl);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to load optimized image:', err);
                if (isMounted) {
                    setSrc(fallback || '');
                    setLoading(false);
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
        };
    }, [supabasePath, version]);

    if (loading) {
        return (
            <div
                className={`${className} animate-pulse bg-zinc-800 flex items-center justify-center`}
                style={{ ...style, minHeight: '100px' }}
            >
                <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    return (
        <img
            src={src}
            className={className}
            style={style}
            onError={() => setSrc(fallback || '')}
            {...props}
        />
    );
};

export default OptimizedImage;
