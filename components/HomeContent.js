"use client";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { useSiteContent } from "@/lib/useSiteContent";

export default function HomeContent() {
    const site = useSiteContent();
    const vis = site.sectionsVisible || {};

    return (
        <>
            {/* ═══════════════ HERO / STATEMENT ═══════════════ */}
            {vis.hero !== false && (
                <section className="section hero" id="hero" data-section="hero">
                    <Reveal className="hero-statement">
                        <p className="question">{site.hero.eyebrow}</p>
                        <h2 className="hero-headline">{site.hero.headline}</h2>
                        <p className="hero-summary">{site.hero.summary}</p>
                        <div className="hero-proof">
                            <div className="proof-pill">
                                <strong>Role</strong> {site.hero.role}
                            </div>
                            <div className="proof-pill">
                                <strong>Base</strong> {site.hero.location}
                            </div>
                            {site.hero.proofPoints?.map((p, i) => (
                                <div className="proof-pill proof-pill--accent" key={i}>
                                    <strong>{p.value}</strong> {p.label}
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </section>
            )}

            {/* ═══════════════ EXPERTISE ═══════════════ */}
            {vis.expertise !== false && (
                <section className="section" id="expertise" data-section="expertise">
                    <Reveal>
                        <SectionHeader
                            question={site.expertise.question}
                            title={site.expertise.title}
                            note={site.expertise.note}
                        />
                    </Reveal>
                    <div className="expertise-grid">
                        {site.expertise.cards.map((card) => (
                            <Reveal as="article" className="expertise-card" key={card.tag}>
                                <span className="card-tag">{card.tag}</span>
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                                <ul className="card-items">
                                    {card.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                                {card.skills?.length > 0 && (
                                    <div className="card-skills">
                                        {card.skills.map((s) => (
                                            <span key={s} className="skill-tag">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </Reveal>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══════════════ CAREER ═══════════════ */}
            {vis.career !== false && (
                <section className="section" id="career" data-section="career">
                    <Reveal>
                        <SectionHeader
                            question={site.career.question}
                            title={site.career.title}
                        />
                    </Reveal>
                    <div className="career-stack">
                        {site.career.positions.map((pos, i) => (
                            <Reveal as="article" className="career-card" key={i}>
                                <div className="career-meta">
                                    <span className="career-period">{pos.period}</span>
                                    <h3 className="career-company">{pos.company}</h3>
                                    <p className="career-role">{pos.role}</p>
                                    {pos.tenure && (
                                        <p className="career-tenure">{pos.tenure}</p>
                                    )}
                                </div>
                                <ul className="card-items">
                                    {pos.bullets.map((b, j) => (
                                        <li key={j}>{b}</li>
                                    ))}
                                </ul>
                            </Reveal>
                        ))}

                        {/* Internships collapsed */}
                        {site.career.internships?.length > 0 && (
                            <Reveal as="article" className="career-card career-card--compact">
                                <div className="career-meta">
                                    <span className="career-period">2021–2022</span>
                                    <h3 className="career-company">Early HR internships</h3>
                                </div>
                                <div className="internship-list">
                                    {site.career.internships.map((int, i) => (
                                        <div className="internship-row" key={i}>
                                            <div>
                                                <strong>{int.company}</strong>
                                                <span>{int.role}</span>
                                            </div>
                                            <span className="internship-period">{int.period}</span>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {/* ═══════════════ TESTIMONIAL (pull-quote) ═══════════════ */}
            {vis.testimonial !== false && (
                <Reveal className="pull-quote" as="blockquote">
                    <p className="pull-quote-text">
                        &ldquo;{site.testimonial.quote}&rdquo;
                    </p>
                    <footer className="pull-quote-attr">
                        <strong>{site.testimonial.author}</strong>
                        <span>{site.testimonial.authorRole}</span>
                    </footer>
                </Reveal>
            )}

            {/* ═══════════════ EDUCATION ═══════════════ */}
            {vis.education !== false && (
                <section className="section" id="education" data-section="education">
                    <Reveal>
                        <SectionHeader
                            question={site.education.question}
                            title={site.education.title}
                        />
                    </Reveal>
                    <div className="education-grid">
                        <Reveal as="article" className="edu-card">
                            <span className="card-tag">Degrees</span>
                            {site.education.degrees.map((deg, i) => (
                                <div className="credential" key={i}>
                                    <h3>{deg.title}</h3>
                                    <p>{deg.institution}</p>
                                    <span>{deg.period}</span>
                                </div>
                            ))}
                        </Reveal>
                        {site.education.certifications?.length > 0 && (
                            <Reveal as="article" className="edu-card">
                                <span className="card-tag">Certifications</span>
                                <div className="cert-tags">
                                    {site.education.certifications.map((c, i) => (
                                        <span key={i} className="skill-tag">{c}</span>
                                    ))}
                                </div>
                            </Reveal>
                        )}
                    </div>
                </section>
            )}

            {/* ═══════════════ CONTACT ═══════════════ */}
            {vis.contact !== false && (
                <section className="section" id="contact" data-section="contact">
                    <Reveal>
                        <SectionHeader
                            question={site.contact.question}
                            title={site.contact.title}
                            note={site.contact.note}
                        />
                    </Reveal>
                    <Reveal className="contact-block">
                        <p>{site.contact.body}</p>
                        <p className="contact-cta">{site.contact.cta}</p>
                    </Reveal>
                </section>
            )}
        </>
    );
}
