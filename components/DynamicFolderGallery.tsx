import React, { useState, useEffect } from 'react';
import { listImagesInFolder } from '../utils/supabaseService';

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
            setLoading(true);

            // Try multiple possible paths to be robust
            const paths = [
                `catalog/${productId}`,
                `catalog/${folderName}`,
                `Model Kemeja/${folderName}`,
                `Model Kemeja/${folderName.toLowerCase()}`,
                `Model Kemeja/${folderName.replace(/\s+/g, '-')}`
            ];

            let allFoundImages: string[] = [];

            for (const path of paths) {
                const fetched = await listImagesInFolder(path);
                if (fetched && fetched.length > 0) {
                    allFoundImages = [...allFoundImages, ...fetched];
                }
            }

            // Remove duplicates if any
            const uniqueImages = Array.from(new Set(allFoundImages));

            // NEW RULE: Main Display (DynamicFolderGallery) must ONLY show 'depan' images
            // If multiple 'depan' exist (e.g. variations), show them.
            // If no 'depan' exists, show everything (fallback).
            const depanImages = uniqueImages.filter(img => img.toLowerCase().includes('depan'));
            const finalImages = depanImages.length > 0 ? depanImages : uniqueImages;

            if (isMounted) {
                setImages(finalImages);
                setLoading(false);
            }
        };

        fetchImages();
        return () => { isMounted = false; };
    }, [folderName]);

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
