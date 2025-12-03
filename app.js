/**
 * /// NEURAL MATRIX ALGORITHM V2.0 ///
 * MASTER ARCHITECT: CODE-TO-REALITY ENGINE
 * FUNCTIONS: Device Detection, Neural Globe Generation, Input Reaction
 */

// [01] STRATEGIC DEVICE DETECTION
const deviceTag = document.getElementById('device-tag');
let deviceType = "DESKTOP NODE";
if(window.innerWidth > 2000) deviceType = "TV / THEATER DISPLAY";
else if(window.innerWidth < 768) deviceType = "MOBILE COMMAND";
else if(window.innerWidth < 1024) deviceType = "TABLET INTERFACE";

deviceTag.innerText = `DETECTED: ${deviceType}`;

// [02] THREE.JS ENGINE SETUP
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Camera positioned for cinematic width
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance cap
container.appendChild(renderer.domElement);

// [03] THE ALGORITHM: NEURAL SPHERE GENERATION
// We create points on a sphere surface and connect them dynamically
const particleCount = window.innerWidth < 768 ? 400 : 800; // Optimize for mobile
const globeGeometry = new THREE.BufferGeometry();
const positions = [];
const originalPositions = [];

const radius = 12;

for (let i = 0; i < particleCount; i++) {
    // Spherical coordinates logic
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    positions.push(x, y, z);
    originalPositions.push(x, y, z); // Store for elastic return
}

globeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

// Material: The "Singularity" Look
const particleMaterial = new THREE.PointsMaterial({
    color: 0x00f3ff,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const globe = new THREE.Points(globeGeometry, particleMaterial);
scene.add(globe);

// Geometric Core (Wireframe Icosahedron inside)
const coreGeo = new THREE.IcosahedronGeometry(10, 1);
const coreMat = new THREE.MeshBasicMaterial({ 
    color: 0xff0055, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.05 
});
const core = new THREE.Mesh(coreGeo, coreMat);
scene.add(core);


// [04] INPUT EVENT LISTENERS (MOUSE + TOUCH)
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', onDocumentMouseMove);
document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05; // Sensitivity
    mouseY = (event.clientY - windowHalfY) * 0.05;
}

function onDocumentTouchMove(event) {
    if(event.touches.length > 0) {
        mouseX = (event.touches[0].clientX - windowHalfX) * 0.1;
        mouseY = (event.touches[0].clientY - windowHalfY) * 0.1;
    }
}

// [05] ANIMATION LOOP (THE HEARTBEAT)
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Smooth Rotation
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    globe.rotation.y += 0.002 + (targetX - globe.rotation.y) * 0.05;
    globe.rotation.x += 0.001 + (targetY - globe.rotation.x) * 0.05;

    core.rotation.y -= 0.002; // Counter rotation for complexity

    // "Breathing" Effect (Vertex Shader Simulation in JS)
    const positions = globe.geometry.attributes.position.array;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // complex wave formula for organic movement
        const wave = Math.sin(time * 2 + originalPositions[i3+1] * 0.5) * 0.2; 
        
        positions[i3] = originalPositions[i3] + (originalPositions[i3] * wave * 0.1);
        positions[i3+1] = originalPositions[i3+1] + (originalPositions[i3+1] * wave * 0.1);
        positions[i3+2] = originalPositions[i3+2] + (originalPositions[i3+2] * wave * 0.1);
    }
    
    globe.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// [06] RESIZE HANDLER (CRITICAL FOR TV/MOBILE)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update Device Tag on rotate
    if(window.innerWidth > 2000) deviceType = "TV / THEATER DISPLAY";
    else if(window.innerWidth < 768) deviceType = "MOBILE COMMAND";
    else if(window.innerWidth < 1024) deviceType = "TABLET INTERFACE";
    deviceTag.innerText = `DETECTED: ${deviceType}`;
});

// START
animate();

// [07] GSAP CINEMATIC ENTRANCE
gsap.from(".mega-title", {
    duration: 2,
    y: 100,
    opacity: 0,
    ease: "power4.out",
    delay: 0.5
});

gsap.from(".manifesto", {
    duration: 1.5,
    x: -50,
    opacity: 0,
    ease: "power2.out",
    delay: 1
});

gsap.from(".matrix-card", {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "back.out(1.7)",
    delay: 1.5
});
