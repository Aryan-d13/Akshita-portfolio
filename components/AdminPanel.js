"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    setDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from "firebase/firestore";
import { defaultSiteContent } from "@/lib/seedContent";

const ADMIN_PASSWORD = "akshita2025";
const AUTH_KEY = "portfolio_admin_auth";
const DRAFT_KEY = "portfolio_blog_draft";

/* ═══════════════════════════════════════════════════════════
   ADMIN PANEL (Top-Level)
   ═══════════════════════════════════════════════════════════ */

export default function AdminPanel() {
    const [authed, setAuthed] = useState(false);
    const [tab, setTab] = useState("site");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = sessionStorage.getItem(AUTH_KEY);
            if (saved === "true") setAuthed(true);
        }
    }, []);

    function handleLogin(pw) {
        if (pw === ADMIN_PASSWORD) {
            setAuthed(true);
            sessionStorage.setItem(AUTH_KEY, "true");
            return true;
        }
        return false;
    }

    if (!authed) return <PasswordGate onLogin={handleLogin} />;

    return (
        <div className="adm-shell">
            <div className="adm-header">
                <Link href="/" className="adm-home" title="Back to Portfolio">⌂</Link>
                <h1 className="adm-title">Admin</h1>
                <div className="adm-tabs">
                    <button
                        className={`adm-tab ${tab === "site" ? "active" : ""}`}
                        onClick={() => setTab("site")}
                    >
                        Site Content
                    </button>
                    <button
                        className={`adm-tab ${tab === "blog" ? "active" : ""}`}
                        onClick={() => setTab("blog")}
                    >
                        Blog
                    </button>
                </div>
                <button
                    className="adm-logout"
                    onClick={() => {
                        sessionStorage.removeItem(AUTH_KEY);
                        setAuthed(false);
                    }}
                >
                    Log out
                </button>
            </div>

            {tab === "site" ? <SiteContentManager /> : <BlogManager />}

            <style jsx>{`
        .adm-shell {
          max-width: 920px;
          margin: 0 auto;
          padding: var(--space-5) var(--space-3);
          min-height: 100vh;
          position: relative;
          z-index: 1;
          transition: max-width 0.3s ease;
        }
        .adm-shell:has(.ai-panel-open) {
          max-width: 1400px;
        }
        .adm-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }
        .adm-home {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          color: var(--surface-solid);
          font-size: 1.2rem;
          text-decoration: none;
          transition: all var(--transition);
          box-shadow: 0 4px 10px rgba(36, 26, 22, 0.18);
        }
        .adm-home:hover {
          transform: translateY(-2px);
          background: var(--accent);
        }
        .adm-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 350;
          letter-spacing: -0.03em;
        }
        .adm-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(122, 103, 83, 0.08);
        }
        .adm-tab {
          padding: 9px 18px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: var(--muted);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }
        .adm-tab.active {
          background: var(--surface-solid);
          color: var(--text);
          box-shadow: 0 2px 8px rgba(64, 44, 31, 0.08);
        }
        .adm-logout {
          margin-left: auto;
          padding: 8px 16px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: transparent;
          color: var(--muted);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }
        .adm-logout:hover {
          border-color: rgba(180, 93, 57, 0.24);
          color: var(--accent);
        }
      `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   PASSWORD GATE
   ═══════════════════════════════════════════════════════════ */

function PasswordGate({ onLogin }) {
    const [pw, setPw] = useState("");
    const [error, setError] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (!onLogin(pw)) {
            setError(true);
            setPw("");
            inputRef.current?.focus();
        }
    }

    return (
        <div className="gate-shell">
            <form className="gate-card" onSubmit={handleSubmit}>
                <h1 className="gate-title">Admin</h1>
                <p className="gate-sub">Enter the password to continue.</p>
                <input
                    ref={inputRef}
                    className={`gate-input ${error ? "gate-error" : ""}`}
                    type="password"
                    placeholder="Password"
                    value={pw}
                    onChange={(e) => { setPw(e.target.value); setError(false); }}
                    autoComplete="current-password"
                />
                {error && <p className="gate-error-msg">Wrong password. Try again.</p>}
                <button className="button button-primary gate-btn" type="submit">Enter</button>
            </form>

            <style jsx>{`
        .gate-shell {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--space-4);
          position: relative;
          z-index: 1;
        }
        .gate-card {
          display: grid;
          gap: var(--space-3);
          width: min(360px, 100%);
          padding: var(--space-6);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--panel-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(16px);
          text-align: center;
        }
        .gate-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 350;
          letter-spacing: -0.04em;
        }
        .gate-sub { margin: 0; color: var(--muted); font-size: 0.9375rem; }
        .gate-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.5);
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--text);
          outline: none;
          transition: border-color var(--transition);
        }
        .gate-input:focus { border-color: var(--accent); }
        .gate-input.gate-error { border-color: #c0392b; }
        .gate-error-msg { color: #c0392b; font-size: 0.8125rem; font-weight: 600; margin: 0; }
        .gate-btn { width: 100%; justify-content: center; }
      `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   SITE CONTENT MANAGER
   ═══════════════════════════════════════════════════════════ */

function SiteContentManager() {
    const [data, setData] = useState(defaultSiteContent);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const timerRef = useRef(null);

    // Load from Firestore
    useEffect(() => {
        let unsub;
        try {
            unsub = onSnapshot(doc(db, "siteContent", "home"), (snap) => {
                if (snap.exists()) {
                    setData((prev) => ({ ...defaultSiteContent, ...snap.data() }));
                }
            });
        } catch { /* keep defaults */ }
        return () => unsub && unsub();
    }, []);

    async function handleSave() {
        setSaving(true);
        try {
            await setDoc(doc(db, "siteContent", "home"), data, { merge: true });
            setSaved(true);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save. Check console.");
        }
        setSaving(false);
    }

    async function handleReset() {
        if (!confirm("Reset all site content to defaults? This cannot be undone.")) return;
        setSaving(true);
        try {
            await setDoc(doc(db, "siteContent", "home"), defaultSiteContent);
            setData(defaultSiteContent);
            setSaved(true);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Reset error:", err);
        }
        setSaving(false);
    }

    function update(path, value) {
        setData((prev) => {
            const copy = JSON.parse(JSON.stringify(prev));
            const keys = path.split(".");
            let obj = copy;
            for (let i = 0; i < keys.length - 1; i++) {
                const k = isNaN(keys[i]) ? keys[i] : Number(keys[i]);
                obj = obj[k];
            }
            const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : Number(keys[keys.length - 1]);
            obj[lastKey] = value;
            return copy;
        });
    }

    return (
        <div className="scm">
            <div className="scm-actions">
                <button className="button button-primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
                </button>
                <button className="button button-secondary" onClick={handleReset} disabled={saving}>
                    Reset to Defaults
                </button>
            </div>

            {/* HERO */}
            <fieldset className="scm-group">
                <legend>Hero / Statement</legend>
                <label className="scm-toggle">
                    <input
                        type="checkbox"
                        checked={data.sectionsVisible?.hero !== false}
                        onChange={(e) => update("sectionsVisible.hero", e.target.checked)}
                    />
                    Visible
                </label>
                <Field label="Eyebrow" value={data.hero?.eyebrow} onChange={(v) => update("hero.eyebrow", v)} />
                <Field label="Headline" value={data.hero?.headline} onChange={(v) => update("hero.headline", v)} textarea />
                <Field label="Summary" value={data.hero?.summary} onChange={(v) => update("hero.summary", v)} textarea />
                <Field label="Role" value={data.hero?.role} onChange={(v) => update("hero.role", v)} />
                <Field label="Location" value={data.hero?.location} onChange={(v) => update("hero.location", v)} />
                <p className="scm-sub-label">Proof Points</p>
                {data.hero?.proofPoints?.map((p, i) => (
                    <div key={i} className="scm-row">
                        <Field label="Value" value={p.value} onChange={(v) => update(`hero.proofPoints.${i}.value`, v)} small />
                        <Field label="Label" value={p.label} onChange={(v) => update(`hero.proofPoints.${i}.label`, v)} />
                    </div>
                ))}
            </fieldset>

            {/* EXPERTISE */}
            <fieldset className="scm-group">
                <legend>Expertise</legend>
                <label className="scm-toggle">
                    <input
                        type="checkbox"
                        checked={data.sectionsVisible?.expertise !== false}
                        onChange={(e) => update("sectionsVisible.expertise", e.target.checked)}
                    />
                    Visible
                </label>
                <Field label="Question" value={data.expertise?.question} onChange={(v) => update("expertise.question", v)} />
                <Field label="Title" value={data.expertise?.title} onChange={(v) => update("expertise.title", v)} />
                <Field label="Note" value={data.expertise?.note} onChange={(v) => update("expertise.note", v)} textarea />
                {data.expertise?.cards?.map((card, ci) => (
                    <div key={ci} className="scm-sub-group">
                        <p className="scm-sub-label">{card.tag}</p>
                        <Field label="Title" value={card.title} onChange={(v) => update(`expertise.cards.${ci}.title`, v)} />
                        <Field label="Desc" value={card.desc} onChange={(v) => update(`expertise.cards.${ci}.desc`, v)} textarea />
                    </div>
                ))}
            </fieldset>

            {/* CAREER */}
            <fieldset className="scm-group">
                <legend>Career</legend>
                <label className="scm-toggle">
                    <input
                        type="checkbox"
                        checked={data.sectionsVisible?.career !== false}
                        onChange={(e) => update("sectionsVisible.career", e.target.checked)}
                    />
                    Visible
                </label>
                <Field label="Question" value={data.career?.question} onChange={(v) => update("career.question", v)} />
                <Field label="Title" value={data.career?.title} onChange={(v) => update("career.title", v)} />
            </fieldset>

            {/* TESTIMONIAL */}
            <fieldset className="scm-group">
                <legend>Testimonial</legend>
                <label className="scm-toggle">
                    <input
                        type="checkbox"
                        checked={data.sectionsVisible?.testimonial !== false}
                        onChange={(e) => update("sectionsVisible.testimonial", e.target.checked)}
                    />
                    Visible
                </label>
                <Field label="Quote" value={data.testimonial?.quote} onChange={(v) => update("testimonial.quote", v)} textarea />
                <Field label="Author" value={data.testimonial?.author} onChange={(v) => update("testimonial.author", v)} />
                <Field label="Author Role" value={data.testimonial?.authorRole} onChange={(v) => update("testimonial.authorRole", v)} textarea />
            </fieldset>

            {/* EDUCATION */}
            <fieldset className="scm-group">
                <legend>Education</legend>
                <label className="scm-toggle">
                    <input
                        type="checkbox"
                        checked={data.sectionsVisible?.education !== false}
                        onChange={(e) => update("sectionsVisible.education", e.target.checked)}
                    />
                    Visible
                </label>
                <Field label="Question" value={data.education?.question} onChange={(v) => update("education.question", v)} />
                <Field label="Title" value={data.education?.title} onChange={(v) => update("education.title", v)} />
            </fieldset>

            {/* CONTACT */}
            <fieldset className="scm-group">
                <legend>Contact</legend>
                <label className="scm-toggle">
                    <input
                        type="checkbox"
                        checked={data.sectionsVisible?.contact !== false}
                        onChange={(e) => update("sectionsVisible.contact", e.target.checked)}
                    />
                    Visible
                </label>
                <Field label="Question" value={data.contact?.question} onChange={(v) => update("contact.question", v)} />
                <Field label="Title" value={data.contact?.title} onChange={(v) => update("contact.title", v)} />
                <Field label="Note" value={data.contact?.note} onChange={(v) => update("contact.note", v)} textarea />
                <Field label="Body" value={data.contact?.body} onChange={(v) => update("contact.body", v)} textarea />
                <Field label="CTA" value={data.contact?.cta} onChange={(v) => update("contact.cta", v)} />
            </fieldset>

            <style jsx>{`
        .scm { display: grid; gap: var(--space-4); }
        .scm-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }
        .scm-group {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          background: rgba(255, 255, 255, 0.4);
          display: grid;
          gap: var(--space-3);
        }
        .scm-group legend {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          padding: 0 8px;
        }
        .scm-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
        }
        .scm-toggle input { accent-color: var(--accent); width: 16px; height: 16px; }
        .scm-sub-label {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
        }
        .scm-row { display: flex; gap: var(--space-2); align-items: end; }
        .scm-sub-group {
          display: grid;
          gap: var(--space-2);
          padding: var(--space-2);
          border-left: 2px solid rgba(180, 93, 57, 0.12);
        }
      `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   FIELD COMPONENT
   ═══════════════════════════════════════════════════════════ */

function Field({ label, value, onChange, textarea, small }) {
    const Tag = textarea ? "textarea" : "input";
    return (
        <label className="field">
            <span className="field-label">{label}</span>
            <Tag
                className={`field-input ${small ? "field-small" : ""}`}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                rows={textarea ? 3 : undefined}
            />
            <style jsx>{`
        .field { display: grid; gap: 4px; }
        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .field-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.5);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--text);
          outline: none;
          resize: vertical;
          transition: border-color var(--transition);
        }
        .field-input:focus { border-color: var(--accent); }
        .field-small { max-width: 120px; }
      `}</style>
        </label>
    );
}

/* ═══════════════════════════════════════════════════════════
   BLOG MANAGER (with AI Writing Assistant)
   ═══════════════════════════════════════════════════════════ */

function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [mode, setMode] = useState("list");
    const [editPost, setEditPost] = useState(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState("");
    const [status, setStatus] = useState("draft");
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [aiOpen, setAiOpen] = useState(false);
    const saveTimerRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    // Auto-save draft
    useEffect(() => {
        if (mode !== "edit") return;
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            const draft = { title, body, tags, status, editId: editPost?.id || null };
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
            setLastSaved(new Date());
        }, 2000);
        return () => clearTimeout(saveTimerRef.current);
    }, [title, body, tags, status, mode, editPost]);

    // Recover draft
    useEffect(() => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
            try {
                const draft = JSON.parse(saved);
                if (draft.title || draft.body) {
                    setTitle(draft.title || "");
                    setBody(draft.body || "");
                    setTags(draft.tags || "");
                    setStatus(draft.status || "draft");
                    if (draft.editId) setEditPost({ id: draft.editId });
                    setMode("edit");
                }
            } catch { /* ignore */ }
        }
    }, []);

    function slugify(text) {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
    }

    function startNew() {
        setEditPost(null);
        setTitle("");
        setBody("");
        setTags("");
        setStatus("draft");
        setAiOpen(false);
        localStorage.removeItem(DRAFT_KEY);
        setMode("edit");
    }

    function startEdit(post) {
        setEditPost(post);
        setTitle(post.title || "");
        setBody(post.body || "");
        setTags((post.tags || []).join(", "));
        setStatus(post.status || "draft");
        setAiOpen(false);
        setMode("edit");
    }

    function cancelEdit() {
        setMode("list");
        setAiOpen(false);
        localStorage.removeItem(DRAFT_KEY);
        setLastSaved(null);
    }

    async function handleSave() {
        if (!title.trim()) return alert("Title is required.");
        setSaving(true);
        const tagArr = tags.split(",").map((t) => t.trim()).filter(Boolean);
        const postData = {
            title: title.trim(),
            body,
            tags: tagArr,
            status,
            slug: slugify(title),
            updatedAt: serverTimestamp(),
        };

        try {
            if (editPost?.id) {
                await updateDoc(doc(db, "posts", editPost.id), postData);
            } else {
                postData.createdAt = serverTimestamp();
                await addDoc(collection(db, "posts"), postData);
            }
            localStorage.removeItem(DRAFT_KEY);
            setMode("list");
            setAiOpen(false);
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save.");
        }
        setSaving(false);
    }

    async function handleDelete(postId) {
        if (!confirm("Delete this post permanently?")) return;
        try {
            await deleteDoc(doc(db, "posts", postId));
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    if (mode === "edit") {
        return (
            <div className={`bm-workspace ${aiOpen ? "ai-panel-open" : ""}`}>
                <div className="bm-editor">
                    <div className="bm-editor-top">
                        <button className="button button-secondary" onClick={cancelEdit}>← Back</button>
                        <div className="bm-editor-actions">
                            <button
                                className={`bm-ai-trigger ${aiOpen ? "active" : ""}`}
                                onClick={() => setAiOpen(!aiOpen)}
                                title="AI Writing Assistant"
                            >
                                <span className="bm-ai-sparkle">✦</span>
                                {aiOpen ? "Close AI" : "Write with AI"}
                            </button>
                            <select
                                className="bm-status-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                            <button className="button button-primary" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving…" : "Save"}
                            </button>
                        </div>
                    </div>

                    {lastSaved && (
                        <p className="bm-autosave">
                            Draft auto-saved {lastSaved.toLocaleTimeString()}
                        </p>
                    )}

                    <input
                        className="bm-title-input"
                        placeholder="Post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="bm-tags-input"
                        placeholder="Tags (comma-separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                    <textarea
                        className="bm-body-input"
                        placeholder="Write your post (HTML supported)…"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={20}
                    />
                </div>

                {aiOpen && (
                    <AIChatPanel
                        title={title}
                        body={body}
                        tags={tags}
                        onInsert={(text) => setBody((prev) => prev + "\n" + text)}
                        onReplace={(text) => setBody(text)}
                        onClose={() => setAiOpen(false)}
                    />
                )}

                <style jsx>{`
          .bm-workspace {
            display: grid;
            gap: var(--space-3);
            transition: all var(--transition);
          }
          .bm-workspace.ai-panel-open {
            grid-template-columns: 1fr 420px;
            gap: var(--space-4);
          }
          .bm-editor { display: grid; gap: var(--space-3); align-content: start; min-width: 0; }
          .bm-editor-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2); }
          .bm-editor-actions { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
          .bm-autosave { margin: 0; font-size: 0.75rem; color: var(--tertiary); }
          .bm-ai-trigger {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 9px 16px;
            border: 1px solid rgba(180, 93, 57, 0.2);
            border-radius: 999px;
            background: linear-gradient(135deg, rgba(180, 93, 57, 0.06), rgba(180, 93, 57, 0.12));
            color: var(--accent);
            font-family: var(--font-body);
            font-size: 0.8125rem;
            font-weight: 700;
            cursor: pointer;
            transition: all var(--transition);
          }
          .bm-ai-trigger:hover {
            background: linear-gradient(135deg, rgba(180, 93, 57, 0.12), rgba(180, 93, 57, 0.2));
            border-color: rgba(180, 93, 57, 0.36);
            transform: translateY(-1px);
          }
          .bm-ai-trigger.active {
            background: var(--accent);
            border-color: var(--accent);
            color: white;
          }
          .bm-ai-sparkle {
            font-size: 0.9rem;
            line-height: 1;
          }
          .bm-status-select {
            padding: 8px 14px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: rgba(255,255,255,0.5);
            font-family: var(--font-body);
            font-size: 0.875rem;
            color: var(--text);
          }
          .bm-title-input, .bm-tags-input, .bm-body-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: 12px;
            background: rgba(255,255,255,0.5);
            font-family: var(--font-body);
            font-size: 1rem;
            color: var(--text);
            outline: none;
            transition: border-color var(--transition);
          }
          .bm-title-input:focus, .bm-tags-input:focus, .bm-body-input:focus { border-color: var(--accent); }
          .bm-title-input {
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 350;
          }
          .bm-tags-input { font-size: 0.875rem; }
          .bm-body-input { resize: vertical; min-height: 300px; line-height: 1.7; }
          @media (max-width: 920px) {
            .bm-workspace.ai-panel-open {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="bm">
            <button className="button button-primary" onClick={startNew}>+ New Post</button>

            <div className="bm-list">
                {posts.length === 0 && (
                    <p className="bm-empty">No posts yet. Create your first entry.</p>
                )}
                {posts.map((post) => (
                    <div key={post.id} className="bm-post">
                        <div className="bm-post-info">
                            <span className={`bm-badge ${post.status === "published" ? "bm-badge--pub" : ""}`}>
                                {post.status || "draft"}
                            </span>
                            <h3 className="bm-post-title">{post.title}</h3>
                        </div>
                        <div className="bm-post-actions">
                            <button className="bm-act" onClick={() => startEdit(post)}>Edit</button>
                            <button className="bm-act bm-act--del" onClick={() => handleDelete(post.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .bm { display: grid; gap: var(--space-4); }
        .bm-list { display: grid; gap: var(--space-2); }
        .bm-empty { color: var(--muted); font-size: 0.9375rem; margin: 0; }
        .bm-post {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.4);
        }
        .bm-post-info { display: flex; align-items: center; gap: var(--space-2); min-width: 0; }
        .bm-badge {
          flex-shrink: 0;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(122,103,83,0.1);
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
        }
        .bm-badge--pub { background: rgba(180,93,57,0.1); color: var(--accent); }
        .bm-post-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bm-post-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .bm-act {
          padding: 6px 14px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: transparent;
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
          transition: all var(--transition);
        }
        .bm-act:hover { border-color: rgba(180,93,57,0.24); color: var(--accent); }
        .bm-act--del:hover { border-color: rgba(192,57,43,0.24); color: #c0392b; }
      `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   AI CHAT PANEL
   ═══════════════════════════════════════════════════════════ */

const AI_SUGGESTIONS = [
    "Write a full blog post about this topic",
    "Give me 5 blog post ideas for my niche",
    "Rewrite the current post to be more engaging",
    "Add a compelling introduction",
    "Summarize the current post in 2 paragraphs",
];

function AIChatPanel({ title, body, tags, onInsert, onReplace, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Focus input on mount
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 200);
    }, []);

    async function sendMessage(text) {
        if (!text.trim() || loading) return;
        setError(null);

        const userMsg = { role: "user", text: text.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newMessages,
                    context: { title, body, tags },
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Error ${res.status}`);
            }

            const data = await res.json();
            const aiMsg = { role: "model", text: data.text || "I wasn't able to generate a response. Try again?" };
            setMessages([...newMessages, aiMsg]);
        } catch (err) {
            console.error("AI error:", err);
            setError(err.message || "Something went wrong. Try again.");
        }
        setLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    }

    function handleSuggestion(suggestion) {
        sendMessage(suggestion);
    }

    function clearChat() {
        setMessages([]);
        setError(null);
        inputRef.current?.focus();
    }

    const hasConversation = messages.length > 0;

    return (
        <div className="ai-panel">
            {/* Panel Header */}
            <div className="ai-header">
                <div className="ai-header-left">
                    <span className="ai-header-sparkle">✦</span>
                    <h3 className="ai-header-title">AI Assistant</h3>
                </div>
                <div className="ai-header-actions">
                    {hasConversation && (
                        <button className="ai-clear" onClick={clearChat} title="New conversation">
                            ↻
                        </button>
                    )}
                    <button className="ai-close" onClick={onClose} title="Close panel">
                        ✕
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="ai-messages" ref={scrollRef}>
                {!hasConversation && !loading && (
                    <div className="ai-welcome">
                        <p className="ai-welcome-text">
                            I can help you write, refine, or brainstorm your blog post.
                            Try one of these or ask anything:
                        </p>
                        <div className="ai-suggestions">
                            {AI_SUGGESTIONS.map((s, i) => (
                                <button
                                    key={i}
                                    className="ai-suggestion"
                                    onClick={() => handleSuggestion(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`ai-msg ai-msg--${msg.role}`}>
                        <div className="ai-msg-marker">
                            {msg.role === "user" ? "You" : "✦ AI"}
                        </div>
                        {msg.role === "model" ? (
                            <>
                                <div
                                    className="ai-msg-content ai-msg-html"
                                    dangerouslySetInnerHTML={{ __html: msg.text }}
                                />
                                <div className="ai-msg-actions">
                                    <button
                                        className="ai-action"
                                        onClick={() => onReplace(msg.text)}
                                        title="Replace the entire post body with this content"
                                    >
                                        ↳ Use as post
                                    </button>
                                    <button
                                        className="ai-action"
                                        onClick={() => onInsert(msg.text)}
                                        title="Append this content to the end of your post"
                                    >
                                        + Insert at end
                                    </button>
                                    <button
                                        className="ai-action"
                                        onClick={() => { navigator.clipboard.writeText(msg.text); }}
                                        title="Copy raw HTML to clipboard"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="ai-msg-content">{msg.text}</div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="ai-msg ai-msg--model">
                        <div className="ai-msg-marker">✦ AI</div>
                        <div className="ai-msg-content">
                            <div className="ai-typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="ai-error">
                        <span>⚠</span> {error}
                        <button className="ai-retry" onClick={() => {
                            const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                            if (lastUserMsg) {
                                setMessages(messages.slice(0, -0)); // keep all
                                sendMessage(lastUserMsg.text);
                            }
                        }}>
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="ai-input-area">
                <textarea
                    ref={inputRef}
                    className="ai-input"
                    placeholder="Ask AI to write, refine, or brainstorm…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={loading}
                />
                <button
                    className="ai-send"
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    title="Send message"
                >
                    ↑
                </button>
            </div>

            <style jsx>{`
        .ai-panel {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 160px);
          max-height: 820px;
          position: sticky;
          top: 100px;
          border: 1px solid rgba(180, 93, 57, 0.16);
          border-radius: var(--radius-lg);
          background: linear-gradient(180deg, rgba(255, 252, 247, 0.95), rgba(249, 242, 233, 0.92));
          box-shadow: 0 24px 64px rgba(64, 44, 31, 0.12);
          backdrop-filter: blur(20px);
          overflow: hidden;
          animation: ai-slide-in 320ms cubic-bezier(0.19, 1, 0.22, 1) both;
        }
        @keyframes ai-slide-in {
          from { opacity: 0; transform: translateX(24px) scale(0.97); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }

        /* Header */
        .ai-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(122, 103, 83, 0.08);
          flex-shrink: 0;
        }
        .ai-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ai-header-sparkle {
          color: var(--accent);
          font-size: 1.1rem;
        }
        .ai-header-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .ai-header-actions {
          display: flex;
          gap: 4px;
        }
        .ai-clear, .ai-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--muted);
          font-size: 1rem;
          cursor: pointer;
          transition: all var(--transition);
        }
        .ai-clear:hover, .ai-close:hover {
          background: rgba(122, 103, 83, 0.08);
          color: var(--text);
        }

        /* Messages */
        .ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(180, 93, 57, 0.2) transparent;
        }

        /* Welcome */
        .ai-welcome {
          display: grid;
          gap: 16px;
        }
        .ai-welcome-text {
          margin: 0;
          font-size: 0.9375rem;
          color: var(--muted);
          line-height: 1.6;
        }
        .ai-suggestions {
          display: grid;
          gap: 6px;
        }
        .ai-suggestion {
          display: block;
          width: 100%;
          text-align: left;
          padding: 11px 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.4);
          color: var(--text);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          line-height: 1.3;
        }
        .ai-suggestion:hover {
          background: rgba(180, 93, 57, 0.06);
          border-color: rgba(180, 93, 57, 0.16);
          transform: translateX(4px);
        }

        /* Message bubbles */
        .ai-msg {
          display: grid;
          gap: 8px;
        }
        .ai-msg-marker {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--tertiary);
        }
        .ai-msg--model .ai-msg-marker {
          color: var(--accent);
        }
        .ai-msg-content {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--text);
        }
        .ai-msg--user .ai-msg-content {
          padding: 12px 16px;
          border-radius: 16px 16px 4px 16px;
          background: var(--primary);
          color: var(--surface-solid);
        }

        /* AI response actions */
        .ai-msg-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .ai-action {
          padding: 6px 12px;
          border: 1px solid rgba(180, 93, 57, 0.16);
          border-radius: 8px;
          background: rgba(180, 93, 57, 0.04);
          color: var(--accent);
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }
        .ai-action:hover {
          background: rgba(180, 93, 57, 0.12);
          border-color: rgba(180, 93, 57, 0.28);
          transform: translateY(-1px);
        }

        /* Typing indicator */
        .ai-typing {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }
        .ai-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.4;
          animation: ai-dot 1.2s ease-in-out infinite;
        }
        .ai-typing span:nth-child(2) { animation-delay: 0.2s; }
        .ai-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ai-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* Error */
        .ai-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(192, 57, 43, 0.06);
          border: 1px solid rgba(192, 57, 43, 0.12);
          color: #c0392b;
          font-size: 0.8125rem;
          font-weight: 500;
        }
        .ai-retry {
          margin-left: auto;
          padding: 4px 10px;
          border: 1px solid rgba(192, 57, 43, 0.2);
          border-radius: 6px;
          background: transparent;
          color: #c0392b;
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .ai-retry:hover { background: rgba(192, 57, 43, 0.08); }

        /* Input area */
        .ai-input-area {
          display: flex;
          gap: 8px;
          align-items: end;
          padding: 14px 16px;
          border-top: 1px solid rgba(122, 103, 83, 0.08);
          flex-shrink: 0;
        }
        .ai-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.6);
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--text);
          outline: none;
          resize: none;
          line-height: 1.5;
          max-height: 120px;
          transition: border-color var(--transition);
        }
        .ai-input:focus { border-color: var(--accent); }
        .ai-input::placeholder { color: var(--tertiary); }
        .ai-send {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 12px;
          background: var(--accent);
          color: white;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
        }
        .ai-send:hover:not(:disabled) {
          background: var(--accent-deep);
          transform: translateY(-1px);
        }
        .ai-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 920px) {
          .ai-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: min(420px, 100vw);
            max-height: 100vh;
            height: 100vh;
            border-radius: var(--radius-lg) 0 0 var(--radius-lg);
            z-index: 100;
          }
        }
      `}</style>

            <style jsx global>{`
        .ai-msg-html p { margin: 0 0 0.8em; }
        .ai-msg-html p:last-child { margin-bottom: 0; }
        .ai-msg-html h2, .ai-msg-html h3 {
          font-family: var(--font-display);
          margin: 1em 0 0.4em;
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .ai-msg-html h2 { font-size: 1.1rem; }
        .ai-msg-html h3 { font-size: 1rem; }
        .ai-msg-html ul, .ai-msg-html ol {
          padding-left: 1.2em;
          margin: 0 0 0.8em;
        }
        .ai-msg-html li { margin-bottom: 0.3em; }
        .ai-msg-html strong { font-weight: 600; }
        .ai-msg-html blockquote {
          margin: 0.8em 0;
          padding: 8px 12px;
          border-left: 2px solid var(--accent);
          color: var(--muted);
          font-style: italic;
        }
        .ai-msg-html code {
          padding: 1px 4px;
          background: rgba(122, 103, 83, 0.08);
          border-radius: 3px;
          font-size: 0.88em;
        }
      `}</style>
        </div>
    );
}
