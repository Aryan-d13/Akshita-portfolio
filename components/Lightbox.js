"use client";

import { useEffect, useCallback } from "react";

export default function Lightbox({ photos, index, onClose, onNav }) {
    const photo = photos[index];
    const hasPrev = index > 0;
    const hasNext = index < photos.length - 1;

    const handleKey = useCallback(
        (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && hasPrev) onNav(index - 1);
            if (e.key === "ArrowRight" && hasNext) onNav(index + 1);
        },
        [onClose, onNav, index, hasPrev, hasNext]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [handleKey]);

    if (!photo) return null;

    return (
        <div className="lightbox-overlay" onClick={onClose}>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                {hasPrev && (
                    <button
                        className="lightbox-nav lightbox-prev"
                        onClick={() => onNav(index - 1)}
                        aria-label="Previous photo"
                    >
                        ‹
                    </button>
                )}

                <div className="lightbox-content">
                    <img
                        src={photo.url}
                        alt={photo.caption || ""}
                        className="lightbox-img"
                    />
                    {photo.caption && (
                        <p className="lightbox-caption">{photo.caption}</p>
                    )}
                </div>

                {hasNext && (
                    <button
                        className="lightbox-nav lightbox-next"
                        onClick={() => onNav(index + 1)}
                        aria-label="Next photo"
                    >
                        ›
                    </button>
                )}

                <button
                    className="lightbox-close"
                    onClick={onClose}
                    aria-label="Close lightbox"
                >
                    ×
                </button>
            </div>

            <style jsx>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(31, 24, 20, 0.92);
          backdrop-filter: blur(12px);
          animation: lbFadeIn 300ms ease;
        }

        @keyframes lbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          max-width: 92vw;
          max-height: 92vh;
        }

        .lightbox-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }

        .lightbox-img {
          max-width: 82vw;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
        }

        .lightbox-caption {
          color: rgba(255, 250, 243, 0.8);
          font-size: 0.9375rem;
          margin: 0;
          text-align: center;
          max-width: 48ch;
        }

        .lightbox-nav {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: var(--surface-solid);
          font-size: 1.8rem;
          cursor: pointer;
          transition: background 200ms, transform 200ms;
        }

        .lightbox-nav:hover {
          background: rgba(255, 255, 255, 0.18);
          transform: scale(1.08);
        }

        .lightbox-close {
          position: absolute;
          top: -48px;
          right: 0;
          border: none;
          background: none;
          color: rgba(255, 250, 243, 0.6);
          font-size: 2rem;
          cursor: pointer;
          transition: color 200ms;
          line-height: 1;
        }

        .lightbox-close:hover {
          color: var(--surface-solid);
        }

        @media (max-width: 720px) {
          .lightbox-nav {
            display: none;
          }
          .lightbox-img {
            max-width: 94vw;
            max-height: 75vh;
          }
        }
      `}</style>
        </div>
    );
}
