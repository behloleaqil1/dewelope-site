import React from "react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {Helmet} from "react-helmet-async";
import {
    FiArrowUpRight, FiArrowRight, FiCheck, FiClock, FiShield, FiZap, FiCode, FiMail,
} from "react-icons/fi";
import {profile, processSteps} from "../constants/index.js";

// Swap for your Cal.com / Calendly link when ready — falls back to email.
const BOOKING_URL = `mailto:${profile.email}?subject=MVP%20build%20—%20let's%20talk`;

const fade = (d = 0) => ({
    initial: {opacity: 0, y: 26},
    whileInView: {opacity: 1, y: 0},
    viewport: {once: true, amount: 0.25},
    transition: {duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: d},
});

const clients = ["EasyPaisa", "JazzCash", "FoodPanda", "ZTBL"];

const stats = [
    {v: "9+", l: "years shipping at scale"},
    {v: "6–8 wk", l: "idea → live MVP"},
    {v: "30 min → 2–3 s", l: "query latency, one client DB"},
    {v: "100%", l: "Upwork Job Success"},
];

const packages = [
    {
        name: "MVP Sprint", term: "4 weeks · fixed scope", price: "$9,000", featured: false,
        desc: "Validate your one core flow — something real in front of users or investors, fast.",
        points: ["One hero user journey, built for real", "Production-grade code, deployed live", "Auth + core data model", "Demo-ready and yours to keep"],
    },
    {
        name: "MVP Build", term: "6–8 weeks · fixed scope", price: "$22,000", featured: true,
        desc: "The complete launchable MVP — everything to onboard real users and start charging.",
        points: ["Full feature set, agreed up front", "Payments / subscriptions integrated", "Admin dashboard + analytics", "CI/CD, monitoring, security-hardened", "Handover + 2 weeks post-launch support"],
    },
    {
        name: "Embedded Squad", term: "monthly · rolling", price: "$9,500", suffix: "/mo", featured: false,
        desc: "A dedicated senior pod that keeps shipping after launch. Scale up or down monthly.",
        points: ["Dedicated senior engineer(s) + lead", "Your standards, your board, your standups", "Flex capacity month to month", "The natural next step after launch"],
    },
];

const faqs = [
    {q: "How fast can you really ship?", a: "A focused 4-week Sprint for one core flow, or a full launchable MVP in 6–8 weeks. We time-box scope so there's always a finish line."},
    {q: "Do I own the code?", a: "100%. Your repos, your infrastructure, full documentation and knowledge transfer on handover. No lock-in."},
    {q: "How does payment work?", a: "Fixed-scope, milestone-based — typically 40% upfront, 30% at midpoint, 30% on delivery. Paid internationally via Wise or Payoneer."},
    {q: "What's your stack?", a: "Java Spring Boot, Node.js/NestJS, React/Next.js, PostgreSQL/MongoDB, AWS & Docker — plus Claude/OpenAI and Twilio for AI-powered features."},
    {q: "What happens after launch?", a: "Two weeks of post-launch support are included. Most clients continue with an Embedded Squad to keep building — but there's zero obligation."},
];

const Pill = ({children}) => (
    <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-secondary">
        {children}
    </span>
);

const MvpLanding = () => {
    return (
        <div className="relative z-0 bg-primary noise-overlay overflow-x-hidden min-h-screen">
            <Helmet>
                <title>Startup MVPs in 6–8 Weeks | DeWelope Softwares</title>
                <meta name="description" content="Production-ready MVPs for funded startups in 6–8 weeks — built by engineers who shipped fintech at banking scale (EasyPaisa, JazzCash). Fixed scope, milestone-based, you own the code." />
                <link rel="canonical" href="https://dewelope.com/mvp/" />
                <meta property="og:title" content="Startup MVPs in 6–8 Weeks | DeWelope Softwares" />
                <meta property="og:description" content="We turn ideas into production MVPs in 6–8 weeks — banking-grade rigor, startup speed." />
                <meta property="og:url" content="https://dewelope.com/mvp/" />
            </Helmet>

            {/* Minimal header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-primary/70 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group" aria-label="DeWelope Softwares — home">
                        <img src="/logo.svg" alt="" width="32" height="32" className="w-8 h-8" />
                        <span className="font-display font-semibold text-[18px] tracking-tight">
                            <span className="text-white">de</span><span className="text-gradient-accent">we</span><span className="text-white">lope</span>
                            <span className="text-muted font-normal ml-1.5 text-[15px]">Softwares</span>
                        </span>
                    </Link>
                    <a href={BOOKING_URL}
                       className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm">
                        Book a call <FiArrowUpRight />
                    </a>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-hero-pattern" />
                <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
                <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-16 text-center">
                    <motion.div {...fade()} className="flex justify-center mb-7">
                        <Pill>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-3 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-3" />
                            </span>
                            Booking new MVP projects
                        </Pill>
                    </motion.div>

                    <motion.h1 {...fade(0.05)}
                        className="font-display font-bold text-white tracking-tight leading-[1.03] text-[40px] xs:text-[52px] sm:text-[68px] lg:text-[80px] max-w-4xl mx-auto text-balance">
                        Your MVP, shipped in <span className="text-gradient-accent">6–8 weeks</span>.
                        Built to <span className="text-gradient-warm">actually scale</span>.
                    </motion.h1>

                    <motion.p {...fade(0.12)}
                        className="mt-7 text-secondary text-[17px] sm:text-[19px] leading-relaxed max-w-2xl mx-auto">
                        We turn ideas into production-ready products for funded startups — engineered
                        by a team that shipped fintech at banking scale for millions of users. No
                        throwaway prototypes. No rebuilds in six months.
                    </motion.p>

                    <motion.div {...fade(0.19)} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a href={BOOKING_URL}
                           className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-primary font-semibold text-base w-full sm:w-auto">
                            Book a free scoping call <FiArrowUpRight />
                        </a>
                        <a href="#how"
                           className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass text-white font-medium text-base w-full sm:w-auto hover:bg-white/10 transition-colors">
                            See how it works <FiArrowRight />
                        </a>
                    </motion.div>

                    {/* Trust row */}
                    <motion.div {...fade(0.26)} className="mt-14">
                        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-muted mb-4">
                            Built by engineers who’ve shipped for
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                            {clients.map((c) => (
                                <span key={c} className="font-display font-semibold text-white/70 text-lg sm:text-xl tracking-tight">{c}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="relative py-6">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden glass">
                        {stats.map((s, i) => (
                            <motion.div key={s.l} {...fade(i * 0.05)} className="bg-surface/40 p-6 sm:p-8 text-center">
                                <div className="font-display font-bold text-white text-2xl sm:text-[28px] tracking-tight tabular-nums">{s.v}</div>
                                <div className="mt-2 text-xs sm:text-[13px] text-muted leading-snug">{s.l}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why us */}
            <section className="relative py-20 sm:py-28">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="max-w-2xl">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2">·  Why us</div>
                        <h2 className="mt-4 font-display font-bold text-white tracking-tight leading-[1.08] text-[32px] sm:text-[44px]">
                            Banking-grade rigor, at <span className="text-gradient-accent">startup speed</span>.
                        </h2>
                        <p className="mt-5 text-secondary text-[16px] sm:text-[17px] leading-relaxed">
                            Most MVP shops optimize for the demo. We build the demo <em>and</em> the foundation
                            underneath it — because we spent years hardening payment systems where downtime
                            and data errors were not an option.
                        </p>
                    </motion.div>

                    <div className="mt-12 grid md:grid-cols-3 gap-5">
                        {[
                            {icon: <FiZap />, t: "Fast, not fragile", d: "Time-boxed sprints and weekly demos — with tested, maintainable code you won’t have to throw away."},
                            {icon: <FiShield />, t: "Fintech-hardened", d: "Payments, auth, audit trails and security done properly, by a team that’s done it at national scale."},
                            {icon: <FiCode />, t: "You own everything", d: "Your repos, your infra, full docs and handover. Continue with us or take it in-house — no lock-in."},
                        ].map((f, i) => (
                            <motion.div key={f.t} {...fade(i * 0.08)} className="glass rounded-2xl p-6 sm:p-7">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent/15 text-accent text-xl">{f.icon}</div>
                                <h3 className="mt-5 font-display font-semibold text-white text-lg tracking-tight">{f.t}</h3>
                                <p className="mt-2 text-secondary text-[14.5px] leading-relaxed">{f.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="relative py-20 sm:py-28 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="text-center max-w-2xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2">·  How it works</div>
                        <h2 className="mt-4 font-display font-bold text-white tracking-tight leading-[1.08] text-[32px] sm:text-[44px]">
                            A clear path from idea to launch
                        </h2>
                    </motion.div>

                    <div className="mt-14 grid md:grid-cols-5 sm:grid-cols-2 gap-5">
                        {processSteps.map((s, i) => (
                            <motion.div key={s.step} {...fade(i * 0.06)} className="relative">
                                <div className="font-mono text-accent text-sm mb-3">{s.step}</div>
                                <h3 className="font-display font-semibold text-white text-[17px] tracking-tight">{s.title}</h3>
                                <p className="mt-2 text-muted text-[13.5px] leading-relaxed">{s.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section id="pricing" className="relative py-20 sm:py-28 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="text-center max-w-2xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2">·  Engagements</div>
                        <h2 className="mt-4 font-display font-bold text-white tracking-tight leading-[1.08] text-[32px] sm:text-[44px]">
                            Fixed scope. Fixed price. No surprises.
                        </h2>
                        <p className="mt-5 text-secondary text-[16px] leading-relaxed">
                            Pick a starting point — we’ll scope the exact plan on our call.
                        </p>
                    </motion.div>

                    <div className="mt-14 grid lg:grid-cols-3 gap-5 items-stretch">
                        {packages.map((p, i) => (
                            <motion.div key={p.name} {...fade(i * 0.08)}
                                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col glass ${p.featured ? "ring-1 ring-accent shadow-glow" : ""}`}>
                                {p.featured && (
                                    <span className="absolute -top-3 left-8 text-[10px] font-mono uppercase tracking-[0.15em] text-primary bg-accent px-2.5 py-1 rounded-md">
                                        Most popular
                                    </span>
                                )}
                                <div className="font-display font-bold text-white text-xl tracking-tight">{p.name}</div>
                                <div className="mt-1.5 text-xs font-mono uppercase tracking-[0.1em] text-muted">{p.term}</div>
                                <div className="mt-5 flex items-baseline gap-1">
                                    <span className="text-[11px] font-mono uppercase tracking-widest text-muted mr-1">from</span>
                                    <span className="font-display font-bold text-white text-[34px] tracking-tight tabular-nums">{p.price}</span>
                                    {p.suffix && <span className="text-muted text-sm font-semibold">{p.suffix}</span>}
                                </div>
                                <p className="mt-4 text-secondary text-[14px] leading-relaxed">{p.desc}</p>
                                <ul className="mt-5 space-y-2.5 flex-1">
                                    {p.points.map((pt) => (
                                        <li key={pt} className="flex items-start gap-2.5 text-[14px] text-white/90">
                                            <FiCheck className="text-accent mt-1 shrink-0" />
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a href={BOOKING_URL}
                                   className={`btn-magnetic mt-7 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm ${p.featured ? "bg-white text-primary" : "glass text-white hover:bg-white/10 transition-colors"}`}>
                                    Book a call <FiArrowUpRight />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                    <p className="mt-6 text-center text-muted text-[13px]">
                        Larger or ongoing builds? We’ll tailor a plan on the call.
                    </p>
                </div>
            </section>

            {/* Proof line */}
            <section className="relative py-16">
                <div className="max-w-4xl mx-auto px-6 sm:px-10">
                    <motion.blockquote {...fade()} className="glass rounded-3xl p-8 sm:p-12 text-center">
                        <FiClock className="mx-auto text-accent-2 text-2xl" />
                        <p className="mt-5 font-display text-white text-xl sm:text-2xl leading-snug tracking-tight text-balance">
                            “Muhammad is truly one of the best freelancers I’ve hired on Upwork — hard working,
                            and goes above and beyond.”
                        </p>
                        <div className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-muted">
                            5.0 ★ · Spring Boot microservices · 192 hrs · repeat client
                        </div>
                    </motion.blockquote>
                </div>
            </section>

            {/* FAQ */}
            <section className="relative py-20 sm:py-28 border-t border-white/5">
                <div className="max-w-3xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="text-center mb-12">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent-2">·  FAQ</div>
                        <h2 className="mt-4 font-display font-bold text-white tracking-tight text-[32px] sm:text-[40px]">
                            Questions, answered
                        </h2>
                    </motion.div>
                    <div className="space-y-3">
                        {faqs.map((f, i) => (
                            <motion.details key={i} {...fade(i * 0.04)} className="group glass rounded-2xl px-6 py-5">
                                <summary className="flex items-center justify-between cursor-pointer list-none font-display font-semibold text-white text-[16px] sm:text-[17px] tracking-tight">
                                    {f.q}
                                    <span className="text-accent transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                                </summary>
                                <p className="mt-3 text-secondary text-[14.5px] leading-relaxed">{f.a}</p>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-16 sm:py-24">
                <div className="max-w-5xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="relative rounded-[32px] overflow-hidden glass p-10 sm:p-16 text-center">
                        <div className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full blur-3xl bg-accent opacity-30" />
                        <div className="pointer-events-none absolute -bottom-32 -right-24 w-[460px] h-[460px] rounded-full blur-3xl bg-accent-2 opacity-25" />
                        <div className="relative z-10">
                            <h2 className="font-display font-bold text-white tracking-tight leading-[1.05] text-[34px] sm:text-[52px] text-balance">
                                Have an idea? Let’s scope it.
                            </h2>
                            <p className="mt-5 text-secondary text-[16px] sm:text-[18px] max-w-xl mx-auto leading-relaxed">
                                Tell us your goal, stack and timeline. We reply within 24 hours — and we’ll
                                send a short plan for how we’d build it.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <a href={BOOKING_URL}
                                   className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-primary font-semibold text-base w-full sm:w-auto">
                                    Book a free scoping call <FiArrowUpRight />
                                </a>
                                <a href={`mailto:${profile.email}`}
                                   className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass text-white font-medium text-base w-full sm:w-auto hover:bg-white/10 transition-colors">
                                    <FiMail /> {profile.email}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <div className="text-center mt-10">
                    <Link to="/" className="text-muted hover:text-white text-sm font-mono transition-colors">← Back to dewelope.com</Link>
                </div>
            </section>
        </div>
    );
};

export default MvpLanding;
