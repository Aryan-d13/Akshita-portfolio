"use client";

import { useEffect, useRef } from "react";

export default function Reveal({ children, className = "", as: Tag = "div" }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReduced) {
            el.classList.add("is-visible");
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18, rootMargin: "0px 0px -48px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag ref={ref} className={`reveal ${className}`}>
            {children}
        </Tag>
    );
}
