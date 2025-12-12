import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function IVSkewHelix({ putIV, callIV }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = mountRef.current;
    const size = Math.min(container.clientWidth, container.clientHeight);
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0, 15);

    // Create helix
    const helixPoints = [];
    const helixColors = [];
    
    for (let i = 0; i < 200; i++) {
      const t = i / 200;
      const angle = t * Math.PI * 8;
      const radius = 3 + Math.sin(t * Math.PI * 2) * 0.5;
      
      helixPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          t * 20 - 10,
          Math.sin(angle) * radius
        )
      );

      // Color based on put vs call IV
      const color = new THREE.Color();
      color.setHSL(t < 0.5 ? 0 : 0.5, 1, 0.5); // Red for puts, cyan for calls
      helixColors.push(color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(helixPoints);
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(helixColors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      linewidth: 3
    });

    const helix = new THREE.Line(geometry, material);
    scene.add(helix);

    // Add glowing spheres at key points
    const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);
    for (let i = 0; i < helixPoints.length; i += 20) {
      const sphereMat = new THREE.MeshBasicMaterial({
        color: i < 100 ? 0xff0000 : 0x00ffff,
        transparent: true,
        opacity: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.copy(helixPoints[i]);
      scene.add(sphere);
    }

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);

    // Animation
    let rotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      rotation += 0.01;
      helix.rotation.y = rotation;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [putIV, callIV]);

  return (
    <div ref={mountRef} className="w-full h-full" />
  );
}