"use client";
import React from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background/50 backdrop-blur-md z-[100] fixed inset-0">
      <DotLottiePlayer
        src="/assets/loading.lottie"
        autoplay
        loop
        style={{ width: '150px', height: '150px' }}
      />
    </div>
  );
}
