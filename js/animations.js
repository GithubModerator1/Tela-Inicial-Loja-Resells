const SCROLL_ANIMATION_TRIGGER_CLASSNAME = "scroll-trigger",
  SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = "scroll-trigger--offscreen",
  SCROLL_ZOOM_IN_TRIGGER_CLASSNAME = "animate--zoom-in",
  SCROLL_ANIMATION_CANCEL_CLASSNAME = "scroll-trigger--cancel";
function onIntersection(e, t) {
  e.forEach((e, r) => {
    if (e.isIntersecting) {
      const i = e.target;
      i.classList.contains("scroll-trigger--offscreen") &&
        (i.classList.remove("scroll-trigger--offscreen"),
        i.hasAttribute("data-cascade") &&
          i.setAttribute("style", `--animation-order: ${r};`)),
        t.unobserve(i);
    } else
      e.target.classList.add("scroll-trigger--offscreen"),
        e.target.classList.remove("scroll-trigger--cancel");
  });
}
function initializeScrollAnimationTrigger(e = document, t = !1) {
  const r = Array.from(e.getElementsByClassName("scroll-trigger"));
  if (0 === r.length) return;
  if (t)
    return void r.forEach((e) => {
      e.classList.add("scroll-trigger--design-mode");
    });
  const i = new IntersectionObserver(onIntersection, {
    rootMargin: "0px 0px -50px 0px",
  });
  r.forEach((e) => i.observe(e));
}
function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const e = Array.from(document.getElementsByClassName("animate--zoom-in"));
  if (0 === e.length) return;
  e.forEach((e) => {
    let t = !1;
    new IntersectionObserver((e) => {
      e.forEach((e) => {
        t = e.isIntersecting;
      });
    }).observe(e),
      e.style.setProperty("--zoom-in-ratio", 1 + 0.002 * percentageSeen(e)),
      window.addEventListener(
        "scroll",
        throttle(() => {
          t &&
            e.style.setProperty(
              "--zoom-in-ratio",
              1 + 0.002 * percentageSeen(e)
            );
        }),
        { passive: !0 }
      );
  });
}
function percentageSeen(e) {
  const t = window.innerHeight,
    r = window.scrollY,
    i = e.getBoundingClientRect().top + r,
    n = e.offsetHeight;
  if (i > r + t) return 0;
  if (i + n < r) return 100;
  let o = (r + t - i) / ((t + n) / 100);
  return Math.round(o);
}
window.addEventListener("DOMContentLoaded", () => {
  initializeScrollAnimationTrigger(), initializeScrollZoomAnimationTrigger();
}),
  Shopify.designMode &&
    (document.addEventListener("shopify:section:load", (e) =>
      initializeScrollAnimationTrigger(e.target, !0)
    ),
    document.addEventListener("shopify:section:reorder", () =>
      initializeScrollAnimationTrigger(document, !0)
    ));
