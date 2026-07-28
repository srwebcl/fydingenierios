'use client';

import React, { useState, useEffect } from 'react';

const videos = [
  '/videos/hero-1.mp4',
  '/videos/hero-2.mp4',
  '/videos/hero-3.mp4'
];

export function HeroVideoBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Rotar cada 8 segundos para dar tiempo a apreciar cada video
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 8000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="absolute inset-0 bg-brand-dark">
        {videos.map((src, index) => (
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-60' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      {/* Capa superpuesta oscura para resaltar el texto blanco */}
      <div className="absolute inset-0 bg-brand-dark/70"></div>
    </>
  );
}
