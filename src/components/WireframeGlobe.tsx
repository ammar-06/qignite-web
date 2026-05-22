'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WireframeGlobeProps {
  color?: string;
  color2?: string;
  opacity?: number;
  size?: number;
}

export default function WireframeGlobe({
  color = '#00C8FF',
  color2 = '#3B6FFF',
  opacity = 0.1,
  size = 12,
}: WireframeGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    if (window.innerWidth <= 768) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.z = 40;

    // --- Main wireframe sphere ---
    const sphereGeo = new THREE.SphereGeometry(size, 24, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe: true,
      transparent: true,
      opacity: opacity,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // --- Inner icosahedron ---
    const icoGeo = new THREE.IcosahedronGeometry(size * 0.55, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color2),
      wireframe: true,
      transparent: true,
      opacity: opacity * 0.6,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // --- Equatorial ring ---
    const ringGeo = new THREE.TorusGeometry(size * 1.25, 0.08, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity * 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    scene.add(ring);

    // --- Second tilted ring ---
    const ring2Geo = new THREE.TorusGeometry(size * 1.4, 0.05, 8, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color2),
      transparent: true,
      opacity: opacity * 0.3,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // --- Orbital dots ---
    const dotCount = 60;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(dotCount * 3);
    const dotAngles = new Float32Array(dotCount);
    const dotRadii = new Float32Array(dotCount);
    const dotPlanes = new Float32Array(dotCount);

    for (let i = 0; i < dotCount; i++) {
      dotAngles[i] = Math.random() * Math.PI * 2;
      dotRadii[i] = size * (0.9 + Math.random() * 0.6);
      dotPlanes[i] = (Math.random() - 0.5) * Math.PI;
      const r = dotRadii[i];
      const angle = dotAngles[i];
      const plane = dotPlanes[i];
      dotPositions[i * 3] = Math.cos(angle) * r * Math.cos(plane);
      dotPositions[i * 3 + 1] = Math.sin(plane) * r * 0.5;
      dotPositions[i * 3 + 2] = Math.sin(angle) * r * Math.cos(plane);
    }

    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.6,
      transparent: true,
      opacity: opacity * 2,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    // --- Background Stars ---
    const starCount = 200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 150;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      starSpeeds[i] = Math.random() * 0.5 + 0.2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: new THREE.Color('#ffffff'),
      size: 0.5,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- Animation ---
    let animId: number;
    const clock = new THREE.Clock();

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      sphere.rotation.y = t * 0.06;
      sphere.rotation.x = Math.sin(t * 0.04) * 0.1;
      sphereMat.opacity = opacity + Math.sin(t * 0.5) * 0.02;

      ico.rotation.y = -t * 0.08;
      ico.rotation.x = t * 0.04;

      ring.rotation.z = t * 0.03;
      ring2.rotation.z = -t * 0.02;

      // Update orbital dots
      const dp = dotGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dotCount; i++) {
        dotAngles[i] += 0.003 + (i % 3) * 0.001;
        const r = dotRadii[i];
        const angle = dotAngles[i];
        const plane = dotPlanes[i];
        dp[i * 3] = Math.cos(angle) * r * Math.cos(plane);
        dp[i * 3 + 1] = Math.sin(plane) * r * 0.5 + Math.sin(t * 0.5 + i) * 0.5;
        dp[i * 3 + 2] = Math.sin(angle) * r * Math.cos(plane);
      }
      dotGeo.attributes.position.needsUpdate = true;

      // Update background stars
      const sPos = starGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        sPos[i * 3 + 1] += Math.sin(t * starSpeeds[i] + i) * 0.005;
      }
      starGeo.attributes.position.needsUpdate = true;
      stars.rotation.y = t * 0.015;
      stars.rotation.x = t * 0.01;

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
      sphereGeo.dispose();
      sphereMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color, color2, opacity, size]);

  return (
    <div
      ref={mountRef}
      className="three-scene-bg"
      aria-hidden="true"
    />
  );
}
