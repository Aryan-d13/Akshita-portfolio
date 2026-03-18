"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sectionLinks = [
    { href: "/", label: "Overview" },
    { href: "/#expertise", label: "Expertise" },
    { href: "/#career", label: "Career" },
    { href: "/#education", label: "Foundation" },
    { href: "/#contact", label: "Contact" },
];

const pageLinks = [
    { href: "/", label: "Home", icon: "⌂" },
    { href: "/blog", label: "Journal", icon: "✎" },
];

export default function Rail() {
    const pathname = usePathname();

    function isActive(href) {
        if (href === "/" && pathname === "/") return true;
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    }

    const isHome = pathname === "/";

    return (
        <aside className="rail">
            {/* Identity Block */}
            <div className="rail-identity">
                <div className="portrait-shell">
                    <Image
                        src="/Gemini_Generated_Image_fftspffftspfffts.webp"
                        alt="Akshita Agrawal"
                        className="profile-photo"
                        width={360}
                        height={441}
                        priority
                    />
                </div>

                <div className="rail-title-block">
                    <h1 className="rail-title">
                        Akshita
                        <br />
                        Agrawal
                    </h1>
                    <p className="eyebrow-accent">Indore, India</p>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="rail-scroll-area">
                <div className="rail-copy">
                    <p className="rail-subtitle">
                        Sr. Payroll Executive & HR Systems Architect
                    </p>
                </div>

                <nav className="page-nav" aria-label="Global Navigation">
                    {pageLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`page-nav-item ${isActive(item.href) ? "active" : ""}`}
                            title={item.label}
                        >
                            <span className="page-nav-icon" aria-hidden="true">{item.icon}</span>
                            <span className="page-nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {isHome && (
                    <nav className="section-nav" aria-label="Page Sections">
                        {sectionLinks.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={item.href === "/" && pathname === "/" ? "active" : ""}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </aside>
    );
}
