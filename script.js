 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
new file mode 100644
index 0000000000000000000000000000000000000000..37c87988bbb07cf861770d6ba982af1d1aaf01e6
--- /dev/null
+++ b/script.js
@@ -0,0 +1,91 @@
+const chapters = [...document.querySelectorAll('.chapter')];
+const chapterIndicator = document.getElementById('chapter-indicator');
+const heroLogo = document.getElementById('hero-logo');
+const siteHeader = document.getElementById('site-header');
+const primaryCards = [...document.querySelectorAll('#look-stream .look-card')];
+const secondaryCards = [...document.querySelectorAll('#look-stream-secondary .look-card')];
+let ticking = false;
+
+function clamp(v, min, max) {
+  return Math.min(Math.max(v, min), max);
+}
+
+function chapterProgress(chapter) {
+  const rect = chapter.getBoundingClientRect();
+  const viewport = window.innerHeight;
+  const totalTravel = rect.height - viewport;
+
+  if (totalTravel <= 0) return rect.top <= 0 ? 1 : 0;
+  return clamp((-rect.top) / totalTravel, 0, 1);
+}
+
+function placeCards(cards, progress, spread = 220) {
+  cards.forEach((card, idx) => {
+    const order = Number(card.dataset.order || idx);
+    const local = progress * 1.25 - order * 0.18;
+    const visible = clamp(local, 0, 1);
+    const xBase = (order - (cards.length - 1) / 2) * spread;
+    const yBase = (order % 2 === 0 ? -1 : 1) * 50;
+
+    card.style.left = '50%';
+    card.style.top = '50%';
+    card.style.height = `${300 + order * 15}px`;
+    card.style.transform = `translate(calc(-50% + ${xBase * (1 - visible)}px), calc(-50% + ${yBase * (1 - visible)}px)) rotate(${(order - 2) * (1 - visible) * 6}deg) scale(${0.8 + visible * 0.2})`;
+    card.style.opacity = String(visible);
+    card.style.pointerEvents = visible > 0.45 ? 'auto' : 'none';
+  });
+}
+
+function update() {
+  ticking = false;
+
+  let activeName = 'CHAPTER 01 / OPENING LOOKS';
+  let activeDistance = Number.POSITIVE_INFINITY;
+
+  chapters.forEach((chapter) => {
+    const p = chapterProgress(chapter);
+    chapter.style.setProperty('--p', p.toFixed(4));
+
+    const rect = chapter.getBoundingClientRect();
+    const distanceToCenter = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
+
+    if (distanceToCenter < activeDistance) {
+      activeDistance = distanceToCenter;
+      activeName = chapter.dataset.name || activeName;
+    }
+  });
+
+  chapterIndicator.textContent = activeName;
+
+  const c1 = chapterProgress(chapters[0]);
+  const c2 = chapterProgress(chapters[1]);
+
+  placeCards(primaryCards, c1, 230);
+  placeCards(secondaryCards, c2, 280);
+
+  const scrollY = window.scrollY || window.pageYOffset;
+  const logoFade = clamp(1 - scrollY / (window.innerHeight * 0.55), 0, 1);
+  heroLogo.style.opacity = String(logoFade);
+
+  if (scrollY > window.innerHeight * 0.15) {
+    siteHeader.classList.add('show');
+  } else {
+    siteHeader.classList.remove('show');
+  }
+}
+
+function requestTick() {
+  if (!ticking) {
+    ticking = true;
+    requestAnimationFrame(update);
+  }
+}
+
+window.addEventListener('scroll', requestTick, { passive: true });
+window.addEventListener('resize', requestTick);
+window.addEventListener('orientationchange', requestTick);
+document.addEventListener('visibilitychange', () => {
+  if (document.visibilityState === 'visible') requestTick();
+});
+
+requestTick();
 
EOF
)
