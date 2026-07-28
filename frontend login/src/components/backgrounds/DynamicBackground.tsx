import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InputMode } from '../InputSection'; 

// --- TEXT BACKGROUND ---
function TextBackground() {
  const words = ["DATA", "RISK", "SIGNAL", "ANALYSIS", "EVALUATE", "PATTERN", "01001", "TRACE"];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }} 
      className="absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-teal-500/10 font-doto text-xl font-bold whitespace-nowrap select-none"
          initial={{ 
            y: -100 - Math.random() * 500, 
            x: `${Math.random() * 100}vw` 
          }}
          animate={{ 
            y: '110vh' 
          }}
          transition={{ 
            duration: 10 + Math.random() * 15, 
            repeat: Infinity, 
            delay: Math.random() * 5, 
            ease: 'linear' 
          }}
        >
          {words[Math.floor(Math.random() * words.length)]}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-teal-500/5 mix-blend-overlay" />
    </motion.div>
  );
}

// --- IMAGE BACKGROUND ---
function ImageBackground() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }} 
      className="absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-30">
        {Array.from({ length: 60 }).map((_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          return (
            <motion.div
              key={i}
              className="absolute w-24 h-24 border border-amber-500/10 bg-amber-500/5 backdrop-blur-sm"
              initial={{ 
                 x: `${(col - 5) * 10}vw`, 
                 y: `${(row - 3) * 15}vh`
              }}
              animate={{ 
                opacity: [0.05, 0.2, 0.05], 
                scale: [1, 1.05, 1], 
                filter: ['blur(4px)', 'blur(0px)', 'blur(4px)'] 
              }}
              transition={{ 
                duration: 4 + Math.random() * 3, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </motion.div>
  );
}

// --- SPEECH BACKGROUND ---
function SpeechBackground() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }} 
      className="absolute inset-0 flex items-center justify-center gap-2 overflow-hidden opacity-30"
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-4 bg-emerald-500/20 rounded-full"
          animate={{ height: [`${10 + Math.random()*20}vh`, `${50 + Math.random()*40}vh`, `${10 + Math.random()*20}vh`] }}
          transition={{ 
            duration: 1 + Math.random() * 1.5, 
            repeat: Infinity, 
            delay: Math.random() * 0.5, 
            ease: 'easeInOut' 
          }}
        />
      ))}
    </motion.div>
  );
}

// --- VIDEO BACKGROUND ---
function VideoBackground() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }} 
      className="absolute inset-0 overflow-hidden"
    >
      {/* Scanlines */}
      <motion.div 
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-rose-500/0 via-rose-500/5 to-rose-500/0"
        animate={{ y: ['-100vh', '150vh'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      {/* Moving frames */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-rose-500/10"
          initial={{
            width: `${20 + Math.random() * 30}vw`,
            height: `${20 + Math.random() * 30}vh`,
            x: `${Math.random() * 80}vw`,
            y: `${Math.random() * 80}vh`,
          }}
          animate={{
            x: [`${Math.random() * 80}vw`, `${Math.random() * 80}vw`],
            y: [`${Math.random() * 80}vh`, `${Math.random() * 80}vh`],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: 'linear', repeatType: 'mirror' }}
        />
      ))}
      {/* Viewfinder brackets */}
      <div className="absolute inset-20 flex justify-between p-4 opacity-40">
        <span className="w-16 h-16 border-t-2 border-l-2 border-rose-500/30" />
        <span className="w-16 h-16 border-t-2 border-r-2 border-rose-500/30" />
      </div>
      <div className="absolute inset-20 flex justify-between items-end p-4 opacity-40">
        <span className="w-16 h-16 border-b-2 border-l-2 border-rose-500/30" />
        <span className="w-16 h-16 border-b-2 border-r-2 border-rose-500/30" />
      </div>
    </motion.div>
  );
}

// --- AUDIO BACKGROUND ---
function AudioBackground() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }} 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-purple-500/20 bg-purple-500/[0.02]"
          style={{ width: `${30 + i * 15}vw`, height: `${30 + i * 15}vw` }}
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.05, 0.3, 0.05] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: i * 0.5, 
            ease: 'easeInOut' 
          }}
        />
      ))}
    </motion.div>
  );
}

interface DynamicBackgroundProps {
  mode: InputMode;
}

export function DynamicBackground({ mode }: DynamicBackgroundProps) {
  return (
     <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
       <AnimatePresence mode="wait">
          {mode === 'text' && <TextBackground key="text" />}
          {mode === 'image' && <ImageBackground key="image" />}
          {mode === 'speech' && <SpeechBackground key="speech" />}
          {mode === 'video' && <VideoBackground key="video" />}
          {mode === 'audio' && <AudioBackground key="audio" />}
       </AnimatePresence>
     </div>
  );
}
