"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { Shield } from 'lucide-react';

interface WovenLightHeroProps {
  onStart?: () => void;
}

// --- Main Hero Component ---
export const WovenLightHero = ({ onStart }: WovenLightHeroProps) => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    // Add a more elegant font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05 + 1.5,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
        opacity: 1,
        y: 0,
        transition: { delay: 2.2, duration: 0.8 }
    });

    return () => {
        document.head.removeChild(link);
    }
  }, [textControls, buttonControls]);

  const headline = "Assess Digital Content Authenticity Risk";
  
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black dark:bg-zinc-950">
      <WovenCanvas />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Shield className="w-4 h-4" />
          <span>Enterprise-Grade Content Moderation</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-7xl font-bold text-white dark:text-zinc-100 leading-tight mb-6" style={{ textShadow: '0 0 50px rgba(59, 130, 246, 0.2)' }}>
            {headline.split(" ").map((word, i) => (
                <span key={i} className="inline-block">
                    {word.split("").map((char, j) => (
                        <motion.span key={j} custom={i * 5 + j} initial={{ opacity: 0, y: 30 }} animate={textControls} style={{ display: 'inline-block' }}>
                            {char}
                        </motion.span>
                    ))}
                    {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
        
        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 20 }}
          animate={textControls}
          className="mx-auto mt-4 max-w-2xl text-lg md:text-xl text-slate-300 dark:text-zinc-400 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          DARE is a multi-agent AI system that evaluates digital content for manipulation, extracts evidence signals, and provides explainable risk assessments for trust & safety teams.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={buttonControls} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto rounded-xl border border-blue-500/30 bg-blue-600 hover:bg-blue-500 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Start Analysis
          </button>
          <a 
            href="#about"
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 font-semibold text-zinc-200 backdrop-blur-sm transition-all" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Learn More
          </a>
        </motion.div>
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

// --- Three.js Canvas Component ---
const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // --- Woven Silk ---
    const particleCount = 50000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);

    for (let i = 0; i < particleCount; i++) {
        const vertexIndex = i % torusKnot.attributes.position.count;
        const x = torusKnot.attributes.position.getX(vertexIndex);
        const y = torusKnot.attributes.position.getY(vertexIndex);
        const z = torusKnot.attributes.position.getZ(vertexIndex);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        const color = new THREE.Color();
        // Give it a blue/emerald tint to match DARE theme
        color.setHSL(Math.random() * 0.1 + 0.55, 0.8, isDarkMode ? 0.5 : 0.7);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        blending: isDarkMode ? THREE.NormalBlending : THREE.AdditiveBlending,
        transparent: true,
        opacity: isDarkMode ? 1.0 : 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const currentPos = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
            const originalPos = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
            const velocity = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

            const dist = currentPos.distanceTo(mouseWorld);
            if (dist < 1.5) {
                const force = (1.5 - dist) * 0.01;
                const direction = new THREE.Vector3().subVectors(currentPos, mouseWorld).normalize();
                velocity.add(direction.multiplyScalar(force));
            }

            // Return to original position
            const returnForce = new THREE.Vector3().subVectors(originalPos, currentPos).multiplyScalar(0.001);
            velocity.add(returnForce);
            
            // Damping
            velocity.multiplyScalar(0.95);

            positions[ix] += velocity.x;
            positions[iy] += velocity.y;
            positions[iz] += velocity.z;
            
            velocities[ix] = velocity.x;
            velocities[iy] = velocity.y;
            velocities[iz] = velocity.z;
        }
        geometry.attributes.position.needsUpdate = true;

        points.rotation.y = elapsedTime * 0.05;
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 opacity-60" />;
};
