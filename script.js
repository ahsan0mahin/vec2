// ===== SIDEBAR =====
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeSidebar = document.getElementById('closeSidebar');

menuBtn.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Nav link active state
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', () => sidebar.classList.remove('active'));
});

// ===== UTILITY FUNCTIONS =====
function degToRad(deg) { return deg * Math.PI / 180; }
function radToDeg(rad) { return rad * 180 / Math.PI; }

function drawArrow(ctx, fromX, fromY, toX, toY, color, lineWidth = 2, headLen = 12) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawDashedLine(ctx, fromX, fromY, toX, toY, color, lineWidth = 1) {
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawArc(ctx, cx, cy, radius, startAngle, endAngle, color, lineWidth = 1.5) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawText(ctx, text, x, y, color = '#333', font = '14px Noto Sans Bengali', align = 'center') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

// ===== HERO BACKGROUND ANIMATION =====
(function() {
    const canvas = document.getElementById('heroBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    const vectors = [];
    for (let i = 0; i < 15; i++) {
        vectors.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            angle: Math.random() * Math.PI * 2,
            len: 40 + Math.random() * 60,
            speed: 0.3 + Math.random() * 0.5,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            color: ['#6C63FF', '#FF6584', '#43E97B', '#FFD600'][Math.floor(Math.random() * 4)]
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vectors.forEach(v => {
            const endX = v.x + v.len * Math.cos(v.angle);
            const endY = v.y + v.len * Math.sin(v.angle);
            drawArrow(ctx, v.x, v.y, endX, endY, v.color, 2, 10);
            
            v.x += Math.cos(v.angle) * v.speed;
            v.y += Math.sin(v.angle) * v.speed;
            v.angle += v.rotSpeed;
            
            if (v.x < -100) v.x = canvas.width + 50;
            if (v.x > canvas.width + 100) v.x = -50;
            if (v.y < -100) v.y = canvas.height + 50;
            if (v.y > canvas.height + 100) v.y = -50;
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== BALL THROW ANIMATION =====
function animateBallThrow() {
    const canvas = document.getElementById('ballThrowCanvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Ground
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(0, 170, canvas.width, 30);
        
        // Trajectory
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        for (let i = 0; i <= 100; i++) {
            const tt = i / 100;
            const x = 30 + tt * 240;
            const y = 165 - (120 * tt - 120 * tt * tt) * 1.5;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Ball position
        const progress = Math.min(t / 120, 1);
        const bx = 30 + progress * 240;
        const by = 165 - (120 * progress - 120 * progress * progress) * 1.5;
        
        // Velocity vector (tangent)
        const vx = 240;
        const vy = -(120 - 240 * progress) * 1.5;
        const vmag = Math.sqrt(vx * vx + vy * vy);
        const vnx = vx / vmag * 50;
        const vny = vy / vmag * 50;
        
        // Draw components
        drawArrow(ctx, bx, by, bx + vnx * 0.8, by, '#43E97B', 2, 8); // horizontal
        drawArrow(ctx, bx, by, bx, by + vny * 0.8, '#FF6584', 2, 8); // vertical
        drawArrow(ctx, bx, by, bx + vnx * 0.8, by + vny * 0.8, '#6C63FF', 2.5, 10); // resultant
        
        // Ball
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD600';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Labels
        drawText(ctx, 'v⃗', bx + vnx * 0.8 + 10, by + vny * 0.8 - 5, '#6C63FF', 'bold 12px sans-serif');
        drawText(ctx, 'vₓ', bx + vnx * 0.4, by - 8, '#43E97B', '11px sans-serif');
        drawText(ctx, 'vᵧ', bx - 15, by + vny * 0.4, '#FF6584', '11px sans-serif');
        
        t++;
        if (t < 120) requestAnimationFrame(draw);
    }
    t = 0;
    draw();
}

// ===== INCLINE ANIMATION =====
function animateIncline() {
    const canvas = document.getElementById('inclineCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const angle = 30;
    const rad = degToRad(angle);
    
    // Draw incline
    ctx.beginPath();
    ctx.moveTo(20, 180);
    ctx.lineTo(270, 180);
    ctx.lineTo(20, 60);
    ctx.closePath();
    ctx.fillStyle = '#e8e8e8';
    ctx.fill();
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Box on incline
    const bx = 120, by = 125;
    
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-rad);
    ctx.fillStyle = '#FFD600';
    ctx.fillRect(-15, -15, 30, 30);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-15, -15, 30, 30);
    ctx.restore();
    
    // Weight (mg) - straight down
    drawArrow(ctx, bx, by, bx, by + 70, '#FF6584', 2.5, 10);
    drawText(ctx, 'mg', bx + 20, by + 65, '#FF6584', 'bold 13px sans-serif');
    
    // Component along incline (mg sin θ)
    const sinComp = 70 * Math.sin(rad);
    const cosComp = 70 * Math.cos(rad);
    
    drawArrow(ctx, bx, by, bx + sinComp * Math.cos(rad), by + sinComp * Math.sin(rad), '#43E97B', 2.5, 10);
    drawText(ctx, 'mg sinθ', bx + sinComp * Math.cos(rad) + 5, by + sinComp * Math.sin(rad) - 10, '#43E97B', '11px sans-serif');
    
    // Component perpendicular to incline (mg cos θ)
    drawArrow(ctx, bx, by, bx + cosComp * Math.sin(rad), by + cosComp * Math.cos(rad) * (-1) + cosComp, '#6C63FF', 2.5, 10);
    
    // Angle arc
    drawArc(ctx, 20, 180, 35, -Math.PI / 2, -rad - Math.PI / 2 + rad, '#FFD600', 2);
    drawText(ctx, 'θ=' + angle + '°', 55, 170, '#333', '11px sans-serif');
}

// ===== BOAT ANIMATION =====
function animateBoat() {
    const canvas = document.getElementById('boatCanvas');
    const ctx = canvas.getContext('2d');
    let t = 0;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // River
        ctx.fillStyle = '#D6EAF8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Banks
        ctx.fillStyle = '#82E0AA';
        ctx.fillRect(0, 0, 30, canvas.height);
        ctx.fillRect(canvas.width - 30, 0, 30, canvas.height);
        
        // Wave lines
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            for (let x = 30; x < canvas.width - 30; x += 2) {
                const y = 30 + i * 35 + Math.sin((x + t * 2) / 20) * 3;
                if (x === 30) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        
        // Current arrow
        drawArrow(ctx, 200, 15, 260, 15, '#3498DB', 2, 8);
        drawText(ctx, 'স্রোত', 230, 12, '#2980B9', '11px Noto Sans Bengali');
        
        const progress = Math.min(t / 150, 1);
        const boatX = 40 + progress * (canvas.width - 80);
        const boatY = 170 - progress * 50;
        
        // Boat velocity (across)
        drawArrow(ctx, boatX, boatY, boatX + 40, boatY, '#43E97B', 2, 8);
        
        // Current velocity (down)
        drawArrow(ctx, boatX, boatY, boatX, boatY + 30, '#3498DB', 2, 8);
        
        // Resultant
        drawArrow(ctx, boatX, boatY, boatX + 40, boatY + 30, '#FF6584', 2.5, 10);
        
        // Boat
        ctx.beginPath();
        ctx.arc(boatX, boatY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#E74C3C';
        ctx.fill();
        
        drawText(ctx, '🚣', boatX - 8, boatY + 5, '#000', '16px sans-serif');
        
        t++;
        if (t < 150) requestAnimationFrame(draw);
    }
    t = 0;
    draw();
}

// ===== PARALLELOGRAM INTERACTIVE =====
const pSlider = document.getElementById('pSlider');
const qSlider = document.getElementById('qSlider');
const alphaSlider = document.getElementById('alphaSlider');

function drawParallelogram() {
    const canvas = document.getElementById('parallelogramCanvas');
    const ctx = canvas.getContext('2d');
    const P = parseFloat(pSlider.value);
    const Q = parseFloat(qSlider.value);
    const alpha = parseFloat(alphaSlider.value);
    const alphaRad = degToRad(alpha);
    
    document.getElementById('pVal').textContent = P;
    document.getElementById('qVal').textContent = Q;
    document.getElementById('alphaVal').textContent = alpha;
    
    const scale = 35;
    const ox = 80, oy = 300;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Points
    const ax = ox + P * scale;
    const ay = oy;
    const bx = ox + Q * scale * Math.cos(alphaRad);
    const by = oy - Q * scale * Math.sin(alphaRad);
    const cx = ax + Q * scale * Math.cos(alphaRad);
    const cy = ay - Q * scale * Math.sin(alphaRad);
    
    // Parallelogram fill
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fillStyle = 'rgba(108, 99, 255, 0.1)';
    ctx.fill();
    
    // Dashed sides
    drawDashedLine(ctx, ax, ay, cx, cy, 'rgba(255,255,255,0.3)');
    drawDashedLine(ctx, bx, by, cx, cy, 'rgba(255,255,255,0.3)');
    
    // P vector (OA)
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 3, 14);
    
    // Q vector (OB)
    drawArrow(ctx, ox, oy, bx, by, '#FFD600', 3, 14);
    
    // R vector (OC - diagonal)
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3.5, 16);
    
    // Angle arc
    drawArc(ctx, ox, oy, 30, 0, -alphaRad, 'rgba(255,255,255,0.6)', 2);
    
    // Labels
    drawText(ctx, 'O', ox - 15, oy + 20, '#fff', 'bold 14px sans-serif');
    drawText(ctx, 'A', ax + 10, ay + 20, '#43E97B', 'bold 14px sans-serif');
    drawText(ctx, 'B', bx - 20, by - 5, '#FFD600', 'bold 14px sans-serif');
    drawText(ctx, 'C', cx + 10, cy - 5, '#FF6584', 'bold 14px sans-serif');
    
    drawText(ctx, 'P⃗ = ' + P, (ox + ax) / 2, oy + 30, '#43E97B', 'bold 13px sans-serif');
    drawText(ctx, 'Q⃗ = ' + Q, (ox + bx) / 2 - 25, (oy + by) / 2 - 5, '#FFD600', 'bold 13px sans-serif');
    
    // Angle label
    const angleLabelR = 45;
    const angleLabelAngle = alphaRad / 2;
    drawText(ctx, 'α=' + alpha + '°', ox + angleLabelR * Math.cos(-angleLabelAngle) + 10, oy - angleLabelR * Math.sin(angleLabelAngle) + 5, '#fff', '12px sans-serif');
    
    // Calculate R and θ
    const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alphaRad));
    const theta = radToDeg(Math.atan2(Q * Math.sin(alphaRad), P + Q * Math.cos(alphaRad)));
    
    drawText(ctx, 'R⃗ = ' + R.toFixed(2), (ox + cx) / 2 + 15, (oy + cy) / 2 + 15, '#FF6584', 'bold 14px sans-serif');
    
    document.getElementById('rValue').textContent = R.toFixed(2);
    document.getElementById('thetaValue').textContent = theta.toFixed(1) + '°';
}

if (pSlider) {
    pSlider.addEventListener('input', drawParallelogram);
    qSlider.addEventListener('input', drawParallelogram);
    alphaSlider.addEventListener('input', drawParallelogram);
    drawParallelogram();
}

// ===== BOOK PUSH EXPERIMENT =====
let bookX = 250, bookY = 125;
let bookVX = 0, bookVY = 0;
let bookAnimId = null;

function drawBook() {
    const canvas = document.getElementById('bookPushCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Table
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(0, 200, canvas.width, 50);
    ctx.fillStyle = '#5c432e';
    ctx.fillRect(0, 195, canvas.width, 8);
    
    // Book
    ctx.save();
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(bookX - 25, bookY - 15, 50, 30);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(bookX - 25, bookY - 15, 50, 30);
    drawText(ctx, '📕', bookX - 8, bookY + 7, '#fff', '18px sans-serif');
    ctx.restore();
}

function pushRight() {
    resetBook();
    bookVX = 3;
    bookVY = -0.5;
    animateBook();
}

function pushLeft() {
    resetBook();
    bookVX = -2;
    bookVY = -1;
    animateBook();
}

function pushBoth() {
    resetBook();
    bookVX = 1.5;
    bookVY = -2;
    animateBook();
    
    // Draw force arrows after small delay
    setTimeout(() => {
        const canvas = document.getElementById('bookPushCanvas');
        const ctx = canvas.getContext('2d');
        drawArrow(ctx, 250, 125, 300, 115, '#43E97B', 2, 8);
        drawArrow(ctx, 250, 125, 230, 90, '#FFD600', 2, 8);
        drawArrow(ctx, 250, 125, 280, 75, '#FF6584', 2.5, 10);
        drawText(ctx, 'লব্ধি', 285, 70, '#FF6584', '12px Noto Sans Bengali');
    }, 100);
}

function animateBook() {
    bookX += bookVX;
    bookY += bookVY;
    bookVX *= 0.98;
    bookVY *= 0.98;
    
    drawBook();
    
    if (Math.abs(bookVX) > 0.05 || Math.abs(bookVY) > 0.05) {
        bookAnimId = requestAnimationFrame(animateBook);
    }
}

function resetBook() {
    if (bookAnimId) cancelAnimationFrame(bookAnimId);
    bookX = 250;
    bookY = 125;
    bookVX = 0;
    bookVY = 0;
    drawBook();
}

// Init book
setTimeout(drawBook, 100);

// ===== PROOF STEP BY STEP =====
let proofStep = 0;

function nextProofStep() {
    proofStep++;
    if (proofStep > 6) proofStep = 1;
    
    // Highlight proof step text
    for (let i = 1; i <= 6; i++) {
        const el = document.getElementById('ps' + i);
        if (el) {
            el.classList.toggle('active', i <= proofStep);
        }
    }
    
    document.getElementById('proofStepInfo').textContent = `ধাপ ${proofStep}/৬`;
    
    drawProof(proofStep);
}

function drawProof(step) {
    const canvas = document.getElementById('proofCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ox = 60, oy = 280;
    const P = 180, Q = 130;
    const alpha = degToRad(50);
    
    const ax = ox + P;
    const ay = oy;
    const bx = ox + Q * Math.cos(alpha);
    const by = oy - Q * Math.sin(alpha);
    const cx = ax + Q * Math.cos(alpha);
    const cy = ay - Q * Math.sin(alpha);
    
    // D point (projection of C on OA extended)
    const dx = cx;
    const dy = oy;
    
    // Always draw parallelogram
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fillStyle = 'rgba(108, 99, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // P vector
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 2.5, 12);
    drawText(ctx, 'P⃗ (OA)', (ox + ax) / 2, oy + 25, '#43E97B', 'bold 13px sans-serif');
    
    // Q vector
    drawArrow(ctx, ox, oy, bx, by, '#FFD600', 2.5, 12);
    drawText(ctx, 'Q⃗ (OB)', (ox + bx) / 2 - 30, (oy + by) / 2, '#FFD600', 'bold 13px sans-serif');
    
    // R vector (diagonal)
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3, 14);
    drawText(ctx, 'R⃗ (OC)', (ox + cx) / 2 + 5, (oy + cy) / 2 - 10, '#FF6584', 'bold 13px sans-serif');
    
    // Labels
    drawText(ctx, 'O', ox - 15, oy + 20, '#333', 'bold 14px sans-serif');
    drawText(ctx, 'A', ax + 5, ay + 20, '#333', 'bold 14px sans-serif');
    drawText(ctx, 'B', bx - 15, by - 5, '#333', 'bold 14px sans-serif');
    drawText(ctx, 'C', cx + 10, cy - 5, '#333', 'bold 14px sans-serif');
    
    // Alpha arc
    drawArc(ctx, ox, oy, 35, 0, -alpha, '#6C63FF', 2);
    drawText(ctx, 'α', ox + 45, oy - 15, '#6C63FF', 'bold 13px sans-serif');
    
    if (step >= 1) {
        // CD perpendicular
        drawDashedLine(ctx, cx, cy, dx, dy, '#E74C3C', 2);
        drawText(ctx, 'D', dx + 5, dy + 20, '#E74C3C', 'bold 14px sans-serif');
        
        // Right angle marker
        ctx.beginPath();
        ctx.moveTo(dx - 10, dy);
        ctx.lineTo(dx - 10, dy - 10);
        ctx.lineTo(dx, dy - 10);
        ctx.strokeStyle = '#E74C3C';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        drawText(ctx, 'CD ⊥ OD', dx - 20, cy + 15, '#E74C3C', '11px sans-serif');
    }
    
    if (step >= 2) {
        // Highlight triangle ODC
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(dx, dy);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fillStyle = 'rgba(231, 76, 60, 0.1)';
        ctx.fill();
        ctx.strokeStyle = '#E74C3C';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        drawText(ctx, 'OC² = OD² + CD²', 300, 50, '#E74C3C', 'bold 13px sans-serif');
    }
    
    if (step >= 3) {
        // Highlight triangle ACD
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(dx, dy);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fillStyle = 'rgba(46, 204, 113, 0.1)';
        ctx.fill();
        ctx.strokeStyle = '#2ECC71';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // CAD angle
        drawArc(ctx, ax, ay, 20, 0, -(Math.PI - alpha), '#2ECC71', 2);
        drawText(ctx, 'α', ax + 5, ay - 25, '#2ECC71', 'bold 12px sans-serif');
        
        drawText(ctx, 'CD = Q sinα', 350, 80, '#2ECC71', 'bold 12px sans-serif');
        drawText(ctx, 'AD = Q cosα', 350, 100, '#2ECC71', 'bold 12px sans-serif');
    }
    
    if (step >= 4) {
        // Show OD = OA + AD
        ctx.beginPath();
        ctx.moveTo(ox, oy + 35);
        ctx.lineTo(ax, oy + 35);
        ctx.strokeStyle = '#43E97B';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(ax, oy + 35);
        ctx.lineTo(dx, oy + 35);
        ctx.strokeStyle = '#2ECC71';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        drawText(ctx, 'P', (ox + ax) / 2, oy + 50, '#43E97B', 'bold 12px sans-serif');
        drawText(ctx, 'Qcosα', (ax + dx) / 2, oy + 50, '#2ECC71', 'bold 12px sans-serif');
    }
    
    if (step >= 5) {
        drawText(ctx, '= P² + 2PQcosα + Q²cos²α + Q²sin²α', 280, 130, '#6C63FF', '11px sans-serif');
    }
    
    if (step >= 6) {
        // Final formula highlight
        ctx.fillStyle = 'rgba(108, 99, 255, 0.15)';
        ctx.fillRect(120, 140, 300, 35);
        ctx.strokeStyle = '#6C63FF';
        ctx.lineWidth = 2;
        ctx.strokeRect(120, 140, 300, 35);
        drawText(ctx, 'R = √(P² + Q² + 2PQcosα)', 270, 163, '#6C63FF', 'bold 14px sans-serif');
    }
}

// Initial proof draw
setTimeout(() => drawProof(0), 200);

// ===== DIRECTION SECTION =====
const pSlider2 = document.getElementById('pSlider2');
const qSlider2 = document.getElementById('qSlider2');
const alphaSlider2 = document.getElementById('alphaSlider2');

function drawDirection() {
    const canvas = document.getElementById('directionCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const P = parseFloat(pSlider2.value);
    const Q = parseFloat(qSlider2.value);
    const alpha = parseFloat(alphaSlider2.value);
    const alphaRad = degToRad(alpha);
    
    document.getElementById('pVal2').textContent = P;
    document.getElementById('qVal2').textContent = Q;
    document.getElementById('alphaVal2').textContent = alpha;
    
    const scale = 30;
    const ox = 80, oy = 280;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ax = ox + P * scale;
    const ay = oy;
    const bx = ox + Q * scale * Math.cos(alphaRad);
    const by = oy - Q * scale * Math.sin(alphaRad);
    const cx = ax + Q * scale * Math.cos(alphaRad);
    const cy = ay - Q * scale * Math.sin(alphaRad);
    
    // Parallelogram
    drawDashedLine(ctx, ax, ay, cx, cy, 'rgba(255,255,255,0.2)');
    drawDashedLine(ctx, bx, by, cx, cy, 'rgba(255,255,255,0.2)');
    
    // Vectors
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 2.5, 12);
    drawArrow(ctx, ox, oy, bx, by, '#FFD600', 2.5, 12);
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3, 14);
    
    // Alpha arc
    drawArc(ctx, ox, oy, 30, 0, -alphaRad, 'rgba(255,255,255,0.5)', 2);
    
    // Theta arc
    const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alphaRad));
    const theta = Math.atan2(Q * Math.sin(alphaRad), P + Q * Math.cos(alphaRad));
    drawArc(ctx, ox, oy, 45, 0, -theta, '#FF6584', 2.5);
    
    // Labels
    drawText(ctx, 'P⃗', (ox + ax) / 2, oy + 25, '#43E97B', 'bold 13px sans-serif');
    drawText(ctx, 'Q⃗', (ox + bx) / 2 - 20, (oy + by) / 2, '#FFD600', 'bold 13px sans-serif');
    drawText(ctx, 'R⃗', (ox + cx) / 2 + 15, (oy + cy) / 2, '#FF6584', 'bold 14px sans-serif');
    drawText(ctx, 'α', ox + 40, oy - 10, '#fff', '12px sans-serif');
    drawText(ctx, 'θ', ox + 55, oy - 3, '#FF6584', 'bold 12px sans-serif');
    
    const thetaDeg = radToDeg(theta);
    document.getElementById('rValue2').textContent = R.toFixed(2);
    document.getElementById('thetaValue2').textContent = thetaDeg.toFixed(1) + '°';
}

if (pSlider2) {
    pSlider2.addEventListener('input', drawDirection);
    qSlider2.addEventListener('input', drawDirection);
    alphaSlider2.addEventListener('input', drawDirection);
    drawDirection();
}

// ===== MAX ANIMATION =====
function animateMax() {
    const canvas = document.getElementById('maxCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const ox = 50, oy = 75;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // P arrow
    drawArrow(ctx, ox, oy, ox + 120, oy, '#43E97B', 3, 12);
    drawText(ctx, 'P = 5', ox + 60, oy - 15, '#43E97B', 'bold 13px sans-serif');
    
    // Q arrow (same direction)
    drawArrow(ctx, ox + 120, oy, ox + 120 + 90, oy, '#FFD600', 3, 12);
    drawText(ctx, 'Q = 3', ox + 120 + 45, oy - 15, '#FFD600', 'bold 13px sans-serif');
    
    // R arrow
    setTimeout(() => {
        drawArrow(ctx, ox, oy + 30, ox + 210, oy + 30, '#FF6584', 3.5, 14);
        drawText(ctx, 'R = P + Q = 8 (সর্বোচ্চ!)', ox + 105, oy + 55, '#FF6584', 'bold 13px sans-serif');
    }, 500);
}

// ===== MIN ANIMATION =====
function animateMin() {
    const canvas = document.getElementById('minCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const ox = 50, oy = 55;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // P arrow (right)
    drawArrow(ctx, ox, oy, ox + 150, oy, '#43E97B', 3, 12);
    drawText(ctx, 'P = 5', ox + 75, oy - 15, '#43E97B', 'bold 13px sans-serif');
    
    // Q arrow (left - opposite)
    drawArrow(ctx, ox + 150, oy, ox + 150 - 90, oy, '#FFD600', 3, 12);
    drawText(ctx, 'Q = 3 (বিপরীতে)', ox + 105, oy + 25, '#FFD600', 'bold 12px sans-serif');
    
    // R arrow
    setTimeout(() => {
        drawArrow(ctx, ox, oy + 50, ox + 60, oy + 50, '#FF6584', 3.5, 14);
        drawText(ctx, 'R = |P − Q| = 2 (সর্বনিম্ন!)', ox + 150, oy + 65, '#FF6584', 'bold 13px sans-serif');
    }, 500);
}

// ===== ANGLE EXPLORER =====
const explorerSlider = document.getElementById('explorerSlider');

function drawAngleExplorer() {
    const canvas = document.getElementById('angleExplorerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const alpha = parseFloat(explorerSlider.value);
    const alphaRad = degToRad(alpha);
    const P = 5, Q = 3;
    
    document.getElementById('explorerAlpha').textContent = alpha;
    
    const R = Math.sqrt(P * P + Q * Q + 2 * P * Q * Math.cos(alphaRad));
    document.getElementById('explorerR').textContent = R.toFixed(2);
    
    const tag = document.getElementById('explorerTag');
    if (alpha === 0) {
        tag.textContent = '⬆️ সর্বোচ্চ!';
        tag.style.background = 'rgba(67,233,123,0.3)';
        tag.style.color = '#43E97B';
    } else if (alpha == 180) {
        tag.textContent = '⬇️ সর্বনিম্ন!';
        tag.style.background = 'rgba(255,101,132,0.3)';
        tag.style.color = '#FF6584';
    } else {
        tag.textContent = '';
        tag.style.background = 'transparent';
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const scale = 28;
    const ox = 100, oy = 200;
    
    const ax = ox + P * scale;
    const ay = oy;
    const bx = ox + Q * scale * Math.cos(alphaRad);
    const by = oy - Q * scale * Math.sin(alphaRad);
    const cx = ax + Q * scale * Math.cos(alphaRad);
    const cy = ay - Q * scale * Math.sin(alphaRad);
    
    // Dashed sides
    drawDashedLine(ctx, ax, ay, cx, cy, 'rgba(0,0,0,0.15)');
    drawDashedLine(ctx, bx, by, cx, cy, 'rgba(0,0,0,0.15)');
    
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 2.5, 12);
    drawArrow(ctx, ox, oy, bx, by, '#FFD600', 2.5, 12);
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3, 14);
    
    drawText(ctx, 'P=5', (ox + ax) / 2, oy + 25, '#43E97B', 'bold 13px sans-serif');
    drawText(ctx, 'Q=3', (ox + bx) / 2 - 20, (oy + by) / 2, '#FFD600', 'bold 13px sans-serif');
    drawText(ctx, 'R=' + R.toFixed(1), (ox + cx) / 2 + 20, (oy + cy) / 2 - 10, '#FF6584', 'bold 14px sans-serif');
    drawText(ctx, 'α=' + alpha + '°', ox + 50, oy - 5, '#6C63FF', 'bold 12px sans-serif');
    
    // R gauge on right
    const gaugeX = 480, gaugeTop = 30, gaugeBottom = 250;
    const gaugeH = gaugeBottom - gaugeTop;
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(gaugeX, gaugeTop, 20, gaugeH);
    
    const maxR = P + Q;
    const minR = Math.abs(P - Q);
    const fillRatio = (R - minR) / (maxR - minR);
    const fillH = fillRatio * gaugeH;
    
    const gradient = ctx.createLinearGradient(0, gaugeBottom, 0, gaugeTop);
    gradient.addColorStop(0, '#FF6584');
    gradient.addColorStop(0.5, '#FFD600');
    gradient.addColorStop(1, '#43E97B');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(gaugeX, gaugeBottom - fillH, 20, fillH);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(gaugeX, gaugeTop, 20, gaugeH);
    
    drawText(ctx, maxR.toFixed(0), gaugeX + 35, gaugeTop + 10, '#43E97B', '11px sans-serif', 'left');
    drawText(ctx, minR.toFixed(0), gaugeX + 35, gaugeBottom + 5, '#FF6584', '11px sans-serif', 'left');
    drawText(ctx, R.toFixed(1), gaugeX + 35, gaugeBottom - fillH + 5, '#333', 'bold 12px sans-serif', 'left');
    
    // Arrow marker
    ctx.beginPath();
    ctx.moveTo(gaugeX - 5, gaugeBottom - fillH);
    ctx.lineTo(gaugeX, gaugeBottom - fillH - 5);
    ctx.lineTo(gaugeX, gaugeBottom - fillH + 5);
    ctx.fillStyle = '#333';
    ctx.fill();
}

if (explorerSlider) {
    explorerSlider.addEventListener('input', drawAngleExplorer);
    drawAngleExplorer();
}

// ===== RESOLUTION INTRO ANIMATION =====
function animateResolution() {
    const canvas = document.getElementById('resolutionIntroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let frame = 0;
    const totalFrames = 90;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const ox = 80, oy = 230;
        const R = 180;
        const angle = degToRad(40);
        const rx = ox + R * Math.cos(angle);
        const ry = oy - R * Math.sin(angle);
        
        const progress = Math.min(frame / totalFrames, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
        
        // R vector
        drawArrow(ctx, ox, oy, rx, ry, '#FF6584', 3, 14);
        drawText(ctx, 'R⃗', (ox + rx) / 2 + 15, (oy + ry) / 2 - 10, '#FF6584', 'bold 16px sans-serif');
        
        if (progress > 0) {
            // X component appearing
            const xEnd = ox + R * Math.cos(angle) * eased;
            drawArrow(ctx, ox, oy, xEnd, oy, '#43E97B', 2.5, 12);
            if (eased > 0.5) {
                drawText(ctx, 'X = R cosα', (ox + xEnd) / 2, oy + 30, '#43E97B', 'bold 13px sans-serif');
            }
            
            // Y component appearing
            const yEnd = oy - R * Math.sin(angle) * eased;
            drawArrow(ctx, ox, oy, ox, yEnd, '#FFD600', 2.5, 12);
            if (eased > 0.5) {
                drawText(ctx, 'Y = R sinα', ox - 45, (oy + yEnd) / 2, '#FFD600', 'bold 13px sans-serif');
            }
            
            // Dashed projection lines
            if (eased > 0.3) {
                drawDashedLine(ctx, rx, ry, rx, oy, 'rgba(255,255,255,0.3)');
                drawDashedLine(ctx, rx, ry, ox, ry, 'rgba(255,255,255,0.3)');
            }
            
            // Right angle
            if (eased > 0.5) {
                ctx.beginPath();
                ctx.moveTo(ox + 12, oy);
                ctx.lineTo(ox + 12, oy - 12);
                ctx.lineTo(ox, oy - 12);
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        // Angle arc
        drawArc(ctx, ox, oy, 35, 0, -angle, 'rgba(255,255,255,0.6)', 2);
        drawText(ctx, 'α', ox + 45, oy - 12, '#fff', '14px sans-serif');
        
        // Equation
        if (eased > 0.8) {
            drawText(ctx, 'R⃗ = X⃗ + Y⃗', 400, 50, '#fff', 'bold 16px sans-serif');
        }
        
        frame++;
        if (frame <= totalFrames + 30) requestAnimationFrame(draw);
    }
    
    frame = 0;
    draw();
}

// ===== PERPENDICULAR COMPONENTS INTERACTIVE =====
const rCompSlider = document.getElementById('rCompSlider');
const alphaCompSlider = document.getElementById('alphaCompSlider');

function drawPerpComponents() {
    const canvas = document.getElementById('perpCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const R = parseFloat(rCompSlider.value);
    const alpha = parseFloat(alphaCompSlider.value);
    const alphaRad = degToRad(alpha);
    
    document.getElementById('rCompVal').textContent = R;
    document.getElementById('alphaCompVal').textContent = alpha;
    
    const scale = 30;
    const ox = 80, oy = 320;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Axes
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + 350, oy);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox, oy - 350);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.stroke();
    
    drawText(ctx, 'X', ox + 360, oy + 5, 'rgba(255,255,255,0.4)', '12px sans-serif');
    drawText(ctx, 'Y', ox - 5, oy - 355, 'rgba(255,255,255,0.4)', '12px sans-serif');
    
    const X = R * Math.cos(alphaRad);
    const Y = R * Math.sin(alphaRad);
    
    const rx = ox + R * scale * Math.cos(alphaRad);
    const ry = oy - R * scale * Math.sin(alphaRad);
    const xx = ox + X * scale;
    const yy = oy - Y * scale;
    
    // Dashed projections
    drawDashedLine(ctx, rx, ry, xx, oy, 'rgba(255,255,255,0.3)');
    drawDashedLine(ctx, rx, ry, ox, yy, 'rgba(255,255,255,0.3)');
    
    // X component
    drawArrow(ctx, ox, oy, xx, oy, '#43E97B', 3, 12);
    drawText(ctx, 'X = ' + X.toFixed(2), (ox + xx) / 2, oy + 25, '#43E97B', 'bold 13px sans-serif');
    
    // Y component
    drawArrow(ctx, ox, oy, ox, yy, '#FFD600', 3, 12);
    drawText(ctx, 'Y = ' + Y.toFixed(2), ox - 45, (oy + yy) / 2, '#FFD600', 'bold 13px sans-serif');
    
    // R vector
    drawArrow(ctx, ox, oy, rx, ry, '#FF6584', 3.5, 14);
    drawText(ctx, 'R⃗ = ' + R, (ox + rx) / 2 + 20, (oy + ry) / 2 - 10, '#FF6584', 'bold 14px sans-serif');
    
    // Right angle marker
    ctx.beginPath();
    ctx.moveTo(ox + 12, oy);
    ctx.lineTo(ox + 12, oy - 12);
    ctx.lineTo(ox, oy - 12);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Angle arc
    drawArc(ctx, ox, oy, 40, 0, -alphaRad, 'rgba(255,255,255,0.7)', 2);
    const labelR = 55;
    drawText(ctx, 'α=' + alpha + '°', ox + labelR * Math.cos(alphaRad / 2), oy - labelR * Math.sin(alphaRad / 2) + 5, '#fff', '12px sans-serif');
    
    document.getElementById('xCompValue').textContent = X.toFixed(2);
    document.getElementById('yCompValue').textContent = Y.toFixed(2);
}

if (rCompSlider) {
    rCompSlider.addEventListener('input', drawPerpComponents);
    alphaCompSlider.addEventListener('input', drawPerpComponents);
    drawPerpComponents();
}

// ===== TRIGONOMETRY CANVAS =====
function drawTrigo() {
    const canvas = document.getElementById('trigoCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ox = 100, oy = 230;
    const R = 180;
    const angle = degToRad(35);
    const ax = ox + R * Math.cos(angle);
    const ay = oy;
    const cx = ax;
    const cy = oy - R * Math.sin(angle);
    
    // Triangle fill
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fillStyle = 'rgba(108, 99, 255, 0.08)';
    ctx.fill();
    
    // Sides
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 2.5, 0); // base (X)
    drawArrow(ctx, ax, ay, cx, cy, '#FFD600', 2.5, 0); // height (Y)
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3, 12); // hypotenuse (R)
    
    // Right angle
    ctx.beginPath();
    ctx.moveTo(ax - 12, ay);
    ctx.lineTo(ax - 12, ay - 12);
    ctx.lineTo(ax, ay - 12);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Angle arc
    drawArc(ctx, ox, oy, 35, 0, -angle, '#6C63FF', 2.5);
    
    // Labels
    drawText(ctx, 'O', ox - 15, oy + 20, '#333', 'bold 15px sans-serif');
    drawText(ctx, 'A', ax + 10, ay + 20, '#333', 'bold 15px sans-serif');
    drawText(ctx, 'C', cx + 10, cy - 10, '#333', 'bold 15px sans-serif');
    
    drawText(ctx, 'α', ox + 45, oy - 8, '#6C63FF', 'bold 14px sans-serif');
    
    drawText(ctx, 'X (সংলগ্ন = R cosα)', (ox + ax) / 2, oy + 35, '#43E97B', 'bold 12px sans-serif');
    drawText(ctx, 'Y (বিপরীত = R sinα)', ax + 55, (ay + cy) / 2, '#FFD600', 'bold 12px sans-serif');
    drawText(ctx, 'R (অতিভুজ)', (ox + cx) / 2 - 30, (oy + cy) / 2 - 10, '#FF6584', 'bold 13px sans-serif');
}

setTimeout(drawTrigo, 300);

// ===== ANY DIRECTION COMPONENTS =====
const rAnySlider = document.getElementById('rAnySlider');
const alphaAnySlider = document.getElementById('alphaAnySlider');
const betaAnySlider = document.getElementById('betaAnySlider');

function drawAnyDirComponents() {
    const canvas = document.getElementById('anyDirCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const R = parseFloat(rAnySlider.value);
    const alpha = parseFloat(alphaAnySlider.value);
    const beta = parseFloat(betaAnySlider.value);
    
    document.getElementById('rAnyVal').textContent = R;
    document.getElementById('alphaAnyVal').textContent = alpha;
    document.getElementById('betaAnyVal').textContent = beta;
    
    const alphaRad = degToRad(alpha);
    const betaRad = degToRad(beta);
    const totalAngle = alphaRad + betaRad;
    
    const scale = 25;
    const ox = 100, oy = 280;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // R vector (along some middle direction)
    const rAngle = betaRad; // R is between X and Y
    const rx = ox + R * scale * Math.cos(rAngle);
    const ry = oy - R * scale * Math.sin(rAngle);
    
    // X direction (α below R)
    const xAngle = rAngle - alphaRad;
    const X = R * Math.sin(betaRad) / Math.sin(totalAngle);
    const xx = ox + X * scale * Math.cos(xAngle);
    const xy = oy - X * scale * Math.sin(xAngle);
    
    // Y direction (β above R)
    const yAngle = rAngle + betaRad;
    const Y = R * Math.sin(alphaRad) / Math.sin(totalAngle);
    const yx = ox + Y * scale * Math.cos(yAngle);
    const yy = oy - Y * scale * Math.sin(yAngle);
    
    // Draw direction lines (faint)
    const lineLen = 300;
    drawDashedLine(ctx, ox, oy, ox + lineLen * Math.cos(xAngle), oy - lineLen * Math.sin(xAngle), 'rgba(67,233,123,0.2)');
    drawDashedLine(ctx, ox, oy, ox + lineLen * Math.cos(yAngle), oy - lineLen * Math.sin(yAngle), 'rgba(255,214,0,0.2)');
    
    // X component
    drawArrow(ctx, ox, oy, xx, xy, '#43E97B', 2.5, 12);
    drawText(ctx, 'X = ' + X.toFixed(2), xx + 10, xy - 10, '#43E97B', 'bold 12px sans-serif', 'left');
    
    // Y component
    drawArrow(ctx, ox, oy, yx, yy, '#FFD600', 2.5, 12);
    drawText(ctx, 'Y = ' + Y.toFixed(2), yx + 10, yy - 5, '#FFD600', 'bold 12px sans-serif', 'left');
    
    // R vector
    drawArrow(ctx, ox, oy, rx, ry, '#FF6584', 3, 14);
    drawText(ctx, 'R⃗ = ' + R, (ox + rx) / 2 + 15, (oy + ry) / 2 + 20, '#FF6584', 'bold 14px sans-serif');
    
    // Alpha arc (from R to X)
    drawArc(ctx, ox, oy, 50, -xAngle, -rAngle, '#43E97B', 2);
    const alphaLabelAngle = (xAngle + rAngle) / 2;
    drawText(ctx, 'α=' + alpha + '°', ox + 60 * Math.cos(alphaLabelAngle), oy - 60 * Math.sin(alphaLabelAngle), '#43E97B', '11px sans-serif');
    
    // Beta arc (from R to Y)
    drawArc(ctx, ox, oy, 60, -rAngle, -yAngle, '#FFD600', 2);
    const betaLabelAngle = (rAngle + yAngle) / 2;
    drawText(ctx, 'β=' + beta + '°', ox + 75 * Math.cos(betaLabelAngle), oy - 75 * Math.sin(betaLabelAngle), '#FFD600', '11px sans-serif');
    
    document.getElementById('xAnyValue').textContent = X.toFixed(2);
    document.getElementById('yAnyValue').textContent = Y.toFixed(2);
}

if (rAnySlider) {
    rAnySlider.addEventListener('input', drawAnyDirComponents);
    alphaAnySlider.addEventListener('input', drawAnyDirComponents);
    betaAnySlider.addEventListener('input', drawAnyDirComponents);
    drawAnyDirComponents();
}

// ===== SOLUTION TOGGLE =====
function toggleSolution(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('show');
    }
}

// ===== PROBLEM VISUALS =====
function drawProblem1() {
    const canvas = document.getElementById('prob1Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ox = 60, oy = 240;
    const P = 5, Q = 8, alpha = 60;
    const scale = 25;
    const alphaRad = degToRad(alpha);
    
    const ax = ox + P * scale;
    const ay = oy;
    const bx = ox + Q * scale * Math.cos(alphaRad);
    const by = oy - Q * scale * Math.sin(alphaRad);
    const cx = ax + Q * scale * Math.cos(alphaRad);
    const cy = ay - Q * scale * Math.sin(alphaRad);
    
    // Parallelogram
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fillStyle = 'rgba(108, 99, 255, 0.08)';
    ctx.fill();
    
    drawDashedLine(ctx, ax, ay, cx, cy, 'rgba(0,0,0,0.2)');
    drawDashedLine(ctx, bx, by, cx, cy, 'rgba(0,0,0,0.2)');
    
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 2.5, 12);
    drawArrow(ctx, ox, oy, bx, by, '#FFD600', 2.5, 12);
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3, 14);
    
    drawArc(ctx, ox, oy, 30, 0, -alphaRad, '#6C63FF', 2);
    
    const R = Math.sqrt(P*P + Q*Q + 2*P*Q*Math.cos(alphaRad));
    const theta = radToDeg(Math.atan2(Q*Math.sin(alphaRad), P + Q*Math.cos(alphaRad)));
    
    drawText(ctx, 'P = 5N', (ox+ax)/2, oy+25, '#43E97B', 'bold 12px sans-serif');
    drawText(ctx, 'Q = 8N', (ox+bx)/2 - 25, (oy+by)/2, '#FFD600', 'bold 12px sans-serif');
    drawText(ctx, 'R = ' + R.toFixed(2) + 'N', (ox+cx)/2 + 20, (oy+cy)/2, '#FF6584', 'bold 13px sans-serif');
    drawText(ctx, '60°', ox + 40, oy - 10, '#6C63FF', 'bold 12px sans-serif');
    drawText(ctx, 'θ = ' + theta.toFixed(1) + '°', ox + 60, oy - 30, '#FF6584', '12px sans-serif');
}

function drawProblem2() {
    const canvas = document.getElementById('prob2Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ox = 60, oy = 230;
    const R = 10, alpha = 30;
    const scale = 20;
    const alphaRad = degToRad(alpha);
    
    const X = R * Math.cos(alphaRad);
    const Y = R * Math.sin(alphaRad);
    
    const rx = ox + R * scale * Math.cos(alphaRad);
    const ry = oy - R * scale * Math.sin(alphaRad);
    
    // Projections
    drawDashedLine(ctx, rx, ry, rx, oy, 'rgba(0,0,0,0.2)');
    drawDashedLine(ctx, rx, ry, ox, ry, 'rgba(0,0,0,0.2)');
    
    drawArrow(ctx, ox, oy, ox + X * scale, oy, '#43E97B', 2.5, 12);
    drawArrow(ctx, ox, oy, ox, oy - Y * scale, '#FFD600', 2.5, 12);
    drawArrow(ctx, ox, oy, rx, ry, '#FF6584', 3, 14);
    
    drawArc(ctx, ox, oy, 35, 0, -alphaRad, '#6C63FF', 2);
    
    // Right angle
    ctx.beginPath();
    ctx.moveTo(ox + 12, oy);
    ctx.lineTo(ox + 12, oy - 12);
    ctx.lineTo(ox, oy - 12);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    drawText(ctx, 'R = 10N', (ox + rx)/2 + 20, (oy + ry)/2 - 5, '#FF6584', 'bold 13px sans-serif');
    drawText(ctx, 'X = 8.66N', (ox + ox + X*scale)/2, oy + 25, '#43E97B', 'bold 12px sans-serif');
    drawText(ctx, 'Y = 5N', ox - 40, (oy + oy - Y*scale)/2, '#FFD600', 'bold 12px sans-serif');
    drawText(ctx, '30°', ox + 45, oy - 8, '#6C63FF', 'bold 12px sans-serif');
}

function drawProblem3() {
    const canvas = document.getElementById('prob3Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Number line
    const lineY = 100;
    const startX = 40;
    const endX = 460;
    const scale = (endX - startX) / 20;
    
    ctx.beginPath();
    ctx.moveTo(startX, lineY);
    ctx.lineTo(endX, lineY);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Tick marks
    for (let i = 0; i <= 20; i++) {
        const x = startX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, lineY - 5);
        ctx.lineTo(x, lineY + 5);
        ctx.strokeStyle = '#999';
        ctx.stroke();
        if (i % 5 === 0) {
            drawText(ctx, i.toString(), x, lineY + 20, '#666', '11px sans-serif');
        }
    }
    
    // Range bar
    const minX = startX + 7 * scale;
    const maxX = startX + 17 * scale;
    
    ctx.fillStyle = 'rgba(108, 99, 255, 0.2)';
    ctx.fillRect(minX, lineY - 20, maxX - minX, 40);
    
    // Min marker
    ctx.beginPath();
    ctx.arc(minX, lineY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6584';
    ctx.fill();
    drawText(ctx, 'R_min = 7N', minX, lineY - 30, '#FF6584', 'bold 12px sans-serif');
    
    // Max marker
    ctx.beginPath();
    ctx.arc(maxX, lineY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#43E97B';
    ctx.fill();
    drawText(ctx, 'R_max = 17N', maxX, lineY - 30, '#43E97B', 'bold 12px sans-serif');
    
    // Invalid markers
    const x20 = startX + 20 * scale;
    drawText(ctx, '❌ 20N', x20 - 10, lineY + 45, '#E74C3C', 'bold 12px sans-serif');
    
    const x3 = startX + 3 * scale;
    drawText(ctx, '❌ 3N', x3, lineY + 45, '#E74C3C', 'bold 12px sans-serif');
    
    drawText(ctx, '7 ≤ R ≤ 17 (সম্ভাব্য পরিসর)', 250, lineY + 70, '#6C63FF', 'bold 13px sans-serif');
}

function drawProblem4() {
    const canvas = document.getElementById('prob4Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ox = 80, oy = 220;
    const F = 10;
    const alpha = 120;
    const scale = 12;
    const alphaRad = degToRad(alpha);
    
    const ax = ox + F * scale;
    const ay = oy;
    const bx = ox + F * scale * Math.cos(alphaRad);
    const by = oy - F * scale * Math.sin(alphaRad);
    const cx = ax + F * scale * Math.cos(alphaRad);
    const cy = ay - F * scale * Math.sin(alphaRad);
    
    // Parallelogram
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ax, ay);
    ctx.lineTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.fillStyle = 'rgba(108, 99, 255, 0.08)';
    ctx.fill();
    
    drawDashedLine(ctx, ax, ay, cx, cy, 'rgba(0,0,0,0.2)');
    drawDashedLine(ctx, bx, by, cx, cy, 'rgba(0,0,0,0.2)');
    
    drawArrow(ctx, ox, oy, ax, ay, '#43E97B', 2.5, 12);
    drawArrow(ctx, ox, oy, bx, by, '#FFD600', 2.5, 12);
    drawArrow(ctx, ox, oy, cx, cy, '#FF6584', 3, 14);
    
    drawArc(ctx, ox, oy, 30, 0, -alphaRad, '#6C63FF', 2);
    
    drawText(ctx, 'F = 10N', (ox+ax)/2, oy+25, '#43E97B', 'bold 12px sans-serif');
    drawText(ctx, 'F = 10N', (ox+bx)/2 - 30, (oy+by)/2 + 10, '#FFD600', 'bold 12px sans-serif');
    drawText(ctx, 'R = 10N', (ox+cx)/2 + 15, (oy+cy)/2 + 15, '#FF6584', 'bold 13px sans-serif');
    drawText(ctx, '120°', ox + 15, oy - 30, '#6C63FF', 'bold 12px sans-serif');
}

function drawProblem5() {
    const canvas = document.getElementById('prob5Canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0f2ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const ox = 80, oy = 230;
    const R = 20, alpha = 30, beta = 45;
    const scale = 10;
    
    const alphaRad = degToRad(alpha);
    const betaRad = degToRad(beta);
    const totalAngle = alphaRad + betaRad;
    
    const X = R * Math.sin(betaRad) / Math.sin(totalAngle);
    const Y = R * Math.sin(alphaRad) / Math.sin(totalAngle);
    
    // R is "middle" — X is α below, Y is β above
    const rAngle = betaRad;
    const xAngle = 0;
    const yAngle = totalAngle;
    
    const rx = ox + R * scale * Math.cos(rAngle);
    const ry = oy - R * scale * Math.sin(rAngle);
    const xx = ox + X * scale * Math.cos(xAngle);
    const xy = oy - X * scale * Math.sin(xAngle);
    const yx = ox + Y * scale * Math.cos(yAngle);
    const yy = oy - Y * scale * Math.sin(yAngle);
    
    drawArrow(ctx, ox, oy, xx, xy, '#43E97B', 2.5, 12);
    drawArrow(ctx, ox, oy, yx, yy, '#FFD600', 2.5, 12);
    drawArrow(ctx, ox, oy, rx, ry, '#FF6584', 3, 14);
    
    drawArc(ctx, ox, oy, 40, -xAngle, -rAngle, '#43E97B', 2);
    drawArc(ctx, ox, oy, 55, -rAngle, -yAngle, '#FFD600', 2);
    
    drawText(ctx, 'R = 20N', (ox+rx)/2 + 15, (oy+ry)/2 + 20, '#FF6584', 'bold 13px sans-serif');
    drawText(ctx, 'X ≈ 14.64N', xx + 5, xy + 20, '#43E97B', 'bold 12px sans-serif');
    drawText(ctx, 'Y ≈ 10.35N', yx - 20, yy - 10, '#FFD600', 'bold 12px sans-serif');
    drawText(ctx, 'α=30°', ox + 50, oy - 8, '#43E97B', '11px sans-serif');
    drawText(ctx, 'β=45°', ox + 30, oy - 55, '#FFD600', '11px sans-serif');
}

// ===== INITIALIZE ALL ON LOAD =====
window.addEventListener('load', () => {
    // Small delay to ensure all canvases are rendered
    setTimeout(() => {
        drawParallelogram();
        drawDirection();
        drawPerpComponents();
        drawAnyDirComponents();
        drawTrigo();
        drawAngleExplorer();
        drawBook();
    }, 500);
});