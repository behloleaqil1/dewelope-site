import {useContent} from "../store/ContentContext.jsx";
import {resolveAsset} from "./assetMap.js";
import {
    profile as cProfile,
    heroStats as cHeroStats,
    services as cServices,
    processSteps as cProcess,
    technologies as cTech,
    experiences as cExperiences,
    projects as cProjects,
    testimonials as cTestimonials,
} from "../constants/index.js";

// Resolve asset keys stored in content.json back into bundled URLs so public
// components can render <img src>. Content from the dashboard stores keys
// (imageKey/iconKey/icon); constants already hold URLs.
function resolveServices(list) {
    return list.map((s) => ({...s, icon: resolveAsset(s.icon) || s.icon}));
}

function resolveTech(list) {
    return list.map((t) => ({...t, icon: resolveAsset(t.icon) || t.icon}));
}

function resolveExperiences(list) {
    return list.map((e) => ({
        ...e,
        icon: e.iconKey ? resolveAsset(e.iconKey) : undefined,
    }));
}

function resolveProjects(list) {
    return list.map((p) => ({
        ...p,
        image: p.imageKey ? resolveAsset(p.imageKey) : undefined,
        live_link: p.live_link || null,
        source_code_link: p.source_code_link || null,
    }));
}

// Returns the public-facing, asset-resolved site content. Falls back to the
// compiled constants when the live content store hasn't loaded yet (keeps the
// prerender + first paint intact).
const SEO_FALLBACK = {
    siteTitle: "DeWelope Softwares — Modern Software House",
    defaultDescription:
        "DeWelope Softwares is a focused software house building enterprise platforms, financial systems and branchless-banking infrastructure.",
    keywords: "DeWelope Softwares, software house, agency, full-stack",
    canonicalBase: "https://dewelope.com",
    ogImage: "https://dewelope.com/og-image.png",
    twitterCard: "summary_large_image",
    twitterSite: "",
    robots: "index,follow",
    home: {title: "DeWelope Softwares — Modern Software House", description: ""},
    mvp: {title: "Startup MVPs in 6–8 Weeks | DeWelope Softwares", description: ""},
    blog: {title: "Blog | DeWelope Softwares", description: ""},
};

export function useSiteContent() {
    const content = useContent();

    if (!content) {
        return {
            profile: cProfile,
            heroStats: cHeroStats,
            services: cServices,
            processSteps: cProcess,
            technologies: cTech,
            experiences: cExperiences,
            projects: cProjects,
            testimonials: cTestimonials,
            seo: SEO_FALLBACK,
            blog: [],
        };
    }

    return {
        profile: content.profile || cProfile,
        heroStats: content.heroStats || cHeroStats,
        services: resolveServices(content.services || []),
        processSteps: content.processSteps || cProcess,
        technologies: resolveTech(content.technologies || []),
        experiences: resolveExperiences(content.experiences || []),
        projects: resolveProjects(content.projects || []),
        testimonials: content.testimonials || cTestimonials,
        seo: {...SEO_FALLBACK, ...(content.seo || {})},
        blog: content.blog || [],
    };
}
