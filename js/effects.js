/* =========================================================
   Happy Birthday — Guild Thần Thoại
   Toàn bộ hiệu ứng: cánh hoa bay, pháo giấy, bóng bay,
   thổi nến (chuột / micro), thiệp lật, nhạc nền.
   ========================================================= */

/* ---------------------------------------------------------
   1. CẤU HÌNH — sửa ở đây là đổi được nội dung cả trang
   --------------------------------------------------------- */
const CONFIG = {
    name: "Chị Dii",      // tên hiển thị to ở giữa trang
    who: "chị Dii",       // cách xưng hô trong mọi lời chúc
    guild: "Guild Thần Thoại",
    banner: "CHÚC MỪNG SINH NHẬT",   // chữ trên băng rôn cờ giấy
    candles: 5,
    lines: [
        "Chúc mừng sinh nhật <b>{who}</b>! 🎂",
        "Chúc {who} tuổi mới thật nhiều sức khoẻ 💪",
        "Lực chiến tăng vọt, gió nào cũng chuẩn 🎯",
        "Cả guild luôn ở đây với {who} nè 💗"
    ],
    wish:
        "Sinh nhật vui vẻ nha! 🎉\n\n" +
        "Chúc {who} một tuổi mới thật rực rỡ — cười thật nhiều, " +
        "gặp thật nhiều may mắn, và lúc nào cũng có các bé bên cạnh.\n\n" +
        "Đoàn kết ♥ Sống tình ♥ Mãi là anh em!",

    /* --- Sổ lưu bút: khách để lại lời chúc, mỗi người một lần --- */
    wishes: {
        /* Dán URL Realtime Database của Firebase vào đây là lời chúc được
           lưu chung, ai vào cũng thấy của nhau. Để trống thì lời chúc chỉ
           nằm trong máy người gửi. Không cần cài thư viện gì thêm.        */
        firebaseUrl: "https://birthday-f6029-default-rtdb.asia-southeast1.firebasedatabase.app",   // ví dụ: https://ten-du-an-default-rtdb.asia-southeast1.firebasedatabase.app

        maxName: 20,
        maxMsg: 140,

        // lời chúc mồi, để lúc chưa ai gửi thì bóng bay vẫn có chữ
        seed: [
            {
                name: "Guild Thần Thoại",
                msg: "Chúc chị Dii sinh nhật thật vui, tuổi mới nhiều may mắn và luôn mạnh khoẻ nha!"
            }
        ]
    }
};

// Cho phép đổi tên qua URL:  index.html?name=Dii&who=chị Dii
const params = new URLSearchParams(location.search);
const nameParam = params.get("name");
const whoParam = params.get("who");
if (nameParam) {
    CONFIG.name = nameParam.trim().slice(0, 40);
    CONFIG.who = CONFIG.name;
}
if (whoParam) CONFIG.who = whoParam.trim().slice(0, 40);

// Thay {who} / {name} trong mọi câu chữ
const fill = (s) => s.replace(/\{who\}/g, CONFIG.who).replace(/\{name\}/g, CONFIG.name);

const PALETTE = ["#ff6fae", "#ffd45c", "#a97bff", "#8fd7ff", "#ffffff", "#ff9ec4", "#e01b7d"];
// ban đêm bỏ các màu tối, chỉ giữ màu sáng để cánh hoa không chìm vào nền
const NIGHT_PALETTE = ["#ffd45c", "#fff0a0", "#ff9ec4", "#a9e4ff", "#ffffff", "#c9aeff"];
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/* ---------------------------------------------------------
   2. TÊN — tách từng chữ cái để nảy lên lần lượt
   --------------------------------------------------------- */
const nameEl = document.getElementById("name");
nameEl.textContent = "";
[...CONFIG.name].forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch === " " ? " " : ch;
    s.style.animationDelay = `${i * 70}ms, ${i * 120}ms`;
    nameEl.appendChild(s);
});

/* ---------------------------------------------------------
   2b. BĂNG RÔN CỜ GIẤY — mỗi chữ cái một lá cờ, treo võng xuống
   --------------------------------------------------------- */
const FLAG_COLORS = [
    ["#ff9ec9", "#e01b7d"],   // hồng
    ["#ffe49b", "#e89a1c"],   // gold
    ["#c9aeff", "#7d4fe0"],   // tím
    ["#a9e4ff", "#2f9fe0"]    // xanh trời
];

(function buildBunting() {
    const flagsEl = document.getElementById("buntingFlags");
    const chars = [...CONFIG.banner];
    const n = chars.length;
    flagsEl.style.setProperty("--flag-count", n);

    chars.forEach((ch, i) => {
        // hệ số võng 0…1 theo hình sin: hai đầu cao, giữa trũng xuống.
        // Nhân với --droop trong CSS nên độ võng tự co giãn theo bề ngang màn hình.
        const k = n > 1 ? Math.sin((Math.PI * i) / (n - 1)) : 0;

        const slot = document.createElement("span");
        slot.className = "flag-slot";
        slot.style.setProperty("--k", k.toFixed(3));

        const flag = document.createElement("span");
        flag.className = "flag";
        const [c1, c2] = FLAG_COLORS[i % FLAG_COLORS.length];
        flag.style.background = `linear-gradient(180deg, ${c1}, ${c2})`;
        flag.style.animationDelay = `${(i * -0.13).toFixed(2)}s`;
        flag.textContent = ch === " " ? "" : ch;

        slot.appendChild(flag);
        flagsEl.appendChild(slot);
    });
})();

/* ---------------------------------------------------------
   2c. BẦU TRỜI ĐÊM — dựng sẵn sao, chờ thổi nến xong mới hiện
   --------------------------------------------------------- */
let isNight = false;

(function buildStars() {
    const layer = document.getElementById("stars");
    const count = innerWidth < 600 ? 70 : 130;
    for (let i = 0; i < count; i++) {
        const sparkle = Math.random() < .12;      // ~1/8 số sao là ngôi bốn cánh
        const size = sparkle ? rand(6, 12) : rand(1.4, 3);
        const s = document.createElement("span");
        s.className = sparkle ? "star star--sparkle" : "star";
        s.style.width = s.style.height = size.toFixed(1) + "px";
        s.style.left = rand(0, 99).toFixed(2) + "%";
        s.style.top = rand(0, 76).toFixed(2) + "%";   // chừa sát đáy cho đỡ rối
        s.style.animationDuration = rand(1.4, 3.8).toFixed(2) + "s";
        s.style.animationDelay = (-rand(0, 4)).toFixed(2) + "s";
        layer.appendChild(s);
    }
})();

const shootingLayer = document.getElementById("shooting");
let shootingTimer;

function spawnShootingStar() {
    const el = document.createElement("span");
    el.className = "shooting-star";
    el.style.left = rand(35, 98) + "%";
    el.style.top = rand(2, 42) + "%";
    // xoay âm để sao băng lao xuống phía dưới bên trái, đuôi hất ngược lên
    el.style.transform = `rotate(${-rand(20, 44).toFixed(1)}deg)`;

    const head = document.createElement("i");
    head.style.animationDuration = rand(.9, 1.5).toFixed(2) + "s";
    el.appendChild(head);

    shootingLayer.appendChild(el);
    setTimeout(() => el.remove(), 2400);
}

function scheduleShootingStar() {
    shootingTimer = setTimeout(() => {
        spawnShootingStar();
        scheduleShootingStar();
    }, rand(3500, 9000));
}

/** Chuyển cảnh ngày → đêm. Toàn bộ phần nhìn do CSS lo, đây chỉ bật công tắc. */
function fallNight() {
    if (isNight) return;
    isNight = true;
    document.body.classList.add("night");
    // đổi màu cánh hoa đang bay sang tông sáng cho nổi trên nền đêm
    drifters.forEach((p) => { p.color = pick(NIGHT_PALETTE); });
    if (!prefersReduced) {
        setTimeout(spawnShootingStar, 2600);
        scheduleShootingStar();
    }
}

/* ---------------------------------------------------------
   3. CANVAS: cánh hoa / tim / sao bay lơ lửng + pháo giấy
   --------------------------------------------------------- */
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2);

function resizeCanvas() {
    W = innerWidth;
    H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
addEventListener("resize", resizeCanvas);

const SHAPES = ["petal", "heart", "star"];
const drifters = [];   // cánh hoa rơi nhè nhẹ, chạy liên tục
const confetti = [];   // pháo giấy, bắn từng đợt rồi biến mất

function makeDrifter(y) {
    return {
        x: rand(0, W),
        y: y ?? rand(-H, 0),
        size: rand(9, 20),
        speed: rand(18, 46),
        sway: rand(18, 44),
        swaySpeed: rand(.6, 1.5),
        rot: rand(0, Math.PI * 2),
        rotSpeed: rand(-1.1, 1.1),
        t: rand(0, 100),
        shape: pick(SHAPES),
        color: pick(isNight ? NIGHT_PALETTE : PALETTE),
        alpha: rand(.55, .95)
    };
}

function spawnConfetti(originX, originY, amount = 90) {
    for (let i = 0; i < amount; i++) {
        const angle = rand(-Math.PI, 0) + rand(-.35, .35);
        const power = rand(260, 640);
        confetti.push({
            x: originX,
            y: originY,
            vx: Math.cos(angle) * power * rand(.5, 1),
            vy: Math.sin(angle) * power,
            size: rand(6, 13),
            rot: rand(0, Math.PI * 2),
            rotSpeed: rand(-9, 9),
            color: pick(PALETTE),
            life: rand(2.4, 4.2),
            shape: Math.random() < .3 ? pick(SHAPES) : "rect"
        });
    }
}

/* ---------------------------------------------------------
   3b. PHÁO HOA — bắn ra từ hai góc trên màn hình
   --------------------------------------------------------- */
const FIRE_COLORS = [
    "#ff5fa8", "#ffd45c", "#a97bff", "#7fd8ff",
    "#ff8a4c", "#fff0a0", "#7dffc0", "#ff6f6f"
];

const rockets = [];   // quả pháo đang bay
const sparks = [];    // tia lửa sau khi nổ
const flashes = [];   // quầng sáng loé lúc nổ

/** side: "left" | "right" — bắn chéo từ góc trên vào giữa màn hình */
function launchFirework(side) {
    if (prefersReduced) return;
    const fromLeft = side === "left";
    const sx = fromLeft ? rand(-12, W * .04) : rand(W * .96, W + 12);
    // nổ gần hai mép trái/phải để lúc nào cũng thấy "pháo hoa từ hai bên"
    const tx = fromLeft ? rand(W * .08, W * .30) : rand(W * .70, W * .92);
    rockets.push({
        sx, sy: rand(-14, 4),
        tx, ty: rand(H * .14, H * .46),
        x: sx, y: 0,
        t: 0,
        dur: rand(.55, .85),
        color: pick(FIRE_COLORS),
        trail: []
    });
}

function explode(x, y, baseColor) {
    const n = innerWidth < 600 ? 64 : 120;
    const power = rand(210, 340);
    const mixed = Math.random() < .4;           // 2/5 số quả nổ ra nhiều màu
    for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + rand(-.07, .07);
        const sp = power * rand(.45, 1.2);
        const life = rand(1.5, 2.8);
        sparks.push({
            x, y, px: x, py: y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            life, maxLife: life,
            size: rand(2.2, 4.6),
            color: mixed ? pick(FIRE_COLORS) : baseColor
        });
    }
    flashes.push({ x, y, r: 10, life: .5, maxLife: .5, color: baseColor });
}

function updateFireworks(dt) {
    ctx.globalCompositeOperation = "lighter";

    // quầng sáng loé
    for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.life -= dt;
        if (f.life <= 0) { flashes.splice(i, 1); continue; }
        const k = f.life / f.maxLife;
        f.r += 460 * dt;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(.25, f.color);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = k * .8;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
    }

    // quả pháo đang bay
    ctx.lineCap = "round";
    for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.t += dt;
        const p = Math.min(r.t / r.dur, 1);
        const e = 1 - (1 - p) * (1 - p);        // bay nhanh rồi chậm dần
        r.x = r.sx + (r.tx - r.sx) * e;
        r.y = r.sy + (r.ty - r.sy) * e;
        r.trail.push(r.x, r.y);
        if (r.trail.length > 16) r.trail.splice(0, 2);

        ctx.strokeStyle = r.color;
        for (let j = 0; j < r.trail.length - 2; j += 2) {
            const f = j / r.trail.length;
            // vệt mờ to bên ngoài + lõi sáng bên trong => đuôi lửa có quầng
            ctx.globalAlpha = f * .3;
            ctx.lineWidth = (1.6 + f * 3.4) * 3;
            ctx.beginPath();
            ctx.moveTo(r.trail[j], r.trail[j + 1]);
            ctx.lineTo(r.trail[j + 2], r.trail[j + 3]);
            ctx.stroke();

            ctx.globalAlpha = f;
            ctx.lineWidth = 1.6 + f * 3.4;
            ctx.stroke();
        }

        if (p >= 1) { explode(r.x, r.y, r.color); rockets.splice(i, 1); }
    }

    // tia lửa — quá đông thì bỏ lớp quầng sáng cho khỏi tụt khung hình
    const glow = sparks.length < 1200;
    for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        s.px = s.x; s.py = s.y;
        s.vy += 130 * dt;                       // trọng lực
        s.vx *= 1 - 1.5 * dt;                   // lực cản không khí
        s.vy *= 1 - 1.0 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const k = s.life / s.maxLife;
        // gần tắt thì nhấp nháy như tàn lửa thật
        const a = k < .35 ? k * (Math.random() < .55 ? 1 : .25) : k;
        ctx.strokeStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(s.px, s.py);
        ctx.lineTo(s.x, s.y);

        if (glow) {
            ctx.globalAlpha = a * .3;             // quầng sáng
            ctx.lineWidth = s.size * k * 3.4;
            ctx.stroke();
        }

        ctx.globalAlpha = a;                      // lõi tia lửa
        ctx.lineWidth = s.size * k;
        ctx.stroke();
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
}

/* --- vẽ từng hình --- */
function drawShape(p) {
    const s = p.size;
    switch (p.shape) {
        case "heart":
            ctx.beginPath();
            ctx.moveTo(0, s * .3);
            ctx.bezierCurveTo(0, -s * .1, -s * .5, -s * .1, -s * .5, s * .25);
            ctx.bezierCurveTo(-s * .5, s * .55, 0, s * .75, 0, s);
            ctx.bezierCurveTo(0, s * .75, s * .5, s * .55, s * .5, s * .25);
            ctx.bezierCurveTo(s * .5, -s * .1, 0, -s * .1, 0, s * .3);
            ctx.fill();
            break;
        case "star": {
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const r = i % 2 ? s * .22 : s * .55;
                const a = (Math.PI / 5) * i - Math.PI / 2;
                i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
                    : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            ctx.closePath();
            ctx.fill();
            break;
        }
        case "petal":
            ctx.beginPath();
            ctx.ellipse(0, 0, s * .52, s * .3, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        default: // rect — mảnh giấy pháo
            ctx.fillRect(-s / 2, -s / 4, s, s / 2);
    }
}

let lastTime = performance.now();
let fxRunning = false;

function tick(now) {
    if (!fxRunning) return;
    const dt = Math.min((now - lastTime) / 1000, .05);
    lastTime = now;
    ctx.clearRect(0, 0, W, H);

    for (const p of drifters) {
        p.t += dt;
        p.y += p.speed * dt;
        p.x += Math.cos(p.t * p.swaySpeed) * p.sway * dt;
        p.rot += p.rotSpeed * dt;
        if (p.y - p.size > H) { Object.assign(p, makeDrifter(-p.size * 2)); }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        drawShape(p);
        ctx.restore();
    }

    for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];
        p.life -= dt;
        p.vy += 900 * dt;          // trọng lực
        p.vx *= 1 - 1.2 * dt;      // lực cản
        p.vy *= 1 - 0.4 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotSpeed * dt;
        if (p.life <= 0 || p.y - p.size > H) { confetti.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.min(1, p.life);
        ctx.fillStyle = p.color;
        drawShape(p);
        ctx.restore();
    }

    updateFireworks(dt);
    requestAnimationFrame(tick);
}

/* Mỗi loạt bắn cả hai góc cùng lúc, thỉnh thoảng nổ chồng thêm một cặp nữa */
let fireTimer;

function volley() {
    launchFirework("left");
    setTimeout(() => launchFirework("right"), rand(60, 240));
    if (Math.random() < .55) {
        setTimeout(() => launchFirework("left"), rand(300, 520));
        setTimeout(() => launchFirework("right"), rand(380, 640));
    }
}

function scheduleFirework() {
    fireTimer = setTimeout(() => {
        volley();
        scheduleFirework();
        // ban đêm bắn dày hơn cho ra không khí tiệc
    }, isNight ? rand(550, 1200) : rand(800, 1700));
}

function startFx() {
    if (fxRunning) return;
    const count = prefersReduced ? 0 : (innerWidth < 600 ? 26 : 46);
    for (let i = 0; i < count; i++) drifters.push(makeDrifter());
    fxRunning = true;
    lastTime = performance.now();
    requestAnimationFrame(tick);

    if (!prefersReduced) {
        volley();
        scheduleFirework();
    }
}

/* ---------------------------------------------------------
   3c. SỔ LƯU BÚT — nơi cất lời chúc của khách
   Tách riêng thành một lớp lưu trữ để đổi chỗ chứa mà không
   phải sờ tới phần giao diện.
   --------------------------------------------------------- */
const LS_WISHES = "tt_wishes";
const LS_SENT = "tt_wish_sent";

// localStorage có thể ném lỗi ở chế độ riêng tư, nên bọc lại cho chắc
const safeStore = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* bỏ qua */ } }
};

function readLocalWishes() {
    try {
        const raw = JSON.parse(safeStore.get(LS_WISHES) || "[]");
        return Array.isArray(raw) ? raw : [];
    } catch { return []; }
}

const WishStore = {
    cache: [],

    get endpoint() {
        const url = (CONFIG.wishes.firebaseUrl || "").trim();
        return url ? url.replace(/\/+$/, "") + "/wishes.json" : null;
    },

    /** Nạp lời chúc: mồi + trên máy chủ + lưu trong máy, rồi khử trùng lặp */
    async load() {
        let remote = [];
        if (this.endpoint) {
            try {
                const res = await fetch(this.endpoint, { cache: "no-store" });
                const data = await res.json();
                if (data && typeof data === "object") remote = Object.values(data);
            } catch { /* mất mạng thì vẫn còn bản lưu trong máy */ }
        }

        const seen = new Set();
        this.cache = [...CONFIG.wishes.seed, ...remote, ...readLocalWishes()]
            .filter((w) => w && w.name && w.msg)
            .map((w) => ({
                name: String(w.name).slice(0, 40),
                msg: String(w.msg).slice(0, 300)
            }))
            .filter((w) => {
                const key = w.name + " " + w.msg;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        return this.cache;
    },

    /** Ghi cả lên máy chủ lẫn trong máy — mất mạng thì lời chúc vẫn không bay mất */
    async add(wish) {
        let ok = true;
        if (this.endpoint) {
            try {
                const res = await fetch(this.endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...wish, at: Date.now() })
                });
                ok = res.ok;
            } catch { ok = false; }
        }
        safeStore.set(LS_WISHES, JSON.stringify([...readLocalWishes(), wish].slice(-300)));
        this.cache.push(wish);
        return ok;
    }
};

const hasSentWish = () => safeStore.get(LS_SENT) === "1";

// lần lượt lấy từng lời chúc để mọi người đều được lên bóng, không ai bị bỏ sót
let wishCursor = 0;
function nextWish() {
    if (!WishStore.cache.length) return null;
    return WishStore.cache[wishCursor++ % WishStore.cache.length];
}

/* ---------------------------------------------------------
   4. BÓNG BAY — bay lên liên tục, bấm vào là nổ.
   Bóng nào mang lời chúc thì in tên người gửi, bấm vỡ ra là đọc được.
   --------------------------------------------------------- */
const balloonLayer = document.getElementById("balloons");
const wishPop = document.getElementById("wishPop");
const wishPopName = document.getElementById("wishPopName");
const wishPopMsg = document.getElementById("wishPopMsg");
let wishPopTimer;

function showWishPop(w) {
    // textContent chứ không phải innerHTML: lời chúc là chữ người lạ nhập vào
    wishPopName.textContent = w.name;
    wishPopMsg.textContent = w.msg;
    wishPop.classList.add("is-open");
    clearTimeout(wishPopTimer);
    wishPopTimer = setTimeout(() => wishPop.classList.remove("is-open"), 5500);
}

function spawnBalloon(forcedWish) {
    const b = document.createElement("div");
    b.className = "balloon";

    // ưu tiên bóng mang lời chúc khi đã có người gửi
    const wish = forcedWish ||
        (WishStore.cache.length && Math.random() < .8 ? nextWish() : null);

    const c = pick(PALETTE);
    b.style.background = `radial-gradient(circle at 32% 28%, #fff9, ${c} 55%, ${c})`;
    b.style.left = rand(2, 88) + "%";
    b.style.animationDuration = (wish ? rand(14, 22) : rand(11, 20)) + "s";

    const scale = wish ? rand(1.05, 1.4) : rand(.65, 1.25);
    b.style.width = 54 * scale + "px";
    b.style.height = 68 * scale + "px";

    if (wish) {
        b.classList.add("balloon--wish");
        const tag = document.createElement("span");
        tag.className = "balloon__name";
        tag.textContent = wish.name;
        b.appendChild(tag);
    }

    b.addEventListener("click", (e) => {
        b.classList.add("pop");
        spawnConfetti(e.clientX, e.clientY, wish ? 60 : 26);
        if (wish) showWishPop(wish);
        setTimeout(() => b.remove(), 400);
    });
    b.addEventListener("animationend", () => b.remove());
    balloonLayer.appendChild(b);
}

let balloonTimer;
function startBalloons() {
    if (prefersReduced) return;
    for (let i = 0; i < 4; i++) setTimeout(() => spawnBalloon(), i * 900);
    balloonTimer = setInterval(() => spawnBalloon(), 2600);
}

/* ---------------------------------------------------------
   5. NẾN — thổi bằng chuột hoặc bằng micro
   --------------------------------------------------------- */
const candlesEl = document.getElementById("candles");
const cakeEl = document.getElementById("cake");
const cakeHint = document.getElementById("cakeHint");
const micBtn = document.getElementById("micBtn");

for (let i = 0; i < CONFIG.candles; i++) {
    const c = document.createElement("div");
    c.className = "candle";
    c.innerHTML = '<div class="flame"></div><div class="smoke"></div>';
    candlesEl.appendChild(c);
}
const candles = [...candlesEl.children];

let allOut = false;
function blowOne() {
    const lit = candles.filter((c) => !c.classList.contains("out"));
    if (!lit.length) return;
    pick(lit).classList.add("out");
    if (candles.every((c) => c.classList.contains("out"))) celebrate();
}

function blowAll() {
    candles.forEach((c) => c.classList.add("out"));
    celebrate();
}

function celebrate() {
    if (allOut) return;
    allOut = true;
    const r = cakeEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + 20;
    spawnConfetti(cx, cy, 160);
    setTimeout(() => spawnConfetti(rand(0, W), rand(H * .2, H * .5), 90), 260);
    setTimeout(() => spawnConfetti(rand(0, W), rand(H * .2, H * .5), 90), 520);

    // trời sập tối — pháo hoa từ đây trở đi sẽ rực hơn hẳn trên nền đêm
    setTimeout(fallNight, 450);

    // loạt pháo hoa mừng: 14 quả liên tiếp từ hai góc, dày dần khi trời tối
    for (let i = 0; i < 14; i++) {
        setTimeout(() => launchFirework(i % 2 ? "right" : "left"), 600 + i * 300);
    }
    cakeHint.textContent = `Điều ước đã bay lên trời rồi đó! 🌟 Chúc mừng sinh nhật ${CONFIG.who} nha!`;
    cakeHint.classList.add("is-done");
    stopMic();
    micBtn.hidden = true;
}

cakeEl.addEventListener("click", blowOne);
cakeEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blowOne(); }
});

/* --- phát hiện tiếng thổi qua micro --- */
const MIC_LABEL = micBtn.textContent.trim();   // nhớ nhãn gốc để khôi phục khi tắt
let micStream = null, audioCtx = null, micRAF = null;

function stopMic() {
    if (micRAF) cancelAnimationFrame(micRAF);
    micRAF = null;
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
    micBtn.classList.remove("is-on");
}

async function startMic() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        });
    } catch {
        micBtn.textContent = "😢 Không mở được micro — bấm vào bánh nhé";
        return;
    }
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const src = audioCtx.createMediaStreamSource(micStream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);

    const bins = new Uint8Array(analyser.frequencyBinCount);
    let sustained = 0;
    micBtn.classList.add("is-on");
    micBtn.textContent = "🎤 Thổi mạnh vào micro đi nào!";

    const loop = () => {
        analyser.getByteFrequencyData(bins);
        // Tiếng thổi = năng lượng lớn dồn ở dải tần thấp
        let low = 0;
        for (let i = 2; i < 28; i++) low += bins[i];
        low /= 26;

        if (low > 132) {
            sustained++;
            if (sustained > 4) { blowOne(); sustained = 0; }
        } else {
            sustained = Math.max(0, sustained - 1);
        }
        micRAF = requestAnimationFrame(loop);
    };
    loop();
}

micBtn.addEventListener("click", () => {
    micStream ? (stopMic(), micBtn.textContent = MIC_LABEL) : startMic();
});
if (!navigator.mediaDevices?.getUserMedia) micBtn.hidden = true;

/* ---------------------------------------------------------
   6. THIỆP LẬT
   --------------------------------------------------------- */
const wishCard = document.getElementById("wishCard");
const cardOverlay = document.getElementById("cardOverlay");
document.getElementById("wishText").textContent = fill(CONFIG.wish);

function openCard() {
    cardOverlay.classList.add("is-open");
    spawnConfetti(W * .5, H * .5, 70);
    // hiện ra mặt trước rồi tự lật sang lời chúc
    setTimeout(() => wishCard.classList.add("is-open"), 420);
}

function closeCard() {
    cardOverlay.classList.remove("is-open");
    setTimeout(() => wishCard.classList.remove("is-open"), 350);
}

document.getElementById("cardBtn").addEventListener("click", openCard);
document.getElementById("cardClose").addEventListener("click", closeCard);

// bấm ra ngoài thiệp thì đóng, bấm vào thiệp thì lật
cardOverlay.addEventListener("click", (e) => {
    if (e.target === cardOverlay) closeCard();
});
wishCard.addEventListener("click", () => wishCard.classList.toggle("is-open"));

addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (cardOverlay.classList.contains("is-open")) closeCard();
    if (formOverlay.classList.contains("is-open")) closeWishForm();
});

/* ---------------------------------------------------------
   6b. Ô GỬI LỜI CHÚC
   --------------------------------------------------------- */
const formOverlay = document.getElementById("formOverlay");
const wishForm = document.getElementById("wishForm");
const wishBtn = document.getElementById("wishBtn");
const wishNameInput = document.getElementById("wishName");
const wishMsgInput = document.getElementById("wishMsg");
const wishErr = document.getElementById("wishErr");
const wishSend = document.getElementById("wishSend");
const wishCountEl = document.getElementById("wishCount");

document.getElementById("wishFormTitle").textContent = `Gửi lời chúc tới ${CONFIG.who}`;
wishNameInput.maxLength = CONFIG.wishes.maxName;
wishMsgInput.maxLength = CONFIG.wishes.maxMsg;
wishMsgInput.addEventListener("input", () => {
    wishCountEl.textContent = wishMsgInput.value.length;
});

/** Đã gửi rồi thì nút đổi thành bộ đếm, bấm vào là thả một chùm bóng lời chúc */
function refreshWishBtn() {
    const n = WishStore.cache.length;
    if (hasSentWish()) {
        wishBtn.textContent = n ? `💌 ${n} lời chúc` : "💌 Đã gửi rồi";
        wishBtn.classList.remove("btn-pill--hot");
    } else {
        wishBtn.textContent = "✍️ Gửi lời chúc";
        wishBtn.classList.add("btn-pill--hot");
    }
}

function openWishForm() {
    wishErr.textContent = "";
    formOverlay.classList.add("is-open");
    setTimeout(() => wishNameInput.focus(), 420);
}

function closeWishForm() {
    formOverlay.classList.remove("is-open");
}

wishBtn.addEventListener("click", () => {
    if (hasSentWish()) {
        // thưởng cho người đã gửi: thả ngay một chùm bóng mang lời chúc
        for (let i = 0; i < 5; i++) setTimeout(() => spawnBalloon(nextWish()), i * 260);
        return;
    }
    openWishForm();
});

document.getElementById("formClose").addEventListener("click", closeWishForm);
formOverlay.addEventListener("click", (e) => {
    if (e.target === formOverlay) closeWishForm();
});

wishForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = wishNameInput.value.trim().replace(/\s+/g, " ");
    const msg = wishMsgInput.value.trim().replace(/\s+/g, " ");

    if (!name) {
        wishErr.textContent = "Cho mình xin tên hoặc nick của bạn nha 🥺";
        wishNameInput.focus();
        return;
    }
    if (msg.length < 2) {
        wishErr.textContent = "Viết vài chữ cho chị Dii đi mà 💗";
        wishMsgInput.focus();
        return;
    }

    wishErr.textContent = "";
    wishSend.disabled = true;
    wishSend.textContent = "Đang thả bóng...";

    const wish = { name, msg };
    const ok = await WishStore.add(wish);

    safeStore.set(LS_SENT, "1");
    closeWishForm();
    refreshWishBtn();

    // thả ngay quả bóng của chính người vừa gửi
    setTimeout(() => {
        spawnBalloon(wish);
        spawnConfetti(W * .5, H * .62, 110);
        showWishPop(wish);
    }, 450);

    wishSend.disabled = false;
    wishSend.textContent = "🎈 Thả bóng bay";
    if (!ok) console.warn("Không gửi được lên máy chủ — lời chúc đã lưu trong máy.");
});

// nạp lời chúc ngay từ đầu; chế độ chung thì thỉnh thoảng nạp lại để thấy bài mới
WishStore.load().then(refreshWishBtn);
if (WishStore.endpoint) {
    setInterval(() => WishStore.load().then(refreshWishBtn), 25000);
}

/* ---------------------------------------------------------
   7. NÚT BẮN PHÁO GIẤY + TIM BAY KHI CHẠM MÀN HÌNH
   --------------------------------------------------------- */
document.getElementById("againBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    spawnConfetti(rand(W * .15, W * .35), H * .75, 110);
    spawnConfetti(rand(W * .65, W * .85), H * .75, 110);
    launchFirework("left");
    setTimeout(() => launchFirework("right"), 260);
});

const TAP_EMOJI = ["💖", "✨", "🌸", "⭐", "💗", "🎀"];
document.addEventListener("pointerdown", (e) => {
    if (prefersReduced) return;
    // đang gõ lời chúc thì đừng rắc tim lên ô nhập
    if (e.target.closest("input, textarea, .wish-form")) return;
    const h = document.createElement("span");
    h.className = "tap-heart";
    h.textContent = pick(TAP_EMOJI);
    h.style.left = e.clientX + "px";
    h.style.top = e.clientY + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
});

/* ---------------------------------------------------------
   8. NHẠC NỀN
   --------------------------------------------------------- */
const song = document.getElementById("song");
const musicBtn = document.getElementById("musicBtn");
song.volume = .55;

musicBtn.addEventListener("click", () => {
    if (song.paused) {
        song.play();
        musicBtn.classList.remove("is-muted");
    } else {
        song.pause();
        musicBtn.classList.add("is-muted");
    }
});

/* ---------------------------------------------------------
   9. LẤP LÁNH Ở MÀN HÌNH MỞ QUÀ
   --------------------------------------------------------- */
const gate = document.getElementById("gate");
const gateSparkles = document.querySelector(".gate-sparkles");
let gateTimer = setInterval(() => {
    const s = document.createElement("span");
    s.className = "tap-heart";
    s.textContent = pick(["✨", "⭐", "💫", "🌟"]);
    s.style.position = "absolute";
    s.style.left = rand(5, 95) + "%";
    s.style.top = rand(20, 90) + "%";
    s.style.fontSize = rand(14, 28) + "px";
    gateSparkles.appendChild(s);
    setTimeout(() => s.remove(), 1000);
}, 320);

/* ---------------------------------------------------------
   10. BẤM "MỞ QUÀ" → vào sân khấu chính
   --------------------------------------------------------- */
const stage = document.getElementById("stage");

document.getElementById("play").addEventListener("click", () => {
    clearInterval(gateTimer);
    gate.classList.add("is-hidden");
    setTimeout(() => gate.remove(), 900);

    stage.hidden = false;
    musicBtn.hidden = false;

    song.play().catch(() => musicBtn.classList.add("is-muted"));

    startFx();
    startBalloons();
    setTimeout(() => spawnConfetti(W * .5, H * .55, 140), 400);

    // ?night=1 để xem thử cảnh đêm mà không cần thổi hết nến
    if (params.get("night")) setTimeout(fallNight, 600);

    // chữ gõ máy
    new Typed("#typed", {
        strings: CONFIG.lines.map(fill),
        typeSpeed: 42,
        backSpeed: 16,
        backDelay: 1800,
        startDelay: 900,
        loop: true,
        showCursor: false
    });
});
