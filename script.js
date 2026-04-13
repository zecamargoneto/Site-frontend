const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const stage = document.getElementById('scroll-stage');
const garments = [...document.querySelectorAll('.garment')];
const hero = document.querySelector('.hero-copy');
const focus = document.querySelector('.focus-stage');
const grid = document.querySelector('.editorial-grid');
const finale = document.querySelector('.finale');

function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + (outMax - outMin) * t;
}

function animate() {
  const rect = stage.getBoundingClientRect();
  const total = window.innerHeight * 6.2;
  const scrollY = clamp(-rect.top, 0, total);
  const p = scrollY / total;

  const heroFadeOut = mapRange(p, 0.16, 0.34, 1, 0);
  const heroScale = mapRange(p, 0, 0.34, 1, 1.36);

  hero.style.opacity = heroFadeOut;
  hero.style.transform = `scale(${heroScale}) translateY(${mapRange(p, 0.02, 0.28, 0, -70)}px)`;

  garments.forEach((garment, i) => {
    const depth = Number(garment.dataset.depth || 0.5);
    const xDirection = i === 1 ? -1 : 1;

    const disperse = mapRange(p, 0, 0.22, 0, 1);
    const converge = mapRange(p, 0.23, 0.54, 0, 1);
    const cardReveal = mapRange(p, 0.53, 0.84, 0, 1);

    const tx = xDirection * (depth * 220 * disperse - depth * 160 * converge);
    const ty = depth * 90 * disperse - depth * 170 * converge;
    const rot = xDirection * (depth * 13 * disperse - depth * 8 * converge);

    const finalX = mapRange(cardReveal, 0, 1, tx, (i - 1) * 290);
    const finalY = mapRange(cardReveal, 0, 1, ty, 25 + i * 8);
    const finalRot = mapRange(cardReveal, 0, 1, rot, (i - 1) * 2);

    const scaleA = mapRange(p, 0, 0.34, 1, 1.08);
    const scaleB = mapRange(p, 0.34, 0.62, 1.08, i === 0 ? 1.35 : 0.78);
    const scaleC = mapRange(p, 0.62, 0.86, scaleB, 0.9);

    let scale = scaleA;
    if (p > 0.34) scale = scaleB;
    if (p > 0.62) scale = scaleC;

    const opacity = p > 0.9 ? mapRange(p, 0.9, 1, 1, 0) : 1;

    garment.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) rotate(${finalRot}deg) scale(${scale})`;
    garment.style.opacity = opacity;
  });

  const focusIn = mapRange(p, 0.32, 0.52, 0, 1);
  const focusOut = mapRange(p, 0.6, 0.72, 1, 0);
  focus.style.opacity = p < 0.6 ? focusIn : focusOut;
  focus.style.transform = `translateY(${mapRange(p, 0.32, 0.6, 40, 0)}px)`;

  const gridIn = mapRange(p, 0.58, 0.76, 0, 1);
  const gridOut = mapRange(p, 0.84, 0.95, 1, 0);
  grid.style.opacity = p < 0.84 ? gridIn : gridOut;
  grid.style.transform = `translateY(${mapRange(p, 0.58, 0.78, 65, 0)}px)`;

  const finaleIn = mapRange(p, 0.82, 0.98, 0, 1);
  finale.style.opacity = finaleIn;
  finale.style.transform = `translateY(${mapRange(p, 0.82, 1, 55, 0)}px)`;

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
