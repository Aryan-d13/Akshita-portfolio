/**
 * Default content for siteContent/home Firestore document.
 * Used as immediate render fallback — no loading skeleton needed.
 * Also used by admin "Reset to defaults" action.
 */

export const defaultSiteContent = {
    hero: {
        eyebrow: "Perspective",
        headline: "Structuring people operations through precision.",
        summary:
            "Senior Payroll Executive building compliant, dependable payroll and people operations with equal attention to process discipline and employee experience.",
        role: "Sr. Payroll Executive @ Creativefuel",
        location: "Indore, India",
        proofPoints: [
            { value: "2", label: "Promotions in two years" },
            { value: "20%", label: "Operational efficiency gain" },
        ],
    },

    expertise: {
        question: "What do they specialize in?",
        title: "Three connected areas of execution.",
        note: "Akshita operates where payroll accuracy, HR systems, and employee lifecycle discipline need to stay tightly aligned.",
        cards: [
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
                skills: ["Payroll processing", "Payroll analysis", "Compliance management", "Salary surveys"],
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
                skills: ["Keka HRMS", "Microsoft Office", "HRIS and PMS", "ATS workflows"],
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
                skills: ["Onboarding and offboarding", "Benefits administration", "Grievance handling", "Training and induction"],
            },
        ],
    },

    career: {
        question: "Can they do it?",
        title: "A promotion-backed growth curve.",
        positions: [
            {
                period: "Jan 2025–Present",
                company: "Creativefuel",
                role: "Senior Payroll Executive",
                tenure: "2 yrs 2 mos total at company",
                bullets: [
                    "Owns end-to-end payroll processing and labor law compliance.",
                    "Led onboarding and offboarding systems to improve employee experience.",
                    "Built training modules that improved operational efficiency by 20%.",
                ],
            },
            {
                period: "Jul 2024–Jan 2025",
                company: "Creativefuel",
                role: "Payroll Executive",
                tenure: "",
                bullets: [
                    "Handled recurring payroll workflows with high-volume coordination.",
                    "Supported compliance checks, data accuracy, and system continuity.",
                ],
            },
            {
                period: "Feb 2024–Jul 2024",
                company: "Creativefuel",
                role: "Payroll Associate",
                tenure: "",
                bullets: [
                    "Managed payroll inputs, data entry, verification, and system maintenance.",
                    "Contributed to auditing, benefits administration, and record keeping.",
                    "Built the operational base that led to two successive promotions.",
                ],
            },
            {
                period: "Jul 2023–Aug 2023",
                company: "The HIRD",
                role: "HR Recruiter",
                tenure: "",
                bullets: [
                    "Supported recruitment workflows and candidate coordination during a short, focused HR assignment.",
                ],
            },
        ],
        internships: [
            { company: "Codezilla Technology", role: "HR Internship (IT)", period: "Jul–Aug 2022" },
            { company: "GrowVation", role: "HR Executive Internship", period: "Aug–Sep 2021" },
            { company: "MDE Groups", role: "Jr. HR Executive Internship", period: "Jul–Aug 2021" },
        ],
    },

    testimonial: {
        quote: "Focused, reliable, goal-oriented, and someone who brings out the best in people.",
        author: "Paraphrased from Anubha Sachan",
        authorRole:
            "Independent Blogger, Technical Recruiter, UGC NET Qualified, and Akshita\u2019s direct manager",
    },

    education: {
        question: "Where did they learn it?",
        title: "Formal HR grounding, then applied quickly in practice.",
        degrees: [
            {
                title: "MBA in HR Management",
                institution: "Prestige Institute of Management & Research",
                period: "2021–2023",
            },
            {
                title: "BBA",
                institution: "MediCaps University, Indore",
                period: "2018–2021",
            },
        ],
        certifications: [
            "HR Management — Cursa",
            "Digital Marketing Fundamentals — Google",
        ],
    },

    contact: {
        question: "How do I reach them?",
        title: "Start with a professional introduction.",
        note: "Akshita is based in Indore and is best reached through a LinkedIn introduction or a Creativefuel referral.",
        body: "Based in Indore, Madhya Pradesh, India, with the strongest fit for conversations around payroll operations, compliance, HRMS workflows, employee lifecycle systems, and structured people operations.",
        cta: "Best route: a LinkedIn introduction or a professional referral connected to Creativefuel.",
    },

    sectionsVisible: {
        hero: true,
        expertise: true,
        career: true,
        testimonial: true,
        education: true,
        contact: true,
    },
};
