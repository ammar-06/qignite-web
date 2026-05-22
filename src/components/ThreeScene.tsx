'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 400;
const SHAPE_COUNT = 3;

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ─── Scene & Camera ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // ─── Particles ───
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      sizes[i] = Math.random() * 2 + 0.5;
      speeds[i] = Math.random() * 0.5 + 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#00C8FF'),
      size: 0.4,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ─── Floating Wireframe Shapes ───
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(3, 0),
      new THREE.TorusKnotGeometry(2, 0.6, 64, 8),
      new THREE.OctahedronGeometry(2.5, 0),
      new THREE.TetrahedronGeometry(2.5, 0),
      new THREE.DodecahedronGeometry(2, 0),
      new THREE.TorusGeometry(2.5, 0.4, 12, 32),
    ];

    for (let i = 0; i < SHAPE_COUNT; i++) {
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.53 + i * 0.04, 1, 0.55),
        wireframe: true,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.08,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30 - 10
      );
      mesh.userData = {
        rotSpeed: { x: (Math.random() - 0.5) * 0.008, y: (Math.random() - 0.5) * 0.008, z: (Math.random() - 0.5) * 0.005 },
        floatSpeed: Math.random() * 0.3 + 0.1,
        floatAmp: Math.random() * 3 + 1,
        baseY: mesh.position.y,
      };
      shapes.push(mesh);
      scene.add(mesh);
    }

    // ─── Mouse tracking ───
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    function onMouseMove(e: MouseEvent) {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ─── Animation Loop ───
    let animationId: number;
    const clock = new THREE.Clock();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Rotate particles gently + mouse influence
      particles.rotation.y = elapsed * 0.03 + mouse.x * 0.15;
      particles.rotation.x = elapsed * 0.015 + mouse.y * 0.1;

      // Animate individual particle positions subtly
      const pos = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += Math.sin(elapsed * speeds[i] + i) * 0.003;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Animate shapes
      shapes.forEach((mesh) => {
        const d = mesh.userData;
        mesh.rotation.x += d.rotSpeed.x;
        mesh.rotation.y += d.rotSpeed.y;
        mesh.rotation.z += d.rotSpeed.z;
        mesh.position.y = d.baseY + Math.sin(elapsed * d.floatSpeed) * d.floatAmp;

        // Mouse parallax on shapes
        mesh.position.x += (mouse.x * 2 - mesh.position.x * 0.001) * 0.02;
      });

      // Camera subtle sway
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    // ─── Resize ───
    function onResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      geometries.forEach((g) => g.dispose());
      shapes.forEach((m) => (m.material as THREE.Material).dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-scene-fg"
      aria-hidden="true"
    />
  );
}
