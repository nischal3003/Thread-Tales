import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    instance.resize();
  }

  const rect = target.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY - 84;

  if (instance) {
    instance.scrollTo(absoluteTop, { immediate: false });
  } else {
    window.scrollTo({ top: absoluteTop, behavior: "smooth" });
  }
}
