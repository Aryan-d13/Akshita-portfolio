"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const ADMIN_PASSWORD = "akshita2025";
const AUTH_KEY = "portfolio_admin_auth";

/* ═══════════════════════════════════════════════════════════
   ADMIN PANEL (Top-Level)
   ═══════════════════════════════════════════════════════════ */

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("photos");

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
    <div className="admin-shell">
      <div className="admin-header">
        <Link href="/" className="admin-home-btn" title="Back to Portfolio Home">
          ⌂
        </Link>
        <h1 className="admin-title">Admin</h1>
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === "photos" ? "active" : ""}`}
            onClick={() => setTab("photos")}
          >
            Photos
          </button>
          <button
            className={`admin-tab ${tab === "blog" ? "active" : ""}`}
            onClick={() => setTab("blog")}
          >
            Blog
          </button>
        </div>
        <button
          className="admin-logout"
          onClick={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
          }}
        >
          Log out
        </button>
      </div>

      {tab === "photos" ? <PhotoManager /> : <BlogManager />}

      <style jsx>{`
        .admin-shell {
          max-width: 960px;
          margin: 0 auto;
          padding: var(--space-5) var(--space-3);
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        .admin-header {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
          flex-wrap: wrap;
        }

        .admin-home-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--primary);
          color: var(--surface-solid);
          font-size: 1.25rem;
          text-decoration: none;
          transition: all var(--transition);
          box-shadow: 0 4px 12px rgba(36, 26, 22, 0.2);
        }

        .admin-home-btn:hover {
          transform: translateY(-2px);
          background: var(--accent);
          box-shadow: 0 6px 16px rgba(180, 93, 57, 0.3);
        }

        .admin-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 350;
          letter-spacing: -0.03em;
        }

        .admin-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(122, 103, 83, 0.08);
        }

        .admin-tab {
          padding: 10px 20px;
          border: none;
          border-radius: 999px;
          background: transparent;
          color: var(--muted);
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }

        .admin-tab.active {
          background: var(--surface-solid);
          color: var(--text);
          box-shadow: 0 2px 8px rgba(64, 44, 31, 0.1);
        }

        .admin-logout {
          margin-left: auto;
          padding: 8px 18px;
          border: 1px solid rgba(122, 103, 83, 0.16);
          border-radius: 999px;
          background: transparent;
          color: var(--muted);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
        }

        .admin-logout:hover {
          border-color: rgba(180, 93, 57, 0.3);
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          autoComplete="current-password"
        />
        {error && (
          <p className="gate-error-msg">
            Wrong password. Try again.
          </p>
        )}
        <button className="button button-primary gate-btn" type="submit">
          Enter
        </button>
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
          width: min(380px, 100%);
          padding: var(--space-6);
          border: 1px solid rgba(122, 103, 83, 0.14);
          border-radius: var(--radius-lg);
          background: var(--panel-bg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(18px);
          text-align: center;
        }

        .gate-title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 350;
          letter-spacing: -0.04em;
        }

        .gate-sub {
          margin: 0;
          color: var(--muted);
          font-size: 0.9375rem;
        }

        .gate-input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid rgba(122, 103, 83, 0.18);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.5);
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--text);
          outline: none;
          transition: border-color var(--transition);
        }

        .gate-input:focus {
          border-color: var(--accent);
        }

        .gate-input.gate-error {
          border-color: #c0392b;
        }

        .gate-error-msg {
          color: #c0392b;
          font-size: 0.8125rem;
          font-weight: 600;
          margin: 0;
        }

        .gate-btn {
          width: 100%;
          justify-content: center;
          margin-top: var(--space-1);
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PHOTO MANAGER
   ═══════════════════════════════════════════════════════════ */

function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "photos"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  function handleFiles(files) {
    const images = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    images.forEach(uploadFile);
  }

  function uploadFile(file) {
    const id = Math.random().toString(36).slice(2);
    const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    setUploading((prev) => [...prev, { id, name: file.name, progress: 0 }]);

    task.on(
      "state_changed",
      (snap) => {
        const progress = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setUploading((prev) =>
          prev.map((u) => (u.id === id ? { ...u, progress } : u))
        );
      },
      (err) => {
        console.error("Upload error:", err);
        setUploading((prev) => prev.filter((u) => u.id !== id));
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        // Get image dimensions
        const img = new window.Image();
        img.onload = async () => {
          await addDoc(collection(db, "photos"), {
            url,
            caption: "",
            tags: [],
            width: img.naturalWidth,
            height: img.naturalHeight,
            storagePath: storageRef.fullPath,
            createdAt: serverTimestamp(),
          });
          setUploading((prev) => prev.filter((u) => u.id !== id));
        };
        img.src = url;
      }
    );
  }

  async function handleDelete(photo) {
    if (!confirm("Delete this photo permanently?")) return;
    try {
      if (photo.storagePath) {
        const storageRef = ref(storage, photo.storagePath);
        await deleteObject(storageRef);
      }
      await deleteDoc(doc(db, "photos", photo.id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  async function handleCaptionSave(photo) {
    await updateDoc(doc(db, "photos", photo.id), { caption: editCaption });
    setEditingId(null);
    setEditCaption("");
  }

  return (
    <div className="pm">
      {/* Drop zone */}
      <div
        className={`pm-dropzone ${dragOver ? "pm-dropzone-active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="pm-dropzone-icon">
          {dragOver ? "↓" : "+"}
        </span>
        <p className="pm-dropzone-text">
          {dragOver
            ? "Drop to upload"
            : "Drag photos here or click to browse"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="pm-uploads">
          {uploading.map((u) => (
            <div key={u.id} className="pm-upload-item">
              <span className="pm-upload-name">{u.name}</span>
              <div className="pm-progress-track">
                <div
                  className="pm-progress-fill"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
              <span className="pm-upload-pct">{u.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Photo grid */}
      <div className="pm-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="pm-card">
            <img src={photo.url} alt={photo.caption || ""} className="pm-img" />
            <div className="pm-card-actions">
              {editingId === photo.id ? (
                <div className="pm-caption-edit">
                  <input
                    className="pm-caption-input"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Add caption..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCaptionSave(photo);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                  />
                  <button
                    className="pm-btn pm-btn-save"
                    onClick={() => handleCaptionSave(photo)}
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <>
                  <span className="pm-caption-text">
                    {photo.caption || "No caption"}
                  </span>
                  <button
                    className="pm-btn"
                    onClick={() => {
                      setEditingId(photo.id);
                      setEditCaption(photo.caption || "");
                    }}
                    title="Edit caption"
                  >
                    ✎
                  </button>
                  <button
                    className="pm-btn pm-btn-delete"
                    onClick={() => handleDelete(photo)}
                    title="Delete photo"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pm {
          display: grid;
          gap: var(--space-4);
        }

        .pm-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          min-height: 180px;
          border: 2px dashed rgba(122, 103, 83, 0.22);
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all var(--transition);
        }

        .pm-dropzone:hover {
          border-color: rgba(180, 93, 57, 0.3);
          background: rgba(180, 93, 57, 0.04);
        }

        .pm-dropzone-active {
          border-color: var(--accent) !important;
          background: rgba(180, 93, 57, 0.08) !important;
          transform: scale(1.01);
        }

        .pm-dropzone-icon {
          font-size: 2.4rem;
          color: var(--accent);
          line-height: 1;
          font-weight: 300;
        }

        .pm-dropzone-text {
          margin: 0;
          color: var(--muted);
          font-size: 0.9375rem;
        }

        .pm-uploads {
          display: grid;
          gap: var(--space-2);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(122, 103, 83, 0.1);
        }

        .pm-upload-item {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .pm-upload-name {
          font-size: 0.8125rem;
          color: var(--muted);
          min-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pm-progress-track {
          flex: 1;
          height: 6px;
          border-radius: 999px;
          background: rgba(122, 103, 83, 0.1);
          overflow: hidden;
        }

        .pm-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-deep));
          border-radius: 999px;
          transition: width 200ms ease;
        }

        .pm-upload-pct {
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 700;
          min-width: 36px;
          text-align: right;
        }

        .pm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-3);
        }

        .pm-card {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(122, 103, 83, 0.12);
          background: var(--surface-solid);
          box-shadow: var(--shadow-soft);
        }

        .pm-img {
          display: block;
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
        }

        .pm-card-actions {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2);
        }

        .pm-caption-text {
          flex: 1;
          font-size: 0.8125rem;
          color: var(--muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pm-caption-edit {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .pm-caption-input {
          flex: 1;
          padding: 6px 10px;
          border: 1px solid rgba(122, 103, 83, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.6);
          font-family: var(--font-body);
          font-size: 0.8125rem;
          outline: none;
        }

        .pm-caption-input:focus {
          border-color: var(--accent);
        }

        .pm-btn {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(122, 103, 83, 0.12);
          border-radius: 8px;
          background: transparent;
          color: var(--muted);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition);
        }

        .pm-btn:hover {
          background: rgba(180, 93, 57, 0.08);
          color: var(--accent);
          border-color: rgba(180, 93, 57, 0.2);
        }

        .pm-btn-save {
          color: #27ae60;
          border-color: rgba(39, 174, 96, 0.2);
        }

        .pm-btn-save:hover {
          background: rgba(39, 174, 96, 0.08);
          color: #27ae60;
        }

        .pm-btn-delete:hover {
          background: rgba(192, 57, 43, 0.08);
          color: #c0392b;
          border-color: rgba(192, 57, 43, 0.2);
        }

        @media (max-width: 560px) {
          .pm-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BLOG MANAGER
   ═══════════════════════════════════════════════════════════ */

const DRAFT_STORAGE_KEY = "portfolio_blog_draft";

function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState("list"); // list | edit
  const [editPost, setEditPost] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimerRef = useRef(null);

  // Load posts
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // Auto-save draft to localStorage every 3 seconds
  useEffect(() => {
    if (mode !== "edit") return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const draft = { title, body, tags, status, editId: editPost?.id || null };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    }, 3000);
    return () => clearTimeout(saveTimerRef.current);
  }, [title, body, tags, status, mode, editPost]);

  // Recover draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.title || draft.body) {
          setTitle(draft.title || "");
          setBody(draft.body || "");
          setTags(draft.tags || "");
          setStatus(draft.status || "draft");
          if (draft.editId) {
            setEditPost({ id: draft.editId });
          }
          setMode("edit");
        }
      } catch {
        // ignore
      }
    }
  }, []);

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  function startNew() {
    setEditPost(null);
    setTitle("");
    setBody("");
    setTags("");
    setStatus("draft");
    setMode("edit");
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }

  function startEdit(post) {
    setEditPost(post);
    setTitle(post.title || "");
    setBody(post.body || "");
    setTags((post.tags || []).join(", "));
    setStatus(post.status || "draft");
    setMode("edit");
  }

  function cancelEdit() {
    setMode("list");
    setEditPost(null);
    setTitle("");
    setBody("");
    setTags("");
    setStatus("draft");
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);

    const tagArr = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const slug = slugify(title);
    const excerpt = body.replace(/<[^>]+>/g, "").slice(0, 200);

    const data = {
      title: title.trim(),
      slug,
      body,
      excerpt,
      tags: tagArr,
      status,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editPost?.id) {
        await updateDoc(doc(db, "posts", editPost.id), data);
      } else {
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, "posts"), data);
      }
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      cancelEdit();
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed. Your draft is safe in local storage.");
    }
    setSaving(false);
  }

  async function handleDelete(post) {
    if (!confirm(`Delete "${post.title}" permanently?`)) return;
    try {
      await deleteDoc(doc(db, "posts", post.id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (mode === "edit") {
    return (
      <div className="be">
        <div className="be-toolbar">
          <button className="pm-btn" onClick={cancelEdit} title="Go back">
            ←
          </button>
          <span className="be-toolbar-title">
            {editPost ? "Edit Post" : "New Post"}
          </span>
          {lastSaved && (
            <span className="be-autosave">
              Draft saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          <div className="be-toolbar-right">
            <select
              className="be-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button
              className="button button-primary be-save-btn"
              onClick={handleSave}
              disabled={saving || !title.trim()}
            >
              {saving ? "Saving…" : status === "published" ? "Publish" : "Save Draft"}
            </button>
          </div>
        </div>

        <input
          className="be-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          autoFocus
        />

        <input
          className="be-tags-input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)..."
        />

        <div className="be-editor-area">
          <div className="be-edit-col">
            <label className="be-label">Write (HTML supported)</label>
            <textarea
              className="be-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="<p>Start writing...</p>"
              spellCheck
            />
          </div>
          <div className="be-preview-col">
            <label className="be-label">Preview</label>
            <div
              className="be-preview post-body"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          </div>
        </div>

        <style jsx>{`
          .be {
            display: grid;
            gap: var(--space-3);
          }

          .be-toolbar {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            flex-wrap: wrap;
          }

          .be-toolbar-title {
            font-weight: 600;
            font-size: 0.9375rem;
          }

          .be-autosave {
            font-size: 0.75rem;
            color: var(--tertiary);
            font-style: italic;
          }

          .be-toolbar-right {
            margin-left: auto;
            display: flex;
            gap: var(--space-2);
            align-items: center;
          }

          .be-status-select {
            padding: 8px 14px;
            border: 1px solid rgba(122, 103, 83, 0.18);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.5);
            font-family: var(--font-body);
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--text);
            cursor: pointer;
          }

          .be-save-btn {
            min-height: 40px;
            padding: 0 20px;
            font-size: 0.8125rem;
          }

          .be-save-btn:disabled {
            opacity: 0.5;
            pointer-events: none;
          }

          .be-title-input {
            width: 100%;
            padding: 16px 0;
            border: none;
            border-bottom: 2px solid rgba(122, 103, 83, 0.12);
            background: transparent;
            font-family: var(--font-display);
            font-size: clamp(1.6rem, 3vw, 2.4rem);
            font-weight: 350;
            letter-spacing: -0.03em;
            color: var(--text);
            outline: none;
            transition: border-color var(--transition);
          }

          .be-title-input:focus {
            border-color: var(--accent);
          }

          .be-tags-input {
            width: 100%;
            padding: 10px 0;
            border: none;
            border-bottom: 1px solid rgba(122, 103, 83, 0.1);
            background: transparent;
            font-family: var(--font-body);
            font-size: 0.875rem;
            color: var(--muted);
            outline: none;
          }

          .be-tags-input:focus {
            border-color: var(--accent);
          }

          .be-editor-area {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-3);
            min-height: 500px;
          }

          .be-label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: var(--space-1);
          }

          .be-textarea {
            width: 100%;
            min-height: 460px;
            padding: var(--space-3);
            border: 1px solid rgba(122, 103, 83, 0.16);
            border-radius: var(--radius-sm);
            background: rgba(255, 255, 255, 0.5);
            font-family: var(--font-body);
            font-size: 0.9375rem;
            line-height: 1.7;
            color: var(--text);
            resize: vertical;
            outline: none;
            transition: border-color var(--transition);
          }

          .be-textarea:focus {
            border-color: var(--accent);
          }

          .be-preview {
            padding: var(--space-3);
            border: 1px solid rgba(122, 103, 83, 0.1);
            border-radius: var(--radius-sm);
            background: rgba(255, 255, 255, 0.3);
            min-height: 460px;
            overflow-y: auto;
          }

          @media (max-width: 720px) {
            .be-editor-area {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bl">
      <div className="bl-header">
        <button className="button button-primary" onClick={startNew}>
          + New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bl-empty">
          <p>No blog posts yet. Click &ldquo;New Post&rdquo; to write one.</p>
        </div>
      ) : (
        <div className="bl-list">
          {posts.map((post) => (
            <div key={post.id} className="bl-card">
              <div className="bl-card-info">
                <span
                  className={`bl-status ${post.status === "published" ? "bl-published" : "bl-draft"
                    }`}
                >
                  {post.status}
                </span>
                <h3 className="bl-card-title">{post.title}</h3>
                <span className="bl-card-date">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <div className="bl-card-actions">
                <button
                  className="pm-btn"
                  onClick={() => startEdit(post)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="pm-btn pm-btn-delete"
                  onClick={() => handleDelete(post)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .bl {
          display: grid;
          gap: var(--space-4);
        }

        .bl-header {
          display: flex;
          justify-content: flex-end;
        }

        .bl-empty {
          text-align: center;
          padding: var(--space-8) var(--space-4);
          color: var(--muted);
        }

        .bl-list {
          display: grid;
          gap: var(--space-2);
        }

        .bl-card {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border: 1px solid rgba(122, 103, 83, 0.12);
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.5);
          transition: transform var(--transition), box-shadow var(--transition);
        }

        .bl-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-soft);
        }

        .bl-card-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-2);
          min-width: 0;
        }

        .bl-status {
          flex-shrink: 0;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .bl-published {
          background: rgba(39, 174, 96, 0.12);
          color: #27ae60;
        }

        .bl-draft {
          background: rgba(180, 93, 57, 0.1);
          color: var(--accent);
        }

        .bl-card-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          min-width: 0;
        }

        .bl-card-date {
          flex-shrink: 0;
          font-size: 0.8125rem;
          color: var(--tertiary);
        }

        .bl-card-actions {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        @media (max-width: 560px) {
          .bl-card-info {
            flex-wrap: wrap;
          }
          .bl-card-date {
            width: 100%;
            order: -1;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
