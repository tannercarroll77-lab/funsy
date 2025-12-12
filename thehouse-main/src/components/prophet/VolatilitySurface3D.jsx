import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function VolatilitySurface3D({ data, edgeScore }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!data || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    const container = mountRef.current;
    const size = Math.min(container.clientWidth, container.clientHeight);
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.set(15, 15, 15);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Create volatility surface
    const geometry = new THREE.PlaneGeometry(20, 20, 30, 30);
    const positions = geometry.attributes.position;
    
    // Generate surface based on IV data
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 2 + 
                Math.sin(x * 0.5 + y * 0.5) * 1.5;
      positions.setZ(i, z);
    }
    geometry.computeVertexNormals();

    // Edge score affects color
    const color = new THREE.Color(
      edgeScore > 70 ? '#00ffff' : edgeScore > 50 ? '#a855f7' : '#dc2626'
    );

    const material = new THREE.MeshPhongMaterial({
      color: color,
      wireframe: false,
      transparent: true,
      opacity: 0.8,
      emissive: color,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2.2;
    scene.add(mesh);

    // Wireframe overlay
    const wireframeGeo = geometry.clone();
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
    wireframe.rotation.x = -Math.PI / 2.2;
    scene.add(wireframe);

    // Lighting
    const light1 = new THREE.DirectionalLight(0x00ffff, 1);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    light2.position.set(-10, 5, -10);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Pulse effect
      mesh.material.emissiveIntensity = 0.3 + Math.sin(Date.now() * 0.002) * 0.2;
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      renderer.dispose();
    };
  }, [data, edgeScore]);

  return <div ref={mountRef} className="w-full h-full" />;
}