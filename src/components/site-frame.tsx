"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { home, type HomeEntry } from "@/content/home";
import { RareGloss } from "@/components/rare-gloss";

type NavMode = "column" | "row";
type LabelMode = "in" | "out";
type MotionMode = "settle" | "spatial" | "crossfade";
type Ghost = HomeEntry & { kind: "cross" };

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [snap, setSnap] = useState(pathname);
  const [nav, setNav] = useState<NavMode>(isHome ? "column" : "row");
  const [labels, setLabels] = useState<LabelMode>("in");
  const [motion, setMotion] = useState<MotionMode>("settle");
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const transitionRef = useRef(0);

  if (pathname !== snap) {
    const from = snap;
    const to = pathname;
    const reduced = typeof window !== "undefined" && reducedMotion();
    setSnap(to);
    if (reduced || from === to) {
      setNav(to === "/" ? "column" : "row");
      setLabels("in");
      setMotion("settle");
      setGhost(null);
    } else if (from === "/" && to !== "/") {
      setNav("column");
      setLabels("out");
      setMotion("spatial");
      setGhost(null);
    } else if (to === "/") {
      setNav("row");
      setLabels("out");
      setMotion("spatial");
      setGhost(null);
    } else {
      const entry = home.entries.find((item) => item.href === from);
      setNav("row");
      setLabels("in");
      setMotion("crossfade");
      setGhost(entry ? { ...entry, kind: "cross" } : null);
    }
  }

  useLayoutEffect(() => {
    if (pathname !== "/") return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest(".rail")) {
      active.blur();
    }
  }, [pathname]);

  useEffect(() => {
    const token = ++transitionRef.current;
    if (motion === "settle") return;
    if (reducedMotion()) return;

    const timers: number[] = [];
    const alive = () => transitionRef.current === token;
    if (motion === "spatial" && pathname !== "/") {
      timers.push(window.setTimeout(() => alive() && setNav("row"), 160));
      timers.push(window.setTimeout(() => alive() && setLabels("in"), 540));
      timers.push(window.setTimeout(() => alive() && setMotion("settle"), 1000));
    } else if (motion === "spatial" && pathname === "/") {
      timers.push(
        window.setTimeout(() => {
          if (!alive()) return;
          setNav("column");
          setLabels("in");
        }, 160),
      );
      timers.push(window.setTimeout(() => alive() && setMotion("settle"), 640));
    } else if (motion === "crossfade") {
      timers.push(
        window.setTimeout(() => {
          if (!alive()) return;
          setGhost(null);
          setMotion("settle");
        }, 180),
      );
    }

    return () => {
      transitionRef.current += 1;
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [motion, pathname]);

  const labelsLive = labels === "in" && motion === "settle";

  return (
    <main
      className="page enter"
      data-view={isHome ? "index" : "section"}
      data-nav={nav}
      data-labels={labels}
      data-motion={motion}
    >
      <RareGloss />
      <header className="header">
        <div className="identity">
          {isHome ? (
            <h1 className="name">
              <Link href="/" className="name-link" data-gloss="name">
                {home.name}
              </Link>
            </h1>
          ) : (
            <p className="name">
              <Link href="/" className="name-link" data-gloss="name">
                {home.name}
              </Link>
            </p>
          )}
          <p className="intro">{home.introduction}</p>
        </div>
        <p className="place">{home.place}</p>
      </header>

      <hr className="rule rule-top" />

      <div className="stage">
        <nav className="rail" aria-label="Index">
          <ul className="entries">
            {home.entries.map((entry, index) => {
              const current = pathname === entry.href;
              return (
                <li key={entry.href} className="entry">
                  <Link
                    href={entry.href}
                    className="row"
                    aria-current={current ? "page" : undefined}
                  >
                    {current ? (
                      <h1
                        className="section-title"
                        data-gloss={String(index)}
                        data-gloss-live={labelsLive ? "true" : "false"}
                      >
                        {entry.label}
                      </h1>
                    ) : (
                      <span
                        data-gloss={String(index)}
                        data-gloss-live={labelsLive ? "true" : "false"}
                      >
                        {entry.label}
                      </span>
                    )}
                    <span className="arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>
                  <p className="response">{entry.response}</p>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="divider" aria-hidden="true" />
        <div className="well">
          {ghost ? (
            <article
              className={`article article-ghost article-ghost-${ghost.kind}`}
              aria-hidden="true"
            >
              <p className="dest-copy">{ghost.response}</p>
              <p className="dest-note">{ghost.note}</p>
              <ul className="dest-list">
                {ghost.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ) : null}
          {children}
        </div>
      </div>

      <footer className="footer">
        <hr className="rule rule-bottom" />
        <div className="footer-meta">
          <p className="closing">{home.closing}</p>
          <nav className="profiles" aria-label="Profiles">
            <a
              className="profile-link"
              href="https://www.linkedin.com/in/shlok-punjabi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.12h.05c.53-1.01 1.84-2.08 3.79-2.08 4.06 0 4.81 2.67 4.81 6.15V24h-4v-7.71c0-1.84-.03-4.21-2.56-4.21-2.56 0-2.95 2-2.95 4.07V24h-4V8.5z"
                />
              </svg>
              LinkedIn
            </a>
            <a
              className="profile-link"
              href="https://x.com/shlokpunjabi"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              X / Twitter
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
