// components/three/ShaderImagesWithLenis.tsx
"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useLenis } from 'lenis/react'; // If you're using react-lenis

// Simple, tested shaders that should compile
const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uScrollVelocity;
  
  varying vec2 vUv;
  
  void main() {
    vec2 st = vUv;
    
    // Simple wave based on scroll
    float wave = sin(st.y * 10.0 + uTime) * uScrollVelocity * 0.001;
    st.x += wave;
    
    vec4 color = texture2D(uTexture, st);
    
    // Tint red when scrolling for debug
    color.r += abs(uScrollVelocity) * 0.01;
    
    gl_FragColor = color;
  }
`;

// Enhanced Image Mesh with debugging
function ImageMeshWithLenis({ 
  texture, 
  position, 
  scale,
  parallaxOffset = 0,
  index,
  debug = false
}: { 
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  parallaxOffset?: number;
  index: number;
  debug?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const scrollVelocityRef = useRef(0);
  const currentScrollRef = useRef(0);
  const debugIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Log initialization
  useEffect(() => {
    console.log(`🖼️ Image ${index + 1} initialized:`, {
      position,
      scale,
      parallaxOffset
    });
  }, [index, position, scale, parallaxOffset]);
  
  // Use Lenis if available
  const lenis = useLenis((lenis: { velocity: number; scroll: number; }) => {
    if (lenis) {
      scrollVelocityRef.current = lenis.velocity;
      currentScrollRef.current = lenis.scroll;
    }
  });
  
  // Fallback to window scroll with better velocity calculation
  useEffect(() => {
    if (!lenis) {
      console.log('⚠️ Lenis not detected, using window scroll fallback');
      let lastScroll = window.scrollY;
      let lastTime = performance.now();
      
      const handleScroll = () => {
        const currentTime = performance.now();
        const currentScroll = window.scrollY;
        const deltaTime = currentTime - lastTime;
        const deltaScroll = currentScroll - lastScroll;
        
        // Calculate velocity (pixels per millisecond, then scale up)
        const velocity = (deltaScroll / deltaTime) * 100;
        
        scrollVelocityRef.current = velocity;
        currentScrollRef.current = currentScroll;
        
        // Log significant velocities
        if (Math.abs(velocity) > 5) {
          console.log(`🚀 Scroll velocity detected:`, velocity.toFixed(2));
        }
        
        lastScroll = currentScroll;
        lastTime = currentTime;
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      console.log('✅ Lenis detected and active');
    }
  }, [lenis]);
  
  // Debug logging interval
  useEffect(() => {
    if (debug) {
      debugIntervalRef.current = setInterval(() => {
        console.log(`📊 Debug Info - Image ${index + 1}:`, {
          scroll: currentScrollRef.current.toFixed(2),
          velocity: scrollVelocityRef.current.toFixed(2),
          hovered: hovered,
          time: materialRef.current?.uniforms.uTime.value.toFixed(2) || 'N/A'
        });
      }, 1000);
      
      return () => {
        if (debugIntervalRef.current) {
          clearInterval(debugIntervalRef.current);
        }
      };
    }
  }, [debug, index, hovered]);
  
  // Test velocity listener for debugging
  useEffect(() => {
    const handleTestVelocity = (e: CustomEvent) => {
      console.log(`🧪 Image ${index + 1} received test velocity:`, e.detail);
      scrollVelocityRef.current = e.detail;
    };
    
    window.addEventListener('test-velocity' as any, handleTestVelocity);
    return () => window.removeEventListener('test-velocity' as any, handleTestVelocity);
  }, [index]);
  
  // Initialize shader material - removed since we're setting uniforms directly in JSX
  
  // Animation loop with detailed debugging
  let frameCount = 0;
  let lastLoggedVelocity = 0;
  
  useFrame((state) => {
    frameCount++;
    
    if (materialRef.current) {
      // Check if material exists and log its state
      if (frameCount % 60 === 0 && debug) {
        console.log(`🔧 Material check - Image ${index + 1}:`, {
          materialExists: !!materialRef.current,
          uniformsExist: !!materialRef.current.uniforms,
          currentVelocity: scrollVelocityRef.current,
          timeUniform: materialRef.current.uniforms.uTime?.value,
          velocityUniform: materialRef.current.uniforms.uScrollVelocity?.value
        });
      }
      
      // Update uniforms - simplified to match our shader
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScrollVelocity.value = scrollVelocityRef.current;
      
      // Force update
      materialRef.current.needsUpdate = true;
      
      // Log the actual uniform values periodically
      if (debug && frameCount % 120 === 0) {
        console.log(`📊 Uniforms state - Image ${index + 1}:`, {
          time: materialRef.current.uniforms.uTime.value.toFixed(2),
          scrollVelocity: materialRef.current.uniforms.uScrollVelocity.value.toFixed(2),
          hover: materialRef.current.uniforms.uHover.value.toFixed(2),
          debug: materialRef.current.uniforms.uDebug.value
        });
        
        // Also check if the shader program is compiled
        if (materialRef.current.program) {
          console.log(`✅ Shader program is compiled for Image ${index + 1}`);
        } else {
          console.log(`❌ Shader program NOT compiled for Image ${index + 1}`);
        }
      }
    } else {
      if (frameCount % 60 === 0) {
        console.log(`❌ No material ref for Image ${index + 1}`);
      }
    }
    
    // Parallax effect
    if (meshRef.current && parallaxOffset !== 0) {
      const scrollProgress = currentScrollRef.current * 0.001;
      const newY = position[1] + (scrollProgress * parallaxOffset);
      meshRef.current.position.y = newY;
    }
    
    // Slower decay for scroll velocity so effect lasts longer
    scrollVelocityRef.current *= 0.98; // Changed from 0.95 to 0.98
  });
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={() => {
        setHovered(true);
        console.log(`🖱️ Mouse entered image ${index + 1}`);
      }}
      onPointerOut={() => {
        setHovered(false);
        console.log(`🖱️ Mouse left image ${index + 1}`);
      }}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
          uScrollVelocity: { value: 0 }
        }}
        onUpdate={(material) => {
          // Log shader compilation errors
          const gl = (material as any).program?.gl;
          if (gl && (material as any).program) {
            const program = (material as any).program;
            const vertexLog = gl.getShaderInfoLog(program.vertexShader);
            const fragmentLog = gl.getShaderInfoLog(program.fragmentShader);
            
            if (vertexLog) console.error(`Vertex shader error: ${vertexLog}`);
            if (fragmentLog) console.error(`Fragment shader error: ${fragmentLog}`);
          }
        }}
      />
    </mesh>
  );
}

// Main scene component
export function ShaderImagesWithLenis({ showDebug = true }: { showDebug?: boolean }) {
  // Load textures with logging
  const textures = [
    useLoader(TextureLoader, '/section2_1.jpg'),
    useLoader(TextureLoader, '/section2_2.jpg'),
    useLoader(TextureLoader, '/section2_3.jpg'),
    useLoader(TextureLoader, '/section2_4.jpg')
  ];
  
  useEffect(() => {
    console.log('🖼️ Textures loaded:', textures.map((t, i) => ({
      [`Image ${i + 1}`]: t.image ? '✅ OK' : '❌ Failed'
    })));
  }, [textures]);
  
  // Global debug info logging
  useEffect(() => {
    if (showDebug) {
      const logGlobalInfo = () => {
        console.log('🌍 Global Scene Info:', {
          windowScroll: window.scrollY,
          innerHeight: window.innerHeight,
          timestamp: new Date().toLocaleTimeString()
        });
      };
      
      // Log every 2 seconds
      const interval = setInterval(logGlobalInfo, 2000);
      
      // Log on scroll
      const handleScroll = () => {
        console.log('📜 Scroll event:', {
          position: window.scrollY,
          maxScroll: document.body.scrollHeight - window.innerHeight
        });
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showDebug]);
  
  // Configuration for each image
  const imageConfigs = [
    { 
      position: [-3, -2, 0] as [number, number, number], 
      scale: [2.2, 3.25, 1] as [number, number, number],
      parallaxOffset: -1.7
    },
    { 
      position: [2, 0, 0] as [number, number, number], 
      scale: [1.625, 2.375, 1] as [number, number, number],
      parallaxOffset: -1.1
    },
    { 
      position: [0, -1, 0] as [number, number, number], 
      scale: [1.625, 2.375, 1] as [number, number, number],
      parallaxOffset: -2.5
    },
    { 
      position: [3, 2, 0] as [number, number, number], 
      scale: [1.625, 2.375, 1] as [number, number, number],
      parallaxOffset: -0.4
    }
  ];
  
  return (
    <>
      {textures.map((texture, index) => (
        <ImageMeshWithLenis
          key={index}
          texture={texture}
          position={imageConfigs[index].position}
          scale={imageConfigs[index].scale}
          parallaxOffset={imageConfigs[index].parallaxOffset}
          index={index}
          debug={showDebug && index === 0} // Enable detailed debug for first image
        />
      ))}
    </>
  );
}

// Complete scene with Canvas
export function ShaderImagesSceneWithLenis({ showDebug = true }: { showDebug?: boolean }) {
  useEffect(() => {
    console.log('🎬 ShaderImagesSceneWithLenis mounted');
    
    // Add a global test function for debugging
    if (showDebug) {
      (window as any).testShaderVelocity = (velocity: number) => {
        console.log(`🧪 Manually setting velocity to ${velocity}`);
        // This will be picked up by the shader components
        window.dispatchEvent(new CustomEvent('test-velocity', { detail: velocity }));
      };
      console.log('💡 Debug: Use window.testShaderVelocity(100) in console to test');
    }
    
    return () => {
      console.log('🎬 ShaderImagesSceneWithLenis unmounted');
      delete (window as any).testShaderVelocity;
    };
  }, [showDebug]);
  
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ 
          position: [0, 0, 10], 
          fov: 50 
        }}
        style={{ pointerEvents: 'auto' }}
        onCreated={({ gl, camera }) => {
          console.log('🎨 Canvas created:', { 
            renderer: gl.info.render,
            cameraPosition: camera.position.toArray(),
            cameraFov: (camera as THREE.PerspectiveCamera).fov
          });
        }}
      >
        <React.Suspense fallback={null}>
          <ShaderImagesWithLenis showDebug={showDebug} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}