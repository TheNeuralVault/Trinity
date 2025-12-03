// --- SYSTEM INITIALIZATION ---
console.log("%c/// NEURAL MATRIX VAULT: MAGNUS OPUS", "background:#000; color:#00f3ff; border:1px solid #00f3ff; padding:5px; font-size:12px;");
try { lucide.createIcons(); } catch(e) {}

// --- 1. PERFORMANCE & VISIBILITY API ---
let isVisible = true;
document.addEventListener("visibilitychange", () => { isVisible = !document.hidden; });

// --- 2. GLSL LIQUID SHADER (Background) ---
if (window.innerWidth > 768) {
    try {
        const canvas = document.getElementById('liquid-shader');
        const gl = canvas.getContext('webgl');
        if (gl) {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            const vs = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
            const fs = `precision mediump float;uniform float t;uniform vec2 r;void main(){vec2 u=gl_FragCoord.xy/r.xy;float c=sin(u.x*10.+t)*0.1+sin(u.y*10.+t)*0.1;gl_FragColor=vec4(vec3(c*0.1,c*0.2,c*0.3),1.);}`;
            
            const vS = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vS, vs); gl.compileShader(vS);
            const fS = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fS, fs); gl.compileShader(fS);
            const p = gl.createProgram(); gl.attachShader(p, vS); gl.attachShader(p, fS); gl.linkProgram(p); gl.useProgram(p);
            
            const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
            const loc = gl.getAttribLocation(p, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
            
            const tLoc = gl.getUniformLocation(p, 't'); const rLoc = gl.getUniformLocation(p, 'r');
            gl.uniform2f(rLoc, canvas.width, canvas.height);
            
            function loop(now) {
                if (isVisible) { gl.uniform1f(tLoc, now * 0.001); gl.drawArrays(gl.TRIANGLES, 0, 6); }
                requestAnimationFrame(loop);
            }
            requestAnimationFrame(loop);
        }
    } catch(e) {}
}

// --- 3. THE SINGULARITY (Hero Artifact) ---
(function initSingularity() {
    const container = document.getElementById('singularity-vessel');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = 6;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // CORE
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0x000000, emissive: 0x111111, specular: 0xffffff, shininess: 90, flatShading: true });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // CAGE
    const cageGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const cageMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    scene.add(cage);

    // PARTICLES
    const pGeo = new THREE.BufferGeometry();
    const pos = [];
    for(let i=0; i<600; i++) {
        const ang = Math.random()*Math.PI*2; const rad = 2.5 + Math.random();
        pos.push(Math.cos(ang)*rad, (Math.random()-0.5)*3, Math.sin(ang)*rad);
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffaa00 });
    const swarm = new THREE.Points(pGeo, pMat);
    scene.add(swarm);

    const light = new THREE.PointLight(0x00f3ff, 2, 10); light.position.set(3,3,3); scene.add(light);
    const light2 = new THREE.PointLight(0xffaa00, 2, 10); light2.position.set(-3,-3,3); scene.add(light2);

    function animate() {
        if (isVisible) {
            core.rotation.y += 0.005; core.rotation.x -= 0.002;
            cage.rotation.y -= 0.002;
            swarm.rotation.y -= 0.005;
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
})();

// --- 4. CHROMATIC MATRIX RAIN ---
const mCanvas = document.getElementById('matrix-rain');
if (mCanvas) {
    const mCtx = mCanvas.getContext('2d');
    let mW = window.innerWidth; let mH = window.innerHeight;
    mCanvas.width = mW; mCanvas.height = mH;
    const cols = Math.floor(mW / 14);
    const drops = Array(cols).fill(1);
    const palette = [{r:0,g:243,b:255}, {r:255,g:0,b:85}, {r:255,g:170,b:0}];
    let t = 0;

    function drawMatrix() {
        if (!isVisible) { requestAnimationFrame(drawMatrix); return; }
        mCtx.fillStyle = "rgba(5, 5, 5, 0.05)"; mCtx.fillRect(0, 0, mW, mH);
        t += 0.005;
        const c = palette[Math.floor(t)%palette.length];
        mCtx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
        mCtx.font = "14px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            const txt = "01XYZA"[Math.floor(Math.random()*6)];
            mCtx.fillText(txt, i*14, drops[i]*14);
            if (drops[i]*14 > mH && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
        requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
}

// --- 5. LOGIC & CURSOR ---
try {
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    if (window.innerWidth > 768) {
        const dot = document.querySelector('.cursor-dot');
        const circ = document.querySelector('.cursor-circle');
        document.addEventListener('mousemove', (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(circ, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.15 });
        });
        
        // PILLAR HOVER LOGIC
        const pillars = [
            { s: '.pillar-core', c: '#00f3ff' }, { s: '.pillar-flux', c: '#ff0055' },
            { s: '.pillar-aero', c: '#ffffff' }, { s: '.pillar-nexus', c: '#bc13fe' },
            { s: '.pillar-cipher', c: '#ffaa00' }, { s: '.pillar-prism', c: '#00ffaa' },
            { s: '.pillar-omega', c: '#ff5500' }
        ];
        pillars.forEach(p => {
            const el = document.querySelector(p.s);
            if(el) {
                el.addEventListener('mouseenter', () => { gsap.to(dot, { backgroundColor: p.c }); gsap.to(circ, { borderColor: p.c, scale: 1.5 }); });
                el.addEventListener('mouseleave', () => { gsap.to(dot, { backgroundColor: '#00f3ff' }); gsap.to(circ, { borderColor: 'rgba(255,255,255,0.3)', scale: 1 }); });
            }
        });
    }
    
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".cell", {
        scrollTrigger: { trigger: ".bento-grid", start: "top 85%" },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
    });
} catch(e) {}
