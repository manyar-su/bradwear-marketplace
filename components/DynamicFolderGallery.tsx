import React, { useState, useEffect } from 'react';
import { listImagesInFolder } from '../utils/supabaseService';
import { getLocalImagesInFolder } from '../assets';

interface DynamicFolderGalleryProps {
    productId?: string;
    folderName: string; // This corresponds to the product name
    fallbackImage: string;
    onImageClick?: () => void;
    className?: string;
    theme: 'light' | 'dark';
}

const DynamicFolderGallery: React.FC<DynamicFolderGalleryProps> = ({
    productId,
    folderName,
    fallbackImage,
    onImageClick,
    className,
    theme
}) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const fetchImages = async () => {
            // STEP 1: PRIORITAS LOKAL (Instant)
            // Kita ambil dari aset lokal dulu agar UI langsung muncul tanpa nunggu network
            const locals = getLocalImagesInFolder(folderName);
            let allFoundImages: string[] = [...locals];

            // Tampilkan aset lokal dulu jika ada
            if (isMounted && allFoundImages.length > 0) {
                const depanLocals = allFoundImages.filter(img => img.toLowerCase().includes('depan'));
                const initialImages = depanLocals.length > 0 ? depanLocals : allFoundImages;
                setImages(initialImages.slice(0, 10));
                setLoading(false);
            }

            // STEP 2: SUPABASE (Background/Parallel)
            // Jalankan request Supabase secara paralel untuk kecepatan maksimal
            const paths = [
                `catalog/${productId}`,
                `catalog/${folderName}`,
                `Model Kemeja/${folderName}`,
                `Jacket/${folderName}`,
                `Celana/${folderName}`,
                `Rompi/${folderName}`,
                `Kids Series/${folderName}`
            ];

            try {
                // Gunakan Promise.all agar fetch tidak antre satu per satu
                const results = await Promise.all(paths.map(path => listImagesInFolder(path)));
                results.forEach(fetched => {
                    if (fetched && fetched.length > 0) {
                        allFoundImages = [...allFoundImages, ...fetched];
                    }
                });

                // Hapus duplikat dan limit maksimal 10 gambar untuk performa
                const uniqueImages = Array.from(new Set(allFoundImages)).slice(0, 10);

                // Filter 'depan' tetap menjadi prioritas tampilan utama
                const depanImages = uniqueImages.filter(img => img.toLowerCase().includes('depan'));
                const finalImages = depanImages.length > 0 ? depanImages : uniqueImages;

                if (isMounted) {
                    setImages(finalImages);
                    setLoading(false);
                }
            } catch (error) {
                console.warn("Fast fetch failed, using fallback/locals:", error);
                if (isMounted) setLoading(false);
            }
        };

        fetchImages();
        return () => { isMounted = false; };
    }, [folderName, productId]);

    // Slideshow effect if multiple images
    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % images.length);
            }, 3000 + Math.random() * 2000); // Random delay to prevent sync
            return () => clearInterval(interval);
        }
    }, [images]);

    if (loading) {
        return (
            <div className={`animate-pulse flex items-center justify-center ${className} ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <img
                src={fallbackImage}
                className={className}
                onClick={onImageClick}
                alt={folderName}
            />
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden" onClick={onImageClick}>
            {images.map((img, idx) => (
                <img
                    key={img}
                    src={img}
                    className={`${className} absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    alt={`${folderName} - ${idx}`}
                />
            ))}

            {images.length > 0 && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
                    <div className="flex gap-1">
                        {images.length > 1 && images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-4 bg-emerald-500' : 'w-1 bg-white/30'}`}
                            />
                        ))}
                    </div>
                    <div className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-2xl">
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[9px] font-black text-white tracking-widest uppercase">KATALOG: {images.length} ITEM</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicFolderGallery;
