/* =========================================================
   AGRONYXX – Smart Agricultural Water Resource Management
   Enhanced simulation engine with AI & Manual modes
   Redesigned for SIH Hackathon
   ========================================================= */

'use strict';

/* ============================================================
   1. SIMULATION STATE
   ============================================================ */
const simulation = {
    day: 64,
    hour: 8,
    minute: 42,
    speed: 1,
    running: false,
    lastFrame: performance.now(),
    tickAccumulator: 0,

    mode: 'ai',
    manualWaterSource: 'auto',

    temperature: 31,
    humidity: 64,
    rainfall: 0,
    rainProbability: 72,
    windSpeed: 8,
    solarRadiation: 650,
    weatherCondition: 'SUNNY',

    soilMoisture: 42,
    soilTemperature: 27,
    soilType: 'Loamy',
    fieldCapacity: 70,
    wiltingPoint: 20,

    cropType: 'paddy',
    cropAge: 64,
    growthStage: 'Mid-season',
    kc: 1.15,
    rootDepth: 0.6,
    minSoilMoisture: 55,
    targetSoilMoisture: 75,

    well: 6500,
    rainTank: 2400,
    river: 12000,
    damOpen: false,
    riverFlow: 380,

    irrigationRequired: 3850,
    targetIrrigation: 0,
    pumpStatus: 'OFF',
    pumpFlow: 0,
    delivered: 0,
    activeSource: null,
    irrigationEvents: 0,

    aiStep: 1,
    aiMessage: 'AI monitoring conditions...',

    moistureHistory: new Array(40).fill(42),
    rainHistory: new Array(40).fill(0),
    usageHistory: new Array(40).fill(0),
    tempHistory: new Array(40).fill(31),

    rainDrops: [],
};

/* ============================================================
   2. CROP PARAMETERS
   ============================================================ */
const CROP_DATA = {
    paddy: {
        name: 'Paddy (Rice)',
        duration: 120,
        kcStages: { initial: 1.05, development: 1.10, mid: 1.15, late: 0.95, harvest: 0.80 },
        rootDepthMax: 0.6,
        minMoisture: 55,
        targetMoisture: 75,
        emoji: '🌾',
    },
    wheat: {
        name: 'Wheat',
        duration: 140,
        kcStages: { initial: 0.40, development: 0.70, mid: 1.15, late: 0.45, harvest: 0.30 },
        rootDepthMax: 0.9,
        minMoisture: 45,
        targetMoisture: 65,
        emoji: '🌾',
    }
};

/* ============================================================
   3. DOM REFERENCES
   ============================================================ */
const DOM = {
    farmCanvas: document.getElementById('farmCanvas'),
    rainCanvas: document.getElementById('rainCanvas'),
    ctx: null,
    rainCtx: null,

    simDayLabel: document.getElementById('simDayLabel'),
    simTimeLabel: document.getElementById('simTimeLabel'),
    weatherEmoji: document.getElementById('weatherEmoji'),
    weatherConditionLabel: document.getElementById('weatherConditionLabel'),
    tempLabel: document.getElementById('tempLabel'),
    humidityLabel: document.getElementById('humidityLabel'),
    windLabel: document.getElementById('windLabel'),
    solarLabel: document.getElementById('solarLabel'),

    cropNameLabel: document.getElementById('cropNameLabel'),
    cropStageLabel: document.getElementById('cropStageLabel'),
    cropAgeLabel: document.getElementById('cropAgeLabel'),
    kcLabel: document.getElementById('kcLabel'),
    rootDepthLabel: document.getElementById('rootDepthLabel'),

    soilMoistureLabel: document.getElementById('soilMoistureLabel'),
    soilTempLabel: document.getElementById('soilTempLabel'),
    soilTypeLabel: document.getElementById('soilTypeLabel'),
    fieldCapLabel: document.getElementById('fieldCapLabel'),
    wiltingLabel: document.getElementById('wiltingLabel'),
    moistureFill: document.getElementById('moistureFill'),

    riverLabel: document.getElementById('riverLabel'),
    rainLabel: document.getElementById('rainLabel'),
    wellLabel: document.getElementById('wellLabel'),
    riverFill: document.getElementById('riverFill'),
    rainFill: document.getElementById('rainFill'),
    wellFill: document.getElementById('wellFill'),

    pumpLed: document.getElementById('pumpLed'),
    pumpStatusLabel: document.getElementById('pumpStatusLabel'),
    flowRateLabel: document.getElementById('flowRateLabel'),
    irrReqLabel: document.getElementById('irrReqLabel'),
    deliveredLabel: document.getElementById('deliveredLabel'),
    nextIrrLabel: document.getElementById('nextIrrLabel'),
    activeSourceLabel: document.getElementById('activeSourceLabel'),
    alertBox: document.getElementById('alertBox'),
    alertText: document.getElementById('alertText'),

    aiDecisionPanel: document.getElementById('aiDecisionPanel'),
    aiMessageText: document.getElementById('aiMessageText'),
    aiSteps: document.querySelectorAll('.ai-step'),

    manualControlBar: document.getElementById('manualControlBar'),
    cropSelect: document.getElementById('cropSelect'),
    waterSourceSelect: document.getElementById('waterSourceSelect'),

    aiModeBtn: document.getElementById('aiModeBtn'),
    manualModeBtn: document.getElementById('manualModeBtn'),
    modeIndicator: document.getElementById('modeIndicator'),

    chartMoisture: document.getElementById('chartMoisture'),
    chartRain: document.getElementById('chartRain'),
    chartUsage: document.getElementById('chartUsage'),
    chartTemp: document.getElementById('chartTemp'),
};

DOM.ctx = DOM.farmCanvas.getContext('2d');
DOM.rainCtx = DOM.rainCanvas.getContext('2d');

/* ============================================================
   4. UTILITIES
   ============================================================ */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (min, max) => min + Math.random() * (max - min);

function getGrowthStage(age, duration) {
    const r = age / duration;
    if (r < 0.20) return 'Initial';
    if (r < 0.50) return 'Development';
    if (r < 0.80) return 'Mid-season';
    if (r < 0.95) return 'Late-season';
    return 'Harvest';
}

function getKcForStage(stage, cropKey) {
    const map = {
        'Initial': 'initial',
        'Development': 'development',
        'Mid-season': 'mid',
        'Late-season': 'late',
        'Harvest': 'harvest'
    };
    return CROP_DATA[cropKey].kcStages[map[stage]] || 1.0;
}

function fmtLiters(n) {
    return Math.round(n).toLocaleString('en-US') + ' L';
}

/* ============================================================
   5. WEATHER ENGINE
   ============================================================ */
function generateWeather(forceRain = false) {
    const hour = simulation.hour;

    let baseTemp = 21 + 11 * Math.sin((hour - 6) / 24 * 2 * Math.PI);
    baseTemp += rand(-2.5, 2.5);
    simulation.temperature = clamp(baseTemp, 10, 44);

    simulation.humidity = clamp(
        92 - simulation.temperature * 1.25 + rand(-8, 8),
        22, 96
    );

    simulation.rainProbability = clamp(
        (simulation.humidity - 38) * 1.9 + rand(-10, 10),
        5, 96
    );

    simulation.windSpeed = clamp(rand(3, 16), 0, 26);

    const sunAngle = Math.max(0, Math.sin((hour - 6) / 12 * Math.PI));
    simulation.solarRadiation = clamp(
        180 + 720 * sunAngle + rand(-60, 60),
        0, 1050
    );

    const roll = Math.random() * 100;
    const rainChance = simulation.rainProbability;

    if (forceRain || roll < rainChance * 0.18) {
        simulation.weatherCondition = 'HEAVY RAIN';
        simulation.rainfall = rand(6, 16);
    } else if (roll < rainChance * 0.55) {
        simulation.weatherCondition = 'RAIN';
        simulation.rainfall = rand(1, 6);
    } else if (roll < rainChance * 0.80) {
        simulation.weatherCondition = 'CLOUDY';
        simulation.rainfall = 0;
    } else if (roll < rainChance * 1.15) {
        simulation.weatherCondition = 'PARTLY CLOUDY';
        simulation.rainfall = 0;
    } else {
        simulation.weatherCondition = 'SUNNY';
        simulation.rainfall = 0;
    }

    if (simulation.rainfall > 0.05) {
        const harvested = simulation.rainfall * 22;
        simulation.rainTank = clamp(simulation.rainTank + harvested, 0, 10000);

        simulation.soilMoisture = clamp(
            simulation.soilMoisture + simulation.rainfall * 2.1,
            8, 96
        );

        if (simulation.pumpStatus === 'RUNNING' && simulation.rainfall > 3) {
            cancelIrrigation('Rain detected — irrigation paused');
        }
    }
}

/* ============================================================
   6. SOIL MODEL
   ============================================================ */
function updateSoil(dtSeconds) {
    if (!simulation.running) return;

    const eto = calculateETo();
    const drynessFactor = 0.6 + (1 - simulation.soilMoisture / 100) * 0.8;
    const dryRate = (eto / 900) * drynessFactor;

    simulation.soilMoisture = clamp(simulation.soilMoisture - dryRate, 6, 96);

    const targetSoilTemp = simulation.temperature - 2.5;
    simulation.soilTemperature = lerp(
        simulation.soilTemperature,
        targetSoilTemp + rand(-1, 1),
        0.04
    );

    const crop = CROP_DATA[simulation.cropType];
    if (simulation.cropAge < crop.duration) {
        simulation.cropAge += dtSeconds * 0.0004 * simulation.speed;
    }
    simulation.cropAge = Math.min(simulation.cropAge, crop.duration);

    simulation.growthStage = getGrowthStage(simulation.cropAge, crop.duration);
    simulation.kc = getKcForStage(simulation.growthStage, simulation.cropType);
    simulation.rootDepth = (simulation.cropAge / crop.duration) * crop.rootDepthMax + 0.10;
    simulation.minSoilMoisture = crop.minMoisture;
    simulation.targetSoilMoisture = crop.targetMoisture;
}

/* ============================================================
   7. FAO-STYLE WATER CALCULATIONS
   ============================================================ */
function calculateETo() {
    const t = simulation.temperature;
    const rh = simulation.humidity;
    const w = simulation.windSpeed;
    const rs = Math.max(simulation.solarRadiation, 10);

    const eto = 0.0023 * (t + 17.8) * Math.sqrt(rs) * (1 + 0.01 * w) * (1 - 0.008 * rh);
    return clamp(eto, 0.4, 14);
}

function calculateCropWaterRequirement() {
    const eto = calculateETo();
    const etc = eto * simulation.kc;
    const litersPerDay = etc * 1200;
    return Math.round(litersPerDay);
}

function calculateIrrigationRequirement() {
    const cropDemand = calculateCropWaterRequirement();
    const effectiveRain = simulation.rainfall * 18;
    const soilWaterAvailable = Math.max(0,
        (simulation.soilMoisture - simulation.wiltingPoint) / 100 * 2200
    );

    let req = cropDemand - effectiveRain - soilWaterAvailable * 0.15;

    if (simulation.soilMoisture < simulation.minSoilMoisture) {
        req = Math.max(req, 2200);
    }

    if (simulation.rainProbability > 80 && simulation.rainfall === 0) {
        req *= 0.55;
    }

    return Math.round(clamp(req, 0, 12000));
}

function calculateIrrigationFrequency() {
    const req = calculateIrrigationRequirement();
    if (req <= 0) return 24;

    const deficit = Math.max(0, simulation.minSoilMoisture - simulation.soilMoisture);
    const depletionRate = 0.8 + (simulation.temperature / 40) + (simulation.windSpeed / 50);
    const hours = deficit / depletionRate * 8 + 1;

    return clamp(Math.round(hours * 10) / 10, 0.5, 48);
}

/* ============================================================
   8. AI DECISION ENGINE
   ============================================================ */
function runAIDecisionEngine() {
    simulation.aiStep = 1;
    const eto = calculateETo();
    const cropDemand = calculateCropWaterRequirement();
    const irrigationReq = calculateIrrigationRequirement();
    simulation.irrigationRequired = irrigationReq;

    simulation.aiStep = 2;

    simulation.aiStep = 3;
    const soilDeficit = simulation.soilMoisture < simulation.minSoilMoisture;
    const rainIncoming = simulation.rainfall > 0.5 ||
                          (simulation.rainProbability > 78 && simulation.rainfall === 0);

    simulation.aiStep = 4;

    if (!soilDeficit) {
        simulation.aiMessage = `✅ Soil moisture ${Math.round(simulation.soilMoisture)}% is above threshold ${simulation.minSoilMoisture}%. No irrigation needed.`;
        if (simulation.pumpStatus === 'RUNNING') {
            cancelIrrigation('AI: soil moisture recovered');
        }
        simulation.aiStep = 5;
        return;
    }

    if (rainIncoming && simulation.rainfall === 0) {
        simulation.aiMessage = `⏸ Rain probability ${Math.round(simulation.rainProbability)}%. Irrigation DELAYED — rain expected soon.`;
        simulation.aiStep = 5;
        return;
    }

    if (simulation.pumpStatus === 'RUNNING') {
        simulation.aiMessage = `💧 Irrigating with ${simulation.activeSource.toUpperCase()} — ${Math.round(simulation.delivered)} / ${simulation.targetIrrigation} L delivered.`;
        simulation.aiStep = 5;
        return;
    }

    const selected = selectBestWaterSource(irrigationReq);

    if (selected.source === 'NONE') {
        simulation.aiMessage = `⚠ WATER SHORTAGE — required ${fmtLiters(irrigationReq)}, available only ${fmtLiters(selected.available)}. Irrigation postponed.`;
        simulation.aiStep = 5;
        showAlert('red', '🔴 WATER SHORTAGE');
        return;
    }

    simulation.aiStep = 5;
    simulation.activeSource = selected.source;
    simulation.targetIrrigation = Math.min(irrigationReq, selected.available);
    simulation.targetIrrigation = Math.max(600, simulation.targetIrrigation);
    startPump(selected.source);
    simulation.aiMessage = `✅ Selected ${selected.source.toUpperCase()} (${fmtLiters(selected.available)} available). Pump ON — target ${fmtLiters(simulation.targetIrrigation)}.`;
    showAlert('blue', `🔵 IRRIGATION STARTED — ${selected.source.toUpperCase()}`);
}

function selectBestWaterSource(required) {
    const candidates = [];

    if (simulation.rainTank > 400) {
        candidates.push({ source: 'rain', available: simulation.rainTank, priority: 1 });
    }

    const riverAvail = simulation.damOpen ? simulation.river * 1.0 : simulation.river * 0.7;
    if (riverAvail > 400) {
        candidates.push({ source: 'river', available: riverAvail, priority: 2 });
    }

    if (simulation.well > 400) {
        candidates.push({ source: 'well', available: simulation.well, priority: 3 });
    }

    if (candidates.length === 0) {
        return { source: 'NONE', available: 0 };
    }

    candidates.sort((a, b) => a.priority - b.priority || b.available - a.available);

    if (candidates[0].available >= required * 0.9) {
        return candidates[0];
    }

    candidates.sort((a, b) => b.available - a.available);
    return candidates[0];
}

/* ============================================================
   9. PUMP OPERATIONS
   ============================================================ */
function startPump(source) {
    simulation.pumpStatus = 'RUNNING';
    simulation.pumpFlow = 900 + Math.random() * 250;
    simulation.delivered = 0;
    simulation.activeSource = source;
    updatePumpLED();
}

function cancelIrrigation(reason) {
    if (simulation.pumpStatus === 'RUNNING') {
        simulation.pumpStatus = 'OFF';
        simulation.pumpFlow = 0;
        simulation.delivered = 0;
        updatePumpLED();
        simulation.aiMessage = reason;
    }
}

function completeIrrigation() {
    simulation.pumpStatus = 'COMPLETED';
    simulation.pumpFlow = 0;
    simulation.irrigationEvents++;
    updatePumpLED();

    showAlert('green', '🟢 IRRIGATION COMPLETED');

    setTimeout(() => {
        if (simulation.pumpStatus === 'COMPLETED') {
            simulation.pumpStatus = 'OFF';
            simulation.delivered = 0;
            updatePumpLED();
        }
    }, 2500);
}

function operatePump(dtSeconds) {
    if (simulation.pumpStatus !== 'RUNNING') {
        simulation.pumpFlow = 0;
        return;
    }

    simulation.pumpFlow = 900 + Math.sin(Date.now() / 500) * 120;

    const deliveredThisFrame = (simulation.pumpFlow / 60) * dtSeconds * simulation.speed;
    simulation.delivered = Math.min(
        simulation.delivered + deliveredThisFrame,
        simulation.targetIrrigation
    );

    simulation.soilMoisture = clamp(
        simulation.soilMoisture + deliveredThisFrame * 0.0018,
        8, 96
    );

    const src = simulation.activeSource;
    if (src === 'well')   simulation.well    = Math.max(0, simulation.well    - deliveredThisFrame);
    if (src === 'rain')   simulation.rainTank = Math.max(0, simulation.rainTank - deliveredThisFrame);
    if (src === 'river')  simulation.river   = Math.max(0, simulation.river   - deliveredThisFrame);

    if (simulation.usageHistory.length > 0) {
        simulation.usageHistory[simulation.usageHistory.length - 1] += deliveredThisFrame;
    }

    if (simulation.delivered >= simulation.targetIrrigation - 20) {
        completeIrrigation();
    }

    if (simulation.well <= 0 && src === 'well') {
        simulation.pumpStatus = 'FAULT';
        simulation.pumpFlow = 0;
        showAlert('red', '🔴 WELL DRY — PUMP FAULT');
        updatePumpLED();
    }
}

function updatePumpLED() {
    DOM.pumpLed.className = 'pump-led';
    if (simulation.pumpStatus === 'RUNNING') {
        DOM.pumpLed.classList.add('on');
        DOM.pumpStatusLabel.textContent = 'PUMP RUNNING';
    } else if (simulation.pumpStatus === 'COMPLETED') {
        DOM.pumpLed.classList.add('completed');
        DOM.pumpStatusLabel.textContent = 'IRRIGATION COMPLETE';
    } else if (simulation.pumpStatus === 'FAULT') {
        DOM.pumpLed.style.background = '#ef4444';
        DOM.pumpLed.style.boxShadow = '0 0 12px #ef4444';
        DOM.pumpStatusLabel.textContent = 'PUMP FAULT';
    } else {
        DOM.pumpLed.style.background = '#4a4a4a';
        DOM.pumpLed.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.1)';
        DOM.pumpStatusLabel.textContent = 'PUMP OFF';
    }
}

/* ============================================================
   10. ALERT SYSTEM
   ============================================================ */
function showAlert(type, text) {
    DOM.alertText.textContent = text;
    const colors = {
        green: { bg: '#d4f0dd', fg: '#1b5e3a' },
        yellow: { bg: '#fef3c7', fg: '#92400e' },
        blue: { bg: '#dbeafe', fg: '#1e40af' },
        orange: { bg: '#ffedd5', fg: '#9a3412' },
        red: { bg: '#fee2e2', fg: '#991b1b' },
    };
    const c = colors[type] || colors.green;
    DOM.alertBox.style.background = c.bg;
    DOM.alertText.style.color = c.fg;
}

/* ============================================================
   11. WATER SOURCE UPDATES
   ============================================================ */
function updateWaterSources(dtSeconds) {
    if (!simulation.running) return;

    simulation.riverFlow = simulation.damOpen ? 1200 : 380;
    const riverRecharge = (simulation.riverFlow / 60) * dtSeconds * simulation.speed;
    simulation.river = clamp(simulation.river + riverRecharge, 0, 30000);
    simulation.well = clamp(simulation.well + 1.2 * dtSeconds * simulation.speed, 0, 12000);
    simulation.rainTank = clamp(simulation.rainTank + 0.3 * dtSeconds * simulation.speed, 0, 10000);
}

/* ============================================================
   12. GRAPHICS – FARM SCENE
   ============================================================ */
function drawFarmScene() {
    const ctx = DOM.ctx;
    const W = DOM.farmCanvas.width;
    const H = DOM.farmCanvas.height;
    const time = performance.now() / 1000;

    ctx.clearRect(0, 0, W, H);

    const horizon = H * 0.42;

    // SKY
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
    const isRain = simulation.weatherCondition.includes('RAIN');
    const isCloudy = simulation.weatherCondition.includes('CLOUD');
    const isPartly = simulation.weatherCondition === 'PARTLY CLOUDY';

    if (isRain) {
        skyGrad.addColorStop(0, '#5a6b7a');
        skyGrad.addColorStop(0.6, '#7d8d9c');
        skyGrad.addColorStop(1, '#9aa8b5');
    } else if (isCloudy) {
        skyGrad.addColorStop(0, '#9fb5c4');
        skyGrad.addColorStop(1, '#c9d8e0');
    } else if (isPartly) {
        skyGrad.addColorStop(0, '#6ec0e0');
        skyGrad.addColorStop(1, '#c8e8f5');
    } else {
        skyGrad.addColorStop(0, '#4aa8d8');
        skyGrad.addColorStop(0.5, '#7ec8e3');
        skyGrad.addColorStop(1, '#c8ecf8');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, horizon);

    // SUN
    if (simulation.weatherCondition === 'SUNNY' || isPartly) {
        const sunX = 130;
        const sunY = 70;
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 90);
        sunGlow.addColorStop(0, 'rgba(255, 245, 180, 1)');
        sunGlow.addColorStop(0.3, 'rgba(255, 230, 130, 0.6)');
        sunGlow.addColorStop(1, 'rgba(255, 220, 100, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF6B8';
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 240, 150, 0.5)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2 + time * 0.1;
            ctx.beginPath();
            ctx.moveTo(sunX + Math.cos(a) * 40, sunY + Math.sin(a) * 40);
            ctx.lineTo(sunX + Math.cos(a) * 55, sunY + Math.sin(a) * 55);
            ctx.stroke();
        }
    }

    // CLOUDS
    if (isCloudy || isRain || isPartly) {
        const cloudAlpha = isRain ? 0.9 : isCloudy ? 0.85 : 0.6;
        const cloudColor = isRain ? '#5a6b7a' : '#f0f4f8';
        ctx.fillStyle = cloudColor;
        ctx.globalAlpha = cloudAlpha;

        const cx1 = 280 + Math.sin(time * 0.15) * 20;
        ctx.beginPath();
        ctx.arc(cx1, 55, 26, 0, Math.PI * 2);
        ctx.arc(cx1 + 30, 45, 32, 0, Math.PI * 2);
        ctx.arc(cx1 + 65, 55, 24, 0, Math.PI * 2);
        ctx.arc(cx1 + 32, 62, 28, 0, Math.PI * 2);
        ctx.fill();

        const cx2 = 520 + Math.sin(time * 0.12 + 2) * 25;
        ctx.beginPath();
        ctx.arc(cx2, 80, 22, 0, Math.PI * 2);
        ctx.arc(cx2 + 28, 72, 30, 0, Math.PI * 2);
        ctx.arc(cx2 + 55, 82, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
    }

    // HILLS
    ctx.fillStyle = '#5a8c6a';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let x = 0; x <= W; x += 20) {
        const h = horizon - 30 - Math.sin(x * 0.008) * 22 - Math.sin(x * 0.02) * 10;
        ctx.lineTo(x, h);
    }
    ctx.lineTo(W, horizon);
    ctx.fill();

    ctx.fillStyle = '#4a7a5a';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (let x = 0; x <= W; x += 20) {
        const h = horizon - 16 - Math.sin(x * 0.01 + 1) * 16 - Math.sin(x * 0.025) * 8;
        ctx.lineTo(x, h);
    }
    ctx.lineTo(W, horizon);
    ctx.fill();

    // GROUND
    const groundGrad = ctx.createLinearGradient(0, horizon, 0, H);
    groundGrad.addColorStop(0, '#8b6b4b');
    groundGrad.addColorStop(0.4, '#7a5b3b');
    groundGrad.addColorStop(1, '#4a3825');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizon, W, H - horizon);

    ctx.fillStyle = 'rgba(139, 107, 75, 0.6)';
    ctx.fillRect(0, horizon + 30, W, 3);
    ctx.fillRect(0, horizon + 70, W, 2);
    ctx.fillRect(0, horizon + 120, W, 3);

    const moistureAlpha = 0.08 + (simulation.soilMoisture / 100) * 0.30;
    ctx.fillStyle = `rgba(40, 100, 180, ${moistureAlpha})`;
    ctx.fillRect(0, horizon, W, H - horizon);

    const wetDepth = horizon + 30 + (1 - simulation.soilMoisture / 100) * 100;
    ctx.strokeStyle = `rgba(80, 150, 220, ${0.3 + simulation.soilMoisture / 300})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, wetDepth);
    for (let x = 0; x <= W; x += 30) {
        ctx.lineTo(x, wetDepth + Math.sin(x * 0.02 + time) * 3);
    }
    ctx.stroke();

    drawCropField(ctx, W, horizon, time);
    drawWell(ctx, 90, horizon + 60, time);
    drawRainTank(ctx, 30, horizon - 90, time);
    drawRiver(ctx, W - 130, horizon, W, H, time);
    drawDam(ctx, W - 55, horizon - 40, time);
    drawPumpAndPipes(ctx, W, horizon, time);

    if (simulation.pumpStatus === 'RUNNING') {
        drawSprinklerWater(ctx, W, horizon, time);
    }

    updateRainParticles();
}

function drawCropField(ctx, W, horizon, time) {
    const crop = CROP_DATA[simulation.cropType];
    const growth = simulation.cropAge / crop.duration;
    const isPaddy = simulation.cropType === 'paddy';

    let leafColor, stalkColor;
    if (isPaddy) {
        leafColor = growth < 0.3 ? '#6a9c5a' : growth < 0.7 ? '#4aac4a' : '#3a9a3a';
        stalkColor = '#2a6b2a';
    } else {
        leafColor = growth < 0.3 ? '#9aaa6a' : growth < 0.7 ? '#c8b85a' : '#e8c86a';
        stalkColor = '#8a7a3a';
    }

    if (isPaddy && simulation.soilMoisture > 60) {
        ctx.fillStyle = `rgba(60, 130, 200, ${0.12 + (simulation.soilMoisture - 60) / 300})`;
        ctx.fillRect(0, horizon + 5, W, 50);
    }

    const fieldStartX = 180;
    const fieldEndX = W - 160;
    const fieldWidth = fieldEndX - fieldStartX;
    const rows = 5;
    const cols = 16;
    const rowSpacing = 26;
    const colSpacing = fieldWidth / cols;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = fieldStartX + c * colSpacing + colSpacing / 2;
            const y = horizon + 10 + r * rowSpacing;

            if ((r * 7 + c * 13) % 5 === 0) continue;

            const windSway = Math.sin(time * 1.5 + c * 0.5 + r * 0.3) * (1 + simulation.windSpeed / 12) * 4;
            const height = 20 + growth * 40 + (r % 3) * 3;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(x + windSway * 0.5, y - height * 0.6, x + windSway, y - height);
            ctx.strokeStyle = stalkColor;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.fillStyle = leafColor;
            const leafSize = 5 + growth * 6;

            ctx.beginPath();
            ctx.ellipse(x + windSway - leafSize, y - height * 0.65, leafSize, leafSize * 0.45, -0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(x + windSway + leafSize, y - height * 0.55, leafSize, leafSize * 0.45, 0.4, 0, Math.PI * 2);
            ctx.fill();

            if (growth > 0.7 && !isPaddy) {
                ctx.fillStyle = '#e8c86a';
                ctx.beginPath();
                ctx.ellipse(x + windSway, y - height - 2, 3.5, 7, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            if (growth > 0.6 && isPaddy) {
                ctx.fillStyle = '#f0e0a0';
                for (let g = 0; g < 3; g++) {
                    ctx.beginPath();
                    ctx.ellipse(x + windSway + (g - 1) * 3, y - height - 2, 2, 4, 0.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    ctx.fillStyle = 'rgba(0, 40, 20, 0.55)';
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${crop.emoji} ${simulation.growthStage.toUpperCase()}`, W / 2, horizon - 12);
    ctx.textAlign = 'left';
}

function drawWell(ctx, x, y, time) {
    ctx.fillStyle = '#5a3e2b';
    ctx.beginPath();
    ctx.ellipse(x, y + 15, 28, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7a5a3b';
    ctx.fillRect(x - 28, y - 5, 56, 22);

    ctx.fillStyle = '#8a6a4b';
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    const wellRatio = simulation.well / 12000;
    ctx.fillStyle = `rgba(60, 140, 220, ${0.5 + wellRatio * 0.5})`;
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    if (simulation.well > 500) {
        ctx.strokeStyle = 'rgba(150, 210, 255, 0.6)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) {
            const shimmerX = x - 12 + ((time * 30 + i * 30) % 24);
            ctx.beginPath();
            ctx.moveTo(shimmerX, y - 5);
            ctx.lineTo(shimmerX + 6, y - 5);
            ctx.stroke();
        }
    }

    ctx.fillStyle = '#0a3320';
    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WELL', x, y + 35);
    ctx.fillText(Math.round(simulation.well) + ' L', x, y + 48);
    ctx.textAlign = 'left';
}

function drawRainTank(ctx, x, y, time) {
    const w = 55;
    const h = 65;

    ctx.fillStyle = 'rgba(200, 215, 230, 0.85)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#7a9ab0';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    const ratio = simulation.rainTank / 10000;
    const waterH = h * ratio;
    const waterGrad = ctx.createLinearGradient(x, y + h - waterH, x, y + h);
    waterGrad.addColorStop(0, '#4aa5e0');
    waterGrad.addColorStop(1, '#2a7ab0');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(x + 2, y + h - waterH, w - 4, waterH);

    if (ratio > 0.05) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        const rippleY = y + h - waterH;
        ctx.beginPath();
        ctx.moveTo(x + 5, rippleY);
        for (let i = 0; i <= w - 10; i += 5) {
            ctx.lineTo(x + 5 + i, rippleY + Math.sin(i * 0.5 + time * 3) * 2);
        }
        ctx.stroke();
    }

    ctx.fillStyle = '#5a7a90';
    ctx.fillRect(x - 3, y - 5, w + 6, 8);

    ctx.fillStyle = '#8aa5b8';
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 5);
    ctx.lineTo(x + w + 8, y - 5);
    ctx.lineTo(x + w, y - 20);
    ctx.lineTo(x, y - 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0a3320';
    ctx.font = 'bold 9px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RAIN TANK', x + w / 2, y + h + 12);
    ctx.fillText(Math.round(simulation.rainTank) + ' L', x + w / 2, y + h + 23);
    ctx.textAlign = 'left';
}

function drawRiver(ctx, x1, y1, x2, y2, time) {
    const riverWidth = 70;

    ctx.fillStyle = '#6a8a5a';
    ctx.beginPath();
    ctx.moveTo(x1 - 20, y1 + 20);
    ctx.quadraticCurveTo(x1 + 30, y1 + 70, x1 + 40, y2);
    ctx.lineTo(x1 + riverWidth + 30, y2);
    ctx.quadraticCurveTo(x1 + 60, y1 + 50, x1 + 40, y1 + 10);
    ctx.fill();

    const riverGrad = ctx.createLinearGradient(x1, y1, x1 + riverWidth, y2);
    riverGrad.addColorStop(0, '#2a7ab0');
    riverGrad.addColorStop(1, '#1a5a90');
    ctx.fillStyle = riverGrad;
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 25);
    ctx.quadraticCurveTo(x1 + 35, y1 + 80, x1 + 30, y2);
    ctx.lineTo(x1 + riverWidth, y2);
    ctx.quadraticCurveTo(x1 + 70, y1 + 70, x1 + 45, y1 + 15);
    ctx.fill();

    ctx.strokeStyle = 'rgba(150, 220, 255, 0.7)';
    ctx.lineWidth = 2;
    const flowSpeed = simulation.damOpen ? 4 : 1.5;
    for (let i = 0; i < 5; i++) {
        const offset = ((time * flowSpeed * 30 + i * 25) % 80);
        ctx.beginPath();
        const fy = y1 + 35 + i * 12;
        ctx.moveTo(x1 + 5 + offset * 0.3, fy);
        ctx.quadraticCurveTo(x1 + 25 + offset * 0.3, fy + 10, x1 + 45 + offset * 0.3, fy + 5);
        ctx.stroke();
    }

    if (simulation.damOpen) {
        ctx.fillStyle = 'rgba(200, 240, 255, 0.7)';
        for (let i = 0; i < 8; i++) {
            const sx = x2 - 60 + Math.random() * 20;
            const sy = y1 + 30 + Math.random() * 30;
            ctx.beginPath();
            ctx.arc(sx, sy, 2 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = '#e0f4ff';
    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RIVER', x1 + riverWidth / 2 + 10, y1 + 15);
    ctx.fillText(Math.round(simulation.river) + ' L', x1 + riverWidth / 2 + 10, y1 + 28);
    ctx.textAlign = 'left';
}

function drawDam(ctx, x, y, time) {
    const w = 40;
    const h = 70;

    ctx.fillStyle = '#8a8a8a';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w - 5, y);
    ctx.lineTo(x + 5, y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#5a5a5a';
    ctx.lineWidth = 2;
    ctx.stroke();

    const gateColor = simulation.damOpen ? '#00b4d8' : '#4a6a7a';
    ctx.fillStyle = gateColor;
    ctx.fillRect(x + 10, y + 25, 20, 35);

    if (simulation.damOpen) {
        ctx.fillStyle = 'rgba(150, 230, 255, 0.85)';
        for (let i = 0; i < 10; i++) {
            const wx = x + 15 + Math.random() * 10;
            const wy = y + 60 + (time * 60 + i * 15) % 40;
            ctx.beginPath();
            ctx.arc(wx, wy, 2 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(0, 200, 255, 0.5)';
        ctx.fillRect(x + 10, y + 25, 20, 35);
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = '#0a3320';
    ctx.font = 'bold 9px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DAM', x + w / 2, y - 8);
    ctx.fillText(simulation.damOpen ? 'OPEN' : 'CLOSED', x + w / 2, y - 0);
    ctx.textAlign = 'left';
}

function drawPumpAndPipes(ctx, W, horizon, time) {
    const pumpX = W * 0.55;
    const pumpY = horizon + 15;

    drawPipe(ctx, 120, horizon + 40, pumpX - 15, pumpY, time, 'well');
    drawPipe(ctx, 60, horizon - 70, pumpX - 15, pumpY, time, 'rain');
    drawPipe(ctx, W - 130, horizon + 40, pumpX + 15, pumpY, time, 'river');
    drawPipe(ctx, pumpX, pumpY - 12, W / 2, horizon - 5, time, 'irrigation');

    ctx.fillStyle = '#3a4050';
    ctx.beginPath();
    ctx.ellipse(pumpX, pumpY, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    const pumpGrad = ctx.createRadialGradient(pumpX - 5, pumpY - 5, 2, pumpX, pumpY, 24);
    pumpGrad.addColorStop(0, '#6a7080');
    pumpGrad.addColorStop(1, '#2a3040');
    ctx.fillStyle = pumpGrad;
    ctx.beginPath();
    ctx.ellipse(pumpX, pumpY, 22, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    if (simulation.pumpStatus === 'RUNNING') {
        ctx.save();
        ctx.translate(pumpX, pumpY);
        ctx.rotate(time * 8);
        ctx.strokeStyle = '#00e676';
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(i * Math.PI / 2) * 10, Math.sin(i * Math.PI / 2) * 10);
            ctx.stroke();
        }
        ctx.restore();

        ctx.shadowColor = '#00e676';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = '#00e676';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pumpX, pumpY, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = '#4a4a5a';
        ctx.beginPath();
        ctx.arc(pumpX, pumpY, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#0a3320';
    ctx.font = 'bold 9px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PUMP', pumpX, pumpY + 32);
    ctx.textAlign = 'left';
}

function drawPipe(ctx, x1, y1, x2, y2, time, source) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 2);
    ctx.lineTo(x2, y2 + 2);
    ctx.stroke();

    ctx.strokeStyle = '#8a9ab0';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = '#b0c0d0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 2);
    ctx.lineTo(x2, y2 - 2);
    ctx.stroke();

    const isActive =
        (simulation.pumpStatus === 'RUNNING' &&
         (simulation.activeSource === source || source === 'irrigation'));

    if (isActive) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;

        const flowOffset = (time * 120) % 25;
        for (let d = flowOffset; d < len; d += 25) {
            const px = x1 + ux * d;
            const py = y1 + uy * d;

            const waterGrad = ctx.createRadialGradient(px, py, 0, px, py, 5);
            waterGrad.addColorStop(0, '#a0e0ff');
            waterGrad.addColorStop(1, 'rgba(60, 180, 240, 0)');

            ctx.fillStyle = waterGrad;
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowColor = '#00b4ff';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = 'rgba(0, 180, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

function drawSprinklerWater(ctx, W, horizon, time) {
    const fieldStartX = 180;
    const fieldEndX = W - 160;
    const positions = 6;

    for (let i = 0; i < positions; i++) {
        const sx = fieldStartX + (i / (positions - 1)) * (fieldEndX - fieldStartX);
        const sy = horizon - 8;

        for (let d = 0; d < 10; d++) {
            const angle = -Math.PI / 2 + (d - 5) * 0.12 + Math.sin(time * 3 + i) * 0.05;
            const dist = 8 + ((time * 60 + d * 12 + i * 20) % 35);
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;

            ctx.fillStyle = `rgba(100, 200, 255, ${0.5 + Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.arc(sx + dx, sy + dy, 1.5 + Math.random(), 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/* ============================================================
   13. RAIN PARTICLES
   ============================================================ */
function updateRainParticles() {
    const rCtx = DOM.rainCtx;
    const W = DOM.rainCanvas.width;
    const H = DOM.rainCanvas.height;

    rCtx.clearRect(0, 0, W, H);

    if (simulation.rainfall < 0.05) {
        simulation.rainDrops = [];
        return;
    }

    const particleCount = Math.min(180, Math.floor(simulation.rainfall * 25));

    while (simulation.rainDrops.length < particleCount) {
        simulation.rainDrops.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            speed: 8 + Math.random() * 10 + simulation.rainfall * 2,
            length: 10 + Math.random() * 15,
            opacity: 0.4 + Math.random() * 0.5,
        });
    }

    if (simulation.rainDrops.length > particleCount) {
        simulation.rainDrops.length = particleCount;
    }

    const groundLevel = H * 0.42;

    for (let i = simulation.rainDrops.length - 1; i >= 0; i--) {
        const drop = simulation.rainDrops[i];
        drop.y += drop.speed;

        if (drop.y > groundLevel) {
            rCtx.strokeStyle = `rgba(150, 210, 240, ${drop.opacity * 0.5})`;
            rCtx.lineWidth = 1;
            rCtx.beginPath();
            rCtx.arc(drop.x, groundLevel, 3, 0, Math.PI);
            rCtx.stroke();

            drop.y = -20;
            drop.x = Math.random() * W;
        }

        rCtx.strokeStyle = `rgba(170, 215, 245, ${drop.opacity})`;
        rCtx.lineWidth = 1.5;
        rCtx.beginPath();
        rCtx.moveTo(drop.x, drop.y);
        rCtx.lineTo(drop.x - 1.5, drop.y + drop.length);
        rCtx.stroke();
    }
}

/* ============================================================
   14. UI UPDATE
   ============================================================ */
function updateUI() {
    const hour12 = simulation.hour % 12 || 12;
    const ampm = simulation.hour >= 12 ? 'PM' : 'AM';
    const minStr = String(Math.floor(simulation.minute)).padStart(2, '0');
    DOM.simDayLabel.textContent = 'DAY ' + simulation.day;
    DOM.simTimeLabel.textContent = `${hour12}:${minStr} ${ampm}`;

    DOM.tempLabel.textContent = Math.round(simulation.temperature) + '°C';
    DOM.humidityLabel.textContent = Math.round(simulation.humidity) + '%';
    DOM.windLabel.textContent = Math.round(simulation.windSpeed) + ' km/h';
    DOM.solarLabel.textContent = Math.round(simulation.solarRadiation) + ' W/m²';
    DOM.weatherConditionLabel.textContent = simulation.weatherCondition;

    const emojiMap = {
        'SUNNY': '☀️',
        'PARTLY CLOUDY': '⛅',
        'CLOUDY': '☁️',
        'RAIN': '🌧️',
        'HEAVY RAIN': '⛈️',
    };
    DOM.weatherEmoji.textContent = emojiMap[simulation.weatherCondition] || '☀️';

    const crop = CROP_DATA[simulation.cropType];
    DOM.cropNameLabel.textContent = crop.name;
    DOM.cropStageLabel.textContent = simulation.growthStage;
    DOM.cropAgeLabel.textContent = Math.floor(simulation.cropAge) + ' / ' + crop.duration + ' d';
    DOM.kcLabel.textContent = simulation.kc.toFixed(2);
    DOM.rootDepthLabel.textContent = simulation.rootDepth.toFixed(2) + ' m';

    DOM.soilMoistureLabel.textContent = Math.round(simulation.soilMoisture) + '%';
    DOM.soilTempLabel.textContent = Math.round(simulation.soilTemperature) + '°C';
    DOM.soilTypeLabel.textContent = simulation.soilType;
    DOM.fieldCapLabel.textContent = simulation.fieldCapacity + '%';
    DOM.wiltingLabel.textContent = simulation.wiltingPoint + '%';
    DOM.moistureFill.style.width = simulation.soilMoisture + '%';

    DOM.riverLabel.textContent = fmtLiters(simulation.river);
    DOM.rainLabel.textContent = fmtLiters(simulation.rainTank);
    DOM.wellLabel.textContent = fmtLiters(simulation.well);

    DOM.riverFill.style.width = (simulation.river / 30000 * 100) + '%';
    DOM.rainFill.style.width = (simulation.rainTank / 10000 * 100) + '%';
    DOM.wellFill.style.width = (simulation.well / 12000 * 100) + '%';

    DOM.flowRateLabel.textContent = Math.round(simulation.pumpFlow) + ' L/min';
    DOM.irrReqLabel.textContent = fmtLiters(simulation.irrigationRequired);
    DOM.deliveredLabel.textContent = fmtLiters(simulation.delivered);
    DOM.nextIrrLabel.textContent = calculateIrrigationFrequency().toFixed(1) + ' h';

    const sourceNames = { well: 'WELL', rain: 'RAIN', river: 'RIVER', NONE: '—', DELAY: 'DELAYED' };
    DOM.activeSourceLabel.textContent = sourceNames[simulation.activeSource] || '—';

    updateAlertBadge();

    if (simulation.mode === 'ai') {
        DOM.aiMessageText.textContent = simulation.aiMessage;
        DOM.aiSteps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum <= simulation.aiStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updatePumpLED();
}

function updateAlertBadge() {
    if (simulation.pumpStatus === 'RUNNING') {
        showAlert('blue', '🔵 IRRIGATION IN PROGRESS');
        return;
    }
    if (simulation.soilMoisture < simulation.minSoilMoisture - 8) {
        showAlert('orange', '🟠 LOW SOIL MOISTURE — IRRIGATION NEEDED');
        return;
    }
    if (simulation.soilMoisture < simulation.minSoilMoisture) {
        showAlert('yellow', '🟡 IRRIGATION REQUIRED SOON');
        return;
    }
    if (simulation.well < 1500 && simulation.rainTank < 800) {
        showAlert('orange', '🟠 LOW WATER RESERVES');
        return;
    }
    if (simulation.rainTank > 5000) {
        showAlert('blue', '🔵 RAINWATER AVAILABLE');
        return;
    }
    if (simulation.damOpen) {
        showAlert('blue', '🔵 RIVER WATER AVAILABLE');
        return;
    }
    showAlert('green', '🟢 SOIL MOISTURE OPTIMAL');
}

/* ============================================================
   15. CHARTS
   ============================================================ */
function drawCharts() {
    drawLineChart(DOM.chartMoisture, simulation.moistureHistory, '#2b8e5a', 0, 100, '%');
    drawBarChart(DOM.chartRain, simulation.rainHistory, '#3b9bd7', 0, 16);
    drawBarChart(DOM.chartUsage, simulation.usageHistory, '#1f7a9e', 0, 4000);
    drawLineChart(DOM.chartTemp, simulation.tempHistory, '#e07b39', 0, 45, '°C');
}

function drawLineChart(canvas, data, color, min, max, unit) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(150, 200, 170, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
        const y = (i / 3) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - ((val - min) / (max - min)) * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, color + '60');
    grad.addColorStop(1, color + '00');
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    const last = data[data.length - 1];
    ctx.fillStyle = '#0a3320';
    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(last) + unit, W - 4, 12);
    ctx.textAlign = 'left';
}

function drawBarChart(canvas, data, color, min, max) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(150, 200, 170, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
        const y = (i / 3) * H;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    const barW = W / data.length;
    data.forEach((val, i) => {
        const h = ((val - min) / (max - min)) * H;
        const x = i * barW;
        const y = H - h;

        const grad = ctx.createLinearGradient(0, y, 0, H);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '80');
        ctx.fillStyle = grad;

        ctx.fillRect(x + 1, y, barW - 2, h);
    });

    const last = data[data.length - 1];
    ctx.fillStyle = '#0a3320';
    ctx.font = 'bold 10px Segoe UI, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(last), W - 4, 12);
    ctx.textAlign = 'left';
}

/* ============================================================
   16. MAIN LOOP
   ============================================================ */
let lastFrameTime = performance.now();

function simulationLoop(now) {
    const dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;

    if (simulation.running) {
        const simMinutesPerSecond = 0.5 * simulation.speed;
        simulation.minute += dt * simMinutesPerSecond;

        while (simulation.minute >= 60) {
            simulation.minute -= 60;
            simulation.hour++;
            if (simulation.hour >= 24) {
                simulation.hour = 0;
                simulation.day++;
                simulation.usageHistory.push(0);
                if (simulation.usageHistory.length > 40) simulation.usageHistory.shift();
            }
        }

        updateSoil(dt);
        updateWaterSources(dt);
        operatePump(dt);

        simulation.tickAccumulator += dt;
        if (simulation.tickAccumulator > 2.5) {
            simulation.tickAccumulator = 0;
            generateWeather();
        }

        simulation.irrigationRequired = calculateIrrigationRequirement();

        if (simulation.mode === 'ai' && Math.floor(now / 800) !== Math.floor((now - dt * 1000) / 800)) {
            runAIDecisionEngine();
        }

        if (Math.floor(now / 1500) !== Math.floor((now - dt * 1000) / 1500)) {
            simulation.moistureHistory.push(simulation.soilMoisture);
            if (simulation.moistureHistory.length > 40) simulation.moistureHistory.shift();

            simulation.rainHistory.push(simulation.rainfall);
            if (simulation.rainHistory.length > 40) simulation.rainHistory.shift();

            simulation.tempHistory.push(simulation.temperature);
            if (simulation.tempHistory.length > 40) simulation.tempHistory.shift();
        }
    }

    drawFarmScene();
    updateUI();
    drawCharts();

    requestAnimationFrame(simulationLoop);
}

/* ============================================================
   17. MODE SWITCH
   ============================================================ */
function setMode(mode) {
    simulation.mode = mode;

    DOM.aiModeBtn.classList.toggle('active', mode === 'ai');
    DOM.manualModeBtn.classList.toggle('active', mode === 'manual');

    DOM.modeIndicator.textContent = mode === 'ai' ? '🤖 AI Mode Active' : '🎮 Manual Mode Active';
    DOM.modeIndicator.style.background = mode === 'ai' ? '#d4f0dd' : '#dbeafe';
    DOM.modeIndicator.style.color = mode === 'ai' ? '#0f5e34' : '#1e40af';

    DOM.aiDecisionPanel.classList.toggle('hidden', mode !== 'ai');
    DOM.manualControlBar.classList.toggle('hidden', mode !== 'manual');

    if (mode === 'ai') {
        simulation.aiMessage = 'AI taking control — monitoring all systems...';
        simulation.aiStep = 1;
    }
}

/* ============================================================
   18. EVENT LISTENERS
   ============================================================ */
function setupEventListeners() {
    DOM.aiModeBtn.addEventListener('click', () => setMode('ai'));
    DOM.manualModeBtn.addEventListener('click', () => setMode('manual'));

    document.getElementById('startDemoBtn').addEventListener('click', () => {
        document.getElementById('simulatorSection').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('playBtn').addEventListener('click', () => {
        simulation.running = true;
    });
    document.getElementById('pauseBtn').addEventListener('click', () => {
        simulation.running = false;
    });
    document.getElementById('speed1xBtn').addEventListener('click', () => {
        simulation.speed = 1;
        updateSpeedButtons('speed1xBtn');
    });
    document.getElementById('speed2xBtn').addEventListener('click', () => {
        simulation.speed = 2;
        updateSpeedButtons('speed2xBtn');
    });
    document.getElementById('speed5xBtn').addEventListener('click', () => {
        simulation.speed = 5;
        updateSpeedButtons('speed5xBtn');
    });
    document.getElementById('resetBtn').addEventListener('click', resetSimulation);
    document.getElementById('forceRainBtn').addEventListener('click', () => {
        generateWeather(true);
    });

    DOM.cropSelect.addEventListener('change', (e) => {
        simulation.cropType = e.target.value;
        simulation.cropAge = 0;
        const crop = CROP_DATA[simulation.cropType];
        simulation.minSoilMoisture = crop.minMoisture;
        simulation.targetSoilMoisture = crop.targetMoisture;
    });

    document.getElementById('openDamBtn').addEventListener('click', () => {
        simulation.damOpen = true;
    });
    document.getElementById('closeDamBtn').addEventListener('click', () => {
        simulation.damOpen = false;
    });

    DOM.waterSourceSelect.addEventListener('change', (e) => {
        simulation.manualWaterSource = e.target.value;
    });

    document.getElementById('pumpOnBtn').addEventListener('click', () => {
        if (simulation.pumpStatus === 'RUNNING') return;

        let source = simulation.manualWaterSource;
        if (source === 'auto') {
            const req = calculateIrrigationRequirement();
            const selected = selectBestWaterSource(req);
            source = selected.source === 'NONE' ? 'well' : selected.source;
        }

        simulation.activeSource = source;
        simulation.targetIrrigation = Math.max(800, simulation.irrigationRequired || 1500);
        startPump(source);
        showAlert('blue', '🔵 MANUAL IRRIGATION STARTED');
    });

    document.getElementById('pumpOffBtn').addEventListener('click', () => {
        cancelIrrigation('Manual stop');
        showAlert('yellow', '🟡 PUMP STOPPED BY USER');
    });
}

function updateSpeedButtons(activeId) {
    ['speed1xBtn', 'speed2xBtn', 'speed5xBtn'].forEach(id => {
        document.getElementById(id).classList.toggle('active', id === activeId);
    });
}

function resetSimulation() {
    simulation.day = 64;
    simulation.hour = 8;
    simulation.minute = 42;
    simulation.speed = 1;
    simulation.running = false;

    simulation.temperature = 31;
    simulation.humidity = 64;
    simulation.rainfall = 0;
    simulation.rainProbability = 72;
    simulation.windSpeed = 8;
    simulation.solarRadiation = 650;
    simulation.weatherCondition = 'SUNNY';

    simulation.soilMoisture = 42;
    simulation.soilTemperature = 27;

    simulation.cropAge = 64;
    simulation.growthStage = 'Mid-season';
    simulation.kc = 1.15;
    simulation.rootDepth = 0.6;

    simulation.well = 6500;
    simulation.rainTank = 2400;
    simulation.river = 12000;
    simulation.damOpen = false;
    simulation.riverFlow = 380;

    simulation.irrigationRequired = 3850;
    simulation.targetIrrigation = 0;
    simulation.pumpStatus = 'OFF';
    simulation.pumpFlow = 0;
    simulation.delivered = 0;
    simulation.activeSource = null;
    simulation.irrigationEvents = 0;

    simulation.moistureHistory = new Array(40).fill(42);
    simulation.rainHistory = new Array(40).fill(0);
    simulation.usageHistory = new Array(40).fill(0);
    simulation.tempHistory = new Array(40).fill(31);

    simulation.aiStep = 1;
    simulation.aiMessage = 'AI monitoring conditions...';

    simulation.rainDrops = [];

    updateSpeedButtons('speed1xBtn');
    showAlert('green', '🟢 SIMULATION RESET');
}

/* ============================================================
   19. INIT
   ============================================================ */
function init() {
    setupEventListeners();
    updateSpeedButtons('speed1xBtn');
    setMode('ai');
    generateWeather();
    updateSoil(0);
    updateUI();
    drawCharts();
    updatePumpLED();
    showAlert('green', '🟢 SYSTEM READY — AI MODE');

    simulation.running = true;
    lastFrameTime = performance.now();
    requestAnimationFrame(simulationLoop);
}

init();