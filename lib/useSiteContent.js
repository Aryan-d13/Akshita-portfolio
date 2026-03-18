"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { defaultSiteContent } from "./seedContent";

/**
 * Reads siteContent/home from Firestore with real-time updates.
 * Returns hardcoded defaults immediately (no loading skeleton).
 * Silently hydrates from Firestore when data arrives.
 */
export function useSiteContent() {
    const [data, setData] = useState(defaultSiteContent);

    useEffect(() => {
        let unsub;
        try {
            unsub = onSnapshot(
                doc(db, "siteContent", "home"),
                (snap) => {
                    if (snap.exists()) {
                        // Deep-merge Firestore data with defaults so missing fields fall back
                        setData((prev) => mergeDeep(defaultSiteContent, snap.data()));
                    }
                },
                (err) => {
                    // Firestore unreachable — keep defaults, no crash
                    console.warn("siteContent listener error:", err.message);
                }
            );
        } catch {
            // Firebase not configured — keep defaults silently
        }
        return () => unsub && unsub();
    }, []);

    return data;
}

/** Simple recursive merge: base values filled by override values */
function mergeDeep(base, override) {
    if (!override) return base;
    if (typeof base !== "object" || base === null) return override;
    if (Array.isArray(override)) return override; // Arrays are replaced wholesale

    const result = { ...base };
    for (const key of Object.keys(override)) {
        if (key in base && typeof base[key] === "object" && !Array.isArray(base[key])) {
            result[key] = mergeDeep(base[key], override[key]);
        } else {
            result[key] = override[key];
        }
    }
    return result;
}
