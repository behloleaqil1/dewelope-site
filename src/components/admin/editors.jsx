import React from "react";
import {Field, TextInput, TextArea, SelectInput, StringList, ItemList} from "./fields.jsx";
import {ASSET_KEYS} from "../../utils/assetMap.js";

const grid2 = "grid sm:grid-cols-2 gap-4";

// --- Profile (identity, founder, socials) -----------------------------------

export function ProfileEditor({value, onChange}) {
    const p = value || {};
    const set = (patch) => onChange({...p, ...patch});
    const setFounder = (patch) => set({founder: {...(p.founder || {}), ...patch}});
    const setSocial = (patch) => set({socials: {...(p.socials || {}), ...patch}});
    const s = p.socials || {};
    const f = p.founder || {};
    return (
        <div className="space-y-5">
            <div className={grid2}>
                <Field label="Company name"><TextInput value={p.name} onChange={(v) => set({name: v})}/></Field>
                <Field label="Role / tagline label"><TextInput value={p.role} onChange={(v) => set({role: v})}/></Field>
            </div>
            <Field label="Tagline"><TextArea value={p.tagline} onChange={(v) => set({tagline: v})}/></Field>
            <Field label="Short tagline"><TextInput value={p.shortTagline} onChange={(v) => set({shortTagline: v})}/></Field>
            <div className={grid2}>
                <Field label="Location"><TextInput value={p.location} onChange={(v) => set({location: v})}/></Field>
                <Field label="Availability"><TextInput value={p.availability} onChange={(v) => set({availability: v})}/></Field>
            </div>
            <div className={grid2}>
                <Field label="Email"><TextInput value={p.email} onChange={(v) => set({email: v})}/></Field>
                <Field label="Phone"><TextInput value={p.phone} onChange={(v) => set({phone: v})}/></Field>
            </div>
            <Field label="Website"><TextInput value={p.website} onChange={(v) => set({website: v})}/></Field>

            <h3 className="text-sm font-semibold text-white pt-2">Social links</h3>
            <div className={grid2}>
                <Field label="GitHub"><TextInput value={s.github} onChange={(v) => setSocial({github: v})}/></Field>
                <Field label="LinkedIn"><TextInput value={s.linkedin} onChange={(v) => setSocial({linkedin: v})}/></Field>
                <Field label="Facebook"><TextInput value={s.facebook} onChange={(v) => setSocial({facebook: v})}/></Field>
                <Field label="Instagram"><TextInput value={s.instagram} onChange={(v) => setSocial({instagram: v})}/></Field>
                <Field label="Upwork"><TextInput value={s.upwork} onChange={(v) => setSocial({upwork: v})}/></Field>
                <Field label="Twitter / X"><TextInput value={s.twitter} onChange={(v) => setSocial({twitter: v})}/></Field>
            </div>

            <h3 className="text-sm font-semibold text-white pt-2">Founder</h3>
            <div className={grid2}>
                <Field label="Name"><TextInput value={f.name} onChange={(v) => setFounder({name: v})}/></Field>
                <Field label="Title"><TextInput value={f.title} onChange={(v) => setFounder({title: v})}/></Field>
            </div>
            <Field label="Bio"><TextArea value={f.bio} onChange={(v) => setFounder({bio: v})} rows={4}/></Field>
            <div className={grid2}>
                <Field label="LinkedIn"><TextInput value={f.linkedin} onChange={(v) => setFounder({linkedin: v})}/></Field>
                <Field label="GitHub"><TextInput value={f.github} onChange={(v) => setFounder({github: v})}/></Field>
            </div>
        </div>
    );
}

// --- Hero stats -------------------------------------------------------------

export function HeroStatsEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="stat"
            newItem={{label: "", value: ""}}
            renderItem={(it, update) => (
                <div className={grid2}>
                    <Field label="Value"><TextInput value={it.value} onChange={(v) => update({value: v})}/></Field>
                    <Field label="Label"><TextInput value={it.label} onChange={(v) => update({label: v})}/></Field>
                </div>
            )}
        />
    );
}

// --- Services ---------------------------------------------------------------

const SHAPES = ["stack", "cluster", "vault", "gear", "neural", "hex"];

export function ServicesEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="service"
            newItem={{title: "", description: "", icon: "web", shape: "stack", tint: "#C0292F"}}
            renderItem={(it, update) => (
                <div className="space-y-4">
                    <Field label="Title"><TextInput value={it.title} onChange={(v) => update({title: v})}/></Field>
                    <Field label="Description"><TextArea value={it.description} onChange={(v) => update({description: v})}/></Field>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Field label="Icon"><SelectInput value={it.icon} onChange={(v) => update({icon: v})} options={ASSET_KEYS}/></Field>
                        <Field label="Shape"><SelectInput value={it.shape} onChange={(v) => update({shape: v})} options={SHAPES}/></Field>
                        <Field label="Tint (hex)"><TextInput value={it.tint} onChange={(v) => update({tint: v})}/></Field>
                    </div>
                </div>
            )}
        />
    );
}

// --- Process steps ----------------------------------------------------------

export function ProcessEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="step"
            newItem={() => ({step: String((value?.length || 0) + 1).padStart(2, "0"), title: "", description: ""})}
            renderItem={(it, update) => (
                <div className="space-y-4">
                    <div className={grid2}>
                        <Field label="Step no."><TextInput value={it.step} onChange={(v) => update({step: v})}/></Field>
                        <Field label="Title"><TextInput value={it.title} onChange={(v) => update({title: v})}/></Field>
                    </div>
                    <Field label="Description"><TextArea value={it.description} onChange={(v) => update({description: v})}/></Field>
                </div>
            )}
        />
    );
}

// --- Technologies -----------------------------------------------------------

export function TechEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="technology"
            newItem={{name: "", icon: "creator", category: "Languages"}}
            renderItem={(it, update) => (
                <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Name"><TextInput value={it.name} onChange={(v) => update({name: v})}/></Field>
                    <Field label="Icon"><SelectInput value={it.icon} onChange={(v) => update({icon: v})} options={ASSET_KEYS}/></Field>
                    <Field label="Category"><TextInput value={it.category} onChange={(v) => update({category: v})}/></Field>
                </div>
            )}
        />
    );
}

// --- Experiences ------------------------------------------------------------

export function ExperiencesEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="experience"
            newItem={{title: "", company_name: "", companyMeta: "", date: "", iconKey: "", iconBg: "#ffffff", points: [], stack: []}}
            renderItem={(it, update) => (
                <div className="space-y-4">
                    <div className={grid2}>
                        <Field label="Role / title"><TextInput value={it.title} onChange={(v) => update({title: v})}/></Field>
                        <Field label="Company name"><TextInput value={it.company_name} onChange={(v) => update({company_name: v})}/></Field>
                    </div>
                    <div className={grid2}>
                        <Field label="Meta (type · mode)"><TextInput value={it.companyMeta} onChange={(v) => update({companyMeta: v})}/></Field>
                        <Field label="Date range"><TextInput value={it.date} onChange={(v) => update({date: v})}/></Field>
                    </div>
                    <div className={grid2}>
                        <Field label="Icon" hint="Leave empty to show initials badge"><SelectInput value={it.iconKey} onChange={(v) => update({iconKey: v})} options={ASSET_KEYS}/></Field>
                        <Field label="Icon background (hex)"><TextInput value={it.iconBg} onChange={(v) => update({iconBg: v})}/></Field>
                    </div>
                    <Field label="Highlights"><StringList items={it.points} onChange={(v) => update({points: v})} placeholder="Add highlight" textarea/></Field>
                    <Field label="Stack"><StringList items={it.stack} onChange={(v) => update({stack: v})} placeholder="Add tech"/></Field>
                </div>
            )}
        />
    );
}

// --- Projects / case studies ------------------------------------------------

export function ProjectsEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="project"
            newItem={{name: "", company: "", description: "", tags: [], imageKey: "", motif3D: "coins", tint: "#C0292F", live_link: "", source_code_link: ""}}
            renderItem={(it, update) => (
                <div className="space-y-4">
                    <div className={grid2}>
                        <Field label="Name"><TextInput value={it.name} onChange={(v) => update({name: v})}/></Field>
                        <Field label="Company / sector"><TextInput value={it.company} onChange={(v) => update({company: v})}/></Field>
                    </div>
                    <Field label="Description"><TextArea value={it.description} onChange={(v) => update({description: v})} rows={4}/></Field>
                    <div className={grid2}>
                        <Field label="Image" hint="Leave empty to use the 3D motif cover"><SelectInput value={it.imageKey} onChange={(v) => update({imageKey: v})} options={ASSET_KEYS}/></Field>
                        <Field label="3D motif"><TextInput value={it.motif3D} onChange={(v) => update({motif3D: v})}/></Field>
                    </div>
                    <div className={grid2}>
                        <Field label="Live link"><TextInput value={it.live_link} onChange={(v) => update({live_link: v})}/></Field>
                        <Field label="Source link"><TextInput value={it.source_code_link} onChange={(v) => update({source_code_link: v})}/></Field>
                    </div>
                    <Field label="Tags" hint="Comma-separate as name:color (e.g. react:blue-text-gradient)">
                        <StringList
                            items={(it.tags || []).map((t) => (t.color ? `${t.name}:${t.color}` : t.name))}
                            onChange={(arr) => update({tags: arr.map((s) => {
                                const [name, color] = s.split(":");
                                return {name: (name || "").trim(), color: (color || "blue-text-gradient").trim()};
                            })})}
                            placeholder="Add tag"
                        />
                    </Field>
                    <Field label="Metric value"><TextInput value={it.metric?.value} onChange={(v) => update({metric: {...(it.metric || {}), value: v}})}/></Field>
                    <Field label="Metric label"><TextInput value={it.metric?.label} onChange={(v) => update({metric: {...(it.metric || {}), label: v}})}/></Field>
                </div>
            )}
        />
    );
}

// --- Testimonials -----------------------------------------------------------

export function TestimonialsEditor({value, onChange}) {
    return (
        <ItemList
            items={value} onChange={onChange} itemLabel="testimonial"
            newItem={{testimonial: "", name: "", designation: "", company: "", image: ""}}
            renderItem={(it, update) => (
                <div className="space-y-4">
                    <Field label="Quote"><TextArea value={it.testimonial} onChange={(v) => update({testimonial: v})} rows={4}/></Field>
                    <div className={grid2}>
                        <Field label="Name"><TextInput value={it.name} onChange={(v) => update({name: v})}/></Field>
                        <Field label="Designation"><TextInput value={it.designation} onChange={(v) => update({designation: v})}/></Field>
                    </div>
                    <div className={grid2}>
                        <Field label="Company / source"><TextInput value={it.company} onChange={(v) => update({company: v})}/></Field>
                        <Field label="Avatar URL"><TextInput value={it.image} onChange={(v) => update({image: v})}/></Field>
                    </div>
                </div>
            )}
        />
    );
}

// --- SEO --------------------------------------------------------------------

export function SeoEditor({value, onChange}) {
    const seo = value || {};
    const set = (patch) => onChange({...seo, ...patch});
    const setRoute = (route, patch) => set({[route]: {...(seo[route] || {}), ...patch}});
    return (
        <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white">Global</h3>
            <Field label="Site title"><TextInput value={seo.siteTitle} onChange={(v) => set({siteTitle: v})}/></Field>
            <Field label="Default description" hint="Used when a route has no description"><TextArea value={seo.defaultDescription} onChange={(v) => set({defaultDescription: v})} rows={3}/></Field>
            <Field label="Keywords" hint="Comma-separated"><TextArea value={seo.keywords} onChange={(v) => set({keywords: v})} rows={2}/></Field>
            <div className={grid2}>
                <Field label="Canonical base URL"><TextInput value={seo.canonicalBase} onChange={(v) => set({canonicalBase: v})}/></Field>
                <Field label="OG image URL"><TextInput value={seo.ogImage} onChange={(v) => set({ogImage: v})}/></Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Twitter card"><TextInput value={seo.twitterCard} onChange={(v) => set({twitterCard: v})}/></Field>
                <Field label="Twitter @site"><TextInput value={seo.twitterSite} onChange={(v) => set({twitterSite: v})}/></Field>
                <Field label="Robots"><TextInput value={seo.robots} onChange={(v) => set({robots: v})}/></Field>
            </div>

            <h3 className="text-sm font-semibold text-white pt-2">Per-page overrides</h3>
            {["home", "mvp", "blog"].map((route) => (
                <div key={route} className="rounded-xl border border-border bg-surface p-4 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-muted">/{route === "home" ? "" : route}</span>
                    <Field label="Title"><TextInput value={seo[route]?.title} onChange={(v) => setRoute(route, {title: v})}/></Field>
                    <Field label="Description"><TextArea value={seo[route]?.description} onChange={(v) => setRoute(route, {description: v})} rows={2}/></Field>
                </div>
            ))}
        </div>
    );
}
