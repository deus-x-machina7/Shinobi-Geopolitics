import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VillageEntranceProps {
  nationId: string;
  onComplete?: () => void;
}

const VillageEntrance: React.FC<VillageEntranceProps> = ({ nationId, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Notify parent immediately so content is ready behind the curtain
    if (onComplete) onComplete();

    // Remove the component after the animation sequence completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  const renderEffect = () => {
    switch (nationId) {
      case 'Fire': return <KonohaLeaves />;
      case 'Lightning': return <KumoLightning />;
      case 'Earth': return <IwaStones />;
      case 'Wind': return <SunaSandstorm />;
      case 'Water': return <KiriClouds />;
      case 'Rain': return <AmeRain />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col">
      {/* 
        The Background Curtain 
        - Starts covering the screen (x: 0)
        - Slides to the right (x: '100%') to reveal content underneath
        - Delays slightly so particles (the leading edge) appear first
      */}
      <motion.div
        className="absolute inset-0 bg-void z-10"
        initial={{ x: 0 }}
        animate={{ x: '100%' }}
        transition={{ 
          duration: 1.0, 
          ease: [0.4, 0, 0.2, 1], // Fast start, smooth end
          delay: 0.1 
        }}
      />

      {/* 
        The Effects Layer 
        - Z-index higher than curtain so they are visible on top of black 
        - Then visible on top of content as curtain slides away
      */}
      <div className="absolute inset-0 z-20 overflow-hidden">
        {renderEffect()}
      </div>
    </div>
  );
};

// --- Effect Components ---

const KonohaLeaves = () => {
  const leafCount = 35;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(leafCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: -100, 
            y: Math.random() * window.innerHeight, 
            opacity: 0, 
            rotate: 0 
          }}
          animate={{ 
            x: window.innerWidth + 200, 
            y: Math.random() * window.innerHeight + (Math.random() * 200 - 100), 
            opacity: [0, 1, 1, 0],
            rotate: 360 + Math.random() * 180
          }}
          transition={{ 
            duration: 1.2 + Math.random() * 0.5,
            delay: Math.random() * 0.3,
            ease: "easeOut"
          }}
          className="absolute w-6 h-6 text-red-500/80"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 14,8 18,10C22,12 20,16 18,18C16,20 12,22 12,22C12,22 8,20 6,18C4,16 2,12 6,10C10,8 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const KumoLightning = () => {
  const boltCount = 60; // Increased count
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(boltCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 1, 0] }}
          transition={{ 
            duration: 0.15, 
            delay: Math.random() * 0.9,
            times: [0, 0.1, 0.2, 0.3, 1] 
          }}
          className="absolute text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.9)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            // Smaller size (0.2 - 0.5 scale)
            transform: `scale(${0.2 + Math.random() * 0.3}) rotate(${Math.random() * 360}deg)`
          }}
        >
          <svg width="40" height="70" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const IwaStones = () => {
  const stoneCount = 25;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(stoneCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -100, y: Math.random() * window.innerHeight, rotate: 0 }}
          animate={{ 
            x: window.innerWidth + 150, 
            rotate: 180 + Math.random() * 360 
          }}
          transition={{ 
            duration: 1.0 + Math.random() * 0.6,
            ease: "linear",
            delay: Math.random() * 0.2
          }}
          className="absolute bg-[#8b4513] rounded-sm shadow-lg border-t border-l border-[#a0522d]"
          style={{
            width: 20 + Math.random() * 30,
            height: 15 + Math.random() * 25,
            top: `${Math.random() * 100}%`
          }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
        </motion.div>
      ))}
    </div>
  );
};

const SunaSandstorm = () => {
  const particleCount = 400;
  return (
    <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay overflow-hidden">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -50, opacity: 0 }}
          animate={{ 
            x: window.innerWidth + 100, 
            opacity: [0, 0.8, 0],
            y: Math.random() * 50 - 25 
          }}
          transition={{ 
            duration: 0.6 + Math.random() * 0.6,
            repeat: 0, 
            delay: Math.random() * 0.6,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-[#f4a460] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            width: Math.random() > 0.8 ? 2 : 1,
            height: Math.random() > 0.8 ? 2 : 1,
          }}
        />
      ))}
    </div>
  );
};

const KiriClouds = () => {
  const cloudCount = 20;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(cloudCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, x: -200 }}
          animate={{ 
            opacity: [0, 0.8, 0.8, 0], 
            scale: 1.2, 
            x: window.innerWidth + 200 // Move fully across screen L->R
          }}
          transition={{ 
            duration: 1.8,
            delay: Math.random() * 0.4,
            ease: "easeInOut"
          }}
          className="absolute text-blue-300/30"
          style={{
            // Distribute start positions vertically
            top: `${Math.random() * 100}%`,
            width: 250 + Math.random() * 300,
            // Stagger start X slightly so they don't all appear in a line
            left: `${-200 + Math.random() * 100}px` 
          }}
        >
           <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full filter blur-2xl">
              <path d="M17.5,19c-3.03,0-5.5-2.47-5.5-5.5c0-0.34,0.04-0.67,0.1-1C11.53,12.15,10.79,12,10,12c-3.31,0-6,2.69-6,6 s2.69,6,6,6c0.34,0,0.67-0.04,1-0.1c0.57,2.23,2.59,3.89,5,4.07c0.17,0.02,0.33,0.03,0.5,0.03c2.76,0,5-2.24,5-5 S19.26,19,17.5,19z M19,16c0,1.66-1.34,3-3,3s-3-1.34-3-3s1.34-3,3-3S19,14.34,19,16z"/>
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
           </svg>
        </motion.div>
      ))}
    </div>
  );
};

const AmeRain = () => {
  const dropCount = 300;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(dropCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: Math.random() * window.innerWidth, y: -100, opacity: 0 }}
          animate={{ 
            x: `+=${50}`, // Slight diagonal
            y: window.innerHeight + 100,
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 0.3 + Math.random() * 0.2, 
            repeat: 1,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
          className="absolute w-[1px] bg-slate-400/50"
          style={{
            height: 30 + Math.random() * 40,
            transform: 'rotate(-15deg)', 
          }}
        />
      ))}
    </div>
  );
};

export default VillageEntrance;