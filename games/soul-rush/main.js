// Soul Rush site — scroll reveals + the descent rail.
// Vanilla JS, no dependencies; degrades to static content without it.

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── scroll reveals ──────────────────────────────────────
  const revealEls = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ── the descent: a soul orb rides the phase rail ────────
  // The six phases alternate between two rails (as the soul swaps lanes
  // in-game). CSS places a node on each phase row; here we string a rail
  // through those nodes, and drive an orb along it with scroll. The rail
  // behind the orb lights up; nodes fill as the soul passes them.
  const descent = document.getElementById("descent");
  if (!descent) return;

  const track = descent.querySelector(".descent-track");
  const svg = track.querySelector("svg");
  const railBase = track.querySelector(".rail-base");
  const railLit = track.querySelector(".rail-lit");
  const orb = track.querySelector(".descent-orb");
  const phases = Array.from(descent.querySelectorAll(".phase"));

  // Lane-change length: how far above a node the diagonal swap begins.
  const SWAP_RUN = 80;

  let nodes = []; // { el, x, y } in track coordinates
  let totalLen = 0;

  function buildRail() {
    const box = track.getBoundingClientRect();
    if (box.height === 0) return;
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

    nodes = phases.map((p) => {
      const el = p.querySelector(".phase-node");
      const b = el.getBoundingClientRect();
      return {
        el,
        x: b.left + b.width / 2 - box.left,
        y: b.top + b.height / 2 - box.top,
      };
    });

    let d = `M ${nodes[0].x} 0 L ${nodes[0].x} ${nodes[0].y}`;
    for (let i = 1; i < nodes.length; i++) {
      const prev = nodes[i - 1];
      const next = nodes[i];
      const swapY = Math.max(prev.y, next.y - SWAP_RUN);
      d += ` L ${prev.x} ${swapY} L ${next.x} ${next.y}`;
    }
    d += ` L ${nodes[nodes.length - 1].x} ${box.height}`;

    railBase.setAttribute("d", d);
    railLit.setAttribute("d", d);
    totalLen = railLit.getTotalLength();
    railLit.style.strokeDasharray = `0 ${totalLen}`;
  }

  buildRail();
  if ("ResizeObserver" in window) {
    new ResizeObserver(buildRail).observe(descent);
  } else {
    window.addEventListener("resize", buildRail);
  }
  window.addEventListener("load", buildRail);

  if (reducedMotion) return; // static rail only — orb and lit trail are hidden

  // Scroll → how far down the rail the soul has descended. Eased with a
  // small lerp each frame so the orb glides rather than jumps.
  let current = 0;

  function targetProgress() {
    const box = track.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    return Math.min(1, Math.max(0, (mid - box.top) / box.height));
  }

  function frame() {
    if (totalLen > 0) {
      current += (targetProgress() - current) * 0.1;
      const at = current * totalLen;
      const pt = railLit.getPointAtLength(at);
      orb.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      railLit.style.strokeDasharray = `${at} ${totalLen}`;
      for (const n of nodes) {
        n.el.classList.toggle("lit", pt.y >= n.y - 6);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
