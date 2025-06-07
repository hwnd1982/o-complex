'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useAnimation = (isVisible: boolean) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const height = elementRef.current?.scrollHeight || 0;

  useEffect(() => {
    if (!elementRef.current) return;
    
    if (isVisible) {
      gsap.fromTo(elementRef.current,
        { opacity: 0, translateY: height * -0.75, height: 0 },
        { 
          opacity: 1, 
          translateY: 0,
          duration: 0.8, 
          ease: "power3.out",
          stagger: 0.1,
          height,
          onComplete: () => {
            gsap.set(elementRef.current, { height: "auto" });
          }
        } 
      );
    }
  }, [isVisible, height]);

  return elementRef;
};
