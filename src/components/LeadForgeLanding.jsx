import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import {Helmet} from "react-helmet-async";
import {
    FiArrowUpRight, FiArrowRight, FiCheck, FiShield, FiMail, FiUsers,
    FiCheckCircle, FiLock, FiZap,
} from "react-icons/fi";

const CONTACT_EMAIL = "hello@dewelope.com";
const MAILTO_LINK = `mailto:${CONTACT_EMAIL}?subject=LeadForge%20early%20access`;

const fade = (d = 0) => ({
    initial: {opacity: 0, y: 26},
    whileInView: {opacity: 1, y: 0},
    viewport: {once: true, amount: 0.25},
    transition: {duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: d},
});

const Pill = ({children}) => (
    <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-secondary">
        {children}
    </span>
);

const features = [
    {
        icon: <FiUsers />,
        title: "Verified leads from multiple providers",
        desc: "Search and aggregate B2B leads from several data providers, with built-in email verification before anything ships.",
    },
    {
        icon: <FiZap />,
        title: "AI-written multilingual emails",
        desc: "Personalised emails in multiple languages, generated with guardrails against invented claims, prompt injection, leaked personal data, and wrong names or languages.",
    },
    {
        icon: <FiCheckCircle />,
        title: "Approval queue before sending",
        desc: "An approval queue lets you review and approve emails before they go out.",
    },
    {
        icon: <FiMail />,
        title: "Your own mailboxes",
        desc: "Send from your Gmail or Microsoft 365 accounts. Built-in deliverability checks protect your sender reputation.",
    },
    {
        icon: <FiShield />,
        title: "Suppression and compliance",
        desc: "Hashed suppression lists, unsubscribe handling and compliance tools that help you keep your outreach clean and compliant.",
    },
    {
        icon: <FiLock />,
        title: "Team roles and client workspaces",
        desc: "For agencies: separate workspaces per client, role-based access and an audit log.",
    },
];

const problems = [
    "Reply rates have roughly halved since 2023",
    "Mailbox providers reject non-compliant bulk mail",
    "Bad lead data wastes time and credits",
    "Opaque credit systems and sudden account suspensions",
    "AI copy that invents claims or uses wrong names",
];

const LeadForgeLanding = () => {
    return (
        <div className="relative z-0 bg-[#0B1120] noise-overlay overflow-x-hidden min-h-screen">
            <Helmet>
                <title>LeadForge — AI outbound, built for quality and compliance | DeWelope</title>
                <meta name="description" content="LeadForge is an AI outbound sales platform built for quality and compliance. It finds and verifies B2B leads, writes personalised multilingual emails with safety guardrails, and sends from customers' own mailboxes while protecting their deliverability." />
                <link rel="canonical" href="https://dewelope.com/leadforge/" />
                <meta property="og:title" content="LeadForge — AI outbound, built for quality and compliance | DeWelope" />
                <meta property="og:description" content="AI outbound sales platform with verified leads, multilingual email generation with guardrails, and your own mailboxes. Built by DeWelope Softwares." />
                <meta property="og:url" content="https://dewelope.com/leadforge/" />
                <meta property="og:image" content="https://dewelope.com/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="LeadForge — AI outbound, built for quality and compliance | DeWelope" />
                <meta name="twitter:description" content="AI outbound sales platform with verified leads, multilingual email generation with guardrails, and your own mailboxes." />
                <meta name="twitter:image" content="https://dewelope.com/og-image.png" />
            </Helmet>

            {/* Minimal header */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0B1120]/70 border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group" aria-label="DeWelope Softwares — home">
                        <img src="/logo.svg" alt="" width="32" height="32" className="w-8 h-8" />
                        <span className="font-display font-semibold text-[18px] tracking-tight">
                            <span className="text-white">de</span><span className="text-gradient-accent">we</span><span className="text-white">lope</span>
                            <span className="text-[#94A3B8] font-normal ml-1.5 text-[15px]">Softwares</span>
                        </span>
                    </Link>
                    <a href={MAILTO_LINK}
                       className="btn-magnetic inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FB923C] text-[#0B1120] font-semibold text-sm hover:bg-[#F97316] transition-colors">
                        Request early access <FiArrowUpRight />
                    </a>
                </div>
            </header>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(194,65,12,0.08),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.05)_1px,transparent_1px)] bg-[length:44px_44px] opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
                <div className="relative max-w-6xl mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-16 text-center">
                    <motion.div {...fade()} className="flex justify-center mb-7">
                        <Pill>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB923C] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FB923C]" />
                            </span>
                            In development · early access
                        </Pill>
                    </motion.div>

                    {/* LeadForge logo */}
                    <motion.div {...fade(0.03)} className="flex justify-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex items-center justify-center">
                                <svg viewBox="0 0 32 32" className="w-10 h-10" role="img" aria-label="LeadForge glyph">
                                    <rect x="7" y="7" width="18" height="18" rx="3" transform="rotate(45 16 16)" fill="#C2410C"/>
                                </svg>
                            </div>
                            <span className="font-display font-bold text-[32px] sm:text-[40px] tracking-tight">
                                <span className="text-[#F1F5F9]">Lead</span><span className="text-[#FB923C]">Forge</span>
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1 {...fade(0.05)}
                        className="font-display font-bold text-[#F1F5F9] tracking-tight leading-[1.08] text-[28px] xs:text-[36px] sm:text-[48px] lg:text-[56px] max-w-4xl mx-auto text-balance">
                        AI outbound sales, built for <span className="text-[#FB923C]">quality</span> and <span className="text-[#FB923C]">compliance</span>.
                    </motion.h1>

                    <motion.p {...fade(0.12)}
                        className="mt-7 text-[#94A3B8] text-[17px] sm:text-[19px] leading-relaxed max-w-2xl mx-auto">
                        LeadForge finds and verifies B2B leads, writes personalised multilingual emails with safety guardrails, and sends from your own mailboxes while protecting your deliverability.
                    </motion.p>

                    <motion.div {...fade(0.19)} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a href={MAILTO_LINK}
                           className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#FB923C] text-[#0B1120] font-semibold text-base w-full sm:w-auto hover:bg-[#F97316] transition-colors">
                            Request early access <FiArrowUpRight />
                        </a>
                        <a href="#features"
                           className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass text-[#F1F5F9] font-medium text-base w-full sm:w-auto hover:bg-white/10 transition-colors">
                            See what it does <FiArrowRight />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* The problem */}
            <section className="relative py-20 sm:py-28">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="max-w-2xl">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#FB923C]">·  The problem</div>
                        <h2 className="mt-4 font-display font-bold text-[#F1F5F9] tracking-tight leading-[1.08] text-[32px] sm:text-[44px]">
                            Cold email is getting <span className="text-[#FB923C]">harder</span>.
                        </h2>
                        <p className="mt-5 text-[#94A3B8] text-[16px] sm:text-[17px] leading-relaxed">
                            Outbound sales teams are hitting walls everywhere: lower reply rates, stricter mailbox providers, and tools that create more problems than they solve.
                        </p>
                    </motion.div>

                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {problems.map((p, i) => (
                            <motion.div key={i} {...fade(i * 0.05)} className="glass rounded-2xl p-5 flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#C2410C]/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[#FB923C] text-xs">✕</span>
                                </div>
                                <p className="text-[#F1F5F9] text-[14.5px] leading-relaxed">{p}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="relative py-20 sm:py-28 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="text-center max-w-2xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#FB923C]">·  What LeadForge does</div>
                        <h2 className="mt-4 font-display font-bold text-[#F1F5F9] tracking-tight leading-[1.08] text-[32px] sm:text-[44px]">
                            Everything you need, nothing you don&apos;t.
                        </h2>
                    </motion.div>

                    <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <motion.div key={f.title} {...fade(i * 0.06)} className="glass rounded-2xl p-6 sm:p-7">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#FB923C]/15 text-[#FB923C] text-xl">
                                    {f.icon}
                                </div>
                                <h3 className="mt-5 font-display font-semibold text-[#F1F5F9] text-lg tracking-tight">{f.title}</h3>
                                <p className="mt-2 text-[#94A3B8] text-[14.5px] leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who it&apos;s for */}
            <section className="relative py-20 sm:py-28 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="max-w-2xl mx-auto text-center">
                        <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#FB923C]">·  Who it&apos;s for</div>
                        <h2 className="mt-4 font-display font-bold text-[#F1F5F9] tracking-tight leading-[1.08] text-[32px] sm:text-[44px]">
                            Built for agencies and <span className="text-[#FB923C]">multilingual teams</span>.
                        </h2>
                        <p className="mt-5 text-[#94A3B8] text-[16px] sm:text-[17px] leading-relaxed">
                            LeadForge is designed for outbound agencies managing multiple clients, and for sales teams that work across languages — especially in the EU and other multilingual markets where compliance and localisation matter.
                        </p>
                    </motion.div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                        {["Outbound agencies", "Multilingual sales teams", "EU market teams", "B2B lead generation"].map((t) => (
                            <motion.span key={t} {...fade(0.05)} className="glass rounded-full px-5 py-2.5 text-sm text-[#F1F5F9]/85 flex items-center gap-2">
                                <FiCheck className="text-[#FB923C]" /> {t}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative py-16 sm:py-24">
                <div className="max-w-5xl mx-auto px-6 sm:px-10">
                    <motion.div {...fade()} className="relative rounded-[32px] overflow-hidden glass p-10 sm:p-16 text-center">
                        <div className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full blur-3xl bg-[#FB923C] opacity-20" />
                        <div className="pointer-events-none absolute -bottom-32 -right-24 w-[460px] h-[460px] rounded-full blur-3xl bg-[#C2410C] opacity-15" />
                        <div className="relative z-10">
                            <h2 className="font-display font-bold text-[#F1F5F9] tracking-tight leading-[1.05] text-[34px] sm:text-[52px] text-balance">
                                Get early access
                            </h2>
                            <p className="mt-5 text-[#94A3B8] text-[16px] sm:text-[18px] max-w-xl mx-auto leading-relaxed">
                                LeadForge is in development. Request early access and we&apos;ll reach out when spots open up.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <a href={MAILTO_LINK}
                                   className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#FB923C] text-[#0B1120] font-semibold text-base w-full sm:w-auto hover:bg-[#F97316] transition-colors">
                                    Request early access <FiArrowUpRight />
                                </a>
                                <a href={`mailto:${CONTACT_EMAIL}`}
                                   className="btn-magnetic inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full glass text-[#F1F5F9] font-medium text-base w-full sm:w-auto hover:bg-white/10 transition-colors">
                                    <FiMail /> {CONTACT_EMAIL}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer line */}
            <section className="relative pb-16">
                <div className="text-center">
                    <p className="text-[#94A3B8] text-sm">
                        LeadForge is built by{" "}
                        <Link to="/" className="text-[#F1F5F9] underline decoration-white/30 underline-offset-2 hover:decoration-white transition-colors">
                            DeWelope Softwares
                        </Link>.
                    </p>
                    <Link to="/" className="inline-block mt-4 text-[#94A3B8] hover:text-[#F1F5F9] text-sm font-mono transition-colors">
                        ← Back to dewelope.com
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LeadForgeLanding;
