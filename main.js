import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Canvas & Renderer ────────────────────────────────────────────────
const canvas = document.getElementById('webgl');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080808);
scene.fog = new THREE.FogExp2(0x080808, 0.0018);

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 3000);
camera.position.set(0, 0, 130);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
}, { passive: true });

// ── Lighting ─────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.15));

const warmKey = new THREE.DirectionalLight(0xc9a96e, 3.5);
warmKey.position.set(100, 80, 80);
scene.add(warmKey);

const rimLight = new THREE.PointLight(0x6633cc, 5, 350);
rimLight.position.set(-90, -60, 50);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0xc9a96e, 2.5, 280);
fillLight.position.set(60, -80, 40);
scene.add(fillLight);

// ── Main Scene Group (for mouse parallax) ────────────────────────────
const mainGroup = new THREE.Group();
scene.add(mainGroup);

// ── Central Gem (Icosahedron) ─────────────────────────────────────────
const gemGeo = new THREE.IcosahedronGeometry(18, 1);
const gemMat = new THREE.MeshPhysicalMaterial({
  color: 0xc9a96e,
  metalness: 0.92,
  roughness: 0.04,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
  reflectivity: 1,
  envMapIntensity: 1.2,
});
const gem = new THREE.Mesh(gemGeo, gemMat);
mainGroup.add(gem);

// Wireframe overlay
const wireGeo = new THREE.IcosahedronGeometry(18.4, 1);
const wireMat = new THREE.MeshBasicMaterial({
  color: 0xc9a96e,
  wireframe: true,
  opacity: 0.1,
  transparent: true,
});
const wire = new THREE.Mesh(wireGeo, wireMat);
mainGroup.add(wire);

// ── Floating Rings (Accessory / Orbit feel) ───────────────────────────
const ringsData = [
  { radius: 36, tube: 0.55, rotX: 0.3, rotY: 0, rotZ: 0 },
  { radius: 50, tube: 0.4, rotX: 1.2, rotY: 0.5, rotZ: 0 },
  { radius: 64, tube: 0.3, rotX: 0.6, rotY: 1.1, rotZ: 0.4 },
  { radius: 28, tube: 0.65, rotX: -0.4, rotY: 0.8, rotZ: 1.0 },
  { radius: 78, tube: 0.25, rotX: 1.5, rotY: -0.3, rotZ: 0.7 },
];

const rings = ringsData.map(({ radius, tube, rotX, rotY, rotZ }) => {
  const geo = new THREE.TorusGeometry(radius, tube, 16, 140);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a96e,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.6,
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.set(rotX, rotY, rotZ);
  mainGroup.add(ring);
  return ring;
});

// ── Gold Dust Particles ───────────────────────────────────────────────
const PARTICLE_COUNT = 3500;
const pPositions = new Float32Array(PARTICLE_COUNT * 3);
const pColors = new Float32Array(PARTICLE_COUNT * 3);
const pSizes = new Float32Array(PARTICLE_COUNT);
const goldC = new THREE.Color(0xc9a96e);
const dimC = new THREE.Color(0x2a2015);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;
  // Distribute in a sphere shell
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 90 + Math.random() * 320;
  pPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
  pPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  pPositions[i3 + 2] = r * Math.cos(phi);

  const mix = Math.random();
  const c = goldC.clone().lerp(dimC, mix * 0.75);
  pColors[i3] = c.r;
  pColors[i3 + 1] = c.g;
  pColors[i3 + 2] = c.b;

  pSizes[i] = Math.random() * 1.2 + 0.3;
}

const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.85,
  vertexColors: true,
  transparent: true,
  opacity: 0.55,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ── Hero Entrance Animations ──────────────────────────────────────────
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.from('#hero-label', { y: 30, opacity: 0, duration: 0.9 }, 0.5)
  .from('#hero-title', { y: 70, opacity: 0, duration: 1.1 }, 0.7)
  .from('#hero-sub', { y: 40, opacity: 0, duration: 0.9 }, 1.0)
  .from('#hero-cta', { y: 30, opacity: 0, duration: 0.8 }, 1.25)
  .from('#scroll-ind', { opacity: 0, duration: 0.9 }, 1.7);

// ── GSAP Scroll Drivers ───────────────────────────────────────────────

// Camera: zoom in as hero exits
gsap.to(camera.position, {
  z: 85,
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: '20% top',
    scrub: 2.5,
  }
});

// Camera: drift back out later
gsap.to(camera.position, {
  z: 140,
  scrollTrigger: {
    trigger: '#collections',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 3,
  }
});

// Gem: full rotation journey across the entire page
gsap.to(gem.rotation, {
  y: Math.PI * 6,
  x: Math.PI * 2,
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 3.5,
  }
});

gsap.to(wire.rotation, {
  y: Math.PI * -4,
  z: Math.PI,
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 4,
  }
});

// Main group drifts down with page
gsap.to(mainGroup.position, {
  y: -70,
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2.5,
  }
});

// Particles spin through the scroll
gsap.to(particles.rotation, {
  y: Math.PI * 2.5,
  x: Math.PI * 0.6,
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 5,
  }
});

// Each ring counter-rotates on scroll
rings.forEach((ring, i) => {
  gsap.to(ring.rotation, {
    z: `+=${Math.PI * (i % 2 === 0 ? 2.5 : -2.5)}`,
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2.2 + i * 0.35,
    }
  });
});

// ── Section Reveal Animations ─────────────────────────────────────────

// Section labels & titles
gsap.utils.toArray('.section-label, .section-title, .gold-line').forEach(el => {
  gsap.from(el, {
    y: 45, opacity: 0, duration: 0.9,
    scrollTrigger: {
      trigger: el, start: 'top 88%',
      toggleActions: 'play none none reverse',
    }
  });
});

// Story text
gsap.from('.story-text', {
  x: -50, opacity: 0, duration: 1.1,
  scrollTrigger: {
    trigger: '#story', start: 'top 75%',
    toggleActions: 'play none none reverse',
  }
});

// Story image
gsap.from('#story-img', {
  x: 60, opacity: 0, duration: 1.2,
  scrollTrigger: {
    trigger: '#story', start: 'top 70%',
    toggleActions: 'play none none reverse',
  }
});

// Stats stagger
gsap.from('.story-stat', {
  y: 35, opacity: 0, duration: 0.8, stagger: 0.15,
  scrollTrigger: {
    trigger: '.story-stat-row', start: 'top 88%',
    toggleActions: 'play none none reverse',
  }
});

// Product cards stagger
gsap.utils.toArray('.product-card').forEach((card, i) => {
  gsap.from(card, {
    y: 55, opacity: 0, duration: 0.85, delay: i * 0.07,
    scrollTrigger: {
      trigger: card, start: 'top 92%',
      toggleActions: 'play none none reverse',
    }
  });
});

// Featured section
gsap.from('.featured-img img', {
  scale: 1.12, duration: 1.6, ease: 'power2.out',
  scrollTrigger: {
    trigger: '#featured', start: 'top 80%',
    toggleActions: 'play none none reverse',
  }
});

gsap.from('.featured-content > *', {
  x: 50, opacity: 0, duration: 0.9, stagger: 0.1,
  scrollTrigger: {
    trigger: '#featured', start: 'top 72%',
    toggleActions: 'play none none reverse',
  }
});

// Testimonial
gsap.from('.testimonial-stars, .testimonial-quote, .testimonial-author', {
  y: 35, opacity: 0, duration: 1, stagger: 0.18,
  scrollTrigger: {
    trigger: '#testimonials', start: 'top 80%',
    toggleActions: 'play none none reverse',
  }
});

// Newsletter
gsap.from('#newsletter > *', {
  y: 40, opacity: 0, duration: 0.9, stagger: 0.2,
  scrollTrigger: {
    trigger: '#newsletter', start: 'top 78%',
    toggleActions: 'play none none reverse',
  }
});

// Footer brand
gsap.from('.footer-col', {
  y: 30, opacity: 0, duration: 0.7, stagger: 0.12,
  scrollTrigger: {
    trigger: 'footer', start: 'top 88%',
    toggleActions: 'play none none reverse',
  }
});

// ── Navbar Frosted Glass on Scroll ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}, { passive: true });

// ── Product Card 3D Tilt Effect ───────────────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 12,
      rotateX: -y * 9,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power2.out',
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateY: 0, rotateX: 0,
      duration: 0.65, ease: 'power3.out',
    });
  });
});

// ── Subscribe Button ─────────────────────────────────────────────────
document.getElementById('subscribe-btn')?.addEventListener('click', () => {
  const input = document.getElementById('email-input');
  if (input?.value && input.value.includes('@')) {
    input.value = '';
    input.placeholder = '✓ You\'re on the list';
    input.style.borderColor = '#c9a96e';
  }
});

// ── Mouse Parallax ────────────────────────────────────────────────────
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

window.addEventListener('mousemove', e => {
  targetX = (e.clientX / innerWidth - 0.5) * 2;
  targetY = (e.clientY / innerHeight - 0.5) * 2;
}, { passive: true });

// ── Animate Loop ──────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Smooth mouse lerp
  currentX += (targetX - currentX) * 0.04;
  currentY += (targetY - currentY) * 0.04;

  // Apply parallax to main group
  mainGroup.rotation.y += (currentX * 0.22 - mainGroup.rotation.y) * 0.03;
  mainGroup.rotation.x += (-currentY * 0.16 - mainGroup.rotation.x) * 0.03;

  // Gem constant slow spin
  gem.rotation.y += 0.0025;
  wire.rotation.y += 0.0025;
  wire.rotation.z += 0.001;

  // Breathing pulse on gem
  const pulse = 1 + Math.sin(t * 0.9) * 0.028;
  gem.scale.setScalar(pulse);
  wire.scale.setScalar(pulse);

  // Rings orbit at different speeds
  rings.forEach((ring, i) => {
    ring.rotation.y += 0.0012 * (i % 2 === 0 ? 1 : -1);
    ring.rotation.x += 0.0006 * (i + 1) * 0.4;
  });

  // Particles very slow drift
  particles.rotation.y += 0.00012;
  particles.rotation.x += 0.00006;

  // Rim light pulse
  rimLight.intensity = 4 + Math.sin(t * 0.6) * 1.5;

  renderer.render(scene, camera);
}

animate();

console.log('✦ AURUM — Luxury 3D Site Loaded');