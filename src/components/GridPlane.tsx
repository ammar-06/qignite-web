'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GridPlaneProps {
  color?: string;
  color2?: string;
  opacity?: number;
}

export default function GridPlane({
  color = '#00C8FF',
  color2 = '#3B6FFF',
  opacity = 0.12,
}: GridPlaneProps) {
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
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 15, 50);
    camera.lookAt(0, 0, -20);

    // --- Grid floor ---
    const gridSize = 200;
    const gridDivisions = 30;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions,
      new THREE.Color(color),
      new THREE.Color(color)
    );
    gridHelper.position.y = -8;
    gridHelper.material.transparent = true;
    (gridHelper.material as THREE.Material).opacity = opacity;
    (gridHelper.material as THREE.Material).depthWrite = false;
    scene.add(gridHelper);

    // --- Horizon glow line ---
    const horizonGeo = new THREE.PlaneGeometry(gridSize, 4);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: opacity * 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.position.set(0, -6, -80);
    horizon.rotation.x = 0;
    scene.add(horizon);

    // --- Floating wireframe shapes ---
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.OctahedronGeometry(2, 0),
      new THREE.TetrahedronGeometry(1.8, 0),
      new THREE.IcosahedronGeometry(1.5, 0),
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.DodecahedronGeometry(1.5, 0),
    ];

    for (let i = 0; i < 5; i++) {
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.53 + i * 0.06, 1, 0.5),
        wireframe: true,
        transparent: true,
        opacity: opacity + Math.random() * 0.06,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (i - 2) * 18 + (Math.random() - 0.5) * 8,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 40 - 10
      );
      mesh.userData = {
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.005,
        },
        floatSpeed: Math.random() * 0.4 + 0.2,
        floatAmp: Math.random() * 3 + 1.5,
        baseY: mesh.position.y,
      };
      shapes.push(mesh);
      scene.add(mesh);
    }

    // --- Vertical light beams ---
    for (let i = 0; i < 4; i++) {
      const beamGeo = new THREE.PlaneGeometry(0.3, 30);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(i % 2 === 0 ? color : color2),
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set((i - 1.5) * 25, 7, -30 + i * 5);
      scene.add(beam);
    }

    // --- Background Stars ---
    const starCount = 250;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = Math.random() * 80;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;
      starSpeeds[i] = Math.random() * 0.5 + 0.2;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: new THREE.Color('#ffffff'),
      size: 0.5,
      transparent: true,
      opacity: 0.6,
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

      // Subtle grid drift
      gridHelper.position.z = (t * 2) % (gridSize / gridDivisions) - gridSize / gridDivisions;

      // Animate shapes
      shapes.forEach((mesh) => {
        const d = mesh.userData;
        mesh.rotation.x += d.rotSpeed.x;
        mesh.rotation.y += d.rotSpeed.y;
        mesh.rotation.z += d.rotSpeed.z;
        mesh.position.y = d.baseY + Math.sin(t * d.floatSpeed) * d.floatAmp;
      });

      // Horizon glow pulse
      horizonMat.opacity = opacity * 0.5 + Math.sin(t * 0.8) * 0.02;

      // Update background stars
      const sPos = starGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        sPos[i * 3 + 1] += Math.sin(t * starSpeeds[i] + i) * 0.005;
      }
      starGeo.attributes.position.needsUpdate = true;
      stars.rotation.y = Math.sin(t * 0.1) * 0.05;

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
      geometries.forEach(g => g.dispose());
      shapes.forEach(m => (m.material as THREE.Material).dispose());
      horizonGeo.dispose();
      horizonMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [color, color2, opacity]);

  return (
    <div
      ref={mountRef}
      className="three-scene-bg"
      aria-hidden="true"
    />
  );
}
