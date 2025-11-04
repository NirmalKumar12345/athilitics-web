'use client';

import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  src?: string | File | null;
  name?: string;
  size?: number;
  rectangular?: boolean;
}

const TOURNAMENT_AVATAR_ASPECT_RATIO = 1.4;

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 30, rectangular = false }) => {
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [imageError, setImageError] = React.useState<boolean>(false);
  const [isPdfFile, setIsPdfFile] = React.useState<boolean>(false);

  React.useEffect(() => {
    setImageError(false);
    setIsPdfFile(false);

    if (!src) {
      setImageUrl('');
      return;
    }

    if (typeof src === 'string') {
      if (src.trim() === '') {
        setImageUrl('');
        return;
      }

      const isPdf = src.toLowerCase().endsWith('.pdf');
      setIsPdfFile(isPdf);

      if (src.startsWith('blob:') || src.startsWith('http:') || src.startsWith('https:')) {
        setImageUrl(src);
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        setImageUrl(apiUrl ? `${apiUrl}${src}` : src);
      }
    } else if (src instanceof File) {
      const isPdf = src.type === 'application/pdf';
      setIsPdfFile(isPdf);

      try {
        const objectUrl = URL.createObjectURL(src);
        setImageUrl(objectUrl);

        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (error) {
        console.warn('Failed to create object URL for file:', error);
        setImageUrl('');
        setImageError(true);
      }
    }
  }, [src]);

  React.useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);
  const handleImageError = () => {
    setImageError(true);
  };

  const renderFallback = () => (
    <div className="flex bg-[#FEE440] items-center justify-center w-full h-full text-black text-lg cursor-pointer">
      {name?.[0]?.toUpperCase() || 'U'}
    </div>
  );

  const renderPdfIcon = () => (
    <div className="flex bg-red-100 items-center justify-center w-full h-full cursor-pointer relative">
      <Image
        src="/images/pdf.svg"
        alt="PDF document"
        width={Math.max(16, size * 0.6)}
        height={Math.max(16, size * 0.6)}
        className="object-contain"
      />
    </div>
  );

  const shouldUseNextImage = (url: string): boolean => {
    return !url.includes('signed?token=');
  };

  const width = rectangular ? Math.round(size * TOURNAMENT_AVATAR_ASPECT_RATIO) : size;
  const height = size;
  const borderRadius = rectangular ? '10px' : '50%';

  return (
    <div
      className={clsx(
        'overflow-hidden bg-gray-200',
        rectangular ? 'rounded-[10px]' : 'rounded-full'
      )}
      style={{ width, height, borderRadius }}
      role="img"
      aria-label={`Avatar for ${name || 'user'}${isPdfFile ? ' (PDF document)' : ''}`}
    >
      {imageError || !imageUrl ? (
        <div className="flex bg-[#FEE440] items-center justify-center w-full h-full text-black text-lg cursor-pointer">
          {name?.[0]?.toUpperCase() || (rectangular ? 'T' : 'U')}
        </div>
      ) : isPdfFile ? (
        renderPdfIcon()
      ) : shouldUseNextImage(imageUrl) ? (
        <Image
          src={imageUrl}
          alt={name || 'User avatar'}
          priority
          width={width}
          height={height}
          className="object-cover w-full h-full cursor-pointer"
          unoptimized
          onError={handleImageError}
        />
      ) : (
        <img
          src={imageUrl}
          alt={name || 'User avatar'}
          width={width}
          height={height}
          className="object-cover w-full h-full cursor-pointer"
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default Avatar;
