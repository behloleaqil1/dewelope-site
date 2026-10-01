import React from "react";
import {Link, useParams} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {FiArrowLeft} from "react-icons/fi";
import {useSiteContent} from "../utils/useSiteContent.js";
import {sanitizeHtml} from "../utils/sanitizeHtml.js";

export default function BlogPost() {
    const {slug} = useParams();
    const {blog, seo, profile} = useSiteContent();
    const base = seo.canonicalBase || "https://dewelope.com";

    const post = (blog || []).find(
        (p) => p.slug === slug && p.status === "published"
    );

    if (!post) {
        return (
            <div className="relative z-0 bg-primary min-h-screen text-white flex items-center justify-center px-6">
                <Helmet>
                    <title>Post not found | {profile.name}</title>
                    <meta name="robots" content="noindex,follow"/>
                </Helmet>
                <div className="text-center">
                    <h1 className="font-display font-bold text-3xl">Post not found</h1>
                    <p className="mt-3 text-muted">This post may have been unpublished or moved.</p>
                    <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-brand-400 hover:text-brand">
                        <FiArrowLeft/> Back to blog
                    </Link>
                </div>
            </div>
        );
    }

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const url = `${base}/blog/${post.slug}`;
    const image = post.coverImage || seo.ogImage;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description,
        image,
        datePublished: post.publishedAt,
        author: {"@type": post.author === profile.name ? "Organization" : "Person", name: post.author || profile.name},
        publisher: {"@type": "Organization", name: profile.name, logo: {"@type": "ImageObject", url: `${base}/dewelope-mark-512.png`}},
        mainEntityOfPage: {"@type": "WebPage", "@id": url},
    };

    const bodyHtml = sanitizeHtml(post.body || "");

    return (
        <div className="relative z-0 bg-primary noise-overlay min-h-screen text-white">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <meta name="robots" content={seo.robots || "index,follow"}/>
                <link rel="canonical" href={url}/>
                <meta property="og:type" content="article"/>
                <meta property="og:title" content={title}/>
                <meta property="og:description" content={description}/>
                <meta property="og:url" content={url}/>
                <meta property="og:image" content={image}/>
                <meta name="twitter:card" content={seo.twitterCard || "summary_large_image"}/>
                <meta name="twitter:title" content={title}/>
                <meta name="twitter:description" content={description}/>
                <meta name="twitter:image" content={image}/>
                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
            </Helmet>

            <article className="max-w-3xl mx-auto px-6 sm:px-10 pt-28 pb-24">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-10">
                    <FiArrowLeft/> All posts
                </Link>

                <div className="text-[11px] font-mono uppercase tracking-widest text-accent-2 mb-3">
                    {new Date(post.publishedAt).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}
                    {post.author ? ` · ${post.author}` : ""}
                </div>
                <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight tracking-tight">{post.title}</h1>

                {post.tags?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                        {post.tags.map((t) => (
                            <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/10 border border-white/10 text-white/85">#{t}</span>
                        ))}
                    </div>
                )}

                {post.coverImage ? (
                    <img src={post.coverImage} alt="" loading="lazy" decoding="async"
                         className="mt-8 w-full rounded-2xl object-cover"/>
                ) : null}

                <div
                    className="blog-body mt-10 text-[17px] leading-relaxed text-secondary"
                    dangerouslySetInnerHTML={{__html: bodyHtml}}
                />
            </article>
        </div>
    );
}
