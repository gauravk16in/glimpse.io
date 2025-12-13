import React, { useEffect, useState, useRef, useCallback } from 'react';
import { LoadingState } from '../types';

interface LoadingScreenProps {
  onComplete: () => void;
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({ isActive: true, isFading: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Grid configuration
  const CELL_SIZE = 120; // Large spacing as per image
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Quick load as requested (1.5s)
    const timer = setTimeout(() => {
        handleExit();
    }, 1500);

    return () => {
        window.removeEventListener('resize', updateDimensions);
        clearTimeout(timer);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleExit = () => {
    setLoadingState(prev => ({ ...prev, isFading: true }));
    setTimeout(() => {
      setLoadingState({ isActive: false, isFading: false });
      onComplete();
    }, 800); // Fade out duration
  };

  if (!loadingState.isActive) return null;

  // Calculate grid
  const cols = Math.ceil(dimensions.width / CELL_SIZE) + 1;
  const rows = Math.ceil(dimensions.height / CELL_SIZE) + 1;
  
  const gridItems = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = Math.floor(cols / 2);
      const cy = Math.floor(rows / 2);
      
      const dist = Math.abs(x - cx) + Math.abs(y - cy);
      const wordIndex = (dist % 7) + 1; 

      const itemX = x * CELL_SIZE;
      const itemY = y * CELL_SIZE;
      const distToMouse = Math.sqrt(Math.pow(itemX - mousePos.x, 2) + Math.pow(itemY - mousePos.y, 2));
      
      let displayWord = NUMBER_WORDS[wordIndex];
      let opacity = 0.5;

      if (distToMouse < 250) {
        opacity = 1;
        const shift = Math.floor((250 - distToMouse) / 50);
        const shiftedIndex = (wordIndex + shift) % 8;
        displayWord = NUMBER_WORDS[shiftedIndex === 0 ? 1 : shiftedIndex];
      }

      gridItems.push(
        <div
          key={`${x}-${y}`}
          className="absolute flex items-center justify-center pointer-events-none transition-all duration-300 ease-out font-mono text-xs tracking-widest select-none"
          style={{
            left: x * CELL_SIZE,
            top: y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            color: 'white',
            opacity: opacity,
            transform: loadingState.isFading ? 'scale(0.8) translateY(-20px)' : 'scale(1)',
          }}
        >
          {displayWord}
        </div>
      );
    }
  }

  return (
    <div 
      ref={containerRef}
      onClick={handleExit}
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 overflow-hidden cursor-none bg-[#8b8b83] transition-opacity duration-1000 ${loadingState.isFading ? 'opacity-0' : 'opacity-100'}`}
    >
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/20 z-10" />
        <div className="absolute inset-0" style={{ transform: 'translate(-50px, -50px)' }}> 
            {gridItems}
        </div>
        
        <div className="absolute bottom-10 w-full text-center text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase">
            Initialize
        </div>
    </div>
  );
};

export default LoadingScreen;