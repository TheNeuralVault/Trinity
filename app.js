/**
 * /// NEURAL MATRIX VAULT ///
 * COMPONENT: CORE ENGINE
 * PLATFORM: GITHUB PAGES
 */

// DEVICE DETECTION LOGIC
const deviceReadout = document.getElementById('device-readout');
const width = window.innerWidth;

if(width < 768) {
    deviceReadout.innerText = "MOBILE NODE";
} else if(width < 1200) {
    deviceReadout.innerText = "TABLET NODE";
} else {
    deviceReadout.innerText = "WORKSTATION";
}

// THREE.JS SCENE SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// GEOMETRY
const geometry = new THREE.BufferGeometry();
const count = width < 768 ? 600 : 1200; 
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 25;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const coreGeo = new THREE.IcosahedronGeometry(4, 1);
const coreMat = new THREE.MeshBasicMaterial({ 
    color: 0xffffff, 
    wireframe: true, 
    transparent: true, 
    opacity: 0.05 
});
const core = new THREE.Mesh(coreGeo, coreMat);
scene.add(core);

// ANIMATION LOOP
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth/2) * 0.001;
    mouseY = (e.clientY - window.innerHeight/2) * 0.001;
});

document.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) {
        mouseX = (e.touches[0].clientX - window.innerWidth/2) * 0.002;
        mouseY = (e.touches[0].clientY - window.innerHeight/2) * 0.002;
    }
}, { passive: true });

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.002;
    core.rotation.y -= 0.002;
    core.rotation.x += 0.001;
    particles.rotation.x += (mouseY - particles.rotation.x) * 0.05;
    particles.rotation.y += (mouseX - particles.rotation.y) * 0.05;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(window.innerWidth < 768) deviceReadout.innerText = "MOBILE NODE";
    else if(window.innerWidth < 1200) deviceReadout.innerText = "TABLET NODE";
    else deviceReadout.innerText = "WORKSTATION";
});

// GSAP INTRO
if(typeof gsap !== 'undefined') {
    gsap.from(".mega-title", { duration: 1.5, y: 50, opacity: 0, ease: "power4.out", delay: 0.2 });
    gsap.from(".manifesto", { duration: 1, x: -20, opacity: 0, delay: 0.5 });
    gsap.from(".titan-btn", { duration: 1, y: 20, opacity: 0, stagger: 0.2, delay: 0.8 });
    gsap.from(".matrix-card", { duration: 0.8, y: 50, opacity: 0, stagger: 0.1, delay: 1.2 });
}
