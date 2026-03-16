"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function HomeContent() {
    return (
        <>
            {/* ═══════════════ HERO ═══════════════ */}
            <section className="section hero" id="hero" data-section="hero">
                <div className="hero-panel">
                    <Reveal className="hero-copy">
                        <p className="question">Perspective</p>
                        <h2 className="section-title">
                            Structuring people operations through precision.
                        </h2>
                        <div className="hero-summary">
                            <p className="lede">
                                Senior Payroll Executive building compliant, dependable payroll
                                and people operations with equal attention to process discipline
                                and employee experience.
                            </p>
                            <div className="hero-meta">
                                <div className="meta-pill">
                                    <strong>Role</strong> Sr. Payroll Executive @ Creativefuel
                                </div>
                                <div className="meta-pill">
                                    <strong>Base</strong> Indore, India
                                </div>
                            </div>
                            <div className="hero-actions">
                                <Link className="button button-primary" href="#experience">
                                    View Timeline
                                </Link>
                                <Link className="button button-secondary" href="#specialties">
                                    Specialties
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal className="hero-card">
                        <p className="eyebrow">Authority Snapshot</p>
                        <div className="hero-card-grid">
                            <div className="metric">
                                <div className="metric-value">9,006</div>
                                <p className="metric-label">Followers</p>
                            </div>
                            <div className="metric">
                                <div className="metric-value">500+</div>
                                <p className="metric-label">Connections</p>
                            </div>
                            <div className="metric">
                                <div className="metric-value">2</div>
                                <p className="metric-label">Promotions in two years</p>
                            </div>
                            <div className="metric">
                                <div className="metric-value">20%</div>
                                <p className="metric-label">Operational efficiency gain</p>
                            </div>
                        </div>
                        <div className="card-divider" aria-hidden="true" />
                        <div className="hero-card-list" aria-label="Current focus areas">
                            <div className="hero-card-item">
                                <span>Specialization</span>
                                <span>
                                    Payroll processing, compliance, HRMS, onboarding, grievance
                                    handling
                                </span>
                            </div>
                            <div className="hero-card-item">
                                <span>Current chapter</span>
                                <span>
                                    Leading payroll and employee lifecycle operations at
                                    Creativefuel since January 2025
                                </span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ SPECIALTIES ═══════════════ */}
            <section className="section" id="specialties" data-section="specialties">
                <Reveal>
                    <SectionHeader
                        question="What do they specialize in?"
                        title="Three connected areas of execution."
                        note="Akshita operates where payroll accuracy, HR systems, and employee lifecycle discipline need to stay tightly aligned."
                    />
                </Reveal>
                <div className="strength-grid">
                    {[
                        {
                            tag: "Pillar 01",
                            title: "Payroll operations",
                            desc: "End-to-end payroll ownership with a strong bias toward accuracy, verification, and timely closure.",
                            items: [
                                "Payroll processing across recurring cycles",
                                "Payroll analysis and salary data checks",
                                "Labor law and compliance alignment",
                                "Audit support and record discipline",
                            ],
                        },
                        {
                            tag: "Pillar 02",
                            title: "HR systems and controls",
                            desc: "Comfortable inside the tools that keep people operations clean, traceable, and scalable.",
                            items: [
                                "Keka HRMS and day-to-day workflows",
                                "HRIS and PMS administration",
                                "ATS-led coordination and tracking",
                                "Microsoft Office-based reporting",
                            ],
                        },
                        {
                            tag: "Pillar 03",
                            title: "Employee lifecycle delivery",
                            desc: "Brings process clarity to onboarding, offboarding, and the human moments around them.",
                            items: [
                                "Onboarding and offboarding execution",
                                "Grievance handling and coordination",
                                "Training, induction, and modules",
                                "Benefits and asset management support",
                            ],
                        },
                    ].map((pillar) => (
                        <Reveal as="article" className="panel" key={pillar.tag}>
                            <span className="panel-tag">{pillar.tag}</span>
                            <h3>{pillar.title}</h3>
                            <p>{pillar.desc}</p>
                            <ul className="mini-list">
                                {pillar.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════════ EXPERIENCE ═══════════════ */}
            <section className="section" id="experience" data-section="experience">
                <Reveal>
                    <SectionHeader
                        question="Can they do it?"
                        title="A promotion-backed growth curve."
                        note="The through-line is operational trust: broader ownership, cleaner systems, and better employee experience as responsibility increased."
                    />
                </Reveal>
                <div className="experience-layout">
                    <Reveal className="experience-summary">
                        <div className="panel">
                            <span className="panel-tag">Proof</span>
                            <h3>Creativefuel became the proving ground.</h3>
                            <p>
                                Associate to Senior within roughly two years, while expanding
                                from payroll execution into compliance stewardship, employee
                                lifecycle systems, and training-led process improvement.
                            </p>
                            <div className="impact-badges" aria-label="Key achievements">
                                <span className="impact-badge">20% efficiency lift</span>
                                <span className="impact-badge">
                                    Onboarding/offboarding lead
                                </span>
                                <span className="impact-badge">Twice promoted</span>
                            </div>
                        </div>
                    </Reveal>
                    <div className="timeline">
                        {/* Job 1 */}
                        <Reveal as="article" className="timeline-card">
                            <div className="timeline-meta">
                                <div className="timeline-split">
                                    <p className="timeline-period">Jan 2025–Present</p>
                                    <h3 className="timeline-company">Creativefuel</h3>
                                    <p className="timeline-role">Senior Payroll Executive</p>
                                </div>
                                <p className="timeline-role">2 yrs 2 mos total at company</p>
                            </div>
                            <ul className="mini-list">
                                <li>
                                    Owns end-to-end payroll processing and labor law compliance.
                                </li>
                                <li>
                                    Led onboarding and offboarding systems to improve employee
                                    experience.
                                </li>
                                <li>
                                    Built training modules that improved operational efficiency by
                                    20%.
                                </li>
                            </ul>
                        </Reveal>

                        {/* Job 2 */}
                        <Reveal as="article" className="timeline-card">
                            <div className="timeline-meta">
                                <div className="timeline-split">
                                    <p className="timeline-period">Jul 2024–Jun 2025</p>
                                    <h3 className="timeline-company">Creativefuel</h3>
                                    <p className="timeline-role">Payroll Executive</p>
                                </div>
                            </div>
                            <ul className="mini-list">
                                <li>
                                    Handled recurring payroll workflows with high-volume
                                    coordination.
                                </li>
                                <li>
                                    Supported compliance checks, data accuracy, and system
                                    continuity.
                                </li>
                            </ul>
                        </Reveal>

                        {/* Job 3 */}
                        <Reveal as="article" className="timeline-card">
                            <div className="timeline-meta">
                                <div className="timeline-split">
                                    <p className="timeline-period">Feb 2024–Jul 2024</p>
                                    <h3 className="timeline-company">Creativefuel</h3>
                                    <p className="timeline-role">Payroll Associate</p>
                                </div>
                            </div>
                            <ul className="mini-list">
                                <li>
                                    Managed payroll inputs, data entry, verification, and system
                                    maintenance.
                                </li>
                                <li>
                                    Contributed to auditing, benefits administration, and record
                                    keeping.
                                </li>
                                <li>
                                    Built the operational base that led to two successive
                                    promotions.
                                </li>
                            </ul>
                        </Reveal>

                        {/* Job 4 */}
                        <Reveal as="article" className="timeline-card">
                            <div className="timeline-meta">
                                <div className="timeline-split">
                                    <p className="timeline-period">Jul 2023–Aug 2023</p>
                                    <h3 className="timeline-company">The HIRD</h3>
                                    <p className="timeline-role">HR Recruiter</p>
                                </div>
                            </div>
                            <ul className="mini-list">
                                <li>
                                    Supported recruitment workflows and candidate coordination
                                    during a short, focused HR assignment.
                                </li>
                            </ul>
                        </Reveal>

                        {/* Job 5 — Internships */}
                        <Reveal as="article" className="timeline-card">
                            <div className="timeline-meta">
                                <div className="timeline-split">
                                    <p className="timeline-period">2021–2022</p>
                                    <h3 className="timeline-company">Early HR internships</h3>
                                    <p className="timeline-role">
                                        Codezilla Technology, GrowVation, MDE Groups
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-compact">
                                <div className="timeline-compact-row">
                                    <div>
                                        <strong>Codezilla Technology</strong>
                                        <span>HR Internship (IT)</span>
                                    </div>
                                    <span>Jul–Aug 2022</span>
                                </div>
                                <div className="timeline-compact-row">
                                    <div>
                                        <strong>GrowVation</strong>
                                        <span>HR Executive Internship</span>
                                    </div>
                                    <span>Aug–Sep 2021</span>
                                </div>
                                <div className="timeline-compact-row">
                                    <div>
                                        <strong>MDE Groups</strong>
                                        <span>Jr. HR Executive Internship</span>
                                    </div>
                                    <span>Jul–Aug 2021</span>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ═══════════════ TESTIMONIAL ═══════════════ */}
            <section
                className="section"
                id="testimonial"
                data-section="testimonial"
            >
                <Reveal>
                    <SectionHeader
                        question="Do others trust them?"
                        title="Reliability is visible to the people around her."
                    />
                </Reveal>
                <Reveal className="testimonial-card">
                    <div className="testimonial-mark" aria-hidden="true">
                        &ldquo;
                    </div>
                    <p className="testimonial-text">
                        Focused, reliable, goal-oriented, and someone who brings out the
                        best in people.
                    </p>
                    <div className="testimonial-meta">
                        <p>
                            <strong>Paraphrased from Anubha Sachan</strong>
                        </p>
                        <p>
                            Independent Blogger, Technical Recruiter, UGC NET Qualified, and
                            Akshita&apos;s direct manager
                        </p>
                    </div>
                </Reveal>
            </section>

            {/* ═══════════════ SKILLS ═══════════════ */}
            <section className="section" id="skills" data-section="skills">
                <Reveal>
                    <SectionHeader
                        question="How do they do it?"
                        title="Through repeatable tools, systems, and operating habits."
                        note="The skill mix is practical rather than performative: fewer claims, stronger coverage across the work that keeps payroll and people operations running."
                    />
                </Reveal>
                <div className="skills-grid">
                    {[
                        {
                            tag: "Group 01",
                            title: "Payroll operations",
                            items: [
                                "Payroll processing",
                                "Payroll analysis",
                                "Compliance management",
                                "Salary surveys",
                            ],
                            note: "Built for accuracy, reconciliation, and deadline discipline.",
                        },
                        {
                            tag: "Group 02",
                            title: "HR systems",
                            items: [
                                "Keka HRMS",
                                "Microsoft Office",
                                "HRIS and PMS",
                                "ATS workflows",
                            ],
                            note: "Comfortable inside systems that keep records, reviews, and pipelines aligned.",
                        },
                        {
                            tag: "Group 03",
                            title: "People operations",
                            items: [
                                "Onboarding and offboarding",
                                "Benefits administration",
                                "Grievance handling",
                                "Training and induction",
                            ],
                            note: "Employee experience handled with process clarity and operational calm.",
                        },
                    ].map((group) => (
                        <Reveal as="article" className="panel" key={group.tag}>
                            <span className="panel-tag">{group.tag}</span>
                            <h3>{group.title}</h3>
                            <ul className="skill-items">
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <p className="sub-note">{group.note}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════════ EDUCATION ═══════════════ */}
            <section className="section" id="education" data-section="education">
                <Reveal>
                    <SectionHeader
                        question="Where did they learn it?"
                        title="Formal HR grounding, then applied quickly in practice."
                    />
                </Reveal>
                <div className="calm-grid">
                    <Reveal as="article" className="panel education-card">
                        <span className="panel-tag">Education</span>
                        <div className="credential">
                            <h3>MBA in HR Management</h3>
                            <p>Prestige Institute of Management &amp; Research</p>
                            <span>2021–2023</span>
                        </div>
                        <div className="credential">
                            <h3>BBA</h3>
                            <p>MediCaps University, Indore</p>
                            <span>2018–2021</span>
                        </div>
                    </Reveal>
                    <Reveal as="article" className="panel education-card">
                        <span className="panel-tag">Certifications</span>
                        <p>
                            Short-form learning focused on practical business and HR support
                            capabilities.
                        </p>
                        <div className="tag-cloud" aria-label="Certifications">
                            <span>HR Management</span>
                            <span>Cursa</span>
                            <span>Digital Marketing Fundamentals</span>
                            <span>Google</span>
                        </div>
                    </Reveal>
                    <Reveal as="article" className="panel education-card">
                        <span className="panel-tag">Current context</span>
                        <p>
                            Actively involved in a company environment that blends payroll
                            operations with hiring momentum and culture-building work.
                        </p>
                        <ul className="mini-list">
                            <li>
                                Supports active hiring drives across HR and creative recruitment
                                needs.
                            </li>
                            <li>
                                Engages with Creativefuel&apos;s Great Place to Work 2026
                                recognition narrative.
                            </li>
                        </ul>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ CONTACT ═══════════════ */}
            <section className="section" id="contact" data-section="contact">
                <Reveal>
                    <SectionHeader
                        question="How do I reach them?"
                        title="Start with a professional introduction."
                        note="Akshita is based in Indore and is best reached through a LinkedIn introduction or a Creativefuel referral."
                    />
                </Reveal>
                <Reveal className="contact-panel">
                    <div className="contact-copy">
                        <p className="eyebrow">Professional Availability</p>
                        <p>
                            Based in <strong>Indore, Madhya Pradesh, India</strong>, with the
                            strongest fit for conversations around payroll operations,
                            compliance, HRMS workflows, employee lifecycle systems, and
                            structured people operations.
                        </p>
                        <p>
                            Best route: a LinkedIn introduction or a professional referral
                            connected to Creativefuel.
                        </p>
                    </div>
                    <div className="contact-stacks">
                        <div className="contact-stack">
                            <h3>Relevant conversations</h3>
                            <p>
                                Payroll processing, labor-law-aligned operations, HR systems
                                discipline, and onboarding or offboarding design.
                            </p>
                        </div>
                        <div className="contact-stack">
                            <h3>Current activity</h3>
                            <p>
                                Active hiring context at Creativefuel across non-IT and
                                marketing recruitment, HR interns, and creative-role hiring
                                support.
                            </p>
                        </div>
                    </div>
                </Reveal>
            </section>
        </>
    );
}
