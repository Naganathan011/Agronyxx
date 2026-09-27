/* =========================================================
   AGRONYXX – Smart Agricultural Water Resource Management
   Redesigned for SIH Hackathon Judging
   ========================================================= */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', Roboto, system-ui, -apple-system, sans-serif;
}

html { scroll-behavior: smooth; }

body {
    background: #061511;
    color: #0e3d2b;
    min-height: 100vh;
    overflow-x: hidden;
}

/* =========================================================
   HERO SECTION
   ========================================================= */
.hero {
    min-height: 100vh;
    background:
        radial-gradient(ellipse at 20% 20%, rgba(30, 160, 90, 0.35), transparent 55%),
        radial-gradient(ellipse at 80% 70%, rgba(20, 120, 200, 0.25), transparent 55%),
        linear-gradient(160deg, #061511 0%, #0f2e21 50%, #08201a 100%);
    color: white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    overflow: hidden;
}

.hero-bg-glow {
    position: absolute;
    top: -50%;
    left: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(60, 200, 120, 0.15), transparent 70%);
    pointer-events: none;
    animation: floatGlow 12s ease-in-out infinite;
}

@keyframes floatGlow {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(80px, 60px) scale(1.15); }
}

.hero-content {
    max-width: 1400px;
    width: 100%;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 2;
}

.hero-badge {
    display: inline-block;
    padding: 8px 18px;
    background: rgba(60, 200, 120, 0.15);
    border: 1px solid rgba(80, 220, 140, 0.4);
    border-radius: 40px;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 1px;
    color: #7ee8a2;
    margin-bottom: 22px;
    text-transform: uppercase;
}

.hero-title {
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 900;
    letter-spacing: -3px;
    line-height: 0.95;
    color: #ffffff;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    text-shadow: 0 4px 30px rgba(60, 200, 120, 0.3);
}

.hero-version {
    font-size: 1rem;
    background: linear-gradient(135deg, #1b8a55, #0f6b3d);
    color: #e6ffed;
    padding: 8px 16px;
    border-radius: 40px;
    letter-spacing: 2px;
    font-weight: 800;
    margin-top: 18px;
    box-shadow: 0 8px 24px rgba(0, 150, 70, 0.5);
    animation: badgePulse 2.5s ease-in-out infinite;
}

@keyframes badgePulse {
    0%, 100% { box-shadow: 0 8px 24px rgba(0, 150, 70, 0.5); }
    50% { box-shadow: 0 8px 36px rgba(0, 220, 120, 0.85); }
}

.hero-tagline {
    font-size: clamp(1rem, 1.6vw, 1.3rem);
    line-height: 1.6;
    color: #b8ddc4;
    margin-bottom: 32px;
    max-width: 640px;
    font-weight: 400;
}

.hero-tagline strong { color: #7ee8a2; font-weight: 700; }
.hero-tagline em { color: #8ecae6; font-style: normal; font-weight: 600; }

.hero-problem {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 34px;
}

.problem-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(120, 200, 150, 0.2);
    border-radius: 18px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    backdrop-filter: blur(8px);
    transition: transform 0.3s, border-color 0.3s;
}

.problem-card:hover {
    transform: translateY(-4px);
    border-color: rgba(120, 220, 160, 0.5);
}

.problem-card.solution {
    background: rgba(40, 180, 100, 0.12);
    border-color: rgba(80, 220, 140, 0.5);
}

.problem-icon { font-size: 1.8rem; }

.problem-stat {
    font-size: 1.35rem;
    font-weight: 900;
    color: #7ee8a2;
    line-height: 1;
    letter-spacing: -0.5px;
}

.problem-card.solution .problem-stat { color: #b8ffd4; }

.problem-text {
    font-size: 0.72rem;
    color: #a0c8b0;
    margin-top: 4px;
    line-height: 1.3;
    font-weight: 500;
}

.hero-cta-row {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
}

.hero-cta {
    padding: 16px 34px;
    background: linear-gradient(135deg, #1b8a55, #147a48);
    color: white;
    border: none;
    border-radius: 60px;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 12px 30px rgba(20, 150, 80, 0.5), inset 0 1px 2px rgba(255,255,255,0.3);
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
}

.hero-cta::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    transform: translateX(-100%);
    animation: ctaShine 3s infinite;
}

@keyframes ctaShine {
    0% { transform: translateX(-100%); }
    60%, 100% { transform: translateX(200%); }
}

.hero-cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 40px rgba(20, 200, 100, 0.6);
}

.hero-hint {
    font-size: 0.8rem;
    color: #7a9a85;
    font-style: italic;
}

/* Hero visual */
.hero-visual {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    max-width: 460px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hv-orbit {
    position: absolute;
    inset: 8%;
    border: 2px dashed rgba(80, 220, 140, 0.25);
    border-radius: 50%;
    animation: orbitSpin 30s linear infinite;
}

.hv-orbit::before {
    content: '';
    position: absolute;
    inset: 18%;
    border: 1px solid rgba(80, 220, 140, 0.15);
    border-radius: 50%;
}

@keyframes orbitSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.hv-center {
    font-size: 6rem;
    filter: drop-shadow(0 10px 30px rgba(60, 200, 120, 0.6));
    animation: centerPulse 3s ease-in-out infinite;
}

@keyframes centerPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
}

.hv-icon {
    position: absolute;
    width: 62px;
    height: 62px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(120, 220, 160, 0.35);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s;
}

.hv-icon:hover { transform: scale(1.15); }

.hv-1 { top: 0%; left: 50%; transform: translateX(-50%); animation: float1 4s ease-in-out infinite; }
.hv-2 { top: 25%; right: 0%; animation: float2 5s ease-in-out infinite; }
.hv-3 { bottom: 25%; right: 0%; animation: float3 4.5s ease-in-out infinite; }
.hv-4 { bottom: 0%; left: 50%; transform: translateX(-50%); animation: float1 5.5s ease-in-out infinite; }
.hv-5 { bottom: 25%; left: 0%; animation: float2 4.2s ease-in-out infinite; }
.hv-6 { top: 25%; left: 0%; animation: float3 5.2s ease-in-out infinite; }

@keyframes float1 {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, -12px); }
}
@keyframes float2 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-8px, -8px); }
}
@keyframes float3 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(8px, 8px); }
}

.scroll-arrow {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.6rem;
    color: #7ee8a2;
    animation: bounceArrow 2s infinite;
    z-index: 3;
}

@keyframes bounceArrow {
    0%, 100% { transform: translate(-50%, 0); }
    50% { transform: translate(-50%, 12px); }
}

/* =========================================================
   SECTION HEADINGS
   ========================================================= */
.section-heading {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    font-weight: 900;
    color: #0a3320;
    letter-spacing: -1px;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
}

.heading-num {
    font-size: 0.9rem;
    background: linear-gradient(135deg, #1b8a55, #0f6b3d);
    color: #e6ffed;
    padding: 6px 14px;
    border-radius: 40px;
    letter-spacing: 2px;
    font-weight: 800;
    box-shadow: 0 6px 16px rgba(20, 120, 70, 0.4);
}

.section-sub {
    font-size: 1rem;
    color: #4a7c60;
    margin-bottom: 32px;
    font-weight: 500;
}

/* =========================================================
   HOW IT WORKS
   ========================================================= */
.how-it-works {
    background: linear-gradient(180deg, #f4fcf6 0%, #e6f4ea 100%);
    padding: 70px 40px;
    border-bottom: 1px solid rgba(60, 140, 90, 0.15);
}

.steps-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.step-card {
    background: white;
    border-radius: 24px;
    padding: 32px 28px;
    box-shadow: 0 20px 40px -20px rgba(20, 60, 35, 0.3);
    border: 1px solid rgba(120, 200, 150, 0.4);
    position: relative;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.step-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 50px -20px rgba(20, 100, 60, 0.4);
}

.step-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1b8a55, #3dc47a, #8ecae6);
}

.step-num {
    position: absolute;
    top: 20px;
    right: 24px;
    font-size: 3.5rem;
    font-weight: 900;
    color: rgba(60, 180, 120, 0.1);
    line-height: 1;
}

.step-icon {
    font-size: 2.5rem;
    margin-bottom: 14px;
}

.step-card h3 {
    font-size: 1.3rem;
    color: #0a3320;
    margin-bottom: 10px;
    font-weight: 800;
}

.step-card p {
    font-size: 0.9rem;
    color: #4a7c60;
    line-height: 1.55;
}

/* =========================================================
   SIMULATOR SECTION
   ========================================================= */
.simulator-section {
    background: radial-gradient(circle at 20% 10%, #0f2e21, #061511 80%);
    padding: 70px 40px;
}

.simulator-section .section-heading { color: #ffffff; }
.simulator-section .section-sub { color: #a0c8b0; }
.simulator-section .heading-num { box-shadow: 0 6px 20px rgba(20, 200, 100, 0.5); }

.agronyxx-app {
    max-width: 1500px;
    margin: 0 auto;
    background: linear-gradient(160deg, #f4fcf6 0%, #e6f4ea 60%, #ddeee2 100%);
    border-radius: 36px;
    box-shadow:
        0 40px 80px -30px rgba(0, 40, 20, 0.8),
        0 0 0 1px rgba(120, 200, 150, 0.4),
        inset 0 1px 2px rgba(255, 255, 255, 0.9);
    padding: 22px 26px 24px;
    position: relative;
}

/* ===== HEADER ===== */
.header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
    gap: 12px;
}

.logo-area h1 {
    font-size: 2.1rem;
    font-weight: 800;
    letter-spacing: -0.8px;
    color: #0a3320;
    line-height: 1;
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-area h1 span {
    background: linear-gradient(135deg, #1b8a55, #0f6b3d);
    color: #e6ffed;
    font-size: 0.9rem;
    padding: 5px 14px;
    border-radius: 40px;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 100, 50, 0.4);
}

.subtitle {
    font-size: 0.82rem;
    font-weight: 500;
    color: #3a6b50;
    margin-top: 4px;
}

.sim-clock {
    background: linear-gradient(145deg, #0f3a27, #1c5c3d);
    padding: 10px 20px;
    border-radius: 100px;
    color: #d4f5e0;
    font-weight: 600;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 50, 25, 0.4);
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 1rem;
    border: 1px solid #52b883;
}

.clock-day {
    background: #2d8b5c;
    padding: 4px 14px;
    border-radius: 32px;
    font-size: 0.9rem;
    color: #fff;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
}

/* ===== MODE SELECTOR ===== */
.mode-selector {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    align-items: center;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.6);
    padding: 8px;
    border-radius: 60px;
    border: 1px solid rgba(140, 200, 160, 0.5);
    backdrop-filter: blur(8px);
}

.mode-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    border-radius: 50px;
    border: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    transition: all 0.25s;
    font-family: inherit;
    color: #205840;
}

.mode-btn .mode-icon { font-size: 1.6rem; }
.mode-btn .mode-text { font-weight: 800; font-size: 0.9rem; letter-spacing: 0.5px; display: block; }
.mode-btn .mode-desc { font-size: 0.68rem; opacity: 0.75; display: block; font-weight: 500; }

.mode-btn:hover { background: rgba(120, 200, 150, 0.15); }

.mode-btn.active {
    background: linear-gradient(135deg, #1b8a55, #147a48);
    color: white;
    box-shadow: 0 8px 20px rgba(20, 120, 70, 0.35);
    border-color: #3dc47a;
}

.mode-btn.active .mode-desc { color: #c8f5d8; opacity: 0.95; }

.mode-indicator {
    margin-left: auto;
    font-size: 0.78rem;
    font-weight: 800;
    padding: 8px 20px;
    border-radius: 30px;
    background: #d4f0dd;
    color: #0f5e34;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

/* ===== DASHBOARD ===== */
.dashboard {
    display: grid;
    grid-template-columns: 1.5fr 0.9fr 1fr;
    gap: 16px;
    margin-bottom: 14px;
}

/* ===== FARM SCENE ===== */
.farm-scene {
    grid-column: 1 / 3;
    background: linear-gradient(180deg, #a8d8c0 0%, #7fbf9a 100%);
    border-radius: 26px;
    position: relative;
    box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.6),
        0 16px 30px -12px #0f3d28,
        0 0 0 2px rgba(60, 140, 90, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.sky-hud {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    padding: 8px 14px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #0a3320;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.6);
    flex-wrap: wrap;
}

.hud-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 30px;
}

.canvas-wrap {
    flex: 1;
    position: relative;
    min-height: 320px;
}

#farmCanvas {
    width: 100%;
    height: 100%;
    display: block;
}

.rain-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.canvas-legend {
    position: absolute;
    bottom: 10px;
    left: 12px;
    display: flex;
    gap: 12px;
    background: rgba(255, 255, 255, 0.85);
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 0.68rem;
    font-weight: 700;
    color: #0a3320;
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.leg {
    display: flex;
    align-items: center;
    gap: 5px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.dot-river { background: #1f7a9e; }
.dot-rain { background: #3b9bd7; }
.dot-well { background: #6f4e2e; }
.dot-crop { background: #2b8e5a; }

/* ===== INFO PANELS ===== */
.info-panel {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    border-radius: 22px;
    padding: 14px 16px;
    box-shadow:
        0 10px 24px -8px rgba(20, 60, 35, 0.25),
        inset 0 1px 2px #fff;
    border: 1px solid rgba(150, 210, 170, 0.7);
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.panel-icon { font-size: 1.1rem; }

.panel-title {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: 800;
    color: #1b5e3a;
}

.metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    font-weight: 500;
    color: #2a4d38;
    padding: 2px 0;
}

.metric-value {
    font-weight: 700;
    color: #0b3320;
    background: #e1f3e6;
    padding: 2px 10px;
    border-radius: 30px;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    min-width: 60px;
    text-align: center;
}

.metric-value.accent { background: #d4e8ff; color: #14457a; }
.metric-value.accent-green { background: #c8f5d8; color: #0f5e34; }

.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #b8ddc4, transparent);
    margin: 6px 0;
}

/* Moisture bar */
.moisture-bar-wrap { margin-top: 6px; }
.moisture-bar {
    position: relative;
    height: 14px;
    background: #cde4d6;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
.moisture-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b9bd7, #2b8e5a);
    border-radius: 30px;
    transition: width 0.4s;
}
.moisture-marker {
    position: absolute;
    top: -3px;
    width: 3px;
    height: 20px;
    border-radius: 2px;
}
.moisture-marker.wilting { background: #dc2626; }
.moisture-marker.threshold { background: #f59e0b; }
.moisture-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.62rem;
    color: #4a7c60;
    margin-top: 2px;
    font-weight: 600;
}
.moisture-legend {
    display: flex;
    gap: 12px;
    font-size: 0.62rem;
    color: #4a7c60;
    margin-top: 6px;
    font-weight: 600;
}
.moisture-legend .marker {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
}
.marker.red { background: #dc2626; }
.marker.amber { background: #f59e0b; }

/* Water source bars */
.source-item { margin: 3px 0; }
.source-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    font-weight: 600;
    color: #2a4d38;
    margin-bottom: 3px;
}
.source-val { font-weight: 700; color: #0b3320; font-variant-numeric: tabular-nums; }
.source-bar {
    height: 10px;
    background: #d6e9dd;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}
.source-fill {
    height: 100%;
    border-radius: 20px;
    transition: width 0.4s;
}
.source-fill.river { background: linear-gradient(90deg, #1f7a9e, #3ba5d0); }
.source-fill.rain { background: linear-gradient(90deg, #3b9bd7, #6fc6ec); }
.source-fill.well { background: linear-gradient(90deg, #6f4e2e, #a67c52); }

/* Pump status */
.pump-status-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #0f2e21;
    color: #d4f5e0;
    padding: 10px 14px;
    border-radius: 40px;
    font-weight: 700;
    font-size: 0.8rem;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);
}

.pump-led {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4a4a4a;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.1);
    transition: all 0.3s;
}

.pump-led.on {
    background: #00e676;
    box-shadow: 0 0 12px #00e676, 0 0 0 2px rgba(0,230,118,0.3);
    animation: pumpPulse 1s infinite;
}

.pump-led.completed {
    background: #29b6f6;
    box-shadow: 0 0 12px #29b6f6;
}

@keyframes pumpPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

.pump-flow {
    margin-left: auto;
    font-size: 0.7rem;
    background: rgba(255,255,255,0.1);
    padding: 3px 10px;
    border-radius: 30px;
    font-variant-numeric: tabular-nums;
}

/* Alert */
.alert-box {
    margin-top: 6px;
    padding: 8px 12px;
    border-radius: 30px;
    font-size: 0.72rem;
    font-weight: 700;
    text-align: center;
    background: #d4f0dd;
    color: #1b5e3a;
    letter-spacing: 0.3px;
    transition: all 0.3s;
    animation: alertPulse 2.5s infinite;
}

@keyframes alertPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
}

/* ===== AI DECISION PANEL ===== */
.ai-decision-panel {
    background: linear-gradient(135deg, #0f2e21, #123d2b);
    border-radius: 22px;
    padding: 14px 20px;
    margin-bottom: 14px;
    box-shadow: 0 12px 24px -8px rgba(0, 40, 20, 0.5);
    border: 1px solid #2d8b5c;
    color: #d4f5e0;
    transition: all 0.4s;
}

.ai-decision-panel.hidden { display: none; }

.ai-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 1px;
    margin-bottom: 10px;
    color: #7ee8a2;
}

.ai-pulse {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00e676;
    box-shadow: 0 0 12px #00e676;
    animation: pumpPulse 1.2s infinite;
}

.ai-live-tag {
    margin-left: auto;
    font-size: 0.68rem;
    color: #ff4444;
    font-weight: 800;
    letter-spacing: 1px;
    animation: liveBlink 1.5s infinite;
}

@keyframes liveBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.ai-steps {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 10px;
}

.ai-step {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(120, 200, 150, 0.2);
    border-radius: 12px;
    padding: 10px 8px;
    font-size: 0.68rem;
    font-weight: 600;
    text-align: center;
    transition: all 0.4s;
    color: #9fc7b0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.step-num-badge {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    font-weight: 800;
    font-size: 0.7rem;
}

.ai-step.active {
    background: rgba(30, 160, 90, 0.4);
    border-color: #3dc47a;
    color: #e6ffed;
    box-shadow: 0 0 14px rgba(60, 200, 120, 0.4);
    transform: translateY(-2px);
}

.ai-step.active .step-num-badge {
    background: #3dc47a;
    color: #062a18;
}

.ai-message {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #b8f0cc;
    border-left: 3px solid #3dc47a;
    font-family: 'Consolas', monospace;
    min-height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.ai-message-label {
    background: #3dc47a;
    color: #062a18;
    padding: 2px 10px;
    border-radius: 20px;
    font-weight: 800;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    flex-shrink: 0;
}

/* ===== CONTROL BAR ===== */
.control-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(8px);
    border-radius: 60px;
    padding: 10px 22px;
    margin-bottom: 12px;
    border: 1px solid #b1dac1;
    box-shadow: 0 8px 20px -8px rgba(20, 60, 35, 0.25);
}

.control-bar.hidden { display: none; }

.control-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-group label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #1b5e3a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn {
    background: #ecf9f0;
    border: none;
    border-radius: 40px;
    padding: 7px 16px;
    font-weight: 700;
    color: #134b2e;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06), inset 0 0 0 1px #b8ddc4;
    cursor: pointer;
    transition: all 0.18s;
    font-size: 0.75rem;
    font-family: inherit;
}

.btn:hover {
    background: #daf1e2;
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(20, 70, 40, 0.15);
}

.btn:active { transform: translateY(0); }

.btn.primary {
    background: linear-gradient(135deg, #1b8a55, #147a48);
    color: white;
    box-shadow: 0 5px 12px rgba(20, 120, 70, 0.35);
}

.btn.danger {
    background: linear-gradient(135deg, #c44536, #a33026);
    color: white;
    box-shadow: 0 5px 12px rgba(160, 40, 30, 0.35);
}

select {
    background: white;
    border: 1px solid #b1dac1;
    border-radius: 40px;
    padding: 7px 14px;
    font-weight: 700;
    color: #183f2b;
    font-size: 0.75rem;
    outline: none;
    cursor: pointer;
    font-family: inherit;
}

/* ===== SIM CONTROLS ===== */
.sim-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 60px;
    border: 1px solid rgba(140, 200, 160, 0.4);
    align-items: center;
}

.sim-btn {
    background: white;
    border: 1px solid #b1dac1;
    border-radius: 40px;
    padding: 7px 18px;
    font-weight: 700;
    color: #134b2e;
    cursor: pointer;
    transition: all 0.18s;
    font-size: 0.75rem;
    font-family: inherit;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.sim-btn:hover {
    background: #eafaf0;
    transform: translateY(-1px);
    box-shadow: 0 5px 12px rgba(20, 70, 40, 0.12);
}

.sim-btn.active {
    background: linear-gradient(135deg, #1b8a55, #147a48);
    color: white;
    border-color: #3dc47a;
}

.sim-btn.reset { background: #fff3cd; border-color: #f0c040; color: #7a5c00; }
.sim-btn.rain { background: #d4e8ff; border-color: #7ab5e8; color: #14457a; margin-left: auto; }

/* ===== CHARTS ===== */
.charts-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 12px;
}

.chart-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    border-radius: 18px;
    padding: 10px 12px;
    box-shadow: 0 6px 16px -6px rgba(20, 60, 35, 0.25);
    border: 1px solid #b8ddc4;
}

.chart-title {
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #2a6144;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
    font-weight: 800;
}

.chart-card canvas {
    width: 100%;
    height: 90px;
    display: block;
}

/* ===== FOOTER NOTE ===== */
.footer-note {
    text-align: center;
    font-size: 0.65rem;
    color: #6b9e80;
    padding-top: 8px;
    font-style: italic;
    letter-spacing: 0.3px;
}

/* =========================================================
   IMPACT SECTION
   ========================================================= */
.impact-section {
    background: linear-gradient(180deg, #e6f4ea 0%, #f4fcf6 100%);
    padding: 70px 40px;
}

.impact-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.impact-card {
    background: white;
    border-radius: 22px;
    padding: 28px 24px;
    text-align: center;
    box-shadow: 0 20px 40px -20px rgba(20, 60, 35, 0.25);
    border: 1px solid rgba(120, 200, 150, 0.4);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
}

.impact-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1b8a55, #8ecae6);
}

.impact-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 50px -20px rgba(20, 100, 60, 0.35);
}

.impact-icon {
    font-size: 2.2rem;
    margin-bottom: 12px;
}

.impact-num {
    font-size: 2.2rem;
    font-weight: 900;
    color: #0a3320;
    letter-spacing: -1px;
    line-height: 1;
}

.impact-label {
    font-size: 0.8rem;
    font-weight: 800;
    color: #1b8a55;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 6px 0 10px;
}

.impact-desc {
    font-size: 0.82rem;
    color: #4a7c60;
    line-height: 1.5;
}

/* =========================================================
   TECH SECTION
   ========================================================= */
.tech-section {
    background: linear-gradient(180deg, #0f2e21 0%, #061511 100%);
    padding: 70px 40px;
}

.tech-section .section-heading { color: #ffffff; }
.tech-section .heading-num { box-shadow: 0 6px 20px rgba(20, 200, 100, 0.5); }

.tech-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
}

.tech-pill {
    background: rgba(60, 200, 120, 0.12);
    border: 1px solid rgba(80, 220, 140, 0.4);
    color: #b8ffd4;
    padding: 12px 26px;
    border-radius: 60px;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.3px;
    transition: all 0.25s;
    backdrop-filter: blur(8px);
}

.tech-pill:hover {
    background: rgba(60, 200, 120, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(60, 200, 120, 0.3);
}

/* =========================================================
   PAGE FOOTER
   ========================================================= */
.page-footer {
    background: #061511;
    color: #a0c8b0;
    text-align: center;
    padding: 40px 20px;
    border-top: 1px solid rgba(60, 140, 90, 0.2);
}

.footer-brand {
    font-size: 1.1rem;
    font-weight: 800;
    color: #7ee8a2;
    letter-spacing: 2px;
    margin-bottom: 6px;
}

.footer-sub {
    font-size: 0.78rem;
    color: #6b9e80;
    letter-spacing: 0.5px;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width: 1100px) {
    .hero-content { grid-template-columns: 1fr; gap: 40px; }
    .hero-visual { max-width: 340px; }
    .dashboard { grid-template-columns: 1fr 1fr; }
    .farm-scene { grid-column: 1 / 3; }
    .charts-row { grid-template-columns: repeat(2, 1fr); }
    .impact-grid { grid-template-columns: repeat(2, 1fr); }
    .steps-grid { grid-template-columns: 1fr; }
}

@media (max-width: 700px) {
    .hero { padding: 40px 20px; }
    .hero-problem { grid-template-columns: 1fr; }
    .how-it-works, .simulator-section, .impact-section, .tech-section { padding: 40px 16px; }
    .agronyxx-app { padding: 14px; border-radius: 24px; }
    .dashboard { grid-template-columns: 1fr; }
    .farm-scene { grid-column: 1; }
    .header { flex-direction: column; align-items: flex-start; }
    .sim-clock { width: 100%; justify-content: space-between; }
    .logo-area h1 { font-size: 1.6rem; }
    .charts-row { grid-template-columns: 1fr; }
    .ai-steps { grid-template-columns: 1fr 1fr; }
    .mode-btn .mode-desc { display: none; }
    .control-bar, .sim-controls { border-radius: 20px; }
    .canvas-wrap { min-height: 240px; }
    .impact-grid { grid-template-columns: 1fr; }
    .mode-selector { border-radius: 20px; }
    .sim-btn.rain { margin-left: 0; }
}
