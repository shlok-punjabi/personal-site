"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const WAIT_MIN = 12_000;
const WAIT_MAX = 24_000;
const DURATION_MIN = 800;
const DURATION_MAX = 1_200;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function RareGloss() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let waitTimer = 0;
    let glossTimer = 0;
    let active: HTMLElement | null = null;
    let stopped = false;

    const targets = () => [...document.querySelectorAll<HTMLElement>("[data-gloss]")];

    const clearActive = () => {
      window.clearTimeout(glossTimer);
      glossTimer = 0;
      if (!active) return;
      active.classList.remove("is-gloss");
      active.style.removeProperty("--gloss-ms");
      active = null;
    };

    const clearWait = () => {
      window.clearTimeout(waitTimer);
      waitTimer = 0;
    };

    const eligible = () =>
      targets().filter((el) => {
        if (el.dataset.gloss !== "name" && el.dataset.glossLive !== "true") return false;
        const group = el.closest(".entries");
        if (group && Number(getComputedStyle(group).opacity) < 0.95) return false;
        const link = el.closest("a");
        if (!link) return true;
        return (
          !link.matches(":hover") &&
          !link.matches(":focus") &&
          !link.matches(":focus-visible")
        );
      });

    const schedule = () => {
      clearWait();
      if (stopped || document.hidden || reducedQuery.matches) return;
      waitTimer = window.setTimeout(() => {
        const pool = eligible();
        if (pool.length === 0) {
          schedule();
          return;
        }
        const next = pool[Math.floor(Math.random() * pool.length)];
        play(next);
      }, randomBetween(WAIT_MIN, WAIT_MAX));
    };

    const play = (el: HTMLElement, duration = randomBetween(DURATION_MIN, DURATION_MAX)) => {
      if (stopped || document.hidden || reducedQuery.matches) return;
      const link = el.closest("a");
      if (
        link &&
        (link.matches(":hover") || link.matches(":focus") || link.matches(":focus-visible"))
      ) {
        schedule();
        return;
      }
      clearActive();
      active = el;
      el.style.setProperty("--gloss-ms", `${Math.round(duration)}ms`);
      el.classList.add("is-gloss");
      glossTimer = window.setTimeout(() => {
        clearActive();
        schedule();
      }, duration);
    };

    const cancelToWait = () => {
      clearWait();
      clearActive();
      schedule();
    };

    const onVisibility = () => {
      clearWait();
      clearActive();
      if (!document.hidden) schedule();
    };

    const onReduce = () => {
      clearWait();
      clearActive();
      if (!reducedQuery.matches) schedule();
    };

    const onInteract = (event: Event) => {
      if (!active) return;
      const link = active.closest("a");
      if (!link || !(event.target instanceof Node) || !link.contains(event.target)) return;
      cancelToWait();
    };

    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onReduce);
    document.addEventListener("pointerover", onInteract);
    document.addEventListener("focusin", onInteract);

    let playedHook = false;
    if (process.env.NODE_ENV === "development" && !reducedQuery.matches) {
      const which = new URLSearchParams(window.location.search).get("gloss");
      const hooked = which
        ? targets().find((node) => node.dataset.gloss === which)
        : undefined;
      if (hooked) {
        playedHook = true;
        play(hooked, 1000);
      }
    }

    if (!playedHook) schedule();

    return () => {
      stopped = true;
      clearWait();
      clearActive();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReduce);
      document.removeEventListener("pointerover", onInteract);
      document.removeEventListener("focusin", onInteract);
    };
  }, [pathname]);

  return null;
}
