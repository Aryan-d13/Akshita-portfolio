"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function BlogListContent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    try {
      const q = query(
        collection(db, "posts"),
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      unsub = onSnapshot(q, (snap) => {
        setPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => unsub && unsub();
  }, []);

  function formatDate(ts) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getExcerpt(body, maxLen = 200) {
    if (!body) return "";
    const plain = body.replace(/<[^>]+>/g, "");
    return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
  }

  return (
    <section className="section" id="blog">
      <Reveal>
        <Link href="/" className="back-link">
          ← Home
        </Link>
        <SectionHeader
          question="From the journal"
          title="Words, unfiltered."
          note="Personal writing, reflections, and things worth saying out loud."
        />
      </Reveal>

      {loading ? (
        <div className="blog-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="blog-card-skeleton" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Reveal className="blog-empty">
          <div className="blog-empty-inner">
            <span className="blog-empty-icon" aria-hidden="true">✎</span>
            <p>No journal entries yet.</p>
            <p className="blog-empty-sub">
              Posts will appear here as they&apos;re published from the admin panel.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="blog-list">
          {posts.map((post) => (
            <Reveal key={post.id} className="blog-card">
              <Link href={`/blog/${post.slug}`} className="blog-card-link">
                <span className="blog-date">{formatDate(post.createdAt)}</span>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{getExcerpt(post.body)}</p>
                <span className="blog-read-more">Continue reading →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      <style jsx>{`
        .blog-list {
          display: grid;
          gap: var(--space-4);
        }

        .blog-card-skeleton {
          height: 160px;
          border-radius: var(--radius-md);
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

        .blog-empty {
          text-align: center;
          padding: var(--space-10) var(--space-4);
        }

        .blog-empty-inner {
          display: grid;
          gap: var(--space-2);
          justify-items: center;
        }

        .blog-empty-icon {
          font-size: 3rem;
          color: rgba(180, 93, 57, 0.2);
          line-height: 1;
        }

        .blog-empty p {
          margin: 0;
          color: var(--muted);
          font-size: 1.1rem;
        }

        .blog-empty-sub {
          font-size: 0.9375rem !important;
          max-width: 36ch;
        }

        .blog-card-link {
          display: grid;
          gap: var(--space-2);
          padding: var(--space-4);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.72),
            rgba(249, 242, 233, 0.86)
          );
          box-shadow: var(--shadow-soft);
          transition: transform var(--transition), box-shadow var(--transition);
        }

        .blog-card-link:hover {
          transform: translateY(-4px);
          box-shadow: 0 26px 54px rgba(64, 44, 31, 0.14);
        }

        .blog-date {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .blog-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.4rem, 3vw, 2rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-weight: 400;
        }

        .blog-excerpt {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
          max-width: 60ch;
        }

        .blog-read-more {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: var(--space-1);
        }
      `}</style>
    </section>
  );
}
