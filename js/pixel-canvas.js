const COLORS = ['#FFD400', '#76FF7A', '#FF6262', '#FFAD33', '#fff'];

function initPixelCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -999, y: -999 };
    let raf = 0;
    let tick = 0;
    let running = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function spawnBurst(x, y, count = 18) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
            const speed = 1.5 + Math.random() * 4;
            const life = 40 + Math.random() * 40;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.floor(Math.random() * 5),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 1, life, maxLife: life,
            });
        }
    }

    function draw() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tick++;

        if (tick % 12 === 0) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + 8,
                vx: (Math.random() - 0.5) * 0.6,
                vy: -(0.4 + Math.random() * 0.8),
                size: 2 + Math.floor(Math.random() * 3),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 0.6, life: 120 + Math.random() * 80, maxLife: 200,
            });
        }

        if (tick % 6 === 0 && mouse.x > 0) {
            particles.push({
                x: mouse.x + (Math.random() - 0.5) * 20,
                y: mouse.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -0.5 - Math.random() * 1,
                size: 2,
                color: '#FFD400',
                alpha: 0.8, life: 25, maxLife: 25,
            });
        }

        particles = particles.filter(p => p.life > 0);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.life--;
            p.alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2, p.size, p.size);
        }

        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    function onMove(e) { mouse = { x: e.clientX, y: e.clientY }; }
    function onLeave() { mouse = { x: -999, y: -999 }; }
    function onClick(e) { spawnBurst(e.clientX, e.clientY); }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    // returns a cleanup function in case you want to tear it down
    // (e.g. only run it on the onboarding screen, not the whole app)
    return function destroy() {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('click', onClick);
    };
}