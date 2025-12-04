// --- MARILYN FOREVER: INITIALIZED ---
console.log("%c/// NEURAL MATRIX: MUSE ONLINE", "color:#ff0055; font-weight:bold;");

const canvas = document.getElementById('gl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- 1. THE LIVING PORTRAIT (Shader Plane) ---
const loader = new THREE.TextureLoader();
// LOADING THE ARTIFACT
const texture = loader.load('marilyn-sentient-digital-artifact.jpg');

// Custom Shader to make her "Breathe" and "Glow"
const geometry = new THREE.PlaneGeometry(5, 7, 32, 32); // Aspect ratio matches portrait
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }
    },
    vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
            vUv = uv;
            vec3 pos = position;
            // Breathing effect (Sine wave distortion)
            pos.z += sin(pos.y * 2.0 + uTime) * 0.1; 
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform float uTime;
        void main() {
            vec4 color = texture2D(uTexture, vUv);
            // Add subtle scanline pulse
            float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.02;
            color.rgb += scanline;
            gl_FragColor = color;
        }
    `,
    side: THREE.DoubleSide
});

const marilyn = new THREE.Mesh(geometry, material);
scene.add(marilyn);

// --- 2. THE CROWN (3D Geometry above head) ---
const crownGeo = new THREE.IcosahedronGeometry(0.8, 0);
const crownMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f3ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.8
});
const crown = new THREE.Mesh(crownGeo, crownMat);
crown.position.set(0, 4.5, 0.5); // Position above the image
scene.add(crown);

// Halo Ring
const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.position.set(0, 4.5, 0.5);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// --- 3. PARTICLE RAIN (The Matrix) ---
const pGeo = new THREE.BufferGeometry();
const pCount = 1000;
const pPos = new Float32Array(pCount * 3);
for(let i=0; i<pCount * 3; i++) {
    pPos[i] = (Math.random() - 0.5) * 15;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xffffff,
    transparent: true,
    opacity: 0.4
});
const rain = new THREE.Points(pGeo, pMat);
scene.add(rain);

// --- 4. THE KISS ENGINE (Interaction) ---
const kisses = [];
const kissGeo = new THREE.SphereGeometry(0.1, 8, 8);
const kissMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

function blowKiss() {
    const kiss = new THREE.Mesh(kissGeo, kissMat);
    // Start at her lips (approximate)
    kiss.position.set(0, 2, 1);
    
    // Random direction towards camera
    const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5, // X Spread
        (Math.random() - 0.5) * 0.5, // Y Spread
        Math.random() * 0.1 + 0.1    // Z Speed (Towards user)
    );
    
    kisses.push({ mesh: kiss, velocity: velocity, life: 100 });
    scene.add(kiss);
}

// Triggers
window.addEventListener('click', blowKiss);
window.addEventListener('touchstart', blowKiss);

// --- 5. ANIMATION LOOP ---
camera.position.z = 8;
const clock = new THREE.Clock();

function animate() {
    const time = clock.getElapsedTime();

    // Animate Marilyn (Breathing Shader)
    material.uniforms.uTime.value = time;

    // Animate Crown
    crown.rotation.y += 0.01;
    crown.rotation.x += 0.005;
    ring.rotation.z -= 0.01;

    // Animate Rain
    rain.rotation.y = time * 0.05;
    rain.position.y = - (time * 0.5) % 5;

    // Animate Kisses
    for (let i = kisses.length - 1; i >= 0; i--) {
        const k = kisses[i];
        k.mesh.position.add(k.velocity);
        k.life--;
        k.mesh.rotation.z += 0.1;
        
        if (k.life <= 0) {
            scene.remove(k.mesh);
            kisses.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

// --- 6. RESPONSIVE ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Scale image on mobile
    if(window.innerWidth < 768) {
        marilyn.scale.set(0.6, 0.6, 0.6);
        crown.position.y = 2.5;
        ring.position.y = 2.5;
    } else {
        marilyn.scale.set(1, 1, 1);
        crown.position.y = 4.5;
        ring.position.y = 4.5;
    }
});
// Trigger resize once to set initial scale
window.dispatchEvent(new Event('resize'));
