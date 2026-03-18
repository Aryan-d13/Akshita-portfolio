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

  function getExcerpt(body, maxLen = 180) {
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
        <div className="journal-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="journal-skeleton" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Reveal className="journal-empty">
          <div className="journal-empty-inner">
            <span className="journal-empty-mark" aria-hidden="true">✎</span>
            <p>No journal entries yet.</p>
            <p className="journal-empty-sub">
              Posts will appear here once they&apos;re published.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="journal-list">
          {posts.map((post, i) => (
            <Reveal
              key={post.id}
              className="journal-card"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <Link href={`/blog/${post.slug}`} className="journal-card-link">
                <span className="journal-date">{formatDate(post.createdAt)}</span>
                <h3 className="journal-title">{post.title}</h3>
                <p className="journal-excerpt">{getExcerpt(post.body)}</p>
                <span className="journal-continue">Continue reading →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}

      <style jsx>{`
        .journal-list {
          display: grid;
          gap: var(--space-3);
        }

        .journal-skeleton {
          height: 140px;
          border-radius: var(--radius-md);
          background: linear-gradient(
            110deg,
            rgba(180, 93, 57, 0.04) 8%,
            rgba(180, 93, 57, 0.09) 18%,
            rgba(180, 93, 57, 0.04) 33%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .journal-empty {
          text-align: center;
          padding: var(--space-10) var(--space-4);
        }

        .journal-empty-inner {
          display: grid;
          gap: var(--space-2);
          justify-items: center;
        }

        .journal-empty-mark {
          font-size: 2.8rem;
          color: rgba(180, 93, 57, 0.16);
          line-height: 1;
        }

        .journal-empty p {
          margin: 0;
          color: var(--muted);
          font-size: 1.05rem;
        }

        .journal-empty-sub {
          font-size: 0.875rem !important;
          max-width: 32ch;
        }

        .journal-card-link {
          display: grid;
          gap: 10px;
          padding: var(--space-4);
          border: 1px solid var(--border);
          border-left: 3px solid transparent;
          border-radius: 4px var(--radius-md) var(--radius-md) 4px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.55),
            rgba(249, 242, 233, 0.72)
          );
          box-shadow: var(--shadow-soft);
          text-decoration: none;
          color: inherit;
          transition:
            transform var(--transition),
            box-shadow var(--transition),
            border-color var(--transition);
        }

        .journal-card-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 48px rgba(64, 44, 31, 0.12);
          border-left-color: var(--accent);
        }

        .journal-date {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
        }

        .journal-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.3rem, 2.8vw, 1.8rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
          font-weight: 400;
        }

        .journal-excerpt {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: 0.9375rem;
          max-width: 56ch;
        }

        .journal-continue {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--accent);
          margin-top: 4px;
        }
      `}</style>
    </section>
  );
}
