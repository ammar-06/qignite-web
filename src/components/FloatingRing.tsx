'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function FloatingRing() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    if (window.innerWidth <= 768) return; // Skip on mobile

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 20;

    // Main torus knot
    const torusGeo = new THREE.TorusKnotGeometry(5, 1.5, 64, 8, 2, 3);
    const torusMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00C8FF'),
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Secondary ring
    const ringGeo = new THREE.TorusGeometry(7, 0.15, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#3B6FFF'),
      wireframe: true,
      transparent: true,
      opacity: 0.06,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Inner icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00C8FF'),
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      torus.rotation.x = t * 0.08;
      torus.rotation.y = t * 0.12;
      torusMat.opacity = 0.06 + Math.sin(t * 0.5) * 0.03;

      ring.rotation.z = t * 0.05;
      ring.rotation.y = t * 0.03;

      ico.rotation.x = -t * 0.1;
      ico.rotation.z = t * 0.07;
      icoMat.opacity = 0.04 + Math.sin(t * 0.8) * 0.02;

      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-scene-bg"
      aria-hidden="true"
    />
  );
}
