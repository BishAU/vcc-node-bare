import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when src changes
    setLoaded(false);
    setError(false);

    if (!src) return;

    // If priority is true, load immediately
    if (priority) {
      loadImage();
    } else {
      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage();
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading when image is 50px from viewport
        }
      );

      const element = document.getElementById(`image-${src}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }
  }, [src, priority]);

  const loadImage = async () => {
    try {
      // Try WebP version first
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const webpResponse = await fetch(webpSrc, { method: 'HEAD' });
      
      if (webpResponse.ok) {
        setImageSrc(webpSrc);
      } else {
        // Fallback to JPG
        const jpgSrc = src.replace(/\.(jpg|jpeg|png|webp)$/, '.jpg');
        setImageSrc(jpgSrc);
      }
    } catch {
      // If both fail, use original src
      setImageSrc(src);
    }
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
    
    // Try to load a placeholder
    setImageSrc(`https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(alt)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
      style={{ width, height }}
      id={`image-${src}`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} ${!loaded ? 'invisible' : ''}`}
          loading={priority ? 'eager' : 'lazy'}
        />
      )}
      
      {/* Loading state */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm">{alt}</span>
        </div>
      )}
    </motion.div>
  );
};

export default OptimizedImage;
