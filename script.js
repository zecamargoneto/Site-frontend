const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const mapRange = (v, inMin, inMax, outMin, outMax) => {
  const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
};

const viewport = document.getElementById('viewport');
const label = document.getElementById('chapter-label');
const garments = [...document.querySelectorAll('.garment')];
const stageType = document.getElementById('stage-type');
const stageFocus = document.getElementById('stage-focus');
const stageTech = document.getElementById('stage-tech');
const stageEditorial = document.getElementById('stage-editorial');
const stageFinal = document.getElementById('stage-final');

const chapterNames = [
  'CHAPTER 01 / FLOAT',
  'CHAPTER 02 / TYPE',
  'CHAPTER 03 / CONVERGE',
  'CHAPTER 04 / ISOLATE',
  'CHAPTER 05 / TECH FRAME',
  'CHAPTER 06 / EDITORIAL CARDS',
  'CHAPTER 07 / FINALE'
];

function getChapter(progress) {
  if (progress < 0.14) return 0;
  if (progress < 0.28) return 1;
  if (progress < 0.43) return 2;
  if (progress < 0.57) return 3;
  if (progress < 0.72) return 4;
  if (progress < 0.86) return 5;
  return 6;
}

function animateGarments(p) {
  garments.forEach((garment, i) => {
    const d = Number(garment.dataset.depth || 0.7);
    const dir = i === 1 ? -1 : 1;

    const s1 = mapRange(p, 0, 0.14, 0, 1); // stage 1 spread
    const s2 = mapRange(p, 0.14, 0.28, 0, 1); // stage 2 type overlap
    const s3 = mapRange(p, 0.28, 0.43, 0, 1); // stage 3 converge
    const s4 = mapRange(p, 0.43, 0.57, 0, 1); // stage 4 isolate
    const s5 = mapRange(p, 0.57, 0.72, 0, 1); // stage 5 tech
    const s6 = mapRange(p, 0.72, 0.86, 0, 1); // stage 6 cards

    const spreadX = dir * d * 260 * s1;
    const spreadY = d * -90 * s1;

    const typeX = spreadX + dir * d * 95 * s2;
    const typeY = spreadY + d * 35 * s2;

    const convergeX = mapRange(s3, 0, 1, typeX, (i - 1) * 115);
    const convergeY = mapRange(s3, 0, 1, typeY, (i - 1) * 28);

    const isolateX = mapRange(s4, 0, 1, convergeX, 0);
    const isolateY = mapRange(s4, 0, 1, convergeY, 0);

    const techX = mapRange(s5, 0, 1, isolateX, (i - 1) * 240);
    const techY = mapRange(s5, 0, 1, isolateY, 15 + i * 6);

    const cardX = mapRange(s6, 0, 1, techX, (i - 1) * 300);
    const cardY = mapRange(s6, 0, 1, techY, 40);

    const rot = dir * mapRange(p, 0, 0.43, 0, 9) - mapRange(p, 0.43, 0.86, 0, 8);
    const scaleIn = mapRange(p, 0, 0.28, 1, 1.15);
    const scaleConverge = mapRange(p, 0.28, 0.57, scaleIn, i === 0 ? 1.32 : 0.82);
    const scaleTech = mapRange(p, 0.57, 0.86, scaleConverge, 0.9);

    let opacity = 1;
    if (p > 0.9) opacity = mapRange(p, 0.9, 1, 1, 0);

    garment.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) rotate(${rot}deg) scale(${scaleTech})`;
    garment.style.opacity = opacity;
  });
}

function animateStages(p) {
  const typeIn = mapRange(p, 0.12, 0.26, 0, 1);
  const typeOut = mapRange(p, 0.34, 0.44, 1, 0);
  stageType.style.opacity = p < 0.34 ? typeIn : typeOut;
  stageType.style.transform = `scale(${mapRange(p, 0.14, 0.44, 1, 1.25)}) translateY(${mapRange(p, 0.14, 0.44, 0, -70)}px)`;

  const focusIn = mapRange(p, 0.41, 0.54, 0, 1);
  const focusOut = mapRange(p, 0.56, 0.66, 1, 0);
  stageFocus.style.opacity = p < 0.56 ? focusIn : focusOut;
  stageFocus.style.transform = `translateY(${mapRange(p, 0.41, 0.56, 45, 0)}px)`;

  const techIn = mapRange(p, 0.56, 0.7, 0, 1);
  const techOut = mapRange(p, 0.72, 0.8, 1, 0);
  stageTech.style.opacity = p < 0.72 ? techIn : techOut;
  stageTech.style.transform = `translateY(${mapRange(p, 0.56, 0.72, 42, 0)}px)`;

  const editorialIn = mapRange(p, 0.72, 0.84, 0, 1);
  const editorialOut = mapRange(p, 0.86, 0.93, 1, 0);
  stageEditorial.style.opacity = p < 0.86 ? editorialIn : editorialOut;
  stageEditorial.style.transform = `translateY(${mapRange(p, 0.72, 0.86, 50, 0)}px)`;

  const finalIn = mapRange(p, 0.86, 1, 0, 1);
  stageFinal.style.opacity = finalIn;
  stageFinal.style.transform = `translateY(${mapRange(p, 0.86, 1, 65, 0)}px)`;
}

function tick() {
  const rect = viewport.getBoundingClientRect();
  const total = window.innerHeight * 8.2;
  const y = clamp(-rect.top, 0, total);
  const p = y / total;

  label.textContent = chapterNames[getChapter(p)];
  animateGarments(p);
  animateStages(p);

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
