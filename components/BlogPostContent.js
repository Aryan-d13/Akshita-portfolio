"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import DOMPurify from "dompurify";

export default function BlogPostContent({ slug }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const q = query(
          collection(db, "posts"),
          where("slug", "==", slug),
          where("status", "==", "published")
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setNotFound(true);
        } else {
          const doc = snap.docs[0];
          setPost({ id: doc.id, ...doc.data() });
        }
      } catch {
        setNotFound(true);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  function formatDate(ts) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function sanitize(html) {
    if (typeof window === "undefined") return html;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
        "h1", "h2", "h3", "h4", "blockquote", "pre", "code", "img", "hr",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class"],
    });
  }

  if (loading) {
    return (
      <section className="section">
        <div className="post-skeleton" />
        <style jsx>{`
          .post-skeleton {
            height: 400px;
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
        `}</style>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="section">
        <Reveal className="post-not-found">
          <h2 className="section-title">Post not found.</h2>
          <p style={{ color: "var(--muted)", margin: "var(--space-2) 0" }}>
            This entry may have been removed or doesn&apos;t exist yet.
          </p>
          <Link href="/blog" className="button button-secondary">
            ← Back to Journal
          </Link>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="section">
      <Reveal className="post-article">
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/" className="post-back">
            ← Home
          </Link>
          <Link href="/blog" className="post-back">
            ← Journal
          </Link>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
        <h1 className="post-title">{post.title}</h1>
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: sanitize(post.body) }}
        />
      </Reveal>

      <style jsx>{`
        .post-article {
          max-width: 65ch;
        }

        .post-back {
          display: inline-block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: var(--space-4);
          transition: transform var(--transition);
        }

        .post-back:hover {
          transform: translateX(-4px);
        }

        .post-date {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: var(--space-2);
        }

        .post-title {
          margin: 0 0 var(--space-3);
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.4rem);
          line-height: 1;
          letter-spacing: -0.03em;
          font-weight: 350;
        }

        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
          margin-bottom: var(--space-5);
        }

        .post-tag {
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(180, 93, 57, 0.1);
          color: var(--accent);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .post-not-found {
          text-align: center;
          padding: var(--space-10) var(--space-4);
        }
      `}</style>

      <style jsx global>{`
        .post-body {
          line-height: 1.85;
          color: var(--text);
          font-size: 1.05rem;
        }

        .post-body p {
          margin: 0 0 1.4em;
        }

        .post-body h2,
        .post-body h3 {
          font-family: var(--font-display);
          margin: 2em 0 0.6em;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .post-body h2 {
          font-size: 1.6rem;
        }

        .post-body h3 {
          font-size: 1.3rem;
        }

        .post-body blockquote {
          margin: 1.6em 0;
          padding: var(--space-3) var(--space-4);
          border-left: 3px solid var(--accent);
          background: rgba(180, 93, 57, 0.06);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-style: italic;
          color: var(--muted);
        }

        .post-body blockquote p:last-child {
          margin-bottom: 0;
        }

        .post-body a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .post-body ul,
        .post-body ol {
          padding-left: 1.4em;
          margin: 0 0 1.4em;
        }

        .post-body li {
          margin-bottom: 0.4em;
        }

        .post-body code {
          padding: 2px 6px;
          background: rgba(122, 103, 83, 0.1);
          border-radius: 4px;
          font-size: 0.9em;
        }

        .post-body pre {
          padding: var(--space-3);
          background: var(--primary);
          color: var(--surface-solid);
          border-radius: var(--radius-sm);
          overflow-x: auto;
          margin: 1.6em 0;
        }

        .post-body pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .post-body img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-sm);
          margin: 1.6em 0;
        }

        .post-body hr {
          border: none;
          height: 1px;
          background: var(--border);
          margin: 2em 0;
        }
      `}</style>
    </section>
  );
}
