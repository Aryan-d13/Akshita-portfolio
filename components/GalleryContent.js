"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import Lightbox from "./Lightbox";

export default function GalleryContent() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  useEffect(() => {
    let unsub;
    try {
      const q = query(
        collection(db, "photos"),
        orderBy("createdAt", "desc")
      );
      unsub = onSnapshot(q, (snap) => {
        setPhotos(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => unsub && unsub();
  }, []);

  const openLightbox = useCallback((i) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(-1), []);

  return (
    <>
      <section className="section" id="gallery">
        <Reveal>
          <Link href="/" className="back-link">
            ← Home
          </Link>
          <SectionHeader
            question="Through the lens"
            title="Moments, caught."
            note="A personal visual journal — landscapes, light, and quiet observations."
          />
        </Reveal>

        {loading ? (
          <div className="gallery-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="gallery-skeleton" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <Reveal className="gallery-empty">
            <div className="gallery-empty-inner">
              <span className="gallery-empty-icon" aria-hidden="true">◎</span>
              <p>No photographs yet.</p>
              <p className="gallery-empty-sub">
                This gallery will fill with images as they&apos;re uploaded
                through the admin panel.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo, i) => (
              <Reveal key={photo.id} className="gallery-item">
                <button
                  className="gallery-trigger"
                  onClick={() => openLightbox(i)}
                  aria-label={`View ${photo.caption || "photo"}`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || ""}
                    width={photo.width || 800}
                    height={photo.height || 600}
                    sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw"
                    className="gallery-img"
                    loading="lazy"
                  />
                  {photo.caption && (
                    <span className="gallery-caption">{photo.caption}</span>
                  )}
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {lightboxIdx >= 0 && (
        <Lightbox
          photos={photos}
          index={lightboxIdx}
          onClose={closeLightbox}
          onNav={setLightboxIdx}
        />
      )}

      <style jsx global>{`
        .gallery-grid {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(24px, 4vw, 40px);
          justify-content: flex-start;
          align-items: flex-start;
          width: 100%;
        }

        .gallery-item {
          width: 300px;
          flex-shrink: 0;
        }

        .gallery-skeleton {
          width: 300px;
          height: 360px;
          border-radius: 2px;
          padding: 10px 10px 38px 10px;
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 8px 24px rgba(36, 26, 22, 0.08);
          display: flex;
        }

        .gallery-skeleton::before {
          content: "";
          width: 100%;
          height: 100%;
          border-radius: 1px;
          background: linear-gradient(
            110deg,
            rgba(180, 93, 57, 0.06) 8%,
            rgba(180, 93, 57, 0.12) 18%,
            rgba(180, 93, 57, 0.06) 33%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .gallery-empty {
          text-align: center;
          padding: var(--space-10) var(--space-4);
          width: 100%;
        }

        .gallery-empty-inner {
          display: grid;
          gap: var(--space-2);
          justify-items: center;
        }

        .gallery-empty-icon {
          font-size: 3rem;
          color: rgba(180, 93, 57, 0.2);
          line-height: 1;
        }

        .gallery-empty p {
          margin: 0;
          color: var(--muted);
          font-size: 1.1rem;
        }

        .gallery-empty-sub {
          font-size: 0.9375rem !important;
          max-width: 36ch;
        }

        .gallery-trigger {
          position: relative;
          display: block;
          width: 100%;
          padding: 10px 10px 38px 10px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          border-radius: 2px;
          cursor: pointer;
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s;
          box-shadow: 0 8px 24px rgba(36, 26, 22, 0.08);
        }

        .gallery-trigger:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 16px 40px rgba(180, 93, 57, 0.15);
          z-index: 10;
        }
        
        /* Alternating subtle tilt effect on hover for an organic feel */
        .gallery-item:nth-child(even) .gallery-trigger:hover {
          transform: translateY(-8px) scale(1.03) rotate(1.5deg);
        }
        
        .gallery-item:nth-child(odd) .gallery-trigger:hover {
          transform: translateY(-8px) scale(1.03) rotate(-1.5deg);
        }

        .gallery-img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 1px;
        }

        .gallery-caption {
          position: absolute;
          bottom: 12px;
          left: 10px;
          right: 10px;
          text-align: center;
          font-family: var(--font-display);
          font-size: 0.8rem;
          color: var(--text);
          font-style: italic;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 480px) {
          .gallery-grid {
             justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
