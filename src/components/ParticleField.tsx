'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleFieldProps {
  color?: string;
  color2?: string;
  count?: number;
  opacity?: number;
  speed?: number;
}

export default function ParticleField({
  color = '#00C8FF',
  color2 = '#3B6FFF',
  count = 180,
  opacity = 0.5,
  speed = 1,
}: ParticleFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    if (window.innerWidth <= 768) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.z = 80;

    // --- Primary particle cloud ---
    const geo1 = new THREE.BufferGeometry();
    const positions1 = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions1[i * 3] = (Math.random() - 0.5) * 200;
      positions1[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions1[i * 3 + 2] = (Math.random() - 0.5) * 80;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02 * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.015 * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01 * speed;
    }

    geo1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));

    const mat1 = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.5,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const points1 = new THREE.Points(geo1, mat1);
    scene.add(points1);

    // --- Secondary particles (different color, fewer, larger) ---
    const count2 = Math.floor(count * 0.3);
    const geo2 = new THREE.BufferGeometry();
    const positions2 = new Float32Array(count2 * 3);

    for (let i = 0; i < count2; i++) {
      positions2[i * 3] = (Math.random() - 0.5) * 180;
      positions2[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions2[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }

    geo2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));

    const mat2 = new THREE.PointsMaterial({
      color: new THREE.Color(color2),
      size: 0.8,
      transparent: true,
      opacity: opacity * 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const points2 = new THREE.Points(geo2, mat2);
    scene.add(points2);

    // --- Faint connecting lines between nearby particles ---
    const lineGeo = new THREE.BufferGeometry();
    const maxLines = 40;
    const linePositions = new Float32Array(maxLines * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // --- Animation ---
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const pos = geo1.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1] + Math.sin(t * 0.3 + i * 0.1) * 0.003;
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around
        if (pos[i * 3] > 100) pos[i * 3] = -100;
        if (pos[i * 3] < -100) pos[i * 3] = 100;
        if (pos[i * 3 + 1] > 60) pos[i * 3 + 1] = -60;
        if (pos[i * 3 + 1] < -60) pos[i * 3 + 1] = 60;
      }
      geo1.attributes.position.needsUpdate = true;

      // Update connection lines
      let lineIdx = 0;
      const lp = lineGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < count && lineIdx < maxLines; i++) {
        for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = dx * dx + dy * dy + dz * dz;
          if (dist < 400) {
            lp[lineIdx * 6] = pos[i * 3];
            lp[lineIdx * 6 + 1] = pos[i * 3 + 1];
            lp[lineIdx * 6 + 2] = pos[i * 3 + 2];
            lp[lineIdx * 6 + 3] = pos[j * 3];
            lp[lineIdx * 6 + 4] = pos[j * 3 + 1];
            lp[lineIdx * 6 + 5] = pos[j * 3 + 2];
            lineIdx++;
          }
        }
      }
      // Zero out unused line slots
      for (let i = lineIdx; i < maxLines; i++) {
        lp[i * 6] = 0; lp[i * 6 + 1] = 0; lp[i * 6 + 2] = 0;
        lp[i * 6 + 3] = 0; lp[i * 6 + 4] = 0; lp[i * 6 + 5] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;

      // Gentle rotation
      points1.rotation.y = t * 0.015 * speed;
      points1.rotation.x = Math.sin(t * 0.1) * 0.05;
      points2.rotation.y = -t * 0.01 * speed;
      points2.rotation.x = Math.cos(t * 0.08) * 0.03;

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
      geo1.dispose();
      mat1.dispose();
      geo2.dispose();
      mat2.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color, color2, count, opacity, speed]);

  return (
    <div
      ref={mountRef}
      className="three-scene-bg"
      aria-hidden="true"
    />
  );
}
