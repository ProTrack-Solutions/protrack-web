"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/** Dispara uma única vez quando o elemento entra na viewport */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px",
  },
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { ref, inView };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  variant?: "up" | "left" | "right" | "zoom";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
  variant = "up",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
