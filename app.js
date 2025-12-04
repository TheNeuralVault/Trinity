/**
 * /// NEURAL MATRIX: SIREN ENGINE ///
 * VISUAL: Liquid Particle Wave
 * MOOD: Hypnotic / Seductive / Fluid
 */

// SCENE SETUP
const scene = new THREE.Scene();
// Deep fog for depth - blending the particles into the void
scene.fog = new THREE.FogExp2(0x020005, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;
camera.position.y = 20;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// /// THE LIQUID WAVE ALGORITHM ///
// We create a plane of particles that ripples
const particleCount = window.innerWidth < 768 ? 2000 : 5000; // Dense field
const geometry = new THREE.BufferGeometry();
const positions = [];
const scales = [];

// Create a grid of particles
const separation = 4;
const width = 200;
const depth = 200;

let i = 0;
for (let ix = 0; ix < width; ix++) {
    for (let iy = 0; iy < depth; iy++) {
        const x = ix * separation - ((width * separation) / 2);
        const z = iy * separation - ((depth * separation) / 2);
        const y = 0;

        positions.push(x, y, z);
        scales.push(1);
    }
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));

// MATERIAL: THE GLOW
const material = new THREE.PointsMaterial({
    color: 0x00f3ff, // Neon Blue Base
    size: 2.5,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending // This creates the "Light" effect
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// INTERACTION
let mouseX = 0;
let mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

document.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouseX = (event.touches[0].clientX - windowHalfX);
        mouseY = (event.touches[0].clientY - windowHalfY);
    }
}, { passive: true });

// /// ANIMATION LOOP: THE BREATH ///
let count = 0;

function animate() {
    requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;
    
    // Rotate the whole system slowly (The "World Turn")
    particles.rotation.y += 0.001;

    // Camera Drift (Cinematic Movement)
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.05 + 20 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // WAVE CALCULATION
    let i = 0;
    for (let ix = 0; ix < width; ix++) {
        for (let iy = 0; iy < depth; iy++) {
            
            // This Sine Wave formula creates the "Liquid" ripple
            // We combine two waves for complexity
            const vertY = (Math.sin((ix + count) * 0.3) * 10) +
                          (Math.sin((iy + count) * 0.5) * 10);
            
            positions[i + 1] = vertY; // Update Y position

            i += 3;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    
    // Change color slowly over time (Blue to Purple pulse)
    const time = Date.now() * 0.0005;
    const h = (Math.sin(time) * 0.1) + 0.55; // Oscillate between blue and purple hue
    material.color.setHSL(h, 0.8, 0.5);

    count += 0.05; // Speed of the wave
    renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// /// GSAP CINEMATIC INTRO ///
gsap.from(".logo-mark", { duration: 2, y: -50, opacity: 0, ease: "power4.out" });
gsap.from(".sex-title", { duration: 2, y: 100, opacity: 0, ease: "power4.out", delay: 0.5 });
gsap.from(".seduction-text", { duration: 2, opacity: 0, delay: 1 });
gsap.from(".action-row", { duration: 1.5, y: 50, opacity: 0, delay: 1.2 });
gsap.from(".glass-card", { 
    duration: 1, 
    y: 100, 
    opacity: 0, 
    stagger: 0.2, 
    ease: "power2.out", 
    delay: 1.5 
});
